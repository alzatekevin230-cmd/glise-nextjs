import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import admin from 'firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId');

  if (!productId) {
    return NextResponse.json(
      { error: 'Falta el ID del producto para buscar reseñas.' },
      { status: 400 }
    );
  }

  try {
    const reviewsQuery = db.collection('reviews')
      .where('productId', '==', Number(productId))
      .orderBy('createdAt', 'desc');

    const querySnapshot = await reviewsQuery.get();

    const reviews = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate().toISOString(),
      };
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error in /api/reviews GET:', error);
    return NextResponse.json(
      { error: 'No se pudo obtener la lista de reseñas.' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { productId, rating, name, text, imageUrl } = await request.json();
    
    // Auth verification attempt
    const authHeader = request.headers.get('Authorization');
    let userId = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split('Bearer ')[1];
      try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        userId = decodedToken.uid;
      } catch (e) {
        console.warn('Token verification failed', e);
      }
    }

    if (!productId || !rating || !name || !text) {
      return NextResponse.json(
        { error: 'Faltan datos para crear la reseña.' },
        { status: 400 }
      );
    }

    // "Verified Purchase" logic
    let isVerified = false;
    if (userId) {
      const ordersQuery = db.collectionGroup('orders')
        .where('userId', '==', userId)
        .where('status', 'in', ['shipped', 'delivered']);

      const userOrdersSnap = await ordersQuery.get();

      userOrdersSnap.forEach(doc => {
        const order = doc.data();
        if (order.items && order.items.some(item => item.id === productId)) {
          isVerified = true;
        }
      });
    }

    const reviewData = {
      productId,
      rating: Number(rating),
      name,
      text,
      imageUrl: imageUrl || null,
      createdAt: FieldValue.serverTimestamp(),
      isVerified,
      helpfulYes: 0,
      helpfulNo: 0,
      userId: userId || null,
    };

    const reviewRef = await db.collection('reviews').add(reviewData);
    return NextResponse.json({ success: true, reviewId: reviewRef.id });

  } catch (error) {
    console.error('Error in /api/reviews POST:', error);
    return NextResponse.json(
      { error: 'No se pudo guardar la reseña.' },
      { status: 500 }
    );
  }
}
