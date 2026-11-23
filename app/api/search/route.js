// app/api/search/route.js
import { getAllProducts } from '@/lib/data';
import { NextResponse } from 'next/server';
import Fuse from 'fuse.js';

let cachedProductsRef = null;
let cachedFuse = null;

async function getFuseInstance() {
  const products = await getAllProducts();
  if (cachedFuse && cachedProductsRef === products) {
    return cachedFuse;
  }

  cachedProductsRef = products;
  cachedFuse = new Fuse(products, {
    keys: ['name', 'category', 'laboratorio'],
    includeScore: true,
    threshold: 0.4,
  });

  return cachedFuse;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '5', 10) || 5, 1), 20);

    if (!query || query.length < 2) {
      return NextResponse.json([]);
    }

    const fuse = await getFuseInstance();
    const results = fuse.search(query).slice(0, limit).map(result => result.item);

    return NextResponse.json(results, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
      }
    });
  } catch (error) {
    console.error('Error en API /api/search:', error);
    return NextResponse.json({ error: 'Error en búsqueda' }, { status: 500 });
  }
}