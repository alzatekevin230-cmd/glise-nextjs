import { v2 as cloudinary } from 'cloudinary';

// Configuración básica para scripts de backend
cloudinary.config({
  cloud_name: 'dovsfntma',
  secure: true,
});

export default cloudinary;
