// Variables globales
let lastScroll = 0;
const header = document.querySelector('.header');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
const faqItems = document.querySelectorAll('.faq-item');
const newsletterForm = document.querySelector('.newsletter-form');

// Funciones para manejo de modales (mantener compatibilidad)
function openLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
    resetLoginModal();
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
}

function openRegisterModal() {
    document.getElementById('registerModal').style.display = 'block';
    resetRegisterModal();
}

function closeRegisterModal() {
    document.getElementById('registerModal').style.display = 'none';
}

function showLoginForm(type) {
    if (type === 'cliente') {
        document.getElementById('loginUserTypeSelection').style.display = 'none';
        document.getElementById('loginClienteForm').classList.add('active');
    } else if (type === 'profesional') {
        document.getElementById('loginUserTypeSelection').style.display = 'none';
        document.getElementById('loginProfesionalForm').classList.add('active');
    }
}

function showRegisterForm(type) {
    if (type === 'cliente') {
        document.getElementById('registerUserTypeSelection').style.display = 'none';
        document.getElementById('registerClienteForm').classList.add('active');
    } else if (type === 'profesional') {
        document.getElementById('registerUserTypeSelection').style.display = 'none';
        document.getElementById('registerProfesionalForm').classList.add('active');
    }
}

function backToUserTypeSelection(modalType) {
    if (modalType === 'login') {
        document.getElementById('loginClienteForm').classList.remove('active');
        document.getElementById('loginProfesionalForm').classList.remove('active');
        document.getElementById('loginUserTypeSelection').style.display = 'block';
    } else if (modalType === 'register') {
        document.getElementById('registerClienteForm').classList.remove('active');
        document.getElementById('registerProfesionalForm').classList.remove('active');
        document.getElementById('registerUserTypeSelection').style.display = 'block';
    }
}

function resetLoginModal() {
    document.getElementById('loginUserTypeSelection').style.display = 'block';
    document.getElementById('loginClienteForm').classList.remove('active');
    document.getElementById('loginProfesionalForm').classList.remove('active');
}

function resetRegisterModal() {
    document.getElementById('registerUserTypeSelection').style.display = 'block';
    document.getElementById('registerClienteForm').classList.remove('active');
    document.getElementById('registerProfesionalForm').classList.remove('active');
}

function switchToLogin(type) {
    closeRegisterModal();
    openLoginModal();
    showLoginForm(type);
}

// Funciones para manejo de formularios con API
async function handleLogin(event, type) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const loginData = {
        email: formData.get('email'),
        password: formData.get('password'),
        remember: formData.get('remember') === 'on'
    };
    
    try {
        const response = await window.maikAPI.login(loginData.email, loginData.password, loginData.remember);
        
        if (response.success) {
            window.maikAPI.showNotification('Inicio de sesión exitoso', 'success');
            closeLoginModal();
            form.reset();
            
            // Redirigir según el tipo de usuario
            if (response.user.tipo_usuario === 'profesional') {
                window.location.href = window.CONFIG?.PAGES?.PROFESSIONAL || 'profesional.html';
            } else {
                window.location.href = window.CONFIG?.PAGES?.CLIENT_PLATFORM || 'mantenimiento.html';
            }
        }
    } catch (error) {
        window.maikAPI.showNotification(error.message || 'Error al iniciar sesión', 'error');
    }
}

async function handleRegister(event, type) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const registerData = {
        tipo_usuario: type,
        nombre: formData.get('nombre'),
        email: formData.get('email'),
        telefono: formData.get('telefono'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
        ubicacion: formData.get('ubicacion'),
        profesion: formData.get('profesion'),
        especialidad: formData.get('especialidad')
    };
    
    // Validar datos
    const errors = window.maikAPI.validateForm(registerData);
    if (errors.length > 0) {
        window.maikAPI.handleFormErrors(errors, form);
        return;
    }
    
    try {
        const response = await window.maikAPI.register(registerData);
        
        if (response.success) {
            window.maikAPI.showNotification('Registro exitoso. Verifica tu email.', 'success');
            closeRegisterModal();
            form.reset();
        }
    } catch (error) {
        window.maikAPI.showNotification(error.message || 'Error al registrarse', 'error');
    }
}

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Menú móvil
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
    }

    // Efecto de scroll en el header
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            header.classList.remove('scroll-up');
            return;
        }
        
        if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
            // Scroll hacia abajo
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
            // Scroll hacia arriba
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }
        lastScroll = currentScroll;
    });

    // FAQ Accordion
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Cerrar otros items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle del item actual
            item.classList.toggle('active');
        });
    });

    // Newsletter form
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]').value;
            
            // Aquí iría la lógica para enviar el email al servidor
            console.log('Email registrado:', email);
            
            // Mostrar mensaje de éxito
            const successMessage = document.createElement('div');
            successMessage.className = 'newsletter-message success';
            successMessage.textContent = '¡Gracias por suscribirte!';
            newsletterForm.appendChild(successMessage);
            
            // Limpiar el formulario
            newsletterForm.reset();
            
            // Eliminar el mensaje después de 3 segundos
            setTimeout(() => {
                successMessage.remove();
            }, 3000);
        });
    }

    // Scroll suave para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Cerrar el menú móvil si está abierto
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    mobileMenuBtn.classList.remove('active');
                }
            }
        });
    });

    // Animaciones al hacer scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.feature-card, .category-card, .testimonial-card, .value-card');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            
            if (elementTop < window.innerHeight && elementBottom > 0) {
                element.classList.add('animate-fade-in');
            }
        });
    };

    // Inicializar animaciones
    window.addEventListener('scroll', animateOnScroll);
    window.addEventListener('load', animateOnScroll);

    // Lazy loading para imágenes
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // Fallback para navegadores que no soportan lazy loading
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        document.body.appendChild(script);
    }
}); 