import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';
import { config } from '@/lib/config';

export async function POST(request) {
  try {
    const { orderData, totalInCents, reference, userId } = await request.json();

    if (!orderData || !totalInCents || !reference) {
      return NextResponse.json(
        { error: 'Faltan datos para procesar la orden.' },
        { status: 400 }
      );
    }

    // Default to 'anonymous' if no userId provided
    const uid = userId || 'anonymous';

    const finalOrderData = {
      ...orderData,
      status: 'pending_payment',
      createdAt: FieldValue.serverTimestamp(),
      userId: uid,
    };

    // Save initial order
    await db.collection(`users/${uid}/orders`).doc(reference).set(finalOrderData);

    // Generate Wompi signature
    const integrityKey = config.wompi.integrityKey;
    const concatenation = `${reference}${totalInCents}COP${integrityKey}`;
    const signature = crypto.createHash('sha256').update(concatenation).digest('hex');

    return NextResponse.json({
      signature,
      publicKey: config.wompi.publicKey,
    });

  } catch (error) {
    console.error('Error in /api/orders/process:', error);
    return NextResponse.json(
      { error: 'No se pudo guardar la orden.' },
      { status: 500 }
    );
  }
}
