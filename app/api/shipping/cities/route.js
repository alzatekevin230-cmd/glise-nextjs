// app/api/shipping/cities/route.js
import { NextResponse } from 'next/server';
import { getCoordinadoraCities } from '@/lib/soapClient';

let memoryCities = null;
let memoryCitiesTime = 0;
const DAY_MS = 24 * 60 * 60 * 1000; // 24 horas

export async function GET() {
  try {
    const now = Date.now();
    if (memoryCities && (now - memoryCitiesTime) < DAY_MS) {
      return NextResponse.json(memoryCities, {
        headers: {
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=86400',
        },
      });
    }

    const cities = await getCoordinadoraCities();
    memoryCities = cities;
    memoryCitiesTime = now;

    return NextResponse.json(cities, {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error in /api/shipping/cities:', error);
    return NextResponse.json(
      { error: 'No se pudo obtener la lista de ciudades.' },
      { status: 500 }
    );
  }
}