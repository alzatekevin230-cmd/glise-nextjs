import { NextResponse } from 'next/server';
import { getCoordinadoraQuote } from '@/lib/soapClient';

export async function POST(request) {
  try {
    const { destinationCityCode, cartItems } = await request.json();

    if (!destinationCityCode || !cartItems || !cartItems.length) {
      return NextResponse.json({ error: 'Faltan datos.' }, { status: 400 });
    }

    // Ejecutamos la cotización
    const quote = await getCoordinadoraQuote(destinationCityCode, cartItems);

    return NextResponse.json(quote);

  } catch (error) {
    // El detalle completo queda en el log del servidor, no se le manda al navegador.
    console.error('Error en /api/shipping/quote:', error);
    return NextResponse.json({
      error: 'No se pudo calcular el costo de envío. Por favor, intenta de nuevo.'
    }, { status: 500 });
  }
}