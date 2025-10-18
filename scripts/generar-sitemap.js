// scripts/generar-sitemap.js
import fs from 'fs';
import path from 'path';
import { db } from '../lib/firebaseClient.js';
import { collection, getDocs } from 'firebase/firestore';

// Helpers
function escapeXml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toSlug(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function isValidImageUrl(url) {
  return typeof url === 'string' && /^https?:\/\//.test(url);
}

// Generar sitemap
async function generarSitemap() {
  const productsRef = collection(db, 'products');
  const snap = await getDocs(productsRef);
  const lines = [];
  lines.push('<?xml version="1.0" encoding="UTF-8"?>');
  lines.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">');

  snap.forEach(doc => {
    const data = doc.data();
    const slug = (data.slug && String(data.slug).trim()) || toSlug(data.name || doc.id);
    const loc = `https://glise.com.co/producto/${slug}`;

    // Fecha: preferir updatedAt o createdAt si vienen como Timestamp
    let lastmod = new Date().toISOString();
    if (data.updatedAt && data.updatedAt.toDate) lastmod = data.updatedAt.toDate().toISOString();
    else if (data.updatedAt) lastmod = new Date(data.updatedAt).toISOString();
    else if (data.createdAt && data.createdAt.toDate) lastmod = data.createdAt.toDate().toISOString();

    // EXTRAER imagen correctamente (manejar array u objeto)
    let imageUrl = '';
    if (Array.isArray(data.images) && data.images.length > 0) {
      imageUrl = data.images[0];
      if (typeof imageUrl === 'object' && imageUrl !== null) {
        imageUrl = imageUrl.url || imageUrl.src || imageUrl.path || imageUrl.fullPath || '';
      }
    } else if (data.image) {
      imageUrl = data.image;
    }

    lines.push('  <url>');
    lines.push(`    <loc>${escapeXml(loc)}</loc>`);

    if (isValidImageUrl(imageUrl)) {
      lines.push('    <image:image>');
      lines.push(`      <image:loc>${escapeXml(imageUrl)}</image:loc>`);
      lines.push(`      <image:title>${escapeXml(data.name || '')}</image:title>`);
      if (data.description) lines.push(`      <image:caption>${escapeXml(String(data.description).slice(0,200))}</image:caption>`);
      lines.push('    </image:image>');
    }

    lines.push(`    <lastmod>${escapeXml(lastmod)}</lastmod>`);
    lines.push('    <changefreq>weekly</changefreq>');
    lines.push('    <priority>0.7</priority>');
    lines.push('  </url>');
  });

  lines.push('</urlset>');
  const xml = lines.join('\n');

  // Guardar en public/sitemap.xml
  const publicPath = path.resolve('./public');
  if (!fs.existsSync(publicPath)) fs.mkdirSync(publicPath, { recursive: true });
  fs.writeFileSync(path.join(publicPath, 'sitemap.xml'), xml, 'utf8');

  // aviso si algo quedó mal
  if (xml.includes('[object Object]')) {
    console.warn('ATENCIÓN: detectado [object Object] en el XML — revisar campo images en Firestore');
  } else {
    console.log('✅ sitemap.xml generado correctamente en /public/sitemap.xml');
  }
}

generarSitemap().catch(e => { console.error(e); process.exit(1); });
