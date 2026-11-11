// app/robots.js
export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/api/feeds/'],
        disallow: ['/api/', '/checkout', '/mis-pedidos', '/rastrear-pedido', '/gracias'],
      },
      // Solo bloqueamos bots masivos que no traen clientes (Bytespider y CCBot)
      { userAgent: 'CCBot', disallow: ['/'] },
      { userAgent: 'Bytespider', disallow: ['/'] },
    ],
    sitemap: 'https://glise.com.co/sitemap.xml',
  };
}