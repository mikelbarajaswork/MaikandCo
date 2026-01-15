/**
 * Configuración global para Maik & Co.
 */

const CONFIG = {
    // URLs del API
    API_BASE_URL: window.location.origin + '/php',
    
    // URLs de las páginas
    PAGES: {
        HOME: 'index.html',
        BLOG: 'blog.html',
        FAQ: 'faq.html',
        CONTACT: 'contacto.html',
        PROFESSIONAL: 'profesional.html',
        CLIENT_PLATFORM: 'mantenimiento.html', // Temporal hasta crear plataforma-cliente.html
        MAINTENANCE: 'mantenimiento.html',
        TERMS: 'terminos.html',
        PRIVACY: 'privacidad.html',
        COOKIES: 'cookies.html'
    },
    
    // URLs de redes sociales
    SOCIAL: {
        FACEBOOK: '#',
        INSTAGRAM: '#',
        LINKEDIN: '#',
        WHATSAPP: '#',
        TELEGRAM: 'https://t.me/maikco_es',
        TIKTOK: 'https://www.tiktok.com/@maik.co0'
    },
    
    // Configuración de notificaciones
    NOTIFICATIONS: {
        AUTO_HIDE_DELAY: 5000,
        POSITION: 'top-right'
    },
    
    // Configuración de formularios
    FORMS: {
        MIN_PASSWORD_LENGTH: 8,
        PHONE_REGEX: /^(\+34|0034|34)?[6-9][0-9]{8}$/,
        EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    }
};

// Exportar para uso global
window.CONFIG = CONFIG;
