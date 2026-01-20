import { Resend } from 'resend';
import { config } from './config';

const resend = new Resend(config.resend.apiKey);

/**
 * Envia un correo electrónico genérico.
 */
export const sendEmail = async ({ to, subject, html }) => {
  try {
    const { data, error } = await resend.emails.send({
      from: `Glisé <no-reply@${config.resend.domainName}>`,
      to,
      subject,
      html,
    });

    if (error) {
      console.error('Error enviando email:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Excepción al enviar email:', error);
    throw error;
  }
};

/**
 * Envia notificación de nuevo mensaje de contacto al administrador.
 */
export const sendContactNotification = async (messageData) => {
  const html = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2 style="color: #0891b2;">Tienes un nuevo mensaje desde tu página web</h2>
      <p><strong>De:</strong> ${messageData.name}</p>
      <p><strong>Correo del remitente:</strong> ${messageData.email}</p>
      <p><strong>Asunto:</strong> ${messageData.subject || 'Sin asunto'}</p>
      <hr>
      <p><strong>Mensaje:</strong></p>
      <p style="white-space: pre-wrap; background-color: #f4f4f4; padding: 15px; border-radius: 5px;">${messageData.message}</p>
    </div>
  `;

  return sendEmail({
    to: [config.resend.toEmail],
    subject: `Nuevo Mensaje de Contacto de: ${messageData.name}`,
    html,
  });
};

/**
 * Envia confirmación de pedido al cliente y notificación al administrador.
 */
export const sendOrderConfirmation = async (orderData, orderId, trackingNumber, wompiEmail = null) => {
  const customerEmail = wompiEmail || orderData.customerDetails?.email;
  const ownerEmail = config.resend.toEmail;

  // 1. Enviar al Cliente
  if (customerEmail) {
    const html = generateCustomerOrderEmail(orderData, orderId, trackingNumber);
    await sendEmail({
      to: [customerEmail],
      subject: `Confirmación y Guía de Envío - Pedido #${orderId}`,
      html,
    });
  }

  // 2. Enviar al Administrador
  if (ownerEmail) {
    const html = generateAdminOrderEmail(orderData, orderId);
    await sendEmail({
      to: [ownerEmail],
      subject: `¡Nuevo Pedido Recibido! - Orden #${orderId}`,
      html,
    });
  }
};

// --- Helpers para generar HTML ---

