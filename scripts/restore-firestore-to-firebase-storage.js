import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
if (!bucketName) {
  console.error('❌ Falta NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET');
  process.exit(1);
}

const CATEGORY_TO_FIREBASE_FOLDER = {
  'Cuidado Infantil': 'infantil',
  'Cuidado y Belleza': 'belleza',
  'Dermocosméticos': 'dermo',
  Milenario: 'milenario',
  'Naturales y Homeopáticos': 'nat',
};

function safeDecode(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function extractFilename(urlOrPath) {
  if (!urlOrPath || typeof urlOrPath !== 'string') return null;

  const firebaseMatch = urlOrPath.match(/\/o\/([^?]+)/);
  if (firebaseMatch?.[1]) {
    const decoded = safeDecode(firebaseMatch[1]);
    return decoded.split('/').pop() || null;
  }

  const noQuery = urlOrPath.split('?')[0];
  const decoded = safeDecode(noQuery);
  return decoded.split('/').pop() || null;
}

function buildFirebaseUrl(folder, filename) {
  const objectPath = `products/${folder}/${filename}`;
  return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(objectPath)}?alt=media`;
}

async function run() {
  const { db } = await import('../lib/firebaseAdmin.js');
  const snapshot = await db.collection('products').get();

  let updated = 0;
  let skipped = 0;
  let noCategory = 0;

  for (const doc of snapshot.docs) {
    const p = doc.data();
    const folder = CATEGORY_TO_FIREBASE_FOLDER[p.category];
    if (!folder) {
      noCategory++;
      continue;
    }

    const updates = {};
    let needsUpdate = false;

    const imageSource = (typeof p.image === 'string' && p.image.trim())
      ? p.image
      : (Array.isArray(p.images) && typeof p.images[0] === 'string' ? p.images[0] : null);

    if (imageSource) {
      const file = extractFilename(imageSource);
      if (file) {
        const nextMain = buildFirebaseUrl(folder, file);
        if (p.image !== nextMain) {
          updates.image = nextMain;
          needsUpdate = true;
        }
      }
    }

    if (Array.isArray(p.images) && p.images.length > 0) {
      const nextImages = p.images.map((img) => {
        if (typeof img !== 'string') return img;
        const file = extractFilename(img);
        return file ? buildFirebaseUrl(folder, file) : img;
      });
      if (JSON.stringify(nextImages) !== JSON.stringify(p.images)) {
        updates.images = nextImages;
        needsUpdate = true;
      }
    }

    if (needsUpdate) {
      await db.collection('products').doc(doc.id).update(updates);
      updated++;
      if (updated <= 30) {
        console.log(`✅ ${doc.id} -> Firebase Storage`);
      }
    } else {
      skipped++;
    }
  }

  console.log('\nResumen:');
  console.log(`- Actualizados: ${updated}`);
  console.log(`- Sin cambios: ${skipped}`);
  console.log(`- Sin mapeo de categoría: ${noCategory}`);
}

run().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
