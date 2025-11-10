// components/NewsletterSignup.jsx
"use client";

import { useState } from 'react';
import toast from 'react-hot-toast';
import { FaSpinner } from 'react-icons/fa';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Por favor ingresa un email válido', {
        duration: 2000,
      });
      return;
    }

    setIsSubmitting(true);

    // Simular envío (aquí integrarías con tu servicio de email marketing)
    setTimeout(() => {
      toast.success('🎉 ¡Gracias por suscribirte! Revisa tu email.', {
        duration: 3000,
        style: {
          background: '#22c55e',
          color: '#fff',
        },
      });
      setEmail('');
      setIsSubmitting(false);
    }, 1000);

    // TODO: Integrar con servicio de email marketing (Mailchimp, SendGrid, etc.)
    // try {
    //   await fetch('/api/newsletter', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ email })
    //   });
    // } catch (error) {
    //   toast.error('Error al suscribirse. Intenta de nuevo.');
    // }
  };

  return (
    <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 shadow-2xl text-white">
      <div className="max-w-2xl mx-auto text-center">
        <div className="text-5xl mb-4">📬</div>
        <h3 className="text-2xl md:text-3xl font-bold mb-3">
          ¿Te gustó este artículo?
        </h3>
        <p className="text-blue-100 mb-6 text-lg">
          Suscríbete a nuestro newsletter y recibe consejos de belleza, novedades y ofertas exclusivas cada semana.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            className="flex-1 px-5 py-4 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-4 focus:ring-white/50 outline-none font-medium"
            disabled={isSubmitting}
            required
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-white text-blue-600 font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <FaSpinner className="animate-spin" />
                Enviando...
              </span>
            ) : (
              'Suscribirme'
            )}
          </button>
        </form>

        <p className="text-blue-100 text-xs mt-4">
          🔒 Tu email está seguro. No compartimos tu información.
        </p>
      </div>
    </div>
  );
}

