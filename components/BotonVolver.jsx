// components/BotonVolver.jsx
"use client";

import { useRouter } from 'next/navigation';

export default function BotonVolver({ texto = 'Volver', className = '' }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      // --- LÍNEA MODIFICADA ---
      className={`bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-md inline-flex items-center transition-colors ${className}`}
    >
      <i className="fas fa-arrow-left mr-2"></i>
      {texto}
    </button>
  );
}