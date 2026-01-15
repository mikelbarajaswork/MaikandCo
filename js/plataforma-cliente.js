// Datos de ejemplo de profesionales (simulando base de datos)
const profesionalesData = [
    {
        id: 1,
        nombre: "Juan Pérez",
        especialidad: "Abogado - Derecho Civil",
        categoria: "legal",
        ubicacion: "Bilbao, Vizcaya",
        valoracion: 4.8,
        numValoraciones: 127,
        precio: 80,
        verificado: true,
        disponibilidad: "inmediata",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        descripcion: "Abogado con más de 15 años de experiencia en derecho civil y familiar."
    },
    {
        id: 2,
        nombre: "María García",
        especialidad: "Arquitecta",
        categoria: "especialistas",
        ubicacion: "San Sebastián, Guipúzcoa",
        valoracion: 4.9,
        numValoraciones: 89,
        precio: 120,
        verificado: true,
        disponibilidad: "semana",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
        descripcion: "Arquitecta especializada en reformas integrales y diseño sostenible."
    },
    {
        id: 3,
        nombre: "Carlos López",
        especialidad: "Electricista",
        categoria: "instalaciones",
        ubicacion: "Vitoria-Gasteiz, Álava",
        valoracion: 4.7,
        numValoraciones: 203,
        precio: 45,
        verificado: true,
        disponibilidad: "inmediata",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        descripcion: "Electricista certificado con amplia experiencia en instalaciones domésticas e industriales."
    },
    {
        id: 4,
        nombre: "Ana Martínez",
        especialidad: "Pintora",
        categoria: "acabados",
        ubicacion: "Bilbao, Vizcaya",
        valoracion: 4.6,
        numValoraciones: 156,
        precio: 35,
        verificado: true,
        disponibilidad: "mes",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        descripcion: "Pintora profesional especializada en acabados de calidad y técnicas modernas."
    },
    {
        id: 5,
        nombre: "Pedro Sánchez",
        especialidad: "Fontanero",
        categoria: "instalaciones",
        ubicacion: "San Sebastián, Guipúzcoa",
        valoracion: 4.5,
        numValoraciones: 98,
        precio: 50,
        verificado: false,
        disponibilidad: "inmediata",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
        descripcion: "Fontanero con experiencia en reparaciones urgentes y nuevas instalaciones."
    },
    {
        id: 6,
        nombre: "Laura Fernández",
        especialidad: "Interiorista",
        categoria: "diseno",
        ubicacion: "Bilbao, Vizcaya",
        valoracion: 4.9,
        numValoraciones: 67,
        precio: 90,
        verificado: true,
        disponibilidad: "semana",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
        descripcion: "Interiorista creativa especializada en espacios modernos y funcionales."
    },
    {
        id: 7,
        nombre: "Roberto Jiménez",
        especialidad: "Albañil",
        categoria: "construccion",
        ubicacion: "Vitoria-Gasteiz, Álava",
        valoracion: 4.4,
        numValoraciones: 145,
        precio: 40,
        verificado: true,
        disponibilidad: "mes",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
        descripcion: "Albañil con amplia experiencia en reformas y construcción tradicional."
    },
    {
        id: 8,
        nombre: "Sofía Ruiz",
        especialidad: "Jardinera",
        categoria: "mantenimiento",
        ubicacion: "Bilbao, Vizcaya",
        valoracion: 4.7,
        numValoraciones: 112,
        precio: 30,
        verificado: true,
        disponibilidad: "inmediata",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
        descripcion: "Jardinera especializada en diseño paisajístico y mantenimiento de jardines."
    }
];

// Estado de la aplicación
let profesionalesFiltrados = [...profesionalesData];
let favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
let proyectos = JSON.parse(localStorage.getItem('proyectos') || '[]');

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando plataforma...');
    
    // Inicializar navegación primero
    inicializarNavegacion();
    
    // Cargar contenido
    cargarProfesionales();
    cargarFavoritos();
    cargarProyectos();
    
    // Event listeners
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                buscarProfesionales();
            }
        });
        
        searchInput.addEventListener('input', function() {
            aplicarFiltros();
        });
    }
    
    console.log('Plataforma inicializada');
});

