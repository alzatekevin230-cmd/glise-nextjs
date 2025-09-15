// app/sobre-nosotros/page.jsx

// --- CAMBIO 1: Eliminamos las importaciones de Header y Footer ---
// --- e importamos nuestro nuevo botón ---
import BotonVolver from '@/components/BotonVolver';

export default function SobreNosotros() {
  // --- CAMBIO 2: Ya no necesitamos pasar 'allProducts' desde aquí ---

  return (
    // --- CAMBIO 3: Eliminamos <Header /> y <Footer /> que ya están en layout.js ---
    <main className="container mx-auto px-4 sm:px-6 py-8">
      
      {/* --- CAMBIO 4: Reemplazamos <a> por nuestro componente BotonVolver --- */}
      <BotonVolver texto="Volver a la tienda" />

      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg static-page-content mt-8">
        <h2>¿Quiénes Somos?</h2>
        <h3>Tu Bienestar es Nuestra Esencia</h3>
        <p>En <strong>Glisé</strong>, creemos que la verdadera belleza y el bienestar nacen de un equilibrio perfecto entre la ciencia y la naturaleza. Somos más que una farmacia o una tienda de belleza; somos un espacio dedicado a tu cuidado integral, donde cada producto ha sido seleccionado con rigor profesional y un profundo respeto por los ingredientes naturales.</p>
        <p>Nacimos en el corazón de <strong>Palmira, Valle del Cauca</strong>, con la misión de ofrecer a nuestras comunidades soluciones confiables y efectivas para la salud y la belleza. Glisé es el resultado de una pasión familiar por combinar el conocimiento farmacéutico con la sabiduría ancestral de los remedios naturales, creando una propuesta única que te acompaña en cada etapa de tu vida.</p>
      </div>
    </main>
  );
}