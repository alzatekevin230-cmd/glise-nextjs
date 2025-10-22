// components/ShareButtons.jsx
"use client";

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function ShareButtons({ title, url }) {
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : url;
  const shareText = `${title} - Glisé Blog`;

  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, '_blank', 'noopener,noreferrer,width=600,height=400');
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer,width=600,height=400');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('🔗 Enlace copiado al portapapeles', {
        duration: 2000,
        style: {
          background: '#22c55e',
          color: '#fff',
        },
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Error al copiar el enlace', {
        duration: 2000,
      });
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 shadow-lg border border-blue-100">
      <div className="flex items-center gap-2 mb-4">
        <i className="fas fa-share-alt text-blue-600"></i>
        <h3 className="text-lg font-bold text-gray-900">Comparte este artículo</h3>
      </div>

      <div className="flex flex-wrap gap-3">
        {/* WhatsApp */}
        <button
          onClick={handleWhatsAppShare}
          className="flex-1 min-w-[120px] flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
          aria-label="Compartir en WhatsApp"
        >
          <i className="fab fa-whatsapp text-xl"></i>
          <span className="text-sm">WhatsApp</span>
        </button>

        {/* Facebook */}
        <button
          onClick={handleFacebookShare}
          className="flex-1 min-w-[120px] flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
          aria-label="Compartir en Facebook"
        >
          <i className="fab fa-facebook-f text-xl"></i>
          <span className="text-sm">Facebook</span>
        </button>

        {/* Twitter/X */}
        <button
          onClick={handleTwitterShare}
          className="flex-1 min-w-[120px] flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
          aria-label="Compartir en Twitter"
        >
          <i className="fab fa-twitter text-xl"></i>
          <span className="text-sm">Twitter</span>
        </button>

        {/* Copiar enlace */}
        <button
          onClick={handleCopyLink}
          className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 ${
            copied
              ? 'bg-green-500 text-white'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
          }`}
          aria-label="Copiar enlace"
        >
          <i className={`fas ${copied ? 'fa-check' : 'fa-link'} text-xl`}></i>
          <span className="text-sm">{copied ? 'Copiado' : 'Copiar'}</span>
        </button>
      </div>
    </div>
  );
}