// Navegación entre secciones
function inicializarNavegacion() {
    try {
        console.log('Inicializando navegación...');
        
        const navItems = document.querySelectorAll('.nav-item[data-section]');
        console.log('Nav items encontrados:', navItems.length);
        
        navItems.forEach(item => {
            if (item) {
                // Remover listeners anteriores si existen
                const newItem = item.cloneNode(true);
                item.parentNode.replaceChild(newItem, item);
                
                newItem.addEventListener('click', function(e) {
                    try {
                        e.preventDefault();
                        e.stopPropagation();
                        const section = this.getAttribute('data-section');
                        if (section) {
                            console.log('Navegando a sección:', section);
                            mostrarSeccion(section);
                            
                            // Cerrar sidebar en móvil después de hacer clic
                            if (window.innerWidth <= 1024) {
                                if (typeof toggleSidebar === 'function') {
                                    toggleSidebar();
                                }
                            }
                        }
                    } catch (error) {
                        console.error('Error en click de navegación:', error);
                    }
                });
            }
        });
        
        // Manejar hash en URL o mostrar sección por defecto
        try {
            const hash = window.location.hash.substring(1);
            if (hash && document.getElementById(hash)) {
                console.log('Mostrando sección desde hash:', hash);
                mostrarSeccion(hash);
            } else {
                // Por defecto mostrar la sección "buscar"
                console.log('Mostrando sección por defecto: buscar');
                mostrarSeccion('buscar');
            }
        } catch (e) {
            console.error('Error manejando hash inicial:', e);
            mostrarSeccion('buscar');
        }
        
        // Escuchar cambios en el hash
        window.addEventListener('hashchange', function() {
            try {
                const newHash = window.location.hash.substring(1);
                if (newHash && document.getElementById(newHash)) {
                    mostrarSeccion(newHash);
                } else {
                    mostrarSeccion('buscar');
                }
            } catch (e) {
                console.error('Error en hashchange:', e);
            }
        });
    } catch (error) {
        console.error('Error inicializando navegación:', error);
        // Fallback: mostrar sección buscar
        try {
            mostrarSeccion('buscar');
        } catch (e) {
            console.error('Error crítico en fallback:', e);
        }
    }
}

function mostrarSeccion(sectionId) {
    try {
        console.log('Mostrando sección:', sectionId);
        
        if (!sectionId) {
            console.warn('sectionId no definido, usando buscar por defecto');
            sectionId = 'buscar';
        }
        
        // Ocultar todas las secciones de forma segura
        try {
            const todasLasSecciones = document.querySelectorAll('.dashboard-section');
            todasLasSecciones.forEach(section => {
                if (section) {
                    section.classList.remove('active');
                }
            });
        } catch (e) {
            console.error('Error ocultando secciones:', e);
        }
        
        // Remover active de todos los nav items de forma segura
        try {
            const todosLosNavItems = document.querySelectorAll('.nav-item');
            todosLosNavItems.forEach(item => {
                if (item) {
                    item.classList.remove('active');
                }
            });
        } catch (e) {
            console.error('Error removiendo active de nav items:', e);
        }
        
        // Mostrar sección seleccionada
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.add('active');
            console.log('Sección activada:', sectionId);
        } else {
            console.warn('Sección no encontrada:', sectionId);
            // Si no se encuentra, mostrar la sección buscar por defecto
            sectionId = 'buscar';
            const buscarSection = document.getElementById('buscar');
            if (buscarSection) {
                buscarSection.classList.add('active');
                console.log('Mostrando sección buscar por defecto');
            } else {
                console.error('No se pudo encontrar ninguna sección');
                return;
            }
        }
        
        // Activar nav item correspondiente de forma segura
        try {
            const navItem = document.querySelector(`.nav-item[data-section="${sectionId}"]`);
            if (navItem) {
                navItem.classList.add('active');
            }
        } catch (e) {
            console.error('Error activando nav item:', e);
        }
        
        // Actualizar URL sin recargar la página
        try {
            if (window.location.hash !== '#' + sectionId) {
                history.pushState(null, null, '#' + sectionId);
            }
        } catch (e) {
            console.error('Error actualizando URL:', e);
        }
        
        // Recargar contenido si es necesario (con manejo de errores)
        try {
            if (sectionId === 'buscar') {
                if (typeof cargarProfesionales === 'function') {
                    cargarProfesionales();
                }
            } else if (sectionId === 'favoritos') {
                if (typeof cargarFavoritos === 'function') {
                    cargarFavoritos();
                }
            } else if (sectionId === 'proyectos') {
                if (typeof cargarProyectos === 'function') {
                    cargarProyectos();
                }
            } else if (sectionId === 'perfil') {
                inicializarPerfil();
            }
        } catch (e) {
            console.error('Error cargando contenido de sección:', e);
        }
        
    } catch (error) {
        console.error('Error en mostrarSeccion:', error);
        // Intentar mostrar la sección buscar como fallback
        try {
            const buscarSection = document.getElementById('buscar');
            if (buscarSection) {
                buscarSection.classList.add('active');
            }
        } catch (e) {
            console.error('Error crítico:', e);
        }
    }
}

