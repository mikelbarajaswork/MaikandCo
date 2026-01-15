/**
 * API Client para Maik & Co.
 * Maneja las peticiones AJAX a los endpoints PHP
 */

class MaikCoAPI {
    constructor() {
        this.baseURL = window.CONFIG?.API_BASE_URL || window.location.origin + '/php';
        this.isLoggedIn = false;
        this.currentUser = null;
        this.isOnline = navigator.onLine;
        
        // Escuchar cambios en el estado de conexión
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.updateConnectionStatus(true);
            this.showNotification('Conexión restaurada', 'success');
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.updateConnectionStatus(false);
            this.showNotification('Sin conexión a internet', 'error');
        });
    }

    /**
     * Realizar petición AJAX
     */
    async request(endpoint, options = {}) {
        // Verificar conexión antes de hacer la petición
        if (!this.isOnline) {
            throw new Error('Sin conexión a internet. Verifica tu conexión y vuelve a intentarlo.');
        }
        
        const url = `${this.baseURL}${endpoint}`;
        
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        };

        const config = { ...defaultOptions, ...options };

        try {
            const response = await fetch(url, config);
            
            // Verificar si la respuesta es JSON válido
            let data;
            try {
                data = await response.json();
            } catch (jsonError) {
                throw new Error('Respuesta del servidor no válida');
            }

            if (!response.ok) {
                throw new Error(data.error || `Error del servidor: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('Error en petición API:', error);
            
            // Manejar diferentes tipos de errores
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
            } else if (error.message.includes('404')) {
                throw new Error('Servicio no disponible temporalmente. Inténtalo más tarde.');
            } else if (error.message.includes('500')) {
                throw new Error('Error interno del servidor. Contacta con soporte.');
            }
            
            throw error;
        }
    }

    /**
     * Registrar nuevo usuario
     */
    async register(userData) {
        return await this.request('/auth/register.php', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    /**
     * Iniciar sesión
     */
    async login(email, password, remember = false) {
        const response = await this.request('/auth/login.php', {
            method: 'POST',
            body: JSON.stringify({
                email: email,
                password: password,
                remember: remember
            })
        });

        if (response.success) {
            this.isLoggedIn = true;
            this.currentUser = response.user;
            this.updateUI();
        }

        return response;
    }

    /**
     * Cerrar sesión
     */
    async logout() {
        try {
            await this.request('/auth/logout.php', {
                method: 'POST'
            });
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        } finally {
            this.isLoggedIn = false;
            this.currentUser = null;
            this.updateUI();
            window.location.reload();
        }
    }

    /**
     * Verificar estado de sesión
     */
    async checkSession() {
        try {
            const response = await this.request('/auth/check_session.php');
            
            if (response.logged_in) {
                this.isLoggedIn = true;
                this.currentUser = response.user;
            } else {
                this.isLoggedIn = false;
                this.currentUser = null;
            }

            return response;
        } catch (error) {
            console.error('Error verificando sesión:', error);
            this.isLoggedIn = false;
            this.currentUser = null;
            return { logged_in: false };
        }
    }

    /**
     * Actualizar UI según estado de sesión
     */
    updateUI() {
        const loginButtons = document.querySelectorAll('.login-btn, .btn-login');
        const registerButtons = document.querySelectorAll('.register-btn, .btn-register');
        const userMenu = document.querySelector('.user-menu');
        const logoutButtons = document.querySelectorAll('.logout-btn, .btn-logout');

        if (this.isLoggedIn) {
            // Ocultar botones de login/registro
            loginButtons.forEach(btn => btn.style.display = 'none');
            registerButtons.forEach(btn => btn.style.display = 'none');

            // Mostrar menú de usuario
            if (userMenu) {
                userMenu.style.display = 'block';
                this.updateUserMenu();
            }

            // Mostrar botones de logout
            logoutButtons.forEach(btn => btn.style.display = 'inline-block');
        } else {
            // Mostrar botones de login/registro
            loginButtons.forEach(btn => btn.style.display = 'inline-block');
            registerButtons.forEach(btn => btn.style.display = 'inline-block');

            // Ocultar menú de usuario
            if (userMenu) {
                userMenu.style.display = 'none';
            }

            // Ocultar botones de logout
            logoutButtons.forEach(btn => btn.style.display = 'none');
        }
    }

    /**
     * Actualizar menú de usuario
     */
    updateUserMenu() {
        if (!this.currentUser) return;

        const userName = document.querySelector('.user-name');
        const userEmail = document.querySelector('.user-email');
        const userType = document.querySelector('.user-type');

        if (userName) userName.textContent = this.currentUser.nombre;
        if (userEmail) userEmail.textContent = this.currentUser.email;
        if (userType) userType.textContent = this.currentUser.tipo_usuario === 'profesional' ? 'Profesional' : 'Cliente';
    }

    /**
     * Actualizar indicador de conexión
     */
    updateConnectionStatus(isOnline) {
        const statusElement = document.getElementById('connectionStatus');
        if (!statusElement) return;

        if (isOnline) {
            statusElement.className = 'connection-status online show';
            statusElement.innerHTML = '<i class="fas fa-wifi"></i><span>Conectado</span>';
            // Ocultar después de 3 segundos
            setTimeout(() => {
                statusElement.classList.remove('show');
            }, 3000);
        } else {
            statusElement.className = 'connection-status offline show';
            statusElement.innerHTML = '<i class="fas fa-wifi"></i><span>Sin conexión</span>';
        }
    }

    /**
     * Mostrar notificación
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;

        // Estilos
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: 500;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 400px;
        `;

        document.body.appendChild(notification);

        // Animar entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Botón de cerrar
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        });

        // Auto-remover después del tiempo configurado
        const autoHideDelay = window.CONFIG?.NOTIFICATIONS?.AUTO_HIDE_DELAY || 5000;
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 300);
            }
        }, autoHideDelay);
    }

    /**
     * Manejar errores de formulario
     */
    handleFormErrors(errors, formElement) {
        // Limpiar errores previos
        formElement.querySelectorAll('.error-message').forEach(el => el.remove());
        formElement.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

        if (Array.isArray(errors)) {
            errors.forEach(error => {
                this.showNotification(error, 'error');
            });
        } else if (typeof errors === 'string') {
            this.showNotification(errors, 'error');
        }
    }

    /**
     * Validar formulario antes de enviar
     */
    validateForm(formData) {
        const errors = [];

        // Validar email
        const emailRegex = window.CONFIG?.FORMS?.EMAIL_REGEX || /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email || !emailRegex.test(formData.email)) {
            errors.push('Email no válido');
        }

        // Validar contraseña
        const minPasswordLength = window.CONFIG?.FORMS?.MIN_PASSWORD_LENGTH || 8;
        if (!formData.password || formData.password.length < minPasswordLength) {
            errors.push(`La contraseña debe tener al menos ${minPasswordLength} caracteres`);
        }

        // Validar confirmación de contraseña
        if (formData.password !== formData.confirmPassword) {
            errors.push('Las contraseñas no coinciden');
        }

        // Validar nombre
        if (!formData.nombre || formData.nombre.length < 2) {
            errors.push('El nombre debe tener al menos 2 caracteres');
        }

        // Validar teléfono (opcional)
        const phoneRegex = window.CONFIG?.FORMS?.PHONE_REGEX || /^(\+34|0034|34)?[6-9][0-9]{8}$/;
        if (formData.telefono && !phoneRegex.test(formData.telefono.replace(/[^0-9+]/g, ''))) {
            errors.push('Teléfono no válido (formato español)');
        }

        return errors;
    }
}

// Crear instancia global
window.maikAPI = new MaikCoAPI();

// Verificar sesión al cargar la página
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Inicializar estado de conexión: solo mostrar si está offline al cargar
        if (!window.maikAPI.isOnline) {
            window.maikAPI.updateConnectionStatus(false);
        }
        
        await window.maikAPI.checkSession();
    } catch (error) {
        console.error('Error verificando sesión inicial:', error);
    }
});

// Exportar para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MaikCoAPI;
}
