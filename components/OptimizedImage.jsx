"use client";

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { CldImage } from 'next-cloudinary';
import SkeletonLoader from './SkeletonLoader';
import { FaImage } from 'react-icons/fa';

export default function OptimizedImage({ 
  src, 
  alt, 
  className = '', 
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  quality = 80, // ✅ Calidad por defecto optimizada
  width,
  height,
  ...props 
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imgRef = useRef(null);

  // Detectar si la imagen es de Cloudinary
  const isCloudinaryImage = src?.includes('cloudinary.com') || src?.includes('res.cloudinary.com');

  useEffect(() => {
    if (priority) {
      // Preload critical images only if they're above the fold
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
      
      return () => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      };
    }
  }, [src, priority]);

  const handleLoad = () => {
    setImageLoaded(true);
  };

  const handleError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  if (imageError) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <div className="text-gray-400 text-center">
          <FaImage className="text-2xl mb-2 mx-auto" />
          <p className="text-sm">Error al cargar</p>
        </div>
      </div>
    );
  }

  // Si es Cloudinary, usar CldImage para optimización automática
  if (isCloudinaryImage) {
    // Extraer publicId de la URL de Cloudinary
    const getPublicId = (url) => {
      if (!url) return null;
      try {
        const match = url.match(/\/v\d+\/(.+)$/);
        return match ? match[1].split('.')[0] : null;
      } catch {
        return null;
      }
    };

    const publicId = getPublicId(src);

    if (publicId) {
      return (
        <div className={`relative ${className} overflow-hidden`}>
          {!imageLoaded && <SkeletonLoader type="image" className="absolute inset-0" />}
          <CldImage
            src={publicId}
            alt={alt}
            fill
            sizes={sizes}
            quality="auto"
            fetchFormat="auto"
            crop="fill"
            className={`object-contain transition-all duration-500 ease-out image-optimized ${
              imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
            onLoad={handleLoad}
            onError={handleError}
            loading={priority ? 'eager' : 'lazy'}
            {...props}
          />
        </div>
      );
    }
  }

  // Para imágenes no-Cloudinary, usar Image normal de Next.js
  // Si es Cloudinary, usar CldImage para optimización automática
  if (isCloudinaryImage) {
    // Extraer publicId de la URL de Cloudinary
    const getPublicId = (url) => {
      if (!url) return null;
      try {
        const match = url.match(/\/v\d+\/(.+)$/);
        return match ? match[1].split('.')[0] : null;
      } catch {
        return null;
      }
    };

    const publicId = getPublicId(src);

    if (publicId) {
      return (
        <div className={`relative ${className} overflow-hidden`}>
          {!imageLoaded && <SkeletonLoader type="image" className="absolute inset-0" />}
          <CldImage
            src={publicId}
            alt={alt}
            fill
            sizes={sizes}
            quality="auto"
            fetchFormat="auto"
            crop="fill"
            className={`object-contain transition-all duration-500 ease-out image-optimized ${
              imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
            onLoad={handleLoad}
            onError={handleError}
            loading={priority ? 'eager' : 'lazy'}
            {...props}
          />
        </div>
      );
    }
  }

  // Para imágenes no-Cloudinary, usar Image normal de Next.js
  return (
    <div className={`relative ${className} overflow-hidden`}>
      {!imageLoaded && <SkeletonLoader type="image" className="absolute inset-0" />}
      <Image
        ref={imgRef}
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        quality={quality}
        className={`object-contain transition-all duration-500 ease-out image-optimized ${
          imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
        }`}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? 'eager' : 'lazy'}
        priority={priority}
        placeholder="blur"
        blurDataURL="data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA="
        {...props}
      />
    </div>
  );
}
