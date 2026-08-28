import * as soap from 'soap';
import crypto from 'crypto';
import { config } from './config';
import { db } from './firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';

/**
 * Crea un cliente SOAP para el servicio especificado.
 * @param {string} url URL del WSDL
 * @returns {Promise<any>} Cliente SOAP
 */
const createSoapClient = async (url) => {
  return await soap.createClientAsync(url);
};

/**
 * Obtiene la lista de ciudades de Coordinadora (con caché en Firestore).
 * @returns {Promise<Array>} Lista de ciudades
 */
export const getCoordinadoraCities = async () => {
  const cacheRef = db.collection('cache').doc('coordinadoraCities');
  const cacheDoc = await cacheRef.get();
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  // Si hay caché y es reciente (menos de 1 día), la devolvemos
  if (cacheDoc.exists && cacheDoc.data().timestamp.toDate() > oneDayAgo) {
    return cacheDoc.data().cities;
  }

  // Si no, pedimos a Coordinadora
  try {
    const client = await createSoapClient(config.coordinadora.wsdlCotizador);
    const result = await client.Cotizador_ciudadesAsync({});
    const cities = result[0].Cotizador_ciudadesResult.item.map((city) => ({
      code: city.codigo,
      name: city.nombre,
      department: city.nombre_departamento,
    }));

    // Guardamos en caché
    await cacheRef.set({
      cities,
      timestamp: FieldValue.serverTimestamp(),
    });

    return cities;
  } catch (error) {
    console.error('Error al obtener ciudades de Coordinadora:', error);
    throw new Error('No se pudo obtener la lista de ciudades.');
  }
};

/**
 * Consolida múltiples items del carrito en un solo paquete para Coordinadora.
 * (VERSIÓN CORREGIDA Y OPTIMIZADA)
 * @param {Array} cartItems Items del carrito
 * @returns {Object} Item consolidado con dimensiones y peso totales
 */
const consolidateCartItems = (cartItems) => {
  if (!cartItems || !cartItems.length) {
    throw new Error('No hay items para consolidar.');
  }

  let totalWeight = 0;
  let totalVolume = 0;
  let maxLength = 0;
  let maxWidth = 0;
  let maxHeight = 0;

  cartItems.forEach((item) => {
    // 1. Limpieza de datos: Evita errores si la Base de Datos manda un string con comas (ej. "0,15")
    const parseNum = (val, fallback) => {
      if (val === undefined || val === null) return fallback;
      const n = Number(String(val).replace(',', '.'));
      return isNaN(n) ? fallback : n;
    };

    const h = parseNum(item.height, 10);
    const w = parseNum(item.width, 10);
    const l = parseNum(item.length, 10);
    const q = parseNum(item.quantity, 1);
    const weight = parseNum(item.weight, 0.5);

    // 2. Rotación lógica del producto:
    // Ordenamos las medidas de mayor a menor para emular un empaque real.
    const dims = [h, w, l].sort((a, b) => b - a);
    const itemMax = dims[0];
    const itemMid = dims[1];
    const itemMin = dims[2];

    if (itemMax > maxLength) maxLength = itemMax;
    if (itemMid > maxWidth) maxWidth = itemMid;
    if (itemMin > maxHeight) maxHeight = itemMin;

    // Suma del volumen absoluto y peso
    totalVolume += (h * w * l) * q;
    totalWeight += weight * q;
  });

  // 3. Cálculo de la "Caja Ideal" (Empaque Virtual Eficiente)
  // Distribuimos el crecimiento proporcional en las tres dimensiones para evitar
  // que todo el volumen extra se acumule en el alto, generando peso volumétrico inflado.
  const volumeBase = maxLength * maxWidth * maxHeight;
  const ratio = volumeBase > 0 ? Math.cbrt(totalVolume / volumeBase) : 1;

  const fLength = Math.max(Math.ceil(maxLength * ratio), Math.ceil(maxLength));
  const fWidth  = Math.max(Math.ceil(maxWidth  * ratio), Math.ceil(maxWidth));
  let fHeight   = Math.max(Math.ceil(maxHeight * ratio), Math.ceil(maxHeight), 1);

  // Ajuste fino: si el volumen calculado supera el real, comprimir solo el alto
  const volCalculado = fLength * fWidth * fHeight;
  if (volCalculado > totalVolume * 1.15) {
    fHeight = Math.max(Math.ceil(totalVolume / (fLength * fWidth)), Math.ceil(maxHeight), 1);
  }

  // 4. CORRECCIÓN CRÍTICA DE PUNTO FLOTANTE (Evita fallos como 0.449999999999)
  const safeWeight = Number(totalWeight.toFixed(2));

  return {
    ubl: 0, 
    alto: fHeight,
    ancho: fWidth,
    largo: fLength,
    peso: safeWeight,
    unidades: 1, // Siempre 1 paquete consolidado
    referencia: '',
  };
};

