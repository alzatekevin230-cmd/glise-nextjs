// components/Icon.jsx
// Wrapper para react-icons que reemplaza Font Awesome
import { 
  FaBars, FaShoppingCart, FaUserCircle, FaStore, FaTruck, FaSearch,
  FaWhatsapp, FaCommentDots, FaTimes, FaHeart, FaShoppingBag,
  FaStar, FaStarHalfAlt, FaBox, FaMapMarkerAlt, FaPhone, FaEnvelope,
  FaFacebook, FaInstagram, FaTiktok, FaChevronDown, FaChevronUp,
  FaChevronRight, FaChevronLeft, FaHome, FaList, FaUser, FaSignOutAlt,
  FaSignInAlt, FaCreditCard, FaSyncAlt, FaCheck, FaExclamationCircle,
  FaInfoCircle, FaClipboardList, FaEye, FaEyeSlash, FaMinus, FaPlus,
  FaTrash, FaPencilAlt, FaCalendar
} from 'react-icons/fa';

import { FaRegStar } from 'react-icons/fa';

// Mapeo de clases de Font Awesome a componentes de React Icons
const iconMap = {
  'fa-bars': FaBars,
  'fa-shopping-cart': FaShoppingCart,
  'fa-user-circle': FaUserCircle,
  'fa-store': FaStore,
  'fa-truck': FaTruck,
  'fa-search': FaSearch,
  'fa-whatsapp': FaWhatsapp,
  'fa-comment-dots': FaCommentDots,
  'fa-times': FaTimes,
  'fa-heart': FaHeart,
  'fa-shopping-bag': FaShoppingBag,
  'fa-star': FaStar,
  'fa-star-half-alt': FaStarHalfAlt,
  'fa-box': FaBox,
  'fa-map-marker-alt': FaMapMarkerAlt,
  'fa-phone': FaPhone,
  'fa-envelope': FaEnvelope,
  'fa-facebook': FaFacebook,
  'fa-instagram': FaInstagram,
  'fa-tiktok': FaTiktok,
  'fa-chevron-down': FaChevronDown,
  'fa-chevron-up': FaChevronUp,
  'fa-chevron-right': FaChevronRight,
  'fa-chevron-left': FaChevronLeft,
  'fa-home': FaHome,
  'fa-list': FaList,
  'fa-user': FaUser,
  'fa-sign-out-alt': FaSignOutAlt,
  'fa-sign-in-alt': FaSignInAlt,
  'fa-credit-card': FaCreditCard,
  'fa-sync-alt': FaSyncAlt,
  'fa-check': FaCheck,
  'fa-exclamation-circle': FaExclamationCircle,
  'fa-info-circle': FaInfoCircle,
  'fa-clipboard-list': FaClipboardList,
  'fa-eye': FaEye,
  'fa-eye-slash': FaEyeSlash,
  'fa-minus': FaMinus,
  'fa-plus': FaPlus,
  'fa-trash': FaTrash,
  'fa-pencil-alt': FaPencilAlt,
  'fa-calendar': FaCalendar,
  // Regular icons (outlined)
  'far fa-star': FaRegStar,
};

export default function Icon({ name, className = '', style = {}, ...props }) {
  // Extraer el nombre del icono de la clase (ej: "fas fa-home" -> "fa-home")
  const iconName = name.split(' ').find(c => c.startsWith('fa-')) || name;
  
  // Para iconos regular (far), usar el nombre completo
  const fullName = name.includes('far') ? name : iconName;
  
  const IconComponent = iconMap[fullName] || iconMap[iconName];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in iconMap`);
    return null;
  }

  return <IconComponent className={className} style={style} {...props} />;
}

// Export individual para uso directo
export { 
  FaBars, FaShoppingCart, FaUserCircle, FaStore, FaTruck, FaSearch,
  FaWhatsapp, FaCommentDots, FaTimes, FaHeart, FaShoppingBag,
  FaStar, FaStarHalfAlt as FaStarHalf, FaBox, FaMapMarkerAlt, FaPhone, 
  FaEnvelope, FaFacebook, FaInstagram, FaTiktok, FaChevronDown, 
  FaChevronUp, FaChevronRight, FaChevronLeft, FaHome, FaList, FaUser,
  FaSignOutAlt, FaSignInAlt, FaCreditCard, FaSyncAlt, FaCheck,
  FaExclamationCircle, FaInfoCircle, FaClipboardList, FaEye, FaEyeSlash,
  FaMinus, FaPlus, FaTrash, FaPencilAlt, FaCalendar, FaRegStar
};

