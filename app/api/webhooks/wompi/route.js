// app/api/webhooks/wompi/route.js
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';
import { db } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';
import { generateCoordinadoraGuide } from '@/lib/soapClient';
import { sendOrderConfirmation } from '@/lib/email';
import { clearDataCache } from '@/lib/data';
import { config } from '@/lib/config';

function verifyWompiSignature(eventData, headerChecksum) {
  const eventsSecret = config.wompi.eventsSecret;
  if (!eventsSecret) {
    console.error('Falta la variable de entorno WOMPI_EVENTS_SECRET.');
    return false;
  }

  const signature = eventData?.signature;
  const timestamp = eventData?.timestamp;
  const receivedChecksum = (headerChecksum || signature?.checksum || '').toLowerCase();

  if (!signature?.properties || !Array.isArray(signature.properties) || !timestamp || !receivedChecksum) {
    return false;
  }

  const values = signature.properties.map((prop) => {
    const val = prop.split('.').reduce((acc, key) => acc?.[key], eventData.data);
    return val !== undefined && val !== null ? String(val) : '';
  });

  const concatenation = `${values.join('')}${timestamp}${eventsSecret}`;
  const expectedChecksum = crypto.createHash('sha256').update(concatenation).digest('hex').toLowerCase();

  const expectedBuf = Buffer.from(expectedChecksum, 'utf8');
  const receivedBuf = Buffer.from(receivedChecksum, 'utf8');

  if (expectedBuf.length !== receivedBuf.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuf, receivedBuf);
}

export async function POST(request) {
  try {
    const eventData = await request.json();
    const headerChecksum = request.headers.get('x-event-checksum');

    if (!verifyWompiSignature(eventData, headerChecksum)) {
      console.warn('Webhook rechazado: firma de Wompi inválida.');
      return NextResponse.json(
        { error: 'Unauthorized: Firma de evento inválida.' },
        { status: 401 }
      );
    }

    if (!eventData?.data?.transaction) {
      console.warn('Webhook con formato inválido.');
      return NextResponse.json(
        { error: 'Bad Request: Formato de evento inválido.' },
        { status: 400 }
      );
    }

    const transaction = eventData.data.transaction;
    const orderId = transaction.reference;
    const newStatus = transaction.status;

    if (!orderId) {
      console.error('Webhook recibido sin referencia de pedido.');
      return NextResponse.json(
        { error: 'Bad Request: Falta la referencia del pedido.' },
        { status: 400 }
      );
    }

    const ordersQuery = db.collectionGroup('orders').where('orderId', '==', orderId);
    const querySnapshot = await ordersQuery.get();

    if (querySnapshot.empty) {
      console.error(`Pedido ${orderId} no encontrado.`);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const orderDoc = querySnapshot.docs[0];
    const orderRef = orderDoc.ref;
    const userId = orderDoc.ref.parent.parent.id;

    let orderDataBeforeUpdate;
    let shouldProcess = false;
    let amountMismatch = false;

    await db.runTransaction(async (t) => {
      const doc = await t.get(orderRef);
      orderDataBeforeUpdate = doc.data();

      if (orderDataBeforeUpdate.status !== 'pending_payment') {
        return;
      }

      if (newStatus === 'APPROVED') {
        const expectedAmountInCents = Math.round((orderDataBeforeUpdate.total || 0) * 100);
        if (Number(transaction.amount_in_cents) !== expectedAmountInCents) {
          amountMismatch = true;
          return;
        }
      }

      shouldProcess = true;
      t.update(orderRef, { status: newStatus.toLowerCase() });

      if (newStatus === 'APPROVED' && orderDataBeforeUpdate.items) {
        for (const item of orderDataBeforeUpdate.items) {
          const productRef = db.collection('products').doc(String(item.id));
          t.update(productRef, { stock: FieldValue.increment(-item.quantity) });
        }
      }
    });

    if (amountMismatch) {
      console.error(`Monto inconsistente en pedido ${orderId}.`);
      return NextResponse.json({ error: 'El monto pagado no coincide con la orden.' }, { status: 400 });
    }

    if (!shouldProcess) {
      return NextResponse.json({ message: 'Evento ya procesado o estado no válido.' });
    }

    if (newStatus === 'APPROVED') {
      clearDataCache();
      revalidatePath('/', 'layout');

      const customerPhone = orderDataBeforeUpdate.customerDetails?.phone;
      if (userId !== 'anonymous' && customerPhone) {
        const userRef = db.collection('users').doc(userId);
        await userRef.set({ phone: customerPhone }, { merge: true });
      }

      const guideResult = await generateCoordinadoraGuide(orderDataBeforeUpdate, orderId, userId);
      const trackingNumber = guideResult.success ? guideResult.trackingNumber : null;

      await sendOrderConfirmation(orderDataBeforeUpdate, orderId, trackingNumber, transaction.customer_email);
    }

    return NextResponse.json({ message: 'Evento procesado.' });
  } catch (error) {
    console.error('Error crítico al procesar webhook:', error);
    return NextResponse.json({ error: 'Error interno.' }, { status: 500 });
  }
}