/**
 * Cotiza un envío en Coordinadora.
 * @param {string} destinationCityCode Código DANE de la ciudad destino
 * @param {Array} cartItems Items del carrito
 * @returns {Promise<Object>} { shippingCost, deliveryDays }
 */
export const getCoordinadoraQuote = async (destinationCityCode, cartItems) => {
  if (!destinationCityCode || !cartItems || !cartItems.length) {
    throw new Error('Faltan datos para la cotización.');
  }

  const valor_declarado = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  // Limpiamos los decimales del dinero por seguridad en la API
  const safeValorDeclarado = Math.round(valor_declarado);

  // Regla de negocio: Envío gratis para Palmira (Local)
  if (destinationCityCode === '76520000') {
    return { shippingCost: 0, realShippingCost: 0, deliveryDays: "1-2" };
  }

  // NOTA: en index.js (Firebase Functions) existe también esta regla, que aquí no estaba:
  // if (valor_declarado >= 250000) {
  //   return { shippingCost: 0, realShippingCost: 0, deliveryDays: "2-5" };
  // }
  // Déjala así comentada si no la quieres activar todavía, o descomenta si sí aplica aquí.

  // Consolidar todos los productos en un solo paquete seguro
  const consolidatedItem = consolidateCartItems(cartItems);

  const args = {
    p: {
      apikey: config.coordinadora.apiKey,
      clave: config.coordinadora.password,
      nit: config.coordinadora.nit,
      div: '00',
      cuenta: 3,           
      producto: 0,         
      nivel_servicio: 1,   
      origen: '76520000', 
      destino: destinationCityCode,
      valoracion: safeValorDeclarado,
      detalle: { item: [consolidatedItem] },
    },
  };

  try {
    const client = await createSoapClient(config.coordinadora.wsdlCotizador);
    const result = await client.Cotizador_cotizarAsync(args);

    const quoteResponse = result[0].Cotizador_cotizarResult;
    if (!quoteResponse) {
      throw new Error('Respuesta de Coordinadora inválida.');
    }

    // ===== SUBSIDIO DE ENVÍO =====
    // realShippingCost: lo que Coordinadora cobra de verdad (para tus reportes/contabilidad).
    // shippingCost: lo que ve el cliente en el checkout (con descuento aplicado).
    // Para ajustar el porcentaje de descuento, cambia SHIPPING_DISCOUNT_RATE (0.25 = 25% de descuento).
    const SHIPPING_DISCOUNT_RATE = 0.30;
    const realShippingCost = Number(quoteResponse.flete_total);
    const discountedShippingCost = Math.round(realShippingCost * (1 - SHIPPING_DISCOUNT_RATE));

    return {
      shippingCost: discountedShippingCost,
      realShippingCost: realShippingCost,
      deliveryDays: quoteResponse.dias_entrega,
    };
  } catch (error) {
    console.error('Error al cotizar con Coordinadora:', error);
    throw new Error('No se pudo calcular el envío en este momento.');
  }
};

