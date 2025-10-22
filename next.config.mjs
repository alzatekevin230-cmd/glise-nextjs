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
};

export default nextConfig;
