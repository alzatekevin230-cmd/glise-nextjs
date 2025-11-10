/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // ✅ DESACTIVADO - No usar optimizador para evitar costos de Vercel
    unoptimized: true,
    
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Optimizaciones de rendimiento
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Optimizar compilación
  reactStrictMode: true,
  
  // ✅ Optimizaciones de bundle y chunks
  webpack: (config, { isServer }) => {
    // Optimizar chunks de JavaScript
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            // Separar vendors grandes
            firebase: {
              test: /[\\/]node_modules[\\/](firebase|@firebase)[\\/]/,
              name: 'firebase',
              priority: 30,
              reuseExistingChunk: true,
            },
            swiper: {
              test: /[\\/]node_modules[\\/](swiper)[\\/]/,
              name: 'swiper',
              priority: 25,
              reuseExistingChunk: true,
            },
            framerMotion: {
              test: /[\\/]node_modules[\\/](framer-motion)[\\/]/,
              name: 'framer-motion',
              priority: 25,
              reuseExistingChunk: true,
            },
            reactIcons: {
              test: /[\\/]node_modules[\\/](react-icons)[\\/]/,
              name: 'react-icons',
              priority: 20,
              reuseExistingChunk: true,
            },
            // Separar vendors comunes
            defaultVendors: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: 10,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }
    return config;
  },
  
  // ✅ Optimizaciones experimentales
  experimental: {
    optimizePackageImports: ['react-icons', 'framer-motion', 'swiper'],
    // Deshabilitar CSS chunks innecesarios
    optimizeCss: true,
  },
  
  // ✅ Comprimir código en producción
  compress: true,
  
  // ✅ Reducir tamaño de página
  poweredByHeader: false,
  
  // ✅ Optimizar preloading de recursos
  // Reduce warnings de CSS preload no utilizado
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

export default nextConfig;
