import { getAllProducts } from '@/lib/data';
import { NextResponse } from 'next/server';

// Caché en memoria simple
let cachedProducts = null;
let cacheTime = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export async function GET() {
  try {
    // Si hay caché válida, retornarla
    if (cachedProducts && cacheTime && (Date.now() - cacheTime) < CACHE_DURATION) {
      return NextResponse.json(cachedProducts, {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
        }
      });
    }

    // Si no hay caché, cargar de Firestore
    const products = await getAllProducts();
    
    // Guardar en caché
    cachedProducts = products;
    cacheTime = Date.now();

    return NextResponse.json(products, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      }
    });
  } catch (error) {
    console.error('Error en API /api/products:', error);
    return NextResponse.json({ error: 'Error al cargar productos' }, { status: 500 });
  }
}

