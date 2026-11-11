// app/api/products/route.js
import { getAllProducts } from '@/lib/data';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const products = await getAllProducts();

    return NextResponse.json(products, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    });
  } catch (error) {
    console.error('Error en API /api/products:', error);
    return NextResponse.json({ error: 'Error al cargar productos' }, { status: 500 });
  }
}