// app/api/contact/route.js
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';
import { sendContactNotification } from '@/lib/email';
import { isRateLimited, getClientIp } from '@/lib/rateLimit';

export async function POST(request) {
  try {
    const ip = getClientIp(request);
    if (isRateLimited(`contact:${ip}`, { windowMs: 15 * 60 * 1000, max: 5 })) {
      return NextResponse.json(
        { error: 'Has enviado demasiados mensajes. Intenta de nuevo en unos minutos.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim();
    const subject = String(body.subject || '').trim();
    const message = String(body.message || '').trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios.' },
        { status: 400 }
      );
    }

    if (!/\S+@\S+\.\S+/.test(email) || name.length > 100 || subject.length > 150 || message.length > 2000) {
      return NextResponse.json(
        { error: 'Revisa los datos ingresados.' },
        { status: 400 }
      );
    }

    const cleanMessage = { name, email, subject, message };

    const docRef = await db.collection('contactMessages').add({
      ...cleanMessage,
      createdAt: FieldValue.serverTimestamp(),
    });

    try {
      await sendContactNotification(cleanMessage);
    } catch (emailError) {
      console.error('Error enviando notificación de contacto:', emailError);
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