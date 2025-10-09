// components/Lightbox.jsx
"use client";

import { useModal } from '@/contexto/ContextoModal';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Lightbox() {
  const { lightboxImage, closeLightbox } = useModal();
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Reset zoom when image changes
  useEffect(() => {
    if (lightboxImage) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [lightboxImage]);

  if (!lightboxImage) {
    return null;
  }

  const handleWheel = (e) => {
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale(prev => Math.max(0.5, Math.min(3, prev * delta)));
  };

  const handleMouseDown = (e) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    if (scale > 1) {
      setIsDragging(true);
      const touch = e.touches[0];
      setDragStart({
        x: touch.clientX - position.x,
        y: touch.clientY - position.y
      });
    }
  };

  const handleTouchMove = (e) => {
    if (isDragging && scale > 1) {
      const touch = e.touches[0];
      setPosition({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleDoubleClick = () => {
    if (scale === 1) {
      setScale(2);
    } else {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black z-[9999] flex items-center justify-center p-2 sm:p-4 animate-fadeIn"
      onClick={closeLightbox}
    >
      {/* Botón de cerrar */}
      <button 
        onClick={closeLightbox} 
        className="absolute top-2 right-2 sm:top-4 sm:right-6 text-white text-3xl sm:text-5xl font-bold hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center transition-all duration-300 hover:bg-opacity-70"
      >
        &times;
      </button>
      
      {/* Contenedor del producto con fondo blanco */}
      <div 
        className="relative bg-white rounded-lg shadow-2xl p-2
                   w-[85vw] h-[65vh] max-w-[85vw] max-h-[65vh]
                   sm:w-full sm:h-full sm:max-w-4xl sm:max-h-[90vh] sm:p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div 
          className="relative overflow-hidden w-full h-full"
          onWheelCapture={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onDoubleClick={handleDoubleClick}
          style={{ cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in' }}
        >
          <Image 
            src={lightboxImage} 
            alt="Imagen de producto ampliada"
            fill
            className="object-contain select-none"
            sizes="(max-width: 640px) 85vw, 100vw"
            style={{
              transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
              transition: isDragging ? 'none' : 'transform 0.2s ease-out'
            }}
            draggable={false}
            priority
            loading="eager"
          />
        </div>
      </div>
    </div>
  );
}