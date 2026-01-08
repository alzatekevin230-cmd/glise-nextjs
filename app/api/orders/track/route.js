import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';

export async function POST(request) {
  try {
    const { orderId, email } = await request.json();

    if (!orderId || !email) {
      return NextResponse.json(
        { error: 'Faltan el ID del pedido y el correo.' },
        { status: 400 }
      );
    }

    const ordersQuery = db.collectionGroup('orders')
      .where('orderId', '==', orderId)
      .where('customerDetails.email', '==', email);

    const querySnapshot = await ordersQuery.get();

    if (querySnapshot.empty) {
      return NextResponse.json({ found: false });
    }

    const orderData = querySnapshot.docs[0].data();

    // Convert Firestore Timestamp to ISO string if needed, or send as is if frontend handles it.
    // Ideally, convert to ISO for better serialization.
    const createdAt = orderData.createdAt?.toDate ? orderData.createdAt.toDate().toISOString() : orderData.createdAt;

    return NextResponse.json({
      found: true,
      orderId: orderData.orderId,
      status: orderData.status,
      shippingProvider: orderData.shippingProvider || null,
      trackingNumber: orderData.trackingNumber || null,
      createdAt,
      total: orderData.total,
      items: orderData.items,
    });

  } catch (error) {
    console.error('Error in /api/orders/track:', error);
    return NextResponse.json(
      { error: 'Ocurrió un error al buscar tu pedido.' },
      { status: 500 }
    );
  }
}
