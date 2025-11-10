// components/ArticuloBlogCard.jsx
import Link from 'next/link';
import Image from 'next/image';
import { processBlogImageUrl } from '@/lib/imageUtils';
import { FaCalendar, FaClock, FaArrowRight } from 'react-icons/fa';

// Utilidad para calcular tiempo de lectura (palabras por minuto)
function calcularTiempoLectura(contenido) {
  if (!contenido) return '3 min';
  const palabras = contenido.replace(/<[^>]*>/g, '').split(/\s+/).length;
  const minutos = Math.ceil(palabras / 200); // 200 palabras por minuto promedio
  return `${minutos} min`;
}

// Formatea fecha en español
function formatearFecha(fecha) {
  if (!fecha) return 'Recientemente';
  
  // Si es un timestamp de Firestore
  if (fecha.seconds) {
    fecha = new Date(fecha.seconds * 1000);
  } else if (typeof fecha === 'string') {
    fecha = new Date(fecha);
  }
  
  const opciones = { day: 'numeric', month: 'short', year: 'numeric' };
  return fecha.toLocaleDateString('es-ES', opciones).replace('.', '');
}

// Colores por categoría
const getCategoryColor = (category) => {
  const colors = {
    'belleza': 'from-pink-500 to-rose-500',
    'bienestar': 'from-green-500 to-emerald-500',
    'natural': 'from-amber-500 to-orange-500',
    'cuidado infantil': 'from-blue-500 to-cyan-500',
    'dermocosmetica': 'from-purple-500 to-indigo-500',
    'salud': 'from-red-500 to-pink-500',
  };
  
  const normalizedCategory = category?.toLowerCase() || '';
  return colors[normalizedCategory] || 'from-blue-500 to-indigo-500';
};

export default function ArticuloBlogCard({ post }) {
  const imageUrl = processBlogImageUrl(post.imageUrl);
  const postLink = `/blog/${post.slug || post.id}`;
  const tiempoLectura = calcularTiempoLectura(post.fullContent);
  const fechaFormateada = formatearFecha(post.publishedAt || post.createdAt);
  const categoryGradient = getCategoryColor(post.category);

  return (
    <article className="group bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      
      {/* Imagen limpia sin elementos encima */}
      <Link href={postLink} className="block relative aspect-video overflow-hidden">
        <Image 
          src={imageUrl} 
          alt={post.title} 
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110" 
          quality={85}
          loading="lazy"
        />
        {/* Gradient overlay sutil en hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </Link>

      {/* Contenido de la card */}
      <div className="p-6 flex flex-col flex-grow">
        
        {/* Badge de categoría - Ahora fuera de la imagen */}
        <div className="mb-3">
          <span className={`inline-block bg-gradient-to-r ${categoryGradient} text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase shadow-md`}>
            {post.category}
          </span>
        </div>

        {/* Meta info: Fecha y tiempo de lectura */}
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <FaCalendar className="text-blue-600" />
            <span>{fechaFormateada}</span>
          </div>
          <span className="text-gray-300">•</span>
          <div className="flex items-center gap-1">
            <FaClock className="text-blue-600" />
            <span>{tiempoLectura} lectura</span>
          </div>
        </div>

        {/* Título */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 flex-grow line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors duration-200">
          <Link href={postLink}>
            {post.title}
          </Link>
        </h3>

        {/* Descripción */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
          {post.description}
        </p>

        {/* CTA */}
        <Link 
          href={postLink} 
          className="inline-flex items-center gap-2 text-blue-600 font-semibold text-sm mt-auto group/link"
        >
          <span>Leer artículo completo</span>
          <FaArrowRight className="text-xs transition-transform duration-200 group-hover/link:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