const generateCustomerOrderEmail = (orderData, orderId, trackingNumber) => {
  const customerName = orderData.customerDetails.firstName;
  const shippingAddress = orderData.customerDetails;
  const orderItems = orderData.items;
  const orderTotals = {
    subtotal: orderData.subtotal,
    shipping: orderData.shippingCost,
    total: orderData.total,
  };

  const itemsHtml = orderItems.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eaeaea;">
        <img src="${item.images?.[0] || item.image}" alt="${item.name}" width="60" style="border-radius: 8px;">
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eaeaea; color: #333;">
        ${item.name}<br>
        <span style="color: #666; font-size: 12px;">Cantidad: ${item.quantity}</span>
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eaeaea; text-align: right; color: #333; font-weight: 600;">
        $${(item.price * item.quantity).toLocaleString('es-CO')}
      </td>
    </tr>
  `).join('');

  let trackingHtml = '';
  if (trackingNumber) {
    // Si trackingNumber es un objeto (caso raro SOAP), extraemos el valor
    const trackingCode = typeof trackingNumber === 'object' ? trackingNumber.$value : trackingNumber;
    
    trackingHtml = `
      <div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 8px; text-align: center;">
        <h3 style="color: #0891b2; margin-top: 0;">¡Tu pedido ya fue enviado!</h3>
        <p style="margin: 10px 0; color: #333;">Puedes rastrearlo con el siguiente número de guía:</p>
        <div style="font-size: 20px; font-weight: bold; color: #0891b2; letter-spacing: 1px; margin-bottom: 15px; padding: 10px; border: 1px dashed #0891b2; border-radius: 5px; background-color: #fff;">
          ${trackingCode}
        </div>
        <a href="https://rastreo.coordinadora.com/" target="_blank" style="display: inline-block; padding: 10px 20px; background-color: #0891b2; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">
          Rastrear en Coordinadora
        </a>
      </div>
    `;
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
        .header { padding: 20px; text-align: center; }
        .header img { max-width: 150px; }
        .content { padding: 30px; color: #333333; line-height: 1.6; }
        .footer { background-color: #f8f8f8; padding: 20px; text-align: center; font-size: 12px; color: #666; }
        h1, h2 { color: #0891b2; }
        .order-summary, .shipping-details { margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 8px; }
        table { width: 100%; border-collapse: collapse; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <!-- Asegúrate de que esta imagen sea accesible públicamente -->
          <img src="https://glise.com.co/imagenespagina/logodeglise.webp" alt="Glisé Logo">
        </div>
        <div class="content">
          <h1>¡Gracias por tu compra, ${customerName}!</h1>
          <p>Hemos recibido tu pedido <strong>#${orderId}</strong>. A continuación, te dejamos un resumen de tu compra.</p>
          
          <div class="order-summary">
            <h2>Resumen del Pedido</h2>
            <table>
              ${itemsHtml}
            </table>
            <table style="margin-top: 20px; width: 100%;">
              <tr>
                <td style="text-align: right; padding: 5px; color: #666;">Subtotal:</td>
                <td style="text-align: right; padding: 5px; font-weight: 600;">$${orderTotals.subtotal.toLocaleString('es-CO')}</td>
              </tr>
              <tr>
                <td style="text-align: right; padding: 5px; color: #666;">Envío:</td>
                <td style="text-align: right; padding: 5px; font-weight: 600;">$${orderTotals.shipping.toLocaleString('es-CO')}</td>
              </tr>
              <tr>
                <td style="text-align: right; padding: 10px 5px; border-top: 2px solid #eaeaea; font-size: 18px;"><strong>Total:</strong></td>
                <td style="text-align: right; padding: 10px 5px; border-top: 2px solid #eaeaea; font-size: 18px; color: #0891b2;"><strong>$${orderTotals.total.toLocaleString('es-CO')}</strong></td>
              </tr>
            </table>
          </div>

          <div class="shipping-details">
            <h2>Dirección de Envío</h2>
            <p style="margin:0;">
              ${shippingAddress.firstName} ${shippingAddress.lastName}<br>
              ${shippingAddress.address}, ${shippingAddress.neighborhood}<br>
              ${shippingAddress.city}, ${shippingAddress.state}<br>
              Tel: ${shippingAddress.phone}
            </p>
          </div>

          ${trackingHtml} 

          <p style="margin-top: 30px;">¡Gracias por confiar en Glisé!</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Glisé. Todos los derechos reservados.</p>
          <p><a href="https://glise.com.co" style="color: #0891b2;">Visita nuestra tienda</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const generateAdminOrderEmail = (orderData, orderId) => {
  const customerDetails = orderData.customerDetails;
  const itemsHtml = orderData.items.map(item => 
    `<tr>
      <td style="padding: 5px; border-bottom: 1px solid #eee;">
        <strong>${item.name}</strong> (x${item.quantity})
        ${item.description ? `<br><small style="color: #666;">${item.description}</small>` : ''}
      </td>
      <td style="padding: 5px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price * item.quantity).toLocaleString('es-CO')}</td>
    </tr>`
  ).join('');

  return `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h1 style="color: #0891b2;">¡Tienes un nuevo pedido!</h1>
      <p><strong>Número de Orden:</strong> ${orderId}</p>
      <hr>
      <h2 style="color: #0891b2;">Detalles del Cliente</h2>
      <p><strong>Nombre:</strong> ${customerDetails.firstName} ${customerDetails.lastName}</p>
      <p><strong>Correo:</strong> ${customerDetails.email}</p>
      <p><strong>Teléfono:</strong> ${customerDetails.phone}</p>
      <p><strong>Dirección:</strong> ${customerDetails.address}, ${customerDetails.neighborhood}, ${customerDetails.city}, ${customerDetails.state}</p>
      <hr>
      <h2 style="color: #0891b2;">Productos Comprados</h2>
      <table style="width: 100%; border-collapse: collapse;">
        ${itemsHtml}
      </table>
      <table style="width: 100%; margin-top: 20px; text-align: right;">
        <tr><td><strong>Subtotal:</strong></td><td>$${orderData.subtotal.toLocaleString('es-CO')}</td></tr>
        <tr><td><strong>Envío:</strong></td><td>$${orderData.shippingCost.toLocaleString('es-CO')}</td></tr>
        <tr><td><h3>Total:</h3></td><td><h3>$${orderData.total.toLocaleString('es-CO')}</h3></td></tr>
      </table>
      <p style="text-align: center; margin-top: 30px;">
        La guía de Coordinadora se ha generado automáticamente. Prepara el envío.
      </p>
    </div>
  `;
};
