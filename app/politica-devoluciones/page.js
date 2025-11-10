"use client";
// app/politica-devoluciones/page.js

import Breadcrumbs from '@/components/Breadcrumbs';
import BotonWhatsapp from '@/components/BotonWhatsapp';
import { FaEnvelope, FaShieldAlt } from 'react-icons/fa';
import { useState } from 'react';

export default function PoliticaDevolucionesPage() {
  const breadcrumbItems = [
    { label: 'Inicio', href: '/' },
    { label: 'Política de Devoluciones', href: '/politica-devoluciones' }
  ];

  return (
    <main className="container mx-auto px-4 sm:px-6 py-8 pt-[190px] md:pt-8">
      <Breadcrumbs items={breadcrumbItems} />
      <div className="flex justify-center mb-7 mt-4">
        <div className="w-full md:max-w-2xl rounded-xl bg-green-50 border border-green-200 shadow flex items-center gap-4 px-5 py-4">
          <FaShieldAlt className="text-green-500 text-3xl shrink-0"/>
          <div>
            <div className="font-bold text-lg text-green-800 mb-1">¡Compra protegida en Glisé!</div>
            <div className="text-green-900 text-sm md:text-base leading-snug">Todas tus compras cuentan con un proceso de devolución <span className="font-semibold">ágil</span>, <span className="font-semibold">seguro</span> y <span className="font-semibold">con acompañamiento del equipo Glisé</span>.<br/>Lee los detalles o contacta soporte si tienes dudas.</div>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg max-w-4xl mx-auto mt-8 static-page-content">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Política de devoluciones y reembolsos</h2>
        <p className="text-gray-500 mb-6">¡Tu experiencia lo es todo para nosotros! Aquí te explicamos nuestro proceso, súper rápido y sencillo.</p>

        <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full mb-2 text-xs font-medium">Actualizado 2024</span>
        <hr className="my-5" />

        <h3 className="font-semibold text-lg mt-6 mb-1">📅 ¿Cuánto tiempo tengo para pedir un cambio o devolución?</h3>
        <p>Aceptamos solicitudes dentro de <span className="font-bold text-green-700">los 3 días calendario</span> posteriores a la entrega de tu pedido. ¡Entre más rápido nos contactes, más ágil es el proceso!</p>

        <h3 className="font-semibold text-lg mt-6 mb-1">✅ ¿Qué se necesita para poder devolver?</h3>
        <ul className="list-disc list-inside mb-3">
          <li>Producto sin uso, nuevo, en empaque original y con etiquetas y sellos intactos.</li>
          <li>No debe haber sido abierto, alterado o modificado.</li>
          <li>Incluye todos sus accesorios, manuales y regalos/promos.</li>
        </ul>

        <div className="mb-6 p-3 rounded bg-blue-50 text-sm">
          <span className="font-bold">¿Simplemente cambiaste de opinión?</span> Si el producto no te convence pero llegó perfecto, puedes devolverlo <b>dentro del plazo</b>, pagando solo el envío de regreso. El reembolso será por el valor del producto (no el envío original), una vez llegue y verifiquemos su estado.
        </div>

        <h3 className="font-semibold text-lg mt-6 mb-1">🚫 ¿Hay productos que no puedo devolver?</h3>
        <p>Por higiene y seguridad, <b>NO aceptamos devoluciones</b> en:</p>
        <ul className="list-disc list-inside mb-3">
          <li>Medicamentos.</li>
          <li>Cosméticos/maquillaje abiertos o sin sello.</li>
          <li>Artículos de higiene/uso personal (cepillos, productos íntimos, de bebé, etc.).</li>
          <li>Alimentos o suplementos abiertos.</li>
        </ul>

        <h3 className="font-semibold text-lg mt-6 mb-1">💬 ¿Cómo empiezo una devolución?</h3>
        <ol className="list-decimal list-inside pl-4 mb-4">
          <li><b>Contáctanos</b> por WhatsApp o envía email. Debes hacerlo dentro de los 3 días posteriores a recibir tu compra.</li>
          <li><b>Ten tu número de pedido y cuéntanos el motivo.</b> Si llegó dañado o equivocado, te pediremos foto para agilizar el proceso.</li>
          <li><b>Sigue las indicaciones</b> de nuestro equipo para enviar el producto.</li>
        </ol>
        <div className="flex gap-3 mb-8">
          <BotonWhatsapp />
          <a href="mailto:gliseybelleza@gmail.com" target="_blank" rel="noopener noreferrer" className="bg-gray-800 text-white flex items-center gap-2 px-4 py-2 rounded-lg font-semibold hover:bg-gray-900 transition"><FaEnvelope/><span>Email</span></a>
        </div>

        <h3 className="font-semibold text-lg mt-6 mb-1">🔄 ¿Cuándo cubrimos todos los gastos?</h3>
        <p>Si el problema fue nuestro (producto dañado, defectuoso o error en envío), <b>¡nos ocupamos de todo!</b> Elegirás entre reposición idéntica <b>sin costo</b> o <b>reembolso completo</b> (incluyendo el envío original).</p>

        <h3 className="font-semibold text-lg mt-6 mb-1">💸 ¿Cuánto tarda el reembolso?</h3>
        <p>En máximo <span className="font-bold text-green-700">5 a 10 días hábiles</span> luego de recibir y revisar tu devolución. Usamos el mismo método de pago que elegiste.</p>

        <div className="my-7">
          <hr/>
          <p className="text-center text-lg font-bold mt-4 mb-3">Preguntas frecuentes</p>
          <FaqAcordeon />
        </div>

        <hr className="my-4" />
        <div className="text-sm text-center text-gray-400">
          <span>¿Quieres saber sobre otras políticas? <a className="underline text-blue-700 font-semibold ml-1" href="/politicas">Lee todas las políticas de la tienda →</a></span>
        </div>
      </div>
    </main>
  );
}

