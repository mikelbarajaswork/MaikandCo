// Función para actualizar los contadores
function actualizarContadores() {
    // Aquí se conectaría con tu backend para obtener los números reales
    // Por ahora usaremos localStorage para simular el almacenamiento
    const contadores = {
        profesionales: parseInt(localStorage.getItem('profesionales-count')) || 0,
        servicios: parseInt(localStorage.getItem('servicios-count')) || 0,
        clientes: parseInt(localStorage.getItem('clientes-count')) || 0
    };

    // Actualizar los elementos en el DOM
    document.getElementById('profesionales-count').textContent = contadores.profesionales;
    document.getElementById('servicios-count').textContent = contadores.servicios;
    document.getElementById('clientes-count').textContent = contadores.clientes;
}

// Función para incrementar los contadores (se llamará cuando se registre alguien)
function incrementarContador(tipo) {
    const contadores = {
        profesionales: parseInt(localStorage.getItem('profesionales-count')) || 0,
        servicios: parseInt(localStorage.getItem('servicios-count')) || 0,
        clientes: parseInt(localStorage.getItem('clientes-count')) || 0
    };

    switch(tipo) {
        case 'profesional':
            contadores.profesionales++;
            break;
        case 'servicio':
            contadores.servicios++;
            break;
        case 'cliente':
            contadores.clientes++;
            break;
    }

    // Guardar en localStorage
    localStorage.setItem('profesionales-count', contadores.profesionales);
    localStorage.setItem('servicios-count', contadores.servicios);
    localStorage.setItem('clientes-count', contadores.clientes);

    // Actualizar la visualización
    actualizarContadores();
}

// Inicializar contadores cuando se carga la página
document.addEventListener('DOMContentLoaded', actualizarContadores); 