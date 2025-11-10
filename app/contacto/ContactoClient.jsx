"use client";

import { useState } from 'react';
import Breadcrumbs from '@/components/Breadcrumbs';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

export default function ContactoClient() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSending, setIsSending] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setFeedback({ type: '', message: '' });

    try {
      // En tu proyecto real, aquí llamarías a la función que guarda en Firestore.
      // const saveMessage = httpsCallable(functions, 'saveContactMessage'); 
      // await saveMessage(formData);
      
      console.log("Simulando envío de mensaje:", formData);
      // Simulamos una pequeña espera como si se estuviera enviando
      await new Promise(resolve => setTimeout(resolve, 1000));

      setFeedback({ type: 'success', message: '¡Mensaje enviado con éxito! Te responderemos pronto.' });
      setFormData({ name: '', email: '', subject: '', message: '' });

    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      setFeedback({ type: 'error', message: 'Hubo un error al enviar tu mensaje. Intenta de nuevo.' });
    } finally {
      setIsSending(false);
    }
  };

  const breadcrumbItems = [
    { label: 'Inicio', href: '/' },
    { label: 'Contacto', href: '/contacto' }
  ];

  return (
    <main className="container mx-auto px-4 sm:px-6 py-8">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg max-w-4xl mx-auto mt-6">
        <h1 className="text-3xl font-bold mb-2">Contáctanos</h1>
        <p className="text-gray-600 mb-8">Estamos aquí para ayudarte. Completa el formulario y te responderemos lo antes posible.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Columna de Información de Contacto */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Información de Contacto</h3>
            <div className="space-y-4">
              <p className="flex items-start"><FaPhoneAlt className="w-6 mr-3 text-blue-600 mt-1" /><span><strong>Teléfono / WhatsApp:</strong><br/>321 797 3158</span></p>
              <p className="flex items-start"><FaEnvelope className="w-6 mr-3 text-blue-600 mt-1" /><span><strong>Correo Electrónico:</strong><br/>gliseybelleza@gmail.com</span></p>
              <p className="flex items-start"><FaMapMarkerAlt className="w-6 mr-3 text-blue-600 mt-1" /><span><strong>Ubicación:</strong><br/>Palmira, Valle del Cauca, Colombia</span></p>
            </div>
          </div>

          {/* Columna del Formulario */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Envíanos un Mensaje</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">Tu nombre *</label>
                <input 
                  type="text" 
                  id="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  required 
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-all duration-200 bg-gray-50 focus:bg-white text-gray-800 placeholder-gray-400" 
                  placeholder="Ingresa tu nombre completo"
                />
              </div>
              
              <div className="relative">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Tu correo electrónico *</label>
                <input 
                  type="email" 
                  id="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  required 
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-all duration-200 bg-gray-50 focus:bg-white text-gray-800 placeholder-gray-400" 
                  placeholder="tu@email.com"
                />
              </div>
              
              <div className="relative">
                <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">Asunto</label>
                <input 
                  type="text" 
                  id="subject" 
                  value={formData.subject} 
                  onChange={handleInputChange} 
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-all duration-200 bg-gray-50 focus:bg-white text-gray-800 placeholder-gray-400" 
                  placeholder="¿En qué podemos ayudarte?"
                />
              </div>
              
              <div className="relative">
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">Tu mensaje *</label>
                <textarea 
                  id="message" 
                  value={formData.message} 
                  onChange={handleInputChange} 
                  required 
                  rows="5" 
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-all duration-200 bg-gray-50 focus:bg-white text-gray-800 placeholder-gray-400 resize-none" 
                  placeholder="Cuéntanos cómo podemos ayudarte..."
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                disabled={isSending} 
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
              >
                {isSending ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviando...
                  </span>
                ) : (
                  'Enviar Mensaje'
                )}
              </button>
              {feedback.message && (
                <div className={`mt-6 p-4 rounded-xl border-2 ${
                  feedback.type === 'success' 
                    ? 'bg-green-50 border-green-200 text-green-800' 
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                  <div className="flex items-center">
                    {feedback.type === 'success' ? (
                      <svg className="w-5 h-5 mr-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 mr-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span className="font-medium">{feedback.message}</span>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

