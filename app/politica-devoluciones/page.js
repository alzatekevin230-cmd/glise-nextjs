// app/politica-devoluciones/page.js

import BotonVolver from '@/components/BotonVolver'; // --- CAMBIO 1: Importamos el botón ---

export default function PoliticaDevolucionesPage() {
  return (
    <main className="container mx-auto px-4 sm:px-6 py-8">
      
      {/* --- CAMBIO 2: Añadimos el botón aquí --- */}
      <BotonVolver texto="Volver a la tienda" />

      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg max-w-4xl mx-auto mt-8 static-page-content">
        <h2>Política de Devoluciones y Reembolsos - Glisé</h2>
        <p>
          En Glisé, tu satisfacción es nuestra máxima prioridad. Si por alguna razón no estás completamente satisfecho con tu compra, hemos diseñado una política de devoluciones clara y sencilla para ayudarte.
        </p>
        
        <h3>1. Plazo para Devoluciones</h3>
        <p>
          Aceptamos solicitudes de devolución hasta <strong>3 días calendario</strong> después de que hayas recibido tu pedido.
        </p>

        <h3>2. Condiciones Generales para la Devolución</h3>
        <p>
          Para que una devolución sea aceptada, el producto debe cumplir con las siguientes condiciones:
        </p>
        <ul>
          <li>Debe estar en perfecto estado: nuevo, sin signos de uso y con todos sus empaques originales, etiquetas y sellos de seguridad intactos.</li>
          <li>No debe haber sido abierto, alterado o modificado de ninguna forma.</li>
          <li>Debe incluir todos los accesorios, manuales y material promocional que venían con él.</li>
        </ul>

        <h3>3. Productos No Elegibles para Devolución</h3>
        <p>Por motivos de higiene, salud y seguridad, los siguientes productos no pueden ser devueltos, a menos que presenten un defecto de fábrica:</p>
        <ul>
            <li>Medicamentos de ningún tipo.</li>
            <li>Cosméticos, maquillaje o productos de cuidado de la piel que hayan sido abiertos o cuyos sellos de seguridad hayan sido rotos.</li>
            <li>Productos de higiene y cuidado personal (cepillos, artículos de bebé, etc.).</li>
            <li>Suplementos dietarios o alimentos que hayan sido abiertos.</li>
        </ul>

        <h3>4. ¿Cómo Solicitar una Devolución?</h3>
        <p>El proceso es muy sencillo:</p>
        <ol className="list-decimal list-inside pl-4">
            <li><strong>Contáctanos:</strong> Escríbenos a nuestro WhatsApp <strong>321 797 3158</strong> o al correo <strong>gliseybelleza@gmail.com</strong> dentro del plazo de 3 días.</li>
            <li><strong>Proporciona la información:</strong> Ten a la mano tu número de pedido y cuéntanos el motivo de la devolución. Si el producto llegó dañado, te pediremos una foto para agilizar el proceso.</li>
            <li><strong>Sigue las instrucciones:</strong> Nuestro equipo te indicará los pasos a seguir para coordinar el envío del producto de regreso.</li>
        </ol>

        <h3>5. Tipos de Devolución y Reembolso</h3>
        <h4>Devolución por Garantía (Producto incorrecto, dañado o vencido)</h4>
        <p>Si recibiste un producto equivocado, con algún defecto de fábrica, o dañado durante el transporte, Glisé cubrirá todos los costos de envío para la devolución. Una vez verifiquemos el caso, podrás elegir entre:</p>
        <ul>
            <li><strong>El envío de un nuevo producto</strong> idéntico, sin costo adicional.</li>
            <li><strong>Un reembolso completo</strong> de tu dinero, incluyendo los gastos de envío originales.</li>
        </ul>

        <h3>6. Tiempos de Reembolso</h3>
        <p>Una vez que recibamos y aprobemos tu devolución, el reembolso se emitirá en un plazo de <strong>5 a 10 días hábiles</strong> al mismo método de pago que utilizaste en tu compra.</p>
        <hr className="my-6" />
        <p>Si tienes cualquier otra pregunta, no dudes en contactarnos. ¡Estamos para ayudarte!</p>
      </div>
    </main>
  );
}