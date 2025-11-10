// app/components/BotonWhatsapp.jsx
import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa';

export default function BotonWhatsapp() {
  return (
    <Link 
      href="https://wa.me/573217973158" 
      target="_blank" 
      className="whatsapp-button" 
      aria-label="Chat en WhatsApp"
    >
      <FaWhatsapp />
    </Link>
  );
}