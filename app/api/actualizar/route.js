// app/api/actualizar/route.js
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { clearDataCache } from '@/lib/data';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const clave = searchParams.get('clave');

  // Clave de seguridad para que solo tú puedas actualizar la tienda
  if (clave !== 'glise2026') {
    return NextResponse.json(
      { error: 'Clave incorrecta. Usa ?clave=glise2026' },
      { status: 401 }
    );
  }

  try {
    // 1. Borra la memoria interna del servidor
    clearDataCache();

    // 2. Ordena a Next.js actualizar todas las páginas (Inicio, Productos, Categorías, Marcas y Blog)
    revalidatePath('/', 'layout');

    return new NextResponse(
      `<!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Tienda Actualizada | Glisé</title>
        </head>
        <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f0fdfa;">
          <div style="background: white; padding: 32px; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.08); text-align: center; max-width: 400px;">
            <div style="font-size: 48px; margin-bottom: 12px;">✅</div>
            <h1 style="color: #0f766e; margin: 0 0 8px 0; font-size: 22px;">¡Tienda actualizada al instante!</h1>
            <p style="color: #4b5563; font-size: 15px; line-height: 1.5;">Todos los cambios de precios, fotos y stock en Firebase ya están en vivo en Glisé.</p>
            <a href="/" style="display: inline-block; margin-top: 16px; background: #0891b2; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold;">Ir a la tienda</a>
          </div>
        </body>
      </html>`,
      {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      }
    );
  } catch (error) {
    console.error('Error al revalidar:', error);
    return NextResponse.json({ error: 'Error al actualizar la caché' }, { status: 500 });
  }
}