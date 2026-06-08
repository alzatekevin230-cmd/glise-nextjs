// components/ImageWithZoom.jsx
"use client";

import { useRef, useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearchPlus, FaExpand } from 'react-icons/fa';
import { getImageUrl } from '@/lib/imageUtils';

// ── Constantes fuera del componente para evitar recreación en cada render ──
const ZOOM_BOX_SIZE = 120;       // px
const ZOOM_SCALE = 2.5;          // 250% zoom en desktop
const ZOOM_LEVELS_MOBILE = [100, 150, 200, 300]; // Porcentajes de zoom para móvil

export default function ImageWithZoom({ src, alt, openLightbox, priority = false }) {
    const optimizedSrc = getImageUrl(src, '700x700');

    // ── Estados Desktop ──────────────────────────────────────────────────────
    const [isZoomingDesktop, setIsZoomingDesktop] = useState(false);
    const [mousePosition, setMousePosition]       = useState({ x: 0, y: 0 });
    const [zoomPosition, setZoomPosition]         = useState({ x: '50%', y: '50%' });

    // ── Estados Móvil ────────────────────────────────────────────────────────
    const [zoomLevelMobile, setZoomLevelMobile] = useState(0); // índice en ZOOM_LEVELS_MOBILE
    const [panPosition, setPanPosition]         = useState({ x: 50, y: 50 }); // % para backgroundPosition
    const [showHintMobile, setShowHintMobile]   = useState(false);

    // ── Estado Mobile detection (null = aún no calculado → evita flash SSR) ──
    const [isMobile, setIsMobile] = useState(null);

    // ── Refs ─────────────────────────────────────────────────────────────────
    const imageContainerRef = useRef(null);
    const rafRef            = useRef(null);
    const boundsRef         = useRef(null);
    const hintTimeoutRef    = useRef(null);
    const lastTouchRef      = useRef(null); // Para pan táctil

    // ── Detectar mobile (con corrección SSR) ─────────────────────────────────
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // ── Precargar imagen crítica ──────────────────────────────────────────────
    useEffect(() => {
        if (priority && optimizedSrc) {
            const link = document.createElement('link');
            link.rel         = 'preload';
            link.as          = 'image';
            link.href        = optimizedSrc;
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
            return () => {
                if (document.head.contains(link)) document.head.removeChild(link);
            };
        }
    }, [optimizedSrc, priority]);

    // ── Cleanup global al desmontar (memory leaks) ───────────────────────────
    useEffect(() => {
        return () => {
            if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
            if (rafRef.current)         cancelAnimationFrame(rafRef.current);
        };
    }, []);

    // ── Cachear getBoundingClientRect ────────────────────────────────────────
    const updateBounds = useCallback(() => {
        if (imageContainerRef.current) {
            boundsRef.current = imageContainerRef.current.getBoundingClientRect();
        }
    }, []);

    // ── Actualizar bounds al hacer scroll (evita desfase de coordenadas) ─────
    useEffect(() => {
        window.addEventListener('scroll', updateBounds, { passive: true });
        return () => window.removeEventListener('scroll', updateBounds);
    }, [updateBounds]);

    // ════════════════════════════════════════════════════════════════════════
    // HANDLERS DESKTOP (zoom lateral)
    // ════════════════════════════════════════════════════════════════════════
    const handleMouseEnterDesktop = useCallback(() => {
        if (isMobile) return;
        updateBounds();
        setIsZoomingDesktop(true);
    }, [isMobile, updateBounds]);

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

            const halfBox      = ZOOM_BOX_SIZE / 2;
            const constrainedX = Math.max(halfBox, Math.min(width  - halfBox, x));
            const constrainedY = Math.max(halfBox, Math.min(height - halfBox, y));

            setMousePosition({
                x: constrainedX - halfBox,
                y: constrainedY - halfBox,
            });
            setZoomPosition({
                x: `${(constrainedX / width)  * 100}%`,
                y: `${(constrainedY / height) * 100}%`,
            });
        });
    }, []);

    // ════════════════════════════════════════════════════════════════════════
    // HANDLERS MÓVIL (zoom progresivo + pan táctil)
    // ════════════════════════════════════════════════════════════════════════
    const handleClickMobile = useCallback((e) => {
        if (!isMobile) return;
        if (e.target.closest('.expand-button')) return;

        const nextLevel = (zoomLevelMobile + 1) % ZOOM_LEVELS_MOBILE.length;
        setZoomLevelMobile(nextLevel);

        // Resetear pan al cambiar nivel
        if (nextLevel === 0) setPanPosition({ x: 50, y: 50 });
    }, [isMobile, zoomLevelMobile]);

    const handleTouchStartMobile = useCallback((e) => {
        if (!isMobile) return;

        // Guardar posición inicial para calcular el pan
        if (e.touches.length === 1) {
            lastTouchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }

        setShowHintMobile(true);
        if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
        hintTimeoutRef.current = setTimeout(() => setShowHintMobile(false), 2000);
    }, [isMobile]);

    // Pan táctil: mover el backgroundPosition mientras se arrastra con zoom activo
    const handleTouchMoveMobile = useCallback((e) => {
        if (!isMobile || zoomLevelMobile === 0 || !lastTouchRef.current) return;
        if (e.touches.length !== 1) return;

        e.preventDefault(); // evita scroll de página durante el pan

        const touch  = e.touches[0];
        const deltaX = touch.clientX - lastTouchRef.current.x;
        const deltaY = touch.clientY - lastTouchRef.current.y;
        lastTouchRef.current = { x: touch.clientX, y: touch.clientY };

        // Sensibilidad inversamente proporcional al nivel de zoom
        const sensitivity = 30 / (ZOOM_LEVELS_MOBILE[zoomLevelMobile] / 100);

        setPanPosition(prev => ({
            x: Math.max(0, Math.min(100, prev.x - deltaX * sensitivity / 10)),
            y: Math.max(0, Math.min(100, prev.y - deltaY * sensitivity / 10)),
        }));
    }, [isMobile, zoomLevelMobile]);

    // ── Valores derivados ────────────────────────────────────────────────────
    const currentZoomPercentMobile = ZOOM_LEVELS_MOBILE[zoomLevelMobile];
    const isZoomingMobile          = zoomLevelMobile > 0;

    // ── Renderizado condicional mientras isMobile no está calculado (evita flash SSR) ──
    if (isMobile === null) {
        return (
            <div className="w-full aspect-square rounded-lg bg-gray-100 animate-pulse" />
        );
    }

    return (
        <div className="flex gap-4 relative">
            {/* ── Contenedor de la imagen principal ── */}
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
                onTouchMove={handleTouchMoveMobile}
            >
                {/* Imagen principal */}
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
                    className="w-full h-full object-cover image-optimized"
                    style={isZoomingMobile ? { opacity: 0.3 } : {}}
                />

                {/* ── DESKTOP: Recuadro que sigue el mouse ── */}
                {!isMobile && (
                    <AnimatePresence>
                        {isZoomingDesktop && (
                            <motion.div
                                key="zoom-box"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.15 }}
                                className="absolute pointer-events-none border-2 border-blue-500 bg-blue-500/10 z-20"
                                style={{
                                    width:     `${ZOOM_BOX_SIZE}px`,
                                    height:    `${ZOOM_BOX_SIZE}px`,
                                    left:      `${mousePosition.x}px`,
                                    top:       `${mousePosition.y}px`,
                                    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.3)',
                                }}
                            />
                        )}
                    </AnimatePresence>
                )}

                {/* ── MÓVIL: Capa de zoom + pan táctil (AnimatePresence consolidado) ── */}
                {isMobile && (
                    <AnimatePresence>
                        {isZoomingMobile && (
                            <motion.div
                                key="mobile-zoom-layer"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="absolute inset-0 pointer-events-none"
                            >
                                {/* Imagen ampliada con pan */}
                                <div
                                    className="w-full h-full bg-no-repeat"
                                    style={{
                                        backgroundImage:    `url(${optimizedSrc})`,
                                        backgroundPosition: `${panPosition.x}% ${panPosition.y}%`,
                                        backgroundSize:     `${currentZoomPercentMobile}%`,
                                    }}
                                />

                                {/* Badge nivel de zoom */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg"
                                >
                                    {currentZoomPercentMobile}%
                                </motion.div>

                                {/* Lupa animada */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                    className="absolute bottom-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-blue-600 shadow-lg"
                                >
                                    <FaSearchPlus style={{ width: '24px', height: '24px' }} />
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}

                {/* ── MÓVIL: Hint "toca para zoom" (solo cuando no hay zoom activo) ── */}
                {isMobile && (
                    <AnimatePresence>
                        {showHintMobile && !isZoomingMobile && (
                            <motion.div
                                key="hint-zoom"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/75 text-white text-xs px-3 py-2 rounded-full whitespace-nowrap pointer-events-none z-10 flex items-center gap-2"
                            >
                                <FaSearchPlus style={{ width: '16px', height: '16px' }} />
                                Toca para zoom
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}

                {/* ── Botón expandir (siempre visible en hover) ── */}
                <motion.button
                    onClick={(e) => {
                        e.stopPropagation();
                        openLightbox(src);
                    }}
                    className="expand-button absolute bottom-4 left-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 hover:bg-white transition-all duration-200 shadow-lg opacity-0 group-hover:opacity-100 z-10 border border-gray-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <FaExpand style={{ width: '18px', height: '18px', minWidth: '18px', minHeight: '18px' }} />
                </motion.button>

                {/* ── DESKTOP: Hint superior ── */}
                {!isMobile && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/75 text-white text-xs px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap flex items-center gap-2">
                        <FaSearchPlus style={{ width: '14px', height: '14px' }} />
                        Pasa el mouse para ampliar
                    </div>
                )}

                {/* ── MÓVIL: Hint "pantalla completa" ── */}
                {isMobile && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/75 text-white text-xs px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap flex items-center gap-1">
                        Toca en <FaExpand className="mx-1" style={{ width: '14px', height: '14px' }} /> para pantalla completa
                    </div>
                )}
            </div>

            {/* ── DESKTOP: Ventana de zoom lateral (estilo Amazon/Walmart) ── */}
            {!isMobile && (
                <motion.div
                    initial={false}
                    animate={{
                        opacity: isZoomingDesktop ? 1 : 0,
                        x:       isZoomingDesktop ? 0 : -20,
                    }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="hidden lg:block absolute left-full ml-4 top-0 w-[500px] h-full bg-white rounded-lg shadow-2xl overflow-hidden border-2 border-gray-200 pointer-events-none z-50"
                >
                    <div
                        className="w-full h-full bg-no-repeat"
                        style={{
                            backgroundImage:    `url('${optimizedSrc}')`,
                            backgroundPosition: `${zoomPosition.x} ${zoomPosition.y}`,
                            backgroundSize:     `${ZOOM_SCALE * 100}%`,
                        }}
                    />

                    {/* Badge zoom */}
                    <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                        {Math.round(ZOOM_SCALE * 100)}% Zoom
                    </div>
                </motion.div>
            )}
        </div>
    );
}