// components/BotonVolver.jsx
"use client";

import Link from 'next/link';

export default function BotonVolver({ texto = 'Volver a la Tienda', className = '' }) {
  return (
    <Link
      href="/categoria/all"
      className={`bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-md inline-flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg ${className}`}
    >
      <i className="fas fa-arrow-left"></i>
      <span>{texto}</span>
    </Link>
  );
}