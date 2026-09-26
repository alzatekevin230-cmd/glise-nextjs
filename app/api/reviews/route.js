import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import admin from 'firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { isRateLimited, getClientIp } from '@/lib/rateLimit';

const MAX_REVIEWS_PER_QUERY = 200;
const NAME_MAX_LEN = 80;
const TEXT_MIN_LEN = 10;
const TEXT_MAX_LEN = 1000;

// Rate limiting simple en memoria (por IP) para mitigar spam: máx. 5 reseñas / 10 min.
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

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
      .orderBy('createdAt', 'desc')
      .limit(MAX_REVIEWS_PER_QUERY);

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
    const body = await request.json();
    const { productId, rating, name, text, imageUrl, website } = body;

    // Honeypot: campo invisible para bots. Si viene lleno, se descarta silenciosamente.
    if (website) {
      return NextResponse.json({ success: true, reviewId: null });
    }

    const ip = getClientIp(request);
    if (isRateLimited(`review:${ip}`, { windowMs: RATE_LIMIT_WINDOW_MS, max: RATE_LIMIT_MAX })) {
      return NextResponse.json(
        { error: 'Has enviado demasiadas reseñas. Inténtalo de nuevo más tarde.' },
        { status: 429 }
      );
    }

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

    const numericRating = Number(rating);
    const trimmedName = String(name).trim();
    const trimmedText = String(text).trim();

    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
      return NextResponse.json({ error: 'La calificación debe ser entre 1 y 5.' }, { status: 400 });
    }
    if (trimmedName.length === 0 || trimmedName.length > NAME_MAX_LEN) {
      return NextResponse.json({ error: 'Nombre inválido.' }, { status: 400 });
    }
    if (trimmedText.length < TEXT_MIN_LEN || trimmedText.length > TEXT_MAX_LEN) {
      return NextResponse.json(
        { error: `La opinión debe tener entre ${TEXT_MIN_LEN} y ${TEXT_MAX_LEN} caracteres.` },
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
      rating: numericRating,
      name: trimmedName,
      text: trimmedText,
      imageUrl: imageUrl || null,
      createdAt: FieldValue.serverTimestamp(),
      isVerified,
      helpfulYes: 0,
      helpfulNo: 0,
      userId: userId || null,
    };

    const reviewRef = await db.collection('reviews').add(reviewData);
    return NextResponse.json({
      success: true,
      reviewId: reviewRef.id,
      review: { id: reviewRef.id, ...reviewData, createdAt: new Date().toISOString() },
    });

  } catch (error) {
    console.error('Error in /api/reviews POST:', error);
    return NextResponse.json(
      { error: 'No se pudo guardar la reseña.' },
      { status: 500 }
    );
  }
}