// Sección FAQ estilo acordeón (componente dentro de la página)
function FaqAcordeon() {
  const [open, setOpen] = useState(null);
  const preguntas = [
    {
      q: '¿Qué hago si se me pasó el plazo de 3 días?',
      a: '¡Contáctanos igual! Revisamos cada caso con empatía, aunque fuera de plazo no siempre es posible devolver.'
    },
    {
      q: '¿Cuál es el costo de la devolución si ya no quiero el producto?',
      a: 'Solo pagas el envío de regreso. Recibirás reembolso del producto (no del primer envío). Si fue error nuestro, cubrimos todo.'
    },
    {
      q: '¿Cuánto tarda el reembolso?',
      a: 'Entre 5 y 10 días hábiles una vez recibamos y revisemos el producto.'
    },
    {
      q: '¿Puedo devolver si el producto se abrió por accidente?',
      a: 'No, solo productos cerrados, sin uso ni alteración son elegibles.'
    },
    {
      q: '¿Puedo hacer el proceso desde otra ciudad?',
      a: '¡Por supuesto! Coordinamos recogida o uso de transportadora según el caso.'
    }
  ];
  return (
    <div className="divide-y divide-gray-200 rounded-lg">
      {preguntas.map((item, idx) => (
        <div key={idx}>
          <button type="button" aria-expanded={open === idx} className="w-full text-left py-3 font-semibold focus:outline-none hover:text-blue-700 transition" onClick={() => setOpen(open === idx ? null : idx)}>{item.q}</button>
          <div className={`mb-2 transition-all overflow-hidden duration-300 ${open===idx ? 'max-h-40 opacity-100' : 'max-h-0 opacity-60'}`}>{open===idx && <p className="text-gray-700 px-2 pb-3 text-sm">{item.a}</p>}</div>
        </div>
      ))}
    </div>
  );
}