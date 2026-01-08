// lib/config.js
// Centralized configuration for environment variables

const getEnv = (key) => {
  const value = process.env[key];
  if (!value) {
    console.warn(`⚠️ Warning: Environment variable ${key} is missing.`);
  }
  return value;
};

export const config = {
  resend: {
    apiKey: getEnv('RESEND_API_KEY'),
    toEmail: getEnv('CONTACT_TO_EMAIL'),
    domainName: getEnv('CONTACT_DOMAIN_NAME'),
  },
  wompi: {
    publicKey: getEnv('NEXT_PUBLIC_WOMPI_PUBLIC_KEY'),
    integrityKey: getEnv('WOMPI_INTEGRITY_KEY'),
    eventsSecret: getEnv('WOMPI_EVENTS_SECRET'), // Recommended for verifying webhooks securely
  },
  coordinadora: {
    apiKey: getEnv('COORDINADORA_APIKEY'),
    password: getEnv('COORDINADORA_PASSWORD'),
    nit: getEnv('COORDINADORA_NIT'),
    guiasIdCliente: getEnv('COORDINADORA_GUIAS_ID_CLIENTE'),
    guiasUsuario: getEnv('COORDINADORA_GUIAS_USUARIO'),
    guiasClave: getEnv('COORDINADORA_GUIAS_CLAVE'),
    wsdlCotizador: "https://ws.coordinadora.com/ags/1.5/server.php?wsdl",
    wsdlGuias: "https://guias.coordinadora.com/ws/guias/1.6/server.php?wsdl",
  },
};
