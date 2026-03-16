// app/contexto/ContextoAuth.jsx
"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useModal } from './ContextoModal';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const ProveedorAuth = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { closeModal } = useModal(); // Obtenemos closeModal para usarlo después del login

  useEffect(() => {
    // Optimización: NO importamos Firebase en el bundle inicial.
    // Cargamos Firebase Auth en idle para evitar que el iframe bloquee el LCP inicial.
    let unsubscribe = null;
    let idleCallbackId = null;
    let timeoutId = null;

    const initAuth = async () => {
      const [{ onAuthStateChanged }, { auth }] = await Promise.all([
        import('firebase/auth'),
        import('@/lib/firebaseClient'),
      ]);

      unsubscribe = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
        setLoading(false);
      });
    };

    // Usar requestIdleCallback para inicializar cuando el navegador esté inactivo
    // Fallback a setTimeout si requestIdleCallback no está disponible
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      idleCallbackId = requestIdleCallback(
        () => {
          initAuth();
        },
        { timeout: 3000 } // Máximo 3 segundos de espera
      );
    } else {
      timeoutId = setTimeout(initAuth, 2000);
    }
    
    // Permitir renderizado inmediato sin esperar Auth
    setLoading(false);

    return () => {
      if (idleCallbackId) cancelIdleCallback(idleCallbackId);
      if (timeoutId) clearTimeout(timeoutId);
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const logout = async () => {
    const [{ signOut }, { auth }] = await Promise.all([
      import('firebase/auth'),
      import('@/lib/firebaseClient'),
    ]);
    return signOut(auth);
  };

  // --- INICIO DE LA NUEVA FUNCIÓN ---
  const signInWithGoogle = async () => {
    try {
      const [
        { GoogleAuthProvider, signInWithPopup },
        { doc, getDoc, setDoc },
        { auth, db },
      ] = await Promise.all([
        import('firebase/auth'),
        import('firebase/firestore'),
        import('@/lib/firebaseClient'),
      ]);

      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Verificamos si es un usuario nuevo para crear su perfil en Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          name: user.displayName,
          email: user.email,
          createdAt: new Date()
        });
      }
      
      // Cerramos el modal después del inicio de sesión exitoso
      closeModal(); 
      alert(`¡Bienvenido/a, ${user.displayName}!`);

    } catch (error) {
      // Solo mostrar error en producción si es necesario
      if (process.env.NODE_ENV === 'development') {
        console.error("Error al iniciar sesión con Google:", error);
      }
      alert("Hubo un error al intentar iniciar sesión con Google.");
    }
  };
  // --- FIN DE LA NUEVA FUNCIÓN ---


  const value = {
    currentUser,
    loading,
    logout,
    signInWithGoogle, // CAMBIO: Exportamos la nueva función
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};