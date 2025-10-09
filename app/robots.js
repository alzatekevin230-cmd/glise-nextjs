// app/robots.js
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/checkout', '/mis-pedidos', '/rastrear-pedido', '/gracias'],
    },
    sitemap: 'https://glise.com.co/sitemap.xml', // Cambia esto a tu dominio real
  };
}

