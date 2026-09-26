// lib/userIndex.js
// Índice de solo lectura para ubicar usuarios por correo desde la consola de Firebase
// (los documentos de /users están indexados por UID, difícil de identificar a simple vista).

// Normaliza el correo para usarlo como ID de documento estable
export function emailToDocId(email) {
  return email.trim().toLowerCase();
}

export async function mirrorUserByEmail({ uid, name, email }) {
  const { doc, setDoc } = await import('firebase/firestore');
  const { db } = await import('@/lib/firebaseClient');
  await setDoc(doc(db, 'usersByEmail', emailToDocId(email)), {
    uid,
    name: name || null,
    email,
    createdAt: new Date(),
  });
}
