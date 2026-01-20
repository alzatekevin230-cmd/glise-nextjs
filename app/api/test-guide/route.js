import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import { generateCoordinadoraGuide } from '@/lib/soapClient';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json({ 
        error: "Falta el ID del pedido. Usa: /api/test-guide?orderId=TU_NUMERO_DE_PEDIDO" 
      }, { status: 400 });
    }

    console.log(`🔍 Buscando pedido ${orderId} para prueba manual...`);

    // Buscar el pedido en todos los usuarios
    const ordersQuery = db.collectionGroup('orders').where('orderId', '==', orderId);
    const querySnapshot = await ordersQuery.get();

    if (querySnapshot.empty) {
      return NextResponse.json({ error: "Pedido no encontrado en Firebase." }, { status: 404 });
    }

    const orderDoc = querySnapshot.docs[0];
    const orderData = orderDoc.data();
    // La estructura es users/{userId}/orders/{orderId}, así que subimos 2 niveles
    const userId = orderDoc.ref.parent.parent.id;

    console.log(`✅ Pedido encontrado. Usuario: ${userId}. Iniciando generación de guía...`);

    // LLAMAMOS A LA FUNCIÓN QUE ARREGLAMOS
    const result = await generateCoordinadoraGuide(orderData, orderId, userId);

    return NextResponse.json({ 
      message: "Prueba finalizada. Revisa la terminal de VS Code para ver los logs detallados.",
      result 
    });

  } catch (error) {
    console.error("❌ Error en la prueba manual:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
