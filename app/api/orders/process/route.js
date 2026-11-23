// app/api/orders/process/route.js
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';
import { config } from '@/lib/config';
import { getCoordinadoraQuote } from '@/lib/soapClient';

const MAX_QUANTITY_PER_ITEM = 10;

async function fetchProductFromFirestore(rawId) {
  const docSnap = await db.collection('products').doc(String(rawId)).get();
  if (docSnap.exists) {
    return { docId: docSnap.id, ...docSnap.data() };
  }

  const numericId = Number(rawId);
  if (!isNaN(numericId)) {
    const querySnap = await db.collection('products').where('id', '==', numericId).limit(1).get();
    if (!querySnap.empty) {
      const firstDoc = querySnap.docs[0];
      return { docId: firstDoc.id, ...firstDoc.data() };
    }
  }

  return null;
}

export async function POST(request) {
  try {
    const { orderData, reference, userId } = await request.json();

    if (!orderData || !Array.isArray(orderData.items) || orderData.items.length === 0 || !reference) {
      return NextResponse.json(
        { error: 'Faltan datos para procesar la orden.' },
        { status: 400 }
      );
    }

    const cityCode = orderData.customerDetails?.cityCode;
    if (!cityCode) {
      return NextResponse.json(
        { error: 'Falta el código de ciudad para calcular el envío.' },
        { status: 400 }
      );
    }

    // 1. Verificar productos, precios reales y stock directamente en Firestore
    const verifiedItems = [];
    for (const cartItem of orderData.items) {
      const quantity = Number(cartItem.quantity);
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY_PER_ITEM) {
        return NextResponse.json(
          { error: `Cantidad inválida para ${cartItem.name || 'un producto'}.` },
          { status: 400 }
        );
      }

      const product = await fetchProductFromFirestore(cartItem.id);
      if (!product) {
        return NextResponse.json(
          { error: `El producto "${cartItem.name || cartItem.id}" ya no está disponible.` },
          { status: 400 }
        );
      }

      const availableStock = Number(product.stock ?? 0);
      if (availableStock < quantity) {
        return NextResponse.json(
          { error: `Stock insuficiente para "${product.name}". Disponible: ${availableStock}.` },
          { status: 400 }
        );
      }

      verifiedItems.push({
        id: product.docId,
        name: product.name,
        price: Number(product.price),
        quantity,
        category: product.category || null,
        image: product.image || product.images?.[0] || null,
        images: Array.isArray(product.images) ? product.images.slice(0, 1) : [],
        height: product.height ?? 10,
        width: product.width ?? 10,
        length: product.length ?? 10,
        weight: product.weight ?? 0.5,
      });
    }

    // 2. Recalcular subtotal y envío en el servidor
    const serverSubtotal = verifiedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const quote = await getCoordinadoraQuote(cityCode, verifiedItems);
    const serverShippingCost = Number(quote.shippingCost);
    const serverRealShippingCost = Number(quote.realShippingCost ?? quote.shippingCost);
    const serverTotal = serverSubtotal + serverShippingCost;
    const serverTotalInCents = Math.round(serverTotal * 100);

    const uid = userId || 'anonymous';
    const safeReference = String(reference).replace(/[^a-zA-Z0-9_-]/g, '');

    const finalOrderData = {
      orderId: safeReference,
      customerDetails: orderData.customerDetails,
      items: verifiedItems,
      subtotal: serverSubtotal,
      shippingCost: serverShippingCost,
      realShippingCost: serverRealShippingCost,
      total: serverTotal,
      orderNotes: orderData.orderNotes || '',
      status: 'pending_payment',
      createdAt: FieldValue.serverTimestamp(),
      userId: uid,
    };

    await db.collection(`users/${uid}/orders`).doc(safeReference).set(finalOrderData);

    // 3. Firmar el monto real calculado por el servidor
    const integrityKey = config.wompi.integrityKey;
    const concatenation = `${safeReference}${serverTotalInCents}COP${integrityKey}`;
    const signature = crypto.createHash('sha256').update(concatenation).digest('hex');

    return NextResponse.json({
      signature,
      publicKey: config.wompi.publicKey,
      totalInCents: serverTotalInCents,
    });
  } catch (error) {
    console.error('Error in /api/orders/process:', error);
    return NextResponse.json(
      { error: 'No se pudo procesar la orden. Inténtalo de nuevo.' },
      { status: 500 }
    );
  }
}