// Buscar profesionales
function buscarProfesionales() {
    aplicarFiltros();
}

function aplicarFiltros() {
    const busqueda = document.getElementById('searchInput').value.toLowerCase();
    const categoria = document.getElementById('filterCategoria').value;
    const ubicacion = document.getElementById('filterUbicacion').value.toLowerCase();
    const valoracion = parseFloat(document.getElementById('filterValoracion').value) || 0;
    const precio = parseFloat(document.getElementById('filterPrecio').value) || Infinity;
    const verificado = document.getElementById('filterVerificado').checked;
    const disponibilidad = document.getElementById('filterDisponibilidad').value;
    
    profesionalesFiltrados = profesionalesData.filter(prof => {
        const matchBusqueda = !busqueda || 
            prof.nombre.toLowerCase().includes(busqueda) ||
            prof.especialidad.toLowerCase().includes(busqueda);
        
        const matchCategoria = !categoria || prof.categoria === categoria;
        const matchUbicacion = !ubicacion || prof.ubicacion.toLowerCase().includes(ubicacion);
        const matchValoracion = prof.valoracion >= valoracion;
        const matchPrecio = prof.precio <= precio;
        const matchVerificado = !verificado || prof.verificado;
        const matchDisponibilidad = !disponibilidad || prof.disponibilidad === disponibilidad;
        
        return matchBusqueda && matchCategoria && matchUbicacion && 
               matchValoracion && matchPrecio && matchVerificado && matchDisponibilidad;
    });
    
    cargarProfesionales();
}

function limpiarFiltros() {
    document.getElementById('searchInput').value = '';
    document.getElementById('filterCategoria').value = '';
    document.getElementById('filterUbicacion').value = '';
    document.getElementById('filterValoracion').value = '';
    document.getElementById('filterPrecio').value = '';
    document.getElementById('filterVerificado').checked = false;
    document.getElementById('filterDisponibilidad').value = '';
    aplicarFiltros();
}

function ordenarResultados() {
    const orden = document.getElementById('sortBy').value;
    
    profesionalesFiltrados.sort((a, b) => {
        switch(orden) {
            case 'valoracion':
                return b.valoracion - a.valoracion;
            case 'precio-asc':
                return a.precio - b.precio;
            case 'precio-desc':
                return b.precio - a.precio;
            case 'proximidad':
                // Simulación de proximidad (ordenar por ubicación alfabéticamente)
                return a.ubicacion.localeCompare(b.ubicacion);
            default:
                return 0;
        }
    });
    
    cargarProfesionales();
}

