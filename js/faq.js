document.addEventListener('DOMContentLoaded', function() {
    // Inicializar AOS
    AOS.init({
        duration: 800,
        once: true
    });

    // Manejo del acordeón FAQ
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Cerrar otros items abiertos
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle del item actual
            item.classList.toggle('active');
        });
    });

    // Base de conocimiento del asistente
    const knowledgeBase = {
        // Preguntas generales
        'hola': '¡Hola! Soy el asistente virtual de Maik&Co. ¿En qué puedo ayudarte hoy?',
        'buenos dias': '¡Buenos días! ¿En qué puedo ayudarte hoy?',
        'buenas tardes': '¡Buenas tardes! ¿En qué puedo ayudarte hoy?',
        'gracias': '¡De nada! ¿Hay algo más en lo que pueda ayudarte?',
        'adios': '¡Hasta luego! Que tengas un excelente día.',
        
        // Preguntas sobre la plataforma
        'que es maik': 'Maik&Co. es una plataforma que conecta profesionales autónomos y pequeños negocios con clientes que buscan servicios de calidad. Ofrecemos un sistema seguro y confiable para encontrar y contratar servicios profesionales.',
        'como funciona': 'Nuestra plataforma funciona de manera sencilla: 1) Los clientes buscan profesionales por categoría, 2) Revisan perfiles y valoraciones, 3) Contactan directamente, 4) Acuerdan el servicio, 5) Realizan el pago seguro, 6) Reciben el servicio y califican al profesional.',
        'como registrarme': 'Para registrarte, simplemente haz clic en el botón "Registrarse" en la parte superior de la página. Puedes elegir registrarte como cliente o como profesional. El proceso es rápido y seguro.',
        
        // Preguntas sobre pagos
        'como pago': 'Ofrecemos múltiples métodos de pago seguros: tarjetas de crédito/débito, transferencia bancaria y PayPal. Todos los pagos están protegidos por nuestro sistema de garantía.',
        'es seguro pagar': 'Sí, todos los pagos son 100% seguros. Utilizamos pasarelas de pago certificadas y encriptadas. Además, el dinero se mantiene en garantía hasta que el servicio se complete satisfactoriamente.',
        'comisiones': 'Para clientes: Plan Básico (gratis) con comisión del 3% por servicio, o planes Avanzado (9€/mes) y Premium (19€/mes) sin comisiones. Para profesionales: Plan Básico (gratis) con comisión del 15%, Premium (29€/mes) con 10%, o Empresarial (99€/mes) con 8%.',
        
        // Preguntas sobre profesionales
        'como ser profesional': 'Para registrarte como profesional: 1) Completa el formulario de registro, 2) Sube tus documentos y certificaciones, 3) Espera la verificación (24-48 horas), 4) Completa tu perfil, 5) ¡Comienza a recibir clientes!',
        'verificar profesional': 'Todos los profesionales pasan por un proceso de verificación que incluye: verificación de identidad, comprobación de certificaciones, y validación de experiencia profesional.',
        
        // Preguntas sobre clientes
        'buscar profesional': 'Puedes buscar profesionales usando nuestro buscador avanzado. Filtra por categoría, ubicación, precio y valoraciones para encontrar el profesional perfecto para tus necesidades.',
        'calificar profesional': 'Después de completar un servicio, podrás calificar al profesional con estrellas (1-5) y dejar un comentario detallado sobre tu experiencia.',
        
        // Preguntas sobre seguridad
        'privacidad': 'Tu privacidad es nuestra prioridad. Utilizamos encriptación de datos, almacenamiento seguro, y cumplimos con RGPD y LOPD. Puedes gestionar tu privacidad en la configuración de tu cuenta.',
        'datos personales': 'Tus datos personales están protegidos y solo se utilizan para proporcionar el servicio. Puedes solicitar una copia de tus datos o su eliminación en cualquier momento.',
        
        // Preguntas sobre soporte
        'contactar soporte': 'Puedes contactar con nuestro equipo de soporte por email a soporte@maikco.com o a través del chat en vivo disponible en horario laboral.',
        'ayuda': 'Estoy aquí para ayudarte. ¿Podrías especificar en qué necesitas ayuda? Puedo asistirte con: registro, pagos, búsqueda de profesionales, o cualquier otra duda sobre la plataforma.',
        
        // Preguntas sobre servicios
        'servicios disponibles': 'Ofrecemos una amplia gama de servicios: servicios del hogar, profesionales técnicos, belleza y bienestar, educación y formación, y servicios empresariales.',
        'categorias': 'Nuestras categorías principales son: Hogar, Técnicos, Belleza, Educación, y Empresarial. Cada categoría tiene subcategorías específicas para facilitar la búsqueda.',
        
        // Preguntas sobre garantías
        'garantias': 'Ofrecemos varias garantías: verificación de profesionales, seguro de responsabilidad civil, garantía de satisfacción, y política de devolución en caso de insatisfacción.',
        'devolucion': 'Si no estás satisfecho con el servicio, puedes solicitar una devolución dentro de las 24 horas posteriores a la finalización del servicio. Nuestro equipo revisará tu caso personalmente.'
    };

    // Función para encontrar la mejor respuesta
    function findBestResponse(message) {
        message = message.toLowerCase().trim();
        
        // Buscar coincidencias exactas
        if (knowledgeBase[message]) {
            return knowledgeBase[message];
        }
        
        // Buscar coincidencias parciales
        for (let key in knowledgeBase) {
            if (message.includes(key)) {
                return knowledgeBase[key];
            }
        }
        
        // Si no hay coincidencias
        return "Lo siento, no tengo una respuesta específica para esa pregunta. ¿Podrías reformularla o contactar con nuestro equipo de soporte en soporte@maikco.com?";
    }

    // Manejo del asistente virtual
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-message');

    function addMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'assistant'}`;
        messageDiv.innerHTML = `<p>${message}</p>`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function handleUserMessage() {
        const message = userInput.value.trim();
        if (message) {
            addMessage(message, true);
            userInput.value = '';
            
            // Simular "escribiendo..."
            const typingDiv = document.createElement('div');
            typingDiv.className = 'message assistant typing';
            typingDiv.innerHTML = '<p>Escribiendo...</p>';
            chatMessages.appendChild(typingDiv);
            
            // Obtener y mostrar respuesta
            setTimeout(() => {
                chatMessages.removeChild(typingDiv);
                const response = findBestResponse(message);
                addMessage(response);
            }, 1000);
        }
    }

    sendButton.addEventListener('click', handleUserMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleUserMessage();
        }
    });

    // Manejo del formulario de newsletter
    const newsletterForm = document.getElementById('newsletter-form');
    const newsletterMessage = document.getElementById('newsletter-message');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            // Simular envío
            newsletterMessage.textContent = '¡Gracias por suscribirte!';
            newsletterMessage.style.color = 'var(--faq-primary)';
            
            // Limpiar formulario
            this.reset();
            
            // Ocultar mensaje después de 3 segundos
            setTimeout(() => {
                newsletterMessage.textContent = '';
            }, 3000);
        });
    }
}); 