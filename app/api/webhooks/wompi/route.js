// app/api/webhooks/wompi/route.js
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';
import { generateCoordinadoraGuide } from '@/lib/soapClient';
import { sendOrderConfirmation } from '@/lib/email';
import { clearDataCache } from '@/lib/data';

export async function POST(request) {
  try {
    const eventData = await request.json();

    if (!eventData?.data?.transaction) {
      console.warn("Webhook con formato inválido.", { body: eventData });
      return NextResponse.json(
        { error: "Bad Request: Formato de evento inválido." },
        { status: 400 }
      );
    }

    const transaction = eventData.data.transaction;
    const orderId = transaction.reference;
    const newStatus = transaction.status;

    if (!orderId) {
      console.error("Webhook recibido sin referencia de pedido.");
      return NextResponse.json(
        { error: "Bad Request: Falta la referencia del pedido." },
        { status: 400 }
      );
    }

    const ordersQuery = db.collectionGroup('orders').where('orderId', '==', orderId);
    const querySnapshot = await ordersQuery.get();

    if (querySnapshot.empty) {
      console.error(`Pedido ${orderId} no encontrado.`);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const orderDoc = querySnapshot.docs[0];
    const orderRef = orderDoc.ref;
    const userId = orderDoc.ref.parent.parent.id;

    let orderDataBeforeUpdate;
    let shouldProcess = false;

    await db.runTransaction(async (t) => {
      const doc = await t.get(orderRef);
      orderDataBeforeUpdate = doc.data();

      if (orderDataBeforeUpdate.status !== 'pending_payment') {
        return;
      }

      shouldProcess = true;
      t.update(orderRef, { status: newStatus.toLowerCase() });

      if (newStatus === 'APPROVED' && orderDataBeforeUpdate.items) {
        for (const item of orderDataBeforeUpdate.items) {
          const productRef = db.collection("products").doc(String(item.id));
          t.update(productRef, { stock: FieldValue.increment(-item.quantity) });
        }
      }
    });

    if (!shouldProcess) {
      return NextResponse.json({ message: "Evento ya procesado o estado no válido." });
    }

    if (newStatus === 'APPROVED') {
      // Actualiza el stock en vivo en toda la tienda inmediatamente después de la compra
      clearDataCache();
      revalidatePath('/', 'layout');

      const customerPhone = orderDataBeforeUpdate.customerDetails?.phone;
      if (userId !== 'anonymous' && customerPhone) {
        const profileRef = db.collection(`users/${userId}/profile`).doc('data');
        await profileRef.set({ phone: customerPhone }, { merge: true });
        console.log(`Teléfono guardado para el usuario ${userId}.`);
      }

      // Generate Shipping Guide
      const guideResult = await generateCoordinadoraGuide(orderDataBeforeUpdate, orderId, userId);
      const trackingNumber = guideResult.success ? guideResult.trackingNumber : null;

      // Send Emails
      await sendOrderConfirmation(orderDataBeforeUpdate, orderId, trackingNumber, transaction.customer_email);
    }

    return NextResponse.json({ message: "Evento procesado." });

  } catch (error) {
    console.error(`Error crítico al procesar webhook:`, error);
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  }
}