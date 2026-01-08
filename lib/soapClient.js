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
  
  // Regla de negocio: Envío gratis si supera cierto valor (ej. 250k)
  if (valor_declarado >= 250000) {
    return { shippingCost: 0, deliveryDays: "2-5" };
  }

  const totalWeight = cartItems.reduce((sum, item) => sum + (item.weight || 0.5) * item.quantity, 0);
  const totalUnits = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  let maxHeight = 0;
  let maxWidth = 0;
  let maxLength = 0;

  cartItems.forEach((item) => {
    if ((item.height || 10) > maxHeight) maxHeight = item.height || 10;
    if ((item.width || 10) > maxWidth) maxWidth = item.width || 10;
    if ((item.length || 10) > maxLength) maxLength = item.length || 10;
  });

  const finalHeight = maxHeight * totalUnits;

  const consolidatedItem = {
    alto: finalHeight,
    ancho: maxWidth,
    largo: maxLength,
    peso: totalWeight,
    unidades: 1,
  };

  const args = {
    p: {
      apikey: config.coordinadora.apiKey,
      clave: config.coordinadora.password,
      nit: config.coordinadora.nit,
      div: '00',
      origen: '76520000', // Palmira
      destino: destinationCityCode,
      valoracion: valor_declarado,
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

    return {
      shippingCost: Number(quoteResponse.flete_total),
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
      telefono_destinatario: customer.phone,
      ciudad_destinatario: customer.cityCode,
      valor_declarado: orderData.subtotal,
      contenido: 'Productos de belleza y cuidado personal',
      referencia: orderId,
      observaciones: orderData.orderNotes || `Pedido Glisé #${orderId}`,
      detalle: {
        item: orderData.items.map((item) => ({
          ubl: 0,
          alto: item.height || 10,
          ancho: item.width || 10,
          largo: item.length || 10,
          peso: item.weight || 0.5,
          unidades: item.quantity,
          referencia: '',
        })),
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

    const guideNumber = guideResponse.codigo_remision;
    const pdfLabel = guideResponse.pdf_guia;

    // Actualizamos el pedido en Firestore
    const orderRef = db.collection(`users/${userId}/orders`).doc(orderId);
    await orderRef.update({
      status: 'shipped',
      shippingProvider: 'Coordinadora',
      trackingNumber: guideNumber,
      shippingLabelBase64: pdfLabel,
    });

    console.log(`Guía ${guideNumber} generada exitosamente para pedido ${orderId}.`);
    return { success: true, trackingNumber: guideNumber };
  } catch (error) {
    console.error(`FALLO al generar guía para pedido ${orderId}:`, error);
    // Registramos el error en la orden para revisión manual
    const orderRef = db.collection(`users/${userId}/orders`).doc(orderId);
    await orderRef.update({ shippingError: error.message || 'Error desconocido al generar guía.' });
    return { success: false, error: error.message };
  }
};
