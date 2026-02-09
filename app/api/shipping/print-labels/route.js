import { printCoordinadoraLabels } from '@/lib/soapClient';
import { NextResponse } from 'next/server';

/**
 * POST /api/shipping/print-labels
 * Imprime rótulos de guías de envío existentes
 * 
 * Body esperado:
 * {
 *   trackingNumbers: ['74295XXXXXX', '74295YYYYYY'],  // Array de números de guía
 *   fileName: 'rotulos.pdf'  // Opcional
 * }
 * 
 * Response:
 * {
 *   success: true,
 *   pdf: "base64...",
 *   fileName: "rotulos_guias_2024-02-04.pdf",
 *   guideCount: 2,
 *   fileSize: "245.50 KB"
 * }
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { trackingNumbers, fileName } = body;

    // Validar que se envió el array de números de guía
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

    // Llamar a la función SOAP
    const result = await printCoordinadoraLabels(trackingNumbers);

    // Generar nombre de archivo
    const timestamp = new Date().toISOString().split('T')[0];
    const finalFileName = fileName || `rotulos_guias_${timestamp}.pdf`;

    // Retornar con headers para descargar como archivo
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
        error: error.message || 'Error al obtener rótulos de impresión.',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/shipping/print-labels (para pruebas/documentación)
 */
export async function GET() {
  return NextResponse.json({
    message: 'Endpoint para imprimir rótulos de guías Coordinadora',
    method: 'POST',
    endpoint: '/api/shipping/print-labels',
    requestBody: {
      trackingNumbers: ['74295XXXXXX', '74295YYYYYY'],
      fileName: 'rotulos.pdf (opcional)',
    },
    response: {
      success: true,
      pdf: 'base64 del PDF',
      fileName: 'rotulos_guias_2024-02-04.pdf',
      guideCount: 2,
      fileSize: '245.50 KB',
    },
    example: `
// JavaScript/Fetch
const response = await fetch('/api/shipping/print-labels', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    trackingNumbers: ['74295XXXXXX'],
    fileName: 'mi_rotulo.pdf'
  })
});

const data = await response.json();
if (data.success) {
  // Descargar PDF
  const link = document.createElement('a');
  const byteCharacters = atob(data.pdf);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: 'application/pdf' });
  link.href = URL.createObjectURL(blob);
  link.download = data.fileName;
  link.click();
}
    `,
  });
}
