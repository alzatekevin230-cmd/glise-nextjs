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

    // --- AQUÍ ESTÁ EL TRUCO ---
    // En lugar de buscar logs, devolvemos la info al navegador
    return NextResponse.json({
      ...quote,
      _DEBUG: {
        destino: destinationCityCode,
        items: cartItems.length,
        // Si soapClient.js calcula el peso, lo verás aquí
      }
    });

  } catch (error) {
    // Si falla, el error saldrá directamente en la pantalla de la web
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}