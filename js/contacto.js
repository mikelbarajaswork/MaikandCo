// Funcionalidad del formulario de contacto
document.addEventListener('DOMContentLoaded', function() {
    const contactoForm = document.getElementById('contactoForm');
    
    if (contactoForm) {
        contactoForm.addEventListener('submit', handleFormSubmit);
        
        // Validación en tiempo real
        const inputs = contactoForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearError);
        });
    }
});

function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);
    
    // Validar formulario
    if (!validateForm(form)) {
        return;
    }
    
    // Mostrar estado de carga
    showLoadingState(submitButton);
    
    // Simular envío del formulario (aquí iría la lógica real de envío)
    setTimeout(() => {
        hideLoadingState(submitButton);
        showSuccessMessage(form);
        form.reset();
    }, 2000);
}

function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // Limpiar errores previos
    clearError(e);
    
    // Validar campos requeridos
    if (field.hasAttribute('required') && !value) {
        errorMessage = 'Este campo es obligatorio';
        isValid = false;
    }
    
    // Validaciones específicas por tipo de campo
    if (value && fieldName === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            errorMessage = 'Por favor, introduce un email válido';
            isValid = false;
        }
    }
    
    if (value && fieldName === 'telefono') {
        const phoneRegex = /^[+]?[\d\s\-\(\)]{9,}$/;
        if (!phoneRegex.test(value)) {
            errorMessage = 'Por favor, introduce un teléfono válido';
            isValid = false;
        }
    }
    
    if (value && fieldName === 'mensaje' && value.length < 10) {
        errorMessage = 'El mensaje debe tener al menos 10 caracteres';
        isValid = false;
    }
    
    // Mostrar error si existe
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function clearError(e) {
    const field = e.target;
    const errorElement = field.parentNode.querySelector('.error-message');
    
    if (errorElement) {
        errorElement.remove();
    }
    
    field.classList.remove('error');
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    const errorElement = document.createElement('span');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    
    field.parentNode.appendChild(errorElement);
}

function showLoadingState(button) {
    button.classList.add('loading');
    button.disabled = true;
    
    const icon = button.querySelector('i');
    if (icon) {
        icon.className = 'fas fa-spinner';
    }
    
    button.innerHTML = '<i class="fas fa-spinner"></i> Enviando...';
}

function hideLoadingState(button) {
    button.classList.remove('loading');
    button.disabled = false;
    
    button.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar mensaje';
}

function showSuccessMessage(form) {
    // Remover mensaje de éxito previo si existe
    const existingMessage = form.querySelector('.success-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <strong>¡Mensaje enviado correctamente!</strong><br>
        Te responderemos lo antes posible. Gracias por contactarnos.
    `;
    
    form.insertBefore(successMessage, form.firstChild);
    
    // Scroll suave hacia el mensaje
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Remover mensaje después de 5 segundos
    setTimeout(() => {
        if (successMessage.parentNode) {
            successMessage.remove();
        }
    }, 5000);
}

// Funcionalidad adicional para mejorar la experiencia del usuario
document.addEventListener('DOMContentLoaded', function() {
    // Animaciones al hacer scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar elementos para animaciones
    const animatedElements = document.querySelectorAll('.info-card, .faq-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Efecto de hover mejorado para las tarjetas de información
    const infoCards = document.querySelectorAll('.info-card');
    infoCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Validación del checkbox de privacidad
    const privacyCheckbox = document.getElementById('privacidad');
    if (privacyCheckbox) {
        privacyCheckbox.addEventListener('change', function() {
            const submitButton = document.querySelector('#contactoForm button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = !this.checked;
                submitButton.style.opacity = this.checked ? '1' : '0.6';
            }
        });
        
        // Deshabilitar botón inicialmente
        const submitButton = document.querySelector('#contactoForm button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.style.opacity = '0.6';
        }
    }
});

// Función para mostrar notificaciones toast (opcional)
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Estilos del toast
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#22c55e' : '#ef4444'};
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
    `;
    
    document.body.appendChild(toast);
    
    // Animar entrada
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 300);
    }, 3000);
}
