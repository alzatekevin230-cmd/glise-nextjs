// app/api/shipping/print-labels/route.js
import crypto from 'crypto';
import { printCoordinadoraLabels } from '@/lib/soapClient';
import { NextResponse } from 'next/server';

function isAuthorized(request) {
  const adminKey = process.env.ADMIN_API_KEY;
  const providedKey = request.headers.get('x-admin-key') || '';
  if (!adminKey || !providedKey) return false;

  const expectedBuf = Buffer.from(adminKey, 'utf8');
  const providedBuf = Buffer.from(providedKey, 'utf8');
  if (expectedBuf.length !== providedBuf.length) return false;

  return crypto.timingSafeEqual(expectedBuf, providedBuf);
}

export async function POST(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { trackingNumbers, fileName } = body;

    if (!trackingNumbers || !Array.isArray(trackingNumbers)) {
      return NextResponse.json(
        { error: 'trackingNumbers debe ser un array de strings.' },
        { status: 400 }
      );
    }

    if (trackingNumbers.length === 0) {
      return NextResponse.json(
        { error: 'Se requiere al menos un número de guía.' },
        { status: 400 }
      );
    }

    const result = await printCoordinadoraLabels(trackingNumbers);

    const timestamp = new Date().toISOString().split('T')[0];
    const finalFileName = fileName || `rotulos_guias_${timestamp}.pdf`;

    return NextResponse.json({
      success: true,
      pdf: result.pdfBase64,
      fileName: finalFileName,
      guideCount: result.guideCount,
      fileSize: `${result.fileSize.toFixed(2)} KB`,
    });
  } catch (error) {
    console.error('Error en /api/shipping/print-labels:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener rótulos de impresión.',
      },
      { status: 500 }
    );
  }
}