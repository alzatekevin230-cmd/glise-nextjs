import { getAllProducts } from '@/lib/data';
import { NextResponse } from 'next/server';
import Fuse from 'fuse.js';

// Caché en memoria
let cachedFuse = null;
let cacheTime = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

async function getFuseInstance() {
  // Si hay caché válida, retornarla
  if (cachedFuse && cacheTime && (Date.now() - cacheTime) < CACHE_DURATION) {
    return cachedFuse;
  }

  // Si no, crear nueva instancia
  const products = await getAllProducts();
  cachedFuse = new Fuse(products, {
    keys: ['name', 'category', 'laboratorio'],
    includeScore: true,
    threshold: 0.4,
  });
  cacheTime = Date.now();
  
  return cachedFuse;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '5');

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

