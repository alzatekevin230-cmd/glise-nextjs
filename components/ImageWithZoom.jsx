// components/ImageWithZoom.jsx
"use client";

import { useRef, useState } from 'react';
import Image from 'next/image';

export default function ImageWithZoom({ src, alt, openLightbox }) {
    const [isZooming, setIsZooming] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: '50%', y: '50%' });
    const imageContainerRef = useRef(null);

    const handleMouseMove = (e) => {
        if (!imageContainerRef.current) return;

        const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;

        const xPercentage = (x / width) * 100;
        const yPercentage = (y / height) * 100;

        setZoomPosition({
            x: `${xPercentage}%`,
            y: `${yPercentage}%`
        });
    };

    return (
        <div 
            ref={imageContainerRef}
            className="w-full relative overflow-hidden aspect-square rounded-lg shadow-sm bg-white"
            onMouseEnter={() => setIsZooming(true)}
            onMouseLeave={() => setIsZooming(false)}
            onMouseMove={handleMouseMove}
        >
            <Image
                src={src}
                alt={alt}
                width={600}
                height={600}
                onClick={() => openLightbox(src)}
                className="w-full h-full object-cover"
            />
            {isZooming && (
                <div 
    className={`absolute inset-0 bg-no-repeat pointer-events-none transition-opacity duration-200 ${isZooming ? 'opacity-100' : 'opacity-0'}`}
    style={{
        backgroundImage: `url(${src})`,
        backgroundPosition: `${zoomPosition.x} ${zoomPosition.y}`,
        backgroundSize: '200%'
    }}
/>
            )}
            <button onClick={() => openLightbox(src)} className="absolute bottom-4 left-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 hover:bg-white hover:scale-110 transition-transform duration-200 shadow-md">
              <i className="fas fa-expand"></i>
            </button>
        </div>
    );
}