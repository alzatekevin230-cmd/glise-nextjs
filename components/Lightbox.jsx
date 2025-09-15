// components/Lightbox.jsx
"use client";

import { useModal } from '@/contexto/ContextoModal';
import Image from 'next/image';

export default function Lightbox() {
  const { lightboxImage, closeLightbox } = useModal();

  if (!lightboxImage) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-80 z-[9999] flex items-center justify-center p-4 animate-fadeIn"
      onClick={closeLightbox}
    >
      <button 
        onClick={closeLightbox} 
        className="absolute top-4 right-6 text-white text-5xl font-bold hover:text-gray-300"
      >
        &times;
      </button>
      <div className="relative w-full h-full max-w-4xl max-h-[90vh]">
        <Image 
          src={lightboxImage} 
          alt="Imagen de producto ampliada"
          fill
          className="object-contain"
          sizes="100vw"
        />
      </div>
    </div>
  );
}