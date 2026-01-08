import { NextResponse } from 'next/server';
import { getCoordinadoraCities } from '@/lib/soapClient';

export async function GET() {
  try {
    const cities = await getCoordinadoraCities();
    return NextResponse.json(cities);
  } catch (error) {
    console.error('Error in /api/shipping/cities:', error);
    return NextResponse.json(
      { error: 'No se pudo obtener la lista de ciudades.' },
      { status: 500 }
    );
  }
}
