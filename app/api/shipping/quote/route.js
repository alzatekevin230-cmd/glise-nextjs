import { NextResponse } from 'next/server';
import { getCoordinadoraQuote } from '@/lib/soapClient';

export async function POST(request) {
  try {
    const { destinationCityCode, cartItems } = await request.json();

    if (!destinationCityCode || !cartItems || !cartItems.length) {
      return NextResponse.json(
        { error: 'Faltan datos para la cotización.' },
        { status: 400 }
      );
    }

    const quote = await getCoordinadoraQuote(destinationCityCode, cartItems);
    return NextResponse.json(quote);

  } catch (error) {
    console.error('Error in /api/shipping/quote:', error);
    return NextResponse.json(
      { error: 'No se pudo calcular el envío en este momento.' },
      { status: 500 }
    );
  }
}