/**
 * Genera la guía de envío (uso interno tras pago aprobado).
 * @param {Object} orderData Datos de la orden
 * @param {string} orderId ID de la orden
 * @param {string} userId ID del usuario
 * @returns {Promise<Object>} { success, trackingNumber }
 */
export const generateCoordinadoraGuide = async (orderData, orderId, userId) => {
  const customer = orderData.customerDetails;
  
  // Encriptar clave SHA-256
  const clavePlana = config.coordinadora.guiasClave;
  const claveEncriptada = crypto.createHash('sha256').update(clavePlana).digest('hex');

  // CORRECCIÓN: Consolidar usando nuestra función robusta
  const consolidatedPackage = consolidateCartItems(orderData.items);
  const safeValorDeclarado = Math.round(orderData.subtotal);

  const args = {
    p: {
      id_cliente: config.coordinadora.guiasIdCliente,
      usuario: config.coordinadora.guiasUsuario,
      clave: claveEncriptada,
      estado: 'IMPRESO',
      codigo_cuenta: 3,
      codigo_producto: 0,
      nivel_servicio: 1,
      nombre_remitente: 'Glisé Farmacia y Belleza',
      direccion_remitente: 'Carrera 28 #35-14, Palmira',
      telefono_remitente: '3217973158',
      ciudad_remitente: '76520000',
      nombre_destinatario: `${customer.firstName} ${customer.lastName}`,
      direccion_destinatario: `${customer.address}, ${customer.neighborhood || ''}`,
      telefono_destinatario: customer.phone.replace(/\D/g, '').slice(-10),
      ciudad_destinatario: customer.cityCode,
      valor_declarado: safeValorDeclarado,
      contenido: 'Productos de belleza y cuidado personal',
      referencia: orderId,
      observaciones: orderData.orderNotes || `Pedido Glisé #${orderId}`,
      detalle: {
        item: [consolidatedPackage],
      },
    },
  };

  try {
    const client = await createSoapClient(config.coordinadora.wsdlGuias);
    const result = await client.Guias_generarGuiaAsync({ p: args.p });
    const guideResponse = result[0].return;

    if (!guideResponse || !guideResponse.codigo_remision) {
      const errorMessage = guideResponse?.errorMessage || 'Respuesta inválida al generar guía.';
      throw new Error(errorMessage);
    }

    let rawGuide = guideResponse.codigo_remision;
    let guideNumber = "";

    if (typeof rawGuide === 'object' && rawGuide !== null) {
        guideNumber = rawGuide.$value || rawGuide._ || rawGuide.$ || rawGuide.toString();
        if (guideNumber === '[object Object]') {
             guideNumber = String(rawGuide); 
        }
    } else {
        guideNumber = String(rawGuide);
    }

    guideNumber = guideNumber.trim();
    console.log(`✅ Guía EXTRAÍDA correctamente: ${guideNumber}`); 
    
    let visualPdf = guideResponse.pdf_guia; 

    try {
      console.log(`Intentando obtener PDF visual para guía ${guideNumber}...`);
      
      const hashedPassword = crypto.createHash('sha256')
                                   .update(config.coordinadora.guiasClave)
                                   .digest('hex');

      const argsImpresion = {
          p: {
              id: Number(config.coordinadora.guiasIdCliente),
              usuario: config.coordinadora.guiasUsuario,
              clave: hashedPassword,
              codigo_remision: [String(guideNumber)]
          }
      };

      await new Promise(resolve => setTimeout(resolve, 1000));
      const printResult = await client.Guias_imprimirRotulosAsync(argsImpresion);
      
      if (printResult[0] && printResult[0].return) {
          visualPdf = printResult[0].return;
          console.log("✅ ¡PDF visual obtenido en .return!");
      } else if (printResult[0] && printResult[0].rotulos) {
          visualPdf = printResult[0].rotulos;
          console.log("✅ ¡PDF visual obtenido en .rotulos!");
      } else {
          console.warn("⚠️ La respuesta no tiene .return ni .rotulos.");
      }

    } catch (printError) {
      console.error("❌ Error imprimiendo:", printError.message);
      if (printError.body) console.error("Detalle SOAP:", printError.body);
    }

    const orderRef = db.collection(`users/${userId}/orders`).doc(orderId);
    await orderRef.update({
      status: 'shipped',
      shippingProvider: 'Coordinadora',
      trackingNumber: guideNumber,
      shippingLabelBase64: visualPdf,
    });

    await db.collection('guides').doc(String(orderId)).set({
      orderId,
      trackingNumber: guideNumber,
      pdfBase64: visualPdf,
      createdAt: FieldValue.serverTimestamp()
    });

    console.log(`Guía ${guideNumber} generada exitosamente para pedido ${orderId}.`);
    return { success: true, trackingNumber: guideNumber };
  } catch (error) {
    console.error(`FALLO al generar guía para pedido ${orderId}:`, error);
    const orderRef = db.collection(`users/${userId}/orders`).doc(orderId);
    await orderRef.update({ shippingError: error.message || 'Error desconocido al generar guía.' });
    return { success: false, error: error.message };
  }
};

