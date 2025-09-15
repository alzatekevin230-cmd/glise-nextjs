// contexto/ContextoModal.jsx
"use client";

import { createContext, useContext, useState, useEffect } from 'react'; // <-- Añadimos useEffect

const ModalContext = createContext();

export const useModal = () => {
  return useContext(ModalContext);
};

export const ProveedorModal = ({ children }) => {
  const [modalActivo, setModalActivo] = useState(null);
  const [authTab, setAuthTab] = useState('login');
  
  const [lightboxImage, setLightboxImage] = useState(null);
  const openLightbox = (imageUrl) => setLightboxImage(imageUrl);
  const closeLightbox = () => setLightboxImage(null);

  const openModal = (nombreModal) => setModalActivo(nombreModal);
  const closeModal = () => setModalActivo(null);

  // --- INICIO DE LA SOLUCIÓN DEFINITIVA ---
  useEffect(() => {
    // Esta es la lógica EXACTA de tu main.js para el footer
    const globalClickListener = (event) => {
      const clickedInsideFooterAccordion = event.target.closest('.footer-accordion');
      if (!clickedInsideFooterAccordion) {
        document.querySelectorAll('.footer-accordion[open]').forEach(accordion => {
          accordion.open = false;
        });
      }
    };

    // Añadimos el 'oído' a todo el documento
    document.addEventListener('click', globalClickListener);

    // Limpiamos el 'oído' para evitar problemas
    return () => {
      document.removeEventListener('click', globalClickListener);
    };
  }, []); // El array vacío asegura que se ejecute solo una vez
  // --- FIN DE LA SOLUCIÓN DEFINITIVA ---

  const value = {
    modalActivo,
    openModal,
    closeModal,
    authTab,
    setAuthTab,
    lightboxImage,
    openLightbox,
    closeLightbox,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  );
};