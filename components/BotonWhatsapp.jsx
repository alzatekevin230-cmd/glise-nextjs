// app/components/BotonWhatsapp.jsx
import Link from 'next/link';

export default function BotonWhatsapp() {
  return (
    <Link 
      href="https://wa.me/573217973158" 
      target="_blank" 
      className="whatsapp-button" 
      aria-label="Chat en WhatsApp"
    >
      <i className="fab fa-whatsapp"></i>
    </Link>
  );
}