function cargarProfesionales() {
    const container = document.getElementById('resultados-profesionales');
    const countElement = document.getElementById('resultsCount');
    
    countElement.textContent = `${profesionalesFiltrados.length} profesional${profesionalesFiltrados.length !== 1 ? 'es' : ''} encontrado${profesionalesFiltrados.length !== 1 ? 's' : ''}`;
    
    if (profesionalesFiltrados.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <h3>No se encontraron profesionales</h3>
                <p>Intenta ajustar los filtros de búsqueda</p>
                <button class="btn btn-primary" onclick="limpiarFiltros()">Limpiar filtros</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = profesionalesFiltrados.map(prof => {
        const esFavorito = favoritos.includes(prof.id);
        const estrellas = generarEstrellas(prof.valoracion);
        
        return `
            <div class="profesional-card" onclick="abrirModalProfesional(${prof.id})">
                <div class="profesional-header">
                    <img src="${prof.avatar}" alt="${prof.nombre}" class="profesional-avatar">
                    <div class="profesional-info">
                        <h3>${prof.nombre}</h3>
                        <p class="profesional-especialidad">${prof.especialidad}</p>
                        ${prof.verificado ? '<span class="profesional-verificado"><i class="fas fa-check-circle"></i> Verificado</span>' : ''}
                    </div>
                </div>
                <div class="profesional-rating">
                    <span class="stars">${estrellas}</span>
                    <span class="rating-text">${prof.valoracion} (${prof.numValoraciones} valoraciones)</span>
                </div>
                <div class="profesional-details">
                    <div class="profesional-detail">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${prof.ubicacion}</span>
                    </div>
                    <div class="profesional-detail">
                        <i class="fas fa-clock"></i>
                        <span>${obtenerDisponibilidadTexto(prof.disponibilidad)}</span>
                    </div>
                </div>
                <div class="profesional-precio">Desde ${prof.precio}€/hora</div>
                <div class="profesional-actions" onclick="event.stopPropagation()">
                    <button class="btn-profesional primary" onclick="contactarProfesional(${prof.id})">
                        <i class="fas fa-envelope"></i> Contactar
                    </button>
                    <button class="btn-profesional favorite ${esFavorito ? 'active' : ''}" onclick="toggleFavorito(${prof.id})">
                        <i class="fas fa-star"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function generarEstrellas(valoracion) {
    const estrellasLlenas = Math.floor(valoracion);
    const tieneMedia = valoracion % 1 >= 0.5;
    const estrellasVacias = 5 - estrellasLlenas - (tieneMedia ? 1 : 0);
    
    let html = '<i class="fas fa-star"></i>'.repeat(estrellasLlenas);
    if (tieneMedia) {
        html += '<i class="fas fa-star-half-alt"></i>';
    }
    html += '<i class="far fa-star"></i>'.repeat(estrellasVacias);
    
    return html;
}

function obtenerDisponibilidadTexto(disponibilidad) {
    const textos = {
        'inmediata': 'Disponibilidad inmediata',
        'semana': 'Disponible esta semana',
        'mes': 'Disponible este mes'
    };
    return textos[disponibilidad] || 'Consultar disponibilidad';
}

// Favoritos
function toggleFavorito(profesionalId) {
    const index = favoritos.indexOf(profesionalId);
    if (index > -1) {
        favoritos.splice(index, 1);
    } else {
        favoritos.push(profesionalId);
    }
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
    cargarProfesionales();
    cargarFavoritos();
}

function cargarFavoritos() {
    const container = document.getElementById('favoritos-lista');
    const favoritosData = profesionalesData.filter(prof => favoritos.includes(prof.id));
    
    if (favoritosData.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-star"></i>
                <h3>No tienes favoritos aún</h3>
                <p>Guarda profesionales que te interesen para encontrarlos fácilmente</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = favoritosData.map(prof => {
        const estrellas = generarEstrellas(prof.valoracion);
        return `
            <div class="favorito-card">
                <div class="favorito-header">
                    <img src="${prof.avatar}" alt="${prof.nombre}" class="favorito-avatar">
                    <div class="favorito-info">
                        <h4>${prof.nombre}</h4>
                        <p>${prof.especialidad}</p>
                        <div class="profesional-rating">
                            <span class="stars">${estrellas}</span>
                            <span class="rating-text">${prof.valoracion}</span>
                        </div>
                    </div>
                </div>
                <div class="favorito-actions">
                    <button class="btn-profesional primary" onclick="contactarProfesional(${prof.id})">
                        <i class="fas fa-envelope"></i> Contactar
                    </button>
                    <button class="btn-profesional secondary" onclick="abrirModalProfesional(${prof.id})">
                        <i class="fas fa-eye"></i> Ver perfil
                    </button>
                    <button class="btn-profesional favorite active" onclick="toggleFavorito(${prof.id})">
                        <i class="fas fa-star"></i> Quitar
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Proyectos
function mostrarProyectos(tipo) {
    // Actualizar tabs
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    const proyectosFiltrados = proyectos.filter(proyecto => proyecto.estado === tipo);
    const container = document.getElementById('proyectos-lista');
    
    if (proyectosFiltrados.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-folder-open"></i>
                <h3>No tienes proyectos ${tipo}</h3>
                <p>Los proyectos que contrates aparecerán aquí</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = proyectosFiltrados.map(proyecto => {
        const profesional = profesionalesData.find(p => p.id === proyecto.profesionalId);
        return `
            <div class="proyecto-card">
                <div class="proyecto-header">
                    <h3 class="proyecto-title">${proyecto.titulo}</h3>
                    <span class="proyecto-status ${proyecto.estado}">${proyecto.estado.charAt(0).toUpperCase() + proyecto.estado.slice(1)}</span>
                </div>
                <div class="proyecto-info">
                    <div class="proyecto-info-item">
                        <i class="fas fa-user-tie"></i>
                        <span>${profesional ? profesional.nombre : 'Profesional'}</span>
                    </div>
                    <div class="proyecto-info-item">
                        <i class="fas fa-calendar"></i>
                        <span>${proyecto.fecha}</span>
                    </div>
                    <div class="proyecto-info-item">
                        <i class="fas fa-euro-sign"></i>
                        <span>${proyecto.precio}€</span>
                    </div>
                </div>
                <p style="color: var(--text-light); margin-bottom: var(--spacing-md);">${proyecto.descripcion}</p>
                <div class="proyecto-actions">
                    ${proyecto.estado === 'activo' ? `
                        <button class="btn btn-primary" onclick="verProyecto(${proyecto.id})">
                            <i class="fas fa-eye"></i> Ver detalles
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

function cargarProyectos() {
    // Mostrar proyectos activos por defecto
    mostrarProyectos('activos');
}

function verProyecto(proyectoId) {
    alert('Funcionalidad de ver proyecto en desarrollo');
}

// Modal de profesional
function abrirModalProfesional(profesionalId) {
    const profesional = profesionalesData.find(p => p.id === profesionalId);
    if (!profesional) return;
    
    const esFavorito = favoritos.includes(profesionalId);
    const estrellas = generarEstrellas(profesional.valoracion);
    
    const modalContent = document.getElementById('profesionalModalContent');
    modalContent.innerHTML = `
        <div class="profesional-header">
            <img src="${profesional.avatar}" alt="${profesional.nombre}" class="profesional-avatar" style="width: 100px; height: 100px;">
            <div class="profesional-info">
                <h2>${profesional.nombre}</h2>
                <p class="profesional-especialidad">${profesional.especialidad}</p>
                ${profesional.verificado ? '<span class="profesional-verificado"><i class="fas fa-check-circle"></i> Profesional Verificado</span>' : ''}
            </div>
        </div>
        <div class="profesional-rating" style="margin: var(--spacing-md) 0;">
            <span class="stars">${estrellas}</span>
            <span class="rating-text">${profesional.valoracion} de 5 (${profesional.numValoraciones} valoraciones)</span>
        </div>
        <div class="profesional-details" style="margin: var(--spacing-md) 0;">
            <div class="profesional-detail">
                <i class="fas fa-map-marker-alt"></i>
                <span><strong>Ubicación:</strong> ${profesional.ubicacion}</span>
            </div>
            <div class="profesional-detail">
                <i class="fas fa-clock"></i>
                <span><strong>Disponibilidad:</strong> ${obtenerDisponibilidadTexto(profesional.disponibilidad)}</span>
            </div>
            <div class="profesional-detail">
                <i class="fas fa-euro-sign"></i>
                <span><strong>Precio:</strong> Desde ${profesional.precio}€/hora</span>
            </div>
        </div>
        <div style="margin: var(--spacing-lg) 0;">
            <h3 style="margin-bottom: var(--spacing-sm);">Sobre ${profesional.nombre}</h3>
            <p style="color: var(--text-light); line-height: 1.6;">${profesional.descripcion}</p>
        </div>
        <div class="profesional-actions" style="margin-top: var(--spacing-lg);">
            <button class="btn-profesional primary" onclick="contactarProfesional(${profesionalId})" style="flex: 1;">
                <i class="fas fa-envelope"></i> Contactar
            </button>
            <button class="btn-profesional favorite ${esFavorito ? 'active' : ''}" onclick="toggleFavorito(${profesionalId}); cerrarModalProfesional();">
                <i class="fas fa-star"></i> ${esFavorito ? 'Quitar de favoritos' : 'Añadir a favoritos'}
            </button>
        </div>
    `;
    
    document.getElementById('profesionalModal').style.display = 'block';
}

function cerrarModalProfesional() {
    document.getElementById('profesionalModal').style.display = 'none';
}

// Contactar profesional
function contactarProfesional(profesionalId) {
    const profesional = profesionalesData.find(p => p.id === profesionalId);
    if (confirm(`¿Deseas contactar con ${profesional.nombre}?`)) {
        // Simular creación de proyecto
        const nuevoProyecto = {
            id: Date.now(),
            profesionalId: profesionalId,
            titulo: `Proyecto con ${profesional.nombre}`,
            descripcion: `Servicio de ${profesional.especialidad}`,
            fecha: new Date().toLocaleDateString('es-ES'),
            precio: profesional.precio,
            estado: 'activo'
        };
        
        proyectos.push(nuevoProyecto);
        localStorage.setItem('proyectos', JSON.stringify(proyectos));
        
        alert('¡Proyecto creado! Puedes verlo en la sección "Mis proyectos"');
        mostrarSeccion('proyectos');
        cargarProyectos();
    }
}

// Toggle filtros
function toggleFilters() {
    const content = document.getElementById('filtersContent');
    const btn = document.querySelector('.btn-toggle-filters');
    content.classList.toggle('collapsed');
    btn.querySelector('i').classList.toggle('fa-chevron-down');
    btn.querySelector('i').classList.toggle('fa-chevron-up');
}

// Soporte
function abrirChat() {
    alert('El chat en vivo estará disponible pronto. Mientras tanto, puedes contactarnos por email o teléfono.');
}

function abrirTema(tema) {
    const temas = {
        'registro': 'Información sobre registro y gestión de cuenta',
        'pagos': 'Información sobre métodos de pago y facturación',
        'contratar': 'Guía para contratar profesionales',
        'problemas': 'Resolución de problemas y disputas',
        'seguridad': 'Seguridad y privacidad de datos',
        'planes': 'Información sobre planes y suscripciones'
    };
    
    alert(`Redirigiendo a información sobre: ${temas[tema] || 'este tema'}`);
    // En una implementación real, aquí redirigirías a la sección específica del FAQ
    window.location.href = `faq.html#${tema}`;
}

function enviarConsulta(event) {
    event.preventDefault();
    
    const tipo = document.getElementById('tipoConsulta').value;
    const prioridad = document.getElementById('prioridadConsulta').value;
    const asunto = document.getElementById('asuntoConsulta').value;
    const descripcion = document.getElementById('descripcionConsulta').value;
    
    // Simulación de envío
    const mensaje = `¡Consulta enviada correctamente!\n\nTipo: ${tipo}\nPrioridad: ${prioridad}\nAsunto: ${asunto}\n\nTe responderemos lo antes posible.`;
    alert(mensaje);
    
    // Limpiar formulario
    document.getElementById('soporteForm').reset();
    
    // Mostrar feedback visual
    const form = document.getElementById('soporteForm');
    const feedback = document.createElement('div');
    feedback.className = 'perfil-feedback';
    feedback.style.display = 'flex';
    feedback.innerHTML = '<i class="fas fa-check-circle"></i><span>¡Consulta enviada! Te responderemos pronto.</span>';
    form.appendChild(feedback);
    
    setTimeout(() => {
        feedback.remove();
    }, 3000);
}

// Toggle sidebar móvil
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    
    sidebar.classList.toggle('open');
    
    if (!overlay) {
        const newOverlay = document.createElement('div');
        newOverlay.className = 'sidebar-overlay';
        newOverlay.onclick = toggleSidebar;
        document.body.appendChild(newOverlay);
    }
    
    const currentOverlay = document.querySelector('.sidebar-overlay');
    if (sidebar.classList.contains('open')) {
        currentOverlay.classList.add('active');
    } else {
        currentOverlay.classList.remove('active');
    }
}

// Inicializar perfil
function inicializarPerfil() {
    try {
        // Avatar preview
        const avatarInput = document.getElementById('avatarInput');
        const avatarPreview = document.getElementById('avatarPreview');
        if (avatarInput && avatarPreview) {
            avatarInput.addEventListener('change', function() {
                const file = this.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        avatarPreview.src = e.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
        
        // Feedback al guardar
        const perfilForm = document.getElementById('perfilForm');
        const perfilFeedback = document.getElementById('perfilFeedback');
        if (perfilForm && perfilFeedback) {
            perfilForm.onsubmit = function(e) {
                e.preventDefault();
                perfilFeedback.style.display = 'flex';
                setTimeout(() => {
                    perfilFeedback.style.display = 'none';
                }, 3000);
            };
        }
    } catch (e) {
        console.error('Error inicializando perfil:', e);
    }
}

function togglePasswordPerfil() {
    try {
        const passInput = document.getElementById('passwordInputPerfil');
        const btn = event.target.closest('.show-pass-btn');
        if (passInput && btn) {
            passInput.type = passInput.type === 'password' ? 'text' : 'password';
            const icon = btn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-eye');
                icon.classList.toggle('fa-eye-slash');
            }
        }
    } catch (e) {
        console.error('Error en togglePasswordPerfil:', e);
    }
}

function confirmDelete() {
    if (confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.')) {
        alert('Cuenta eliminada (demo).');
        window.location.href = 'index.html';
    }
}

// Cerrar sesión
function cerrarSesion() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        window.location.href = 'index.html';
    }
}

// Cerrar modal al hacer clic fuera
window.onclick = function(event) {
    const modal = document.getElementById('profesionalModal');
    if (event.target === modal) {
        cerrarModalProfesional();
    }
}
