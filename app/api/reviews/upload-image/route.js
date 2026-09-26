import { NextResponse } from 'next/server';
import admin from 'firebase-admin';
import '@/lib/firebaseAdmin'; // asegura que la app de admin esté inicializada
import { isRateLimited, getClientIp } from '@/lib/rateLimit';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

// Sube la foto de una reseña usando el Admin SDK (el cliente no tiene permiso
// de escritura directa en Storage; ver storage.rules).
export async function POST(request) {
  try {
    const ip = getClientIp(request);
    if (isRateLimited(`review-upload:${ip}`, { windowMs: 10 * 60 * 1000, max: 10 })) {
      return NextResponse.json(
        { error: 'Has subido demasiadas imágenes. Inténtalo de nuevo más tarde.' },
        { status: 429 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const productId = formData.get('productId') || 'general';

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'Falta el archivo de imagen.' }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Formato de imagen no permitido.' }, { status: 400 });
    }
    if (file.size > MAX_IMAGE_BYTES) {
      return NextResponse.json({ error: 'La imagen no puede pesar más de 5MB.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const safeExt = (file.type.split('/')[1] || 'jpg').replace(/[^a-z0-9]/gi, '');
    const filePath = `reviews/${productId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${safeExt}`;

    const bucket = admin.storage().bucket(bucketName);
    await bucket.file(filePath).save(buffer, { metadata: { contentType: file.type } });

    // storage.rules permite lectura pública para todas las rutas, no se requiere token.
    const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(filePath)}?alt=media`;

    return NextResponse.json({ success: true, imageUrl });
  } catch (error) {
    console.error('Error in /api/reviews/upload-image POST:', error);
    return NextResponse.json({ error: 'No se pudo subir la imagen.' }, { status: 500 });
  }
}