/**
 * Imprime rótulos de guías existentes en Coordinadora.
 * @param {Array<string>} guideNumbers Array de números de guía (códigos de remisión)
 * @returns {Promise<Object>} { success, pdfBase64, fileSize }
 */
export const printCoordinadoraLabels = async (guideNumbers) => {
  if (!guideNumbers || !Array.isArray(guideNumbers) || guideNumbers.length === 0) {
    throw new Error('Se requiere un array no vacío de números de guía.');
  }

  if (guideNumbers.length > 100) {
    throw new Error('Máximo 100 guías por solicitud.');
  }

  try {
    const hashedPassword = crypto.createHash('sha256')
                                  .update(config.coordinadora.guiasClave)
                                  .digest('hex');

    const args = {
      p: {
        id_rotulo: config.coordinadora.guiasIdRotulo, 
        codigos_remisiones: guideNumbers.map(num => String(num).trim()), 
        usuario: config.coordinadora.guiasUsuario,
        clave: hashedPassword,
      },
    };

    console.log(`📋 Solicitando impresión de ${guideNumbers.length} rótulo(s) a Coordinadora...`);

    const client = await createSoapClient(config.coordinadora.wsdlGuias);
    const result = await client.Guias_imprimirRotulosAsync(args);

    let pdfBase64 = null;
    let responseData = result[0];

    if (responseData && responseData.return) {
      pdfBase64 = responseData.return;
      console.log('✅ PDF obtenido en .return');
    } else if (responseData && responseData.rotulos) {
      pdfBase64 = responseData.rotulos;
      console.log('✅ PDF obtenido en .rotulos');
    } else if (responseData && responseData.Guias_imprimirRotulosResult) {
      pdfBase64 = responseData.Guias_imprimirRotulosResult;
      console.log('✅ PDF obtenido en .Guias_imprimirRotulosResult');
    }

    if (!pdfBase64) {
      console.error('❌ No se encontró PDF en la respuesta. Respuesta completa:', JSON.stringify(result, null, 2));
      throw new Error('No se pudo obtener el PDF de rótulos de Coordinadora.');
    }

    if (typeof pdfBase64 === 'object' && pdfBase64 !== null) {
      pdfBase64 = pdfBase64.$value || pdfBase64._ || pdfBase64.$ || String(pdfBase64);
    }

    pdfBase64 = String(pdfBase64).trim();
    const fileSize = Buffer.byteLength(pdfBase64, 'utf8') / 1024; 

    console.log(`✅ Rótulos generados exitosamente. Tamaño: ${fileSize.toFixed(2)} KB`);

    return {
      success: true,
      pdfBase64,
      fileSize,
      guideCount: guideNumbers.length,
    };
  } catch (error) {
    console.error('❌ Error imprimiendo rótulos en Coordinadora:', error.message);
    if (error.body) {
      console.error('Detalle SOAP:', error.body);
    }
    throw error;
  }
};