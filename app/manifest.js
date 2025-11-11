// app/manifest.js - PWA Manifest para mejor rendimiento
export default function manifest() {
  return {
    name: 'Glisé - Farmacia y Belleza Natural',
    short_name: 'Glisé',
    description: 'Tu farmacia online #1 en Colombia. Productos naturales, dermocosméticos premium y cuidado personal.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0891b2',
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}






