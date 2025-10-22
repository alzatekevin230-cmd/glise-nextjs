// components/Lightbox.jsx
"use client";

import { useModal } from '@/contexto/ContextoModal';
import Image from 'next/image';
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Lightbox() {
  const { lightboxImage, lightboxImages = [], closeLightbox } = useModal();
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef(null);

  const MIN_SCALE = 0.5;
  const MAX_SCALE = 4;

  // Encontrar el índice de la imagen actual
  useEffect(() => {
    if (lightboxImage && lightboxImages.length > 0) {
      const index = lightboxImages.findIndex(img => img === lightboxImage);
      setCurrentIndex(index >= 0 ? index : 0);
    }
  }, [lightboxImage, lightboxImages]);

  // Reset zoom cuando cambia la imagen
  useEffect(() => {
    if (lightboxImage) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [lightboxImage, currentIndex]);

  // Auto-hide controls
  const resetControlsTimeout = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  }, []);

  useEffect(() => {
    resetControlsTimeout();
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [resetControlsTimeout]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          handlePrevImage();
          break;
        case 'ArrowRight':
          handleNextImage();
          break;
        case '+':
        case '=':
          handleZoomIn();
          break;
        case '-':
          handleZoomOut();
          break;
        case '0':
          handleResetZoom();
          break;
      }
    };

    if (lightboxImage) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [lightboxImage, currentIndex, scale]);

  const handleNextImage = useCallback(() => {
    if (lightboxImages.length <= 1) return;
    const nextIndex = (currentIndex + 1) % lightboxImages.length;
    setCurrentIndex(nextIndex);
    resetControlsTimeout();
  }, [currentIndex, lightboxImages.length, resetControlsTimeout]);

  const handlePrevImage = useCallback(() => {
    if (lightboxImages.length <= 1) return;
    const prevIndex = currentIndex === 0 ? lightboxImages.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    resetControlsTimeout();
  }, [currentIndex, lightboxImages.length, resetControlsTimeout]);

  const handleZoomIn = useCallback(() => {
    setScale(prev => Math.min(MAX_SCALE, prev + 0.5));
    resetControlsTimeout();
  }, [resetControlsTimeout]);

  const handleZoomOut = useCallback(() => {
    setScale(prev => Math.max(MIN_SCALE, prev - 0.5));
    resetControlsTimeout();
  }, [resetControlsTimeout]);

  const handleResetZoom = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    resetControlsTimeout();
  }, [resetControlsTimeout]);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale(prev => Math.max(MIN_SCALE, Math.min(MAX_SCALE, prev * delta)));
    resetControlsTimeout();
  }, [resetControlsTimeout]);

  const handleMouseDown = useCallback((e) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  }, [scale, position]);

  const handleMouseMove = useCallback((e) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
    resetControlsTimeout();
  }, [isDragging, scale, dragStart, resetControlsTimeout]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback((e) => {
    const touch = e.touches[0];
    
    if (e.touches.length === 1) {
      // Detectar swipe
      setTouchStart({ x: touch.clientX, y: touch.clientY, time: Date.now() });
      
      if (scale > 1) {
        setIsDragging(true);
        setDragStart({
          x: touch.clientX - position.x,
          y: touch.clientY - position.y
        });
      }
    }
  }, [scale, position]);

  const handleTouchMove = useCallback((e) => {
    if (isDragging && scale > 1 && e.touches.length === 1) {
      const touch = e.touches[0];
      setPosition({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y
      });
    }
    resetControlsTimeout();
  }, [isDragging, scale, dragStart, resetControlsTimeout]);

  const handleTouchEnd = useCallback((e) => {
    if (touchStart && e.changedTouches[0]) {
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStart.x;
      const deltaY = touch.clientY - touchStart.y;
      const deltaTime = Date.now() - touchStart.time;
      
      // Detectar swipe horizontal (solo si no hay zoom)
      if (scale === 1 && Math.abs(deltaX) > 50 && Math.abs(deltaY) < 100 && deltaTime < 300) {
        if (deltaX > 0) {
          handlePrevImage();
        } else {
          handleNextImage();
        }
      }
    }
    
    setIsDragging(false);
    setTouchStart(null);
  }, [touchStart, scale, handlePrevImage, handleNextImage]);

  const handleDoubleClick = useCallback(() => {
    if (scale === 1) {
      setScale(2);
    } else {
      handleResetZoom();
    }
  }, [scale, handleResetZoom]);

  if (!lightboxImage) {
    return null;
  }

  const currentImage = lightboxImages[currentIndex] || lightboxImage;
  const hasMultipleImages = lightboxImages.length > 1;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="fixed inset-0 bg-black z-[9999] flex items-center justify-center"
        onClick={(e) => {
          if (e.target === e.currentTarget) closeLightbox();
        }}
        onMouseMove={resetControlsTimeout}
      >
        {/* Header con controles */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-4 z-20"
            >
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Contador de imágenes */}
                {hasMultipleImages && (
                  <div className="text-white text-sm font-semibold bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                    <i className="fas fa-images mr-2"></i>
                    {currentIndex + 1} / {lightboxImages.length}
                  </div>
                )}
                
                {/* Controles de zoom */}
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full p-1">
                  <button
                    onClick={handleZoomOut}
                    disabled={scale <= MIN_SCALE}
                    className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-colors flex items-center justify-center"
                    title="Alejar (tecla -)"
                  >
                    <i className="fas fa-search-minus"></i>
                  </button>
                  
                  <span className="text-white text-sm font-bold min-w-[60px] text-center">
                    {Math.round(scale * 100)}%
                  </span>
                  
                  <button
                    onClick={handleZoomIn}
                    disabled={scale >= MAX_SCALE}
                    className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-colors flex items-center justify-center"
                    title="Acercar (tecla +)"
                  >
                    <i className="fas fa-search-plus"></i>
                  </button>
                  
                  <button
                    onClick={handleResetZoom}
                    disabled={scale === 1}
                    className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-colors flex items-center justify-center"
                    title="Restablecer (tecla 0)"
                  >
                    <i className="fas fa-undo"></i>
                  </button>
                </div>

                {/* Botón de cerrar */}
                <button
                  onClick={closeLightbox}
                  className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white transition-colors flex items-center justify-center text-2xl"
                  title="Cerrar (ESC)"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Flechas de navegación */}
        {hasMultipleImages && (
          <>
            <AnimatePresence>
              {showControls && (
                <>
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white transition-all flex items-center justify-center text-2xl z-20 hover:scale-110"
                    title="Anterior (←)"
                  >
                    <i className="fas fa-chevron-left"></i>
                  </motion.button>

                  <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white transition-all flex items-center justify-center text-2xl z-20 hover:scale-110"
                    title="Siguiente (→)"
                  >
                    <i className="fas fa-chevron-right"></i>
                  </motion.button>
                </>
              )}
            </AnimatePresence>
          </>
        )}

        {/* Contenedor de la imagen - SIN LOADING SPINNER */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="relative w-full h-full max-w-7xl max-h-[90vh] p-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="relative overflow-hidden w-full h-full bg-black/20 rounded-lg backdrop-blur-sm"
            onWheelCapture={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onDoubleClick={handleDoubleClick}
            style={{ 
              cursor: scale > 1 
                ? (isDragging ? 'grabbing' : 'grab') 
                : 'zoom-in' 
            }}
          >
            <Image
              key={currentImage}
              src={currentImage}
              alt="Imagen de producto ampliada"
              fill
              className="object-contain select-none"
              sizes="100vw"
              style={{
                transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                transition: isDragging ? 'none' : 'transform 0.2s ease-out'
              }}
              draggable={false}
              priority
              loading="eager"
            />
          </div>
        </motion.div>

        {/* Hints en la parte inferior */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm text-white text-xs sm:text-sm px-4 py-2 rounded-full z-20 flex items-center gap-4"
            >
              <span className="hidden sm:inline">
                <i className="fas fa-arrows-alt mr-2"></i>
                Rueda para zoom
              </span>
              {hasMultipleImages && (
                <span className="hidden sm:inline">
                  <i className="fas fa-arrows-alt-h mr-2"></i>
                  Flechas para navegar
                </span>
              )}
              <span>
                <i className="fas fa-hand-pointer mr-2"></i>
                Doble clic = Zoom 2x
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
