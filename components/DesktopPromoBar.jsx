"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaTimes, FaTruck, FaGift, FaStar, FaFire, FaShoppingBag } from 'react-icons/fa';

const promoMessages = [
  { 
    icon: FaGift, 
    text: "Envío GRATIS en compras desde $250.000", 
    link: "/categoria/all",
    cta: "Ver ofertas"
  },
  { 
    icon: FaTruck, 
    text: "Envíos rápidos a todo Colombia - Llegamos en 2-5 días", 
    link: "/categoria/all",
    cta: "Comprar ahora"
  },
  { 
    icon: FaStar, 
    text: "+5.000 clientes satisfechos - Únete a nuestra comunidad", 
    link: "/categoria/all",
    cta: "Descubrir productos"
  },
  { 
    icon: FaFire, 
    text: "Nuevos productos cada semana - Descubre lo último", 
    link: "/categoria/all",
    cta: "Ver novedades"
  },
  { 
    icon: FaShoppingBag, 
    text: "Ofertas exclusivas solo en Glisé - Aprovecha ahora", 
    link: "/categoria/all",
    cta: "Ver ofertas"
  }
];

export default function DesktopPromoBar() {
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);
  const [isClosed, setIsClosed] = useState(false);

  // Cargar estado de cierre desde localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('promoBarClosed');
    if (savedState === 'true') {
      setIsClosed(true);
    }
  }, []);

  // Rotación automática de mensajes (más lenta, cada 8 segundos)
  useEffect(() => {
    if (isClosed) return;
    
    const interval = setInterval(() => {
      setCurrentPromoIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % promoMessages.length;
        return nextIndex;
      });
    }, 8000);

    return () => clearInterval(interval);
  }, [isClosed]);

  const handleClose = () => {
    setIsClosed(true);
    localStorage.setItem('promoBarClosed', 'true');
  };

  if (isClosed) {
    return null;
  }

  const currentMessage = promoMessages[currentPromoIndex];
  const IconComponent = currentMessage.icon;

  return (
    <div className="hidden md:flex bg-gradient-to-r from-cyan-600 to-teal-600 text-white text-sm mb-4">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-center gap-2.5">
          <IconComponent className="text-base flex-shrink-0" />
          <span className="font-medium">
            {currentMessage.text}
          </span>
          <Link 
            href={currentMessage.link}
            className="ml-3 font-bold hover:opacity-80 transition-opacity underline decoration-2"
          >
            {currentMessage.cta} →
          </Link>
          <button
            onClick={handleClose}
            className="ml-auto text-white hover:opacity-70 transition-opacity p-1.5 rounded-full hover:bg-white hover:bg-opacity-20"
            aria-label="Cerrar barra promocional"
          >
            <FaTimes className="text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
}
