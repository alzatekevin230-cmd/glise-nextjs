const { db } = require('../lib/firebaseAdmin.js');

async function checkBlogImages() {
  try {
    console.log('🔍 Verificando imágenes del blog...\n');
    
    const blogSnapshot = await db.collection('blogPosts').orderBy('id', 'asc').get();
    
    if (blogSnapshot.empty) {
      console.log('❌ No se encontraron artículos del blog');
      return;
    }
    
    console.log(`📝 Encontrados ${blogSnapshot.docs.length} artículos del blog:\n`);
    
    blogSnapshot.docs.forEach((doc, index) => {
      const post = doc.data();
      console.log(`${index + 1}. ${post.title}`);
      console.log(`   📸 Imagen: ${post.imageUrl || 'No tiene imagen'}`);
      console.log(`   📂 Categoría: ${post.category || 'Sin categoría'}`);
      console.log(`   🆔 ID: ${post.id}`);
      console.log(`   🔗 Slug: ${post.slug || 'Sin slug'}`);
      console.log('');
    });
    
    // Verificar URLs de Firebase Storage
    const firebaseUrls = blogSnapshot.docs
      .map(doc => doc.data().imageUrl)
      .filter(url => url && url.includes('firebasestorage.googleapis.com'));
    
    console.log(`🌐 URLs de Firebase Storage encontradas: ${firebaseUrls.length}`);
    
    if (firebaseUrls.length > 0) {
      console.log('\n📋 URLs de Firebase Storage:');
      firebaseUrls.forEach((url, index) => {
        const isWebP = url.includes('.webp');
        const format = isWebP ? '✅ WebP' : '❌ PNG/JPG';
        console.log(`   ${index + 1}. ${format} - ${url}`);
      });
    }
    
    console.log('\n💡 Diagnóstico:');
    if (firebaseUrls.length === 0) {
      console.log('   - No hay URLs de Firebase Storage');
      console.log('   - Las imágenes pueden estar usando placeholders o URLs locales');
    } else {
      const webpCount = firebaseUrls.filter(url => url.includes('.webp')).length;
      const pngJpgCount = firebaseUrls.length - webpCount;
      
      if (pngJpgCount > 0) {
        console.log(`   ⚠️  ${pngJpgCount} imágenes siguen siendo PNG/JPG`);
        console.log('   💡 Solución: Convertir imágenes en Firebase Storage a WebP');
      } else {
        console.log('   ✅ Todas las imágenes son WebP');
      }
    }
    
  } catch (error) {
    console.error('💥 Error al verificar imágenes del blog:', error);
  }
}

checkBlogImages();
