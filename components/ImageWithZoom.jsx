// components/ImageWithZoom.jsx
"use client";

import { useRef, useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { FaSearchPlus, FaExpand } from 'react-icons/fa';
import { getImageUrl } from '@/lib/imageUtils';

const ZOOM_BOX_SIZE = 120;
const ZOOM_SCALE = 2.5;

export default function ImageWithZoom({ src, alt, openLightbox, priority = false }) {
  const optimizedSrc = src && !src.includes('w_700') ? getImageUrl(src, '700x700') : (src || '');

  const [isZoomingDesktop, setIsZoomingDesktop] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [zoomPosition, setZoomPosition] = useState({ x: '50%', y: '50%' });

  const imageContainerRef = useRef(null);
  const rafRef = useRef(null);
  const boundsRef = useRef(null);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const updateBounds = useCallback(() => {
    if (imageContainerRef.current) {
      boundsRef.current = imageContainerRef.current.getBoundingClientRect();
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', updateBounds, { passive: true });
    return () => window.removeEventListener('scroll', updateBounds);
  }, [updateBounds]);

  const handleMouseEnterDesktop = useCallback(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) return;
    updateBounds();
    setIsZoomingDesktop(true);
  }, [updateBounds]);

  const handleMouseLeaveDesktop = useCallback(() => {
    setIsZoomingDesktop(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  const handleMouseMoveDesktop = useCallback((e) => {
    if (!boundsRef.current) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      const { left, top, width, height } = boundsRef.current;
      const x = e.clientX - left;
      const y = e.clientY - top;

      const halfBox = ZOOM_BOX_SIZE / 2;
      const constrainedX = Math.max(halfBox, Math.min(width - halfBox, x));
      const constrainedY = Math.max(halfBox, Math.min(height - halfBox, y));

      setMousePosition({
        x: constrainedX - halfBox,
        y: constrainedY - halfBox,
      });
      setZoomPosition({
        x: `${(constrainedX / width) * 100}%`,
        y: `${(constrainedY / height) * 100}%`,
      });
    });
  }, []);

  return (
    <div className="flex gap-4 relative">
      {/* Contenedor principal: la imagen se dibuja de inmediato desde el primer milisegundo */}
      <div
        ref={imageContainerRef}
        className="w-full relative overflow-hidden aspect-square rounded-lg shadow-sm bg-white group cursor-pointer lg:cursor-crosshair"
        onMouseEnter={handleMouseEnterDesktop}
        onMouseLeave={handleMouseLeaveDesktop}
        onMouseMove={handleMouseMoveDesktop}
        onClick={() => {
          if (typeof window !== 'undefined' && window.innerWidth < 1024) {
            openLightbox(src);
          }
        }}
      >
        <Image
          src={optimizedSrc}
          alt={alt}
          width={600}
          height={600}
          priority={priority}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          sizes="(max-width: 768px) 100vw, 600px"
          unoptimized={true}
          className="w-full h-full object-contain image-optimized"
        />

        {/* Recuadro azul de zoom (solo escritorio) */}
        <div
          className={`hidden lg:block absolute pointer-events-none border-2 border-cyan-600 bg-cyan-500/10 z-20 transition-opacity duration-150 ${
            isZoomingDesktop ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            width: `${ZOOM_BOX_SIZE}px`,
            height: `${ZOOM_BOX_SIZE}px`,
            left: `${mousePosition.x}px`,
            top: `${mousePosition.y}px`,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.25)',
          }}
        />

        {/* Botón expandir */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            openLightbox(src);
          }}
          aria-label="Ampliar imagen"
          className="expand-button absolute bottom-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 hover:bg-white hover:scale-110 active:scale-95 transition-all duration-200 shadow-lg z-10 border border-gray-200 opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
        >
          <FaExpand style={{ width: '18px', height: '18px', minWidth: '18px', minHeight: '18px' }} />
        </button>

        {/* Hint superior (solo escritorio) */}
        <div className="hidden lg:flex absolute top-4 left-1/2 -translate-x-1/2 bg-black/75 text-white text-xs px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap items-center gap-2">
          <FaSearchPlus style={{ width: '14px', height: '14px' }} />
          Pasa el mouse para ampliar
        </div>
      </div>

      {/* Ventana de zoom lateral (solo escritorio) */}
      <div
        className={`hidden lg:block absolute left-full ml-4 top-0 w-[500px] h-full bg-white rounded-lg shadow-2xl overflow-hidden border-2 border-gray-200 pointer-events-none z-50 transition-opacity duration-150 ${
          isZoomingDesktop ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div
          className="w-full h-full bg-no-repeat"
          style={{
            backgroundImage: isZoomingDesktop ? `url('${optimizedSrc}')` : 'none',
            backgroundPosition: `${zoomPosition.x} ${zoomPosition.y}`,
            backgroundSize: `${ZOOM_SCALE * 100}%`,
          }}
        />
        <div className="absolute top-4 left-4 bg-cyan-700 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
          {Math.round(ZOOM_SCALE * 100)}% Zoom
        </div>
      </div>
    </div>
  );
}