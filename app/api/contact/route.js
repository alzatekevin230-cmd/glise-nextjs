import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';
import { sendContactNotification } from '@/lib/email';

export async function POST(request) {
  try {
    const messageData = await request.json();
    const { name, email, message, subject } = messageData;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios.' },
        { status: 400 }
      );
    }

    // 1. Save to Firestore
    const docRef = await db.collection('contactMessages').add({
      ...messageData,
      createdAt: FieldValue.serverTimestamp(),
    });

    // 2. Send Email Notification
    try {
      await sendContactNotification(messageData);
    } catch (emailError) {
      console.error('Error enviando notificación de contacto:', emailError);
      // We don't fail the request if email fails, but we log it.
      // The message is safe in Firestore.
    }

    return NextResponse.json({ success: true, id: docRef.id });

  } catch (error) {
    console.error('Error in /api/contact:', error);
    return NextResponse.json(
      { error: 'No se pudo enviar el mensaje.' },
      { status: 500 }
    );
  }
}
