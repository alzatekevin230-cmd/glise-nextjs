// app/api/feeds/merchant/route.js
import { NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/data';

function generateMerchantXML(products) {
  const items = products.map(product => {
    const {
      id,
      name,
      description,
      price,
      image,
      images,
      category,
      laboratorio,
      stock = 10,
      slug
    } = product;

    const availability = stock > 0 ? 'in_stock' : 'out_of_stock';
    const productUrl = `https://glise.com.co/producto/${slug || id}`;
    const mainImage = images?.[0] || image || '';
    const additionalImages = images?.slice(1, 11) || [];

    const escapeXml = (str) => {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
    };

    return `    <item>
      <g:id>${escapeXml(id)}</g:id>
      <g:title>${escapeXml(name)}</g:title>
      <g:description>${escapeXml(description)}</g:description>
      <g:link>${escapeXml(productUrl)}</g:link>
      <g:image_link>${escapeXml(mainImage)}</g:image_link>
      ${additionalImages.map(img => `<g:additional_image_link>${escapeXml(img)}</g:additional_image_link>`).join('\n      ')}
      <g:price>${price} COP</g:price>
      <g:availability>${availability}</g:availability>
      <g:condition>new</g:condition>
      <g:brand>${escapeXml(laboratorio || 'GLISÉ')}</g:brand>
      <g:product_type>${escapeXml(category)}</g:product_type>
    </item>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Glisé - Tienda Online de Bienestar y Belleza</title>
    <link>https://glise.com.co</link>
    <description>Feed de productos para Google Merchant Center</description>
${items}
  </channel>
</rss>`;
}

export async function GET() {
  try {
    const products = await getAllProducts();

    if (!products || products.length === 0) {
      return new NextResponse('<?xml version="1.0"?><error>No hay productos</error>', {
        status: 404,
        headers: { 'Content-Type': 'application/xml; charset=utf-8' },
      });
    }

    const xml = generateMerchantXML(products);

    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error generando feed de Google Merchant:', error);
    return new NextResponse('<?xml version="1.0"?><error>Error interno del servidor</error>', {
      status: 500,
      headers: { 'Content-Type': 'application/xml; charset=utf-8' },
    });
  }
}