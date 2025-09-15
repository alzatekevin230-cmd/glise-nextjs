// components/SearchResults.jsx
import Link from 'next/link';
import Image from 'next/image';

const formatPrice = (price) => `$${Math.round(price).toLocaleString('es-CO')}`;

// 1. COPIAMOS LA FUNCIÓN DIRECTAMENTE AQUÍ
function createSlug(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

export default function SearchResults({ suggestions }) {
  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="absolute mt-2 w-full rounded-md bg-white shadow-lg z-50 border max-h-96 overflow-y-auto">
      {suggestions.map(p => {
        // 2. AHORA LA FUNCIÓN ESTÁ DISPONIBLE LOCALMENTE
        const productSlug = createSlug(p.name);

        return (
          // 3. Y LA USAMOS PARA CREAR EL ENLACE CORRECTO
          <Link key={p.id} href={`/producto/${productSlug}`} className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors">
            <div className="relative w-12 h-12 flex-shrink-0">
              <Image 
                src={p.image || p.images?.[0] || 'https://placehold.co/100x100'} 
                alt={p.name} 
                fill 
                className="object-contain rounded-md" 
              />
            </div>
            <div className="ml-4 overflow-hidden">
              <p className="font-semibold line-clamp-1">{p.name}</p>
              <p className="text-sm text-blue-600">{formatPrice(p.price)}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}