// app/contexto/ContextoAuth.jsx
"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebaseClient'; // CAMBIO: Importamos 'db' también
// CAMBIO: Importamos las funciones necesarias para el login con Google
import { onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
// CAMBIO: Importamos funciones de Firestore para crear el perfil del nuevo usuario
import { doc, getDoc, setDoc } from 'firebase/firestore';
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
    // Optimización: Lazy load Firebase Auth después de que la página cargue
    // Esto evita que el iframe de Firebase bloquee el LCP inicial (ahorro de ~1148ms)
    let unsubscribe = null;
    let idleCallbackId = null;
    let timeoutId = null;

    const initAuth = () => {
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

  const logout = () => {
    return signOut(auth);
  };

  // --- INICIO DE LA NUEVA FUNCIÓN ---
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
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