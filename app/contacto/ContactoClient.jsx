"use client";

import { useState } from 'react';
import BotonVolver from '@/components/BotonVolver';

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

  return (
    <main className="container mx-auto px-4 sm:px-6 py-8">
      <BotonVolver texto="Volver a la tienda" />

      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg max-w-4xl mx-auto mt-8">
        <h1 className="text-3xl font-bold mb-2">Contáctanos</h1>
        <p className="text-gray-600 mb-8">Estamos aquí para ayudarte. Completa el formulario y te responderemos lo antes posible.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Columna de Información de Contacto */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Información de Contacto</h3>
            <div className="space-y-4">
              <p className="flex items-start"><i className="fas fa-phone-alt w-6 mr-3 text-blue-600 mt-1"></i><span><strong>Teléfono / WhatsApp:</strong><br/>321 797 3158</span></p>
              <p className="flex items-start"><i className="fas fa-envelope w-6 mr-3 text-blue-600 mt-1"></i><span><strong>Correo Electrónico:</strong><br/>gliseybelleza@gmail.com</span></p>
              <p className="flex items-start"><i className="fas fa-map-marker-alt w-6 mr-3 text-blue-600 mt-1"></i><span><strong>Ubicación:</strong><br/>Palmira, Valle del Cauca, Colombia</span></p>
            </div>
          </div>

          {/* Columna del Formulario */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Envíanos un Mensaje</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Tu nombre *</label>
                <input type="text" id="name" value={formData.name} onChange={handleInputChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Tu correo electrónico *</label>
                <input type="email" id="email" value={formData.email} onChange={handleInputChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Asunto</label>
                <input type="text" id="subject" value={formData.subject} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Tu mensaje *</label>
                <textarea id="message" value={formData.message} onChange={handleInputChange} required rows="5" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
              </div>
              
              <button type="submit" disabled={isSending} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400">
                {isSending ? 'Enviando...' : 'Enviar Mensaje'}
              </button>
              {feedback.message && (
                <p className={`mt-4 text-center text-sm font-medium ${feedback.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                  {feedback.message}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

