import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const { type } = await request.json();

    if (!id || (type !== 'yes' && type !== 'no')) {
      return NextResponse.json({ error: 'Solicitud inválida.' }, { status: 400 });
    }

    const field = type === 'yes' ? 'helpfulYes' : 'helpfulNo';
    const reviewRef = db.collection('reviews').doc(id);
    await reviewRef.update({ [field]: FieldValue.increment(1) });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in /api/reviews/[id]/helpful PATCH:', error);
    return NextResponse.json({ error: 'No se pudo registrar el voto.' }, { status: 500 });
  }
}
