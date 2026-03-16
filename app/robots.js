// app/robots.js
export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/checkout', '/mis-pedidos', '/rastrear-pedido', '/gracias'],
      },
      { userAgent: 'GPTBot', disallow: ['/'] },
      { userAgent: 'ClaudeBot', disallow: ['/'] },
      { userAgent: 'CCBot', disallow: ['/'] },
      { userAgent: 'Google-Extended', disallow: ['/'] },
      { userAgent: 'Amazonbot', disallow: ['/'] },
      { userAgent: 'Bytespider', disallow: ['/'] },
      { userAgent: 'meta-externalagent', disallow: ['/'] },
      { userAgent: 'Applebot-Extended', disallow: ['/'] },
    ],
    sitemap: 'https://glise.com.co/sitemap.xml',
  };
}