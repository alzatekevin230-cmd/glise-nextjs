// components/ImageWithZoom.jsx
"use client";

import { useRef, useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearchPlus, FaExpand } from 'react-icons/fa';

export default function ImageWithZoom({ src, alt, openLightbox, priority = false }) {
    // Estados para DESKTOP (zoom lateral)
    const [isZoomingDesktop, setIsZoomingDesktop] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [zoomPosition, setZoomPosition] = useState({ x: '50%', y: '50%' });
    
    // Estados para MÓVIL (zoom progresivo)
    const [zoomLevelMobile, setZoomLevelMobile] = useState(0); // 0 = sin zoom, 1 = 150%, 2 = 200%, 3 = 300%
    const [showHintMobile, setShowHintMobile] = useState(false);
    
    const [isMobile, setIsMobile] = useState(false);
    const imageContainerRef = useRef(null);
    const rafRef = useRef(null);
    const boundsRef = useRef(null);
    const hintTimeoutRef = useRef(null);

    // Configuración
    const ZOOM_BOX_SIZE = 120; // px
    const ZOOM_SCALE = 2.5; // 250% de zoom para desktop
    const zoomLevelsMobile = [100, 150, 200, 300]; // Porcentajes de zoom para móvil

    // Detectar si es móvil
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Cachear getBoundingClientRect para evitar forced reflows
    const updateBounds = useCallback(() => {
        if (imageContainerRef.current) {
            boundsRef.current = imageContainerRef.current.getBoundingClientRect();
        }
    }, []);

    // ====== HANDLERS PARA DESKTOP (ZOOM LATERAL) ======
    const handleMouseMoveDesktop = useCallback((e) => {
        if (!boundsRef.current) return;

        // Cancelar el frame anterior si existe
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
        }

        // Usar requestAnimationFrame para agrupar actualizaciones
        rafRef.current = requestAnimationFrame(() => {
            const { left, top, width, height } = boundsRef.current;
        const x = e.clientX - left;
        const y = e.clientY - top;

            // Limitar el recuadro para que no se salga de la imagen
            const halfBox = ZOOM_BOX_SIZE / 2;
            const constrainedX = Math.max(halfBox, Math.min(width - halfBox, x));
            const constrainedY = Math.max(halfBox, Math.min(height - halfBox, y));

            // Posición del recuadro azul
            setMousePosition({
                x: constrainedX - halfBox,
                y: constrainedY - halfBox
            });

            // Calcular porcentajes para el zoom
            const xPercentage = (constrainedX / width) * 100;
            const yPercentage = (constrainedY / height) * 100;

        setZoomPosition({
            x: `${xPercentage}%`,
            y: `${yPercentage}%`
        });
        });
    }, []);

    const handleMouseEnterDesktop = useCallback(() => {
        if (isMobile) return;
        updateBounds();
        setIsZoomingDesktop(true);
    }, [updateBounds, isMobile]);

    const handleMouseLeaveDesktop = useCallback(() => {
        setIsZoomingDesktop(false);
        
        // Cancelar cualquier animación pendiente
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
        }
    }, []);

    // ====== HANDLERS PARA MÓVIL (ZOOM PROGRESIVO) ======
    const handleClickMobile = useCallback((e) => {
        if (!isMobile) return;
        
        // Si es click en el botón de expandir, no hacer zoom
        if (e.target.closest('.expand-button')) {
            return;
        }

        // Ciclar entre niveles de zoom
        const nextLevel = (zoomLevelMobile + 1) % zoomLevelsMobile.length;
        setZoomLevelMobile(nextLevel);
    }, [isMobile, zoomLevelMobile, zoomLevelsMobile.length]);

    const handleTouchStartMobile = useCallback(() => {
        if (!isMobile) return;
        
        setShowHintMobile(true);
        
        // Ocultar hint después de 2 segundos
        if (hintTimeoutRef.current) {
            clearTimeout(hintTimeoutRef.current);
        }
        hintTimeoutRef.current = setTimeout(() => {
            setShowHintMobile(false);
        }, 2000);
    }, [isMobile]);

    const currentZoomPercentMobile = zoomLevelsMobile[zoomLevelMobile];
    const isZoomingMobile = zoomLevelMobile > 0;

    return (
        <div className="flex gap-4 relative">
            {/* Contenedor de la imagen principal */}
        <div 
            ref={imageContainerRef}
                className={`w-full relative overflow-hidden aspect-square rounded-lg shadow-sm bg-white group ${
                    isMobile ? 'cursor-pointer' : 'cursor-crosshair'
                }`}
                onMouseEnter={handleMouseEnterDesktop}
                onMouseLeave={handleMouseLeaveDesktop}
                onMouseMove={handleMouseMoveDesktop}
                onClick={handleClickMobile}
                onTouchStart={handleTouchStartMobile}
            >
                {/* Imagen principal */}
            <Image
                src={src}
                alt={alt}
                width={600}
                height={600}
                    priority={priority}
                    className="w-full h-full object-cover transition-opacity duration-200"
                    style={{ opacity: isZoomingMobile ? 0.3 : 1 }}
                />

                {/* ====== DESKTOP: Recuadro azul que sigue el mouse (estilo Amazon) ====== */}
                {!isMobile && (
                    <AnimatePresence>
                        {isZoomingDesktop && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.15 }}
                                className="absolute pointer-events-none border-2 border-blue-500 bg-blue-500/10"
                                style={{
                                    width: `${ZOOM_BOX_SIZE}px`,
                                    height: `${ZOOM_BOX_SIZE}px`,
                                    left: `${mousePosition.x}px`,
                                    top: `${mousePosition.y}px`,
                                    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.3)'
                                }}
                            />
                        )}
                    </AnimatePresence>
                )}

                {/* ====== MÓVIL: Capa de zoom progresivo ====== */}
                {isMobile && (
                    <AnimatePresence>
                        {isZoomingMobile && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="absolute inset-0 bg-no-repeat pointer-events-none"
                                style={{
                                    backgroundImage: `url(${src})`,
                                    backgroundPosition: 'center',
                                    backgroundSize: `${currentZoomPercentMobile}%`
                                }}
                            />
                        )}
                    </AnimatePresence>
                )}

                {/* ====== MÓVIL: Hint de zoom ====== */}
                {isMobile && (
                    <AnimatePresence>
                        {showHintMobile && !isZoomingMobile && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/75 text-white text-xs px-3 py-2 rounded-full whitespace-nowrap pointer-events-none z-10 flex items-center gap-2"
                            >
                                <FaSearchPlus style={{width: '16px', height: '16px'}} />
                                Toca para zoom
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}

                {/* ====== MÓVIL: Indicador de nivel de zoom ====== */}
                {isMobile && (
                    <AnimatePresence>
                        {isZoomingMobile && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.2 }}
                                className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full pointer-events-none z-10 shadow-lg"
                            >
                                {currentZoomPercentMobile}%
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}

                {/* ====== MÓVIL: Lupa animada ====== */}
                {isMobile && (
                    <AnimatePresence>
                        {isZoomingMobile && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="absolute bottom-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-blue-600 pointer-events-none z-10 shadow-lg"
                            >
                                <FaSearchPlus style={{width: '24px', height: '24px'}} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}

                {/* Botón de expandir (siempre visible en hover) */}
                <motion.button
                    onClick={(e) => {
                        e.stopPropagation();
                        openLightbox(src);
                    }}
                    className="expand-button absolute bottom-4 left-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg opacity-0 group-hover:opacity-100 z-10 border border-gray-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <FaExpand style={{width: '18px', height: '18px', minWidth: '18px', minHeight: '18px'}} />
                </motion.button>

                {/* ====== DESKTOP: Hint en la parte superior ====== */}
                {!isMobile && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/75 text-white text-xs px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap flex items-center gap-2">
                        <FaSearchPlus style={{width: '14px', height: '14px'}} />
                        Pasa el mouse para ampliar
                    </div>
                )}

                {/* ====== MÓVIL: Hint de "toca para pantalla completa" ====== */}
                {isMobile && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/75 text-white text-xs px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap flex items-center gap-1">
                        Toca en <FaExpand className="mx-1" style={{width: '14px', height: '14px'}} /> para pantalla completa
                    </div>
                )}
            </div>

            {/* ====== DESKTOP: Ventana de zoom lateral (estilo Amazon/Walmart) ====== */}
            {!isMobile && (
                <AnimatePresence>
                    {isZoomingDesktop && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2, type: "spring", stiffness: 300, damping: 30 }}
                            className="hidden lg:block absolute left-full ml-4 top-0 w-[500px] h-full bg-white rounded-lg shadow-2xl overflow-hidden border-2 border-gray-200 pointer-events-none z-50"
                        >
                            <div
                                className="w-full h-full bg-no-repeat"
    style={{
        backgroundImage: `url(${src})`,
        backgroundPosition: `${zoomPosition.x} ${zoomPosition.y}`,
                                    backgroundSize: `${ZOOM_SCALE * 100}%`,
                                }}
                            />
                            
                            {/* Badge indicador de zoom */}
                            <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                                {Math.round(ZOOM_SCALE * 100)}% Zoom
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </div>
    );
}
