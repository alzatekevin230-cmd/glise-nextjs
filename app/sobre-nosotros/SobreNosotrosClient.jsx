"use client";

import Link from 'next/link';
import Image from 'next/image';
import { FaLeaf, FaHeart, FaFlask, FaUsers } from 'react-icons/fa';
import AnimatedSection from '@/components/AnimatedSection';

export default function SobreNosotrosClient() {
  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero: mismo fondo que sección Únete a Nuestra Comunidad */}
      <AnimatedSection>
        <div className="relative w-full h-80 rounded-2xl overflow-hidden shadow-lg flex items-center justify-center bg-gradient-to-r from-cyan-600 to-teal-600">
          <div className="relative z-30 flex flex-col items-center justify-center h-full text-center p-4">
            <div className="bg-white/90 backdrop-blur-xl rounded-xl shadow-xl p-6 w-72 h-44 flex items-center justify-center border border-cyan-100">
              <Image
                src="/imagenespagina/logodeglise.webp"
                alt="Logo de Glisé"
                width={220}
                height={120}
                className="object-contain"
              />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold mt-8 tracking-tight text-white drop-shadow">Sobre Nosotros</h1>
            <span className="mt-2 text-base sm:text-lg text-white/90 font-medium">Conectando bienestar y ciencia</span>
          </div>
        </div>
      </AnimatedSection>

      {/* Nuestra Trayectoria Section */}
      <AnimatedSection>
        <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">Nuestra Trayectoria</h2>
            <p className="mt-4 max-w-3xl mx-auto text-base sm:text-lg text-gray-600">
              Glisé nació en <strong>Palmira, Valle del Cauca</strong>, de una pasión familiar. Con profundas raíces en el conocimiento farmacéutico y un amor por los remedios ancestrales, creamos un espacio único dedicado a la salud y la belleza. No somos solo una tienda, somos tu aliado en el camino hacia un bienestar consciente.
            </p>
        </div>
      </AnimatedSection>

      {/* Nuestra Filosofía Section */}
      <AnimatedSection>
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">Nuestra Filosofía</h2>
          <p className="mt-4 max-w-3xl mx-auto text-base sm:text-lg text-gray-600">
            Creemos en un cuidado que respeta tanto tu cuerpo como el planeta. Nuestros valores son el pilar de cada decisión que tomamos.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow">
            <FaLeaf className="mx-auto text-3xl sm:text-4xl text-cyan-600" />
            <h3 className="mt-4 text-lg font-semibold text-gray-800">Origen Natural</h3>
            <p className="mt-2 text-gray-600">Priorizamos ingredientes puros y efectivos que la naturaleza nos ofrece.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow">
            <FaFlask className="mx-auto text-3xl sm:text-4xl text-cyan-600" />
            <h3 className="mt-4 text-lg font-semibold text-gray-800">Rigor Científico</h3>
            <p className="mt-2 text-gray-600">Cada producto es evaluado para garantizar su seguridad y eficacia.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow">
            <FaUsers className="mx-auto text-3xl sm:text-4xl text-cyan-600" />
            <h3 className="mt-4 text-lg font-semibold text-gray-800">Compromiso Contigo</h3>
            <p className="mt-2 text-gray-600">Tu bienestar es el centro de nuestra misión y te acompañamos en cada paso.</p>
          </div>
        </div>
      </AnimatedSection>

      {/* Call to Action Section */}
      <AnimatedSection>
        <div className="bg-gradient-to-r from-cyan-600 to-teal-600 p-8 sm:p-12 rounded-lg text-center shadow-lg">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Únete a Nuestra Comunidad</h2>
          <p className="mt-4 text-lg text-white/90 max-w-2xl mx-auto">
            Descubre productos que cambiarán tu rutina de cuidado y explora nuestro contenido de bienestar.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link href="/categoria/all" className="w-full sm:w-auto inline-block bg-white text-cyan-700 font-bold py-3 px-6 rounded-full hover:bg-gray-100 transition-colors shadow-md">
              Explorar Productos
            </Link>
            <Link href="/blog" className="w-full sm:w-auto inline-block bg-transparent border-2 border-white text-white font-bold py-3 px-6 rounded-full hover:bg-white hover:text-cyan-700 transition-colors">
              Leer Nuestro Blog
            </Link>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
