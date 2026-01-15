document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('.registro-form');
    if (!form) return;

    const password = form.querySelector('input[name="password"]');
    const confirmPassword = form.querySelector('input[name="confirm-password"]');
    const email = form.querySelector('input[name="email"]');
    const mensaje = document.createElement('div');
    mensaje.className = 'mensaje-registro';
    form.appendChild(mensaje);

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        mensaje.textContent = '';
        mensaje.classList.remove('error', 'exito');

        // Validación de email
        const emailVal = email.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailVal)) {
            mensaje.textContent = 'Por favor, introduce un correo electrónico válido.';
            mensaje.classList.add('error');
            email.focus();
            return;
        }

        // Validación de contraseñas
        if (password.value !== confirmPassword.value) {
            mensaje.textContent = 'Las contraseñas no coinciden.';
            mensaje.classList.add('error');
            confirmPassword.focus();
            return;
        }

        // Validación de campos vacíos
        let campos = form.querySelectorAll('input[required], textarea[required]');
        for (let campo of campos) {
            if (!campo.value.trim()) {
                mensaje.textContent = 'Por favor, completa todos los campos obligatorios.';
                mensaje.classList.add('error');
                campo.focus();
                return;
            }
        }

        // Simular registro exitoso
        mensaje.textContent = '¡Registro exitoso! Redirigiendo a la página de inicio de sesión...';
        mensaje.classList.add('exito');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    });
}); 