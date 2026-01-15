# Maik & Co. — Documentación Técnica de la Web y Plataforma

## Visión General

Plataforma web estática (HTML/CSS/JS) orientada a conectar clientes con profesionales. Estructura modular, diseño responsive y preparación para conectar con API real mediante `js/api.js` y `js/config.js`.

---

## Estructura del Repositorio

```
Maik & co._Pagina_web_plataforma/
├── index.html                 # Landing principal con modales (login/registro)
├── profesional.html           # Portal de profesionales (registro/login)
├── plataforma-cliente.html    # Dashboard cliente (demo)
├── perfil-cliente.html        # Perfil de cliente (edición básica)
├── blog.html                  # Blog (listado y artículos)
├── faq.html                   # Preguntas frecuentes
├── nuestra-historia.html      # Página de historia/branding
├── mantenimiento.html         # Página temporal de panel
├── terminos.html              # Términos y condiciones
├── privacidad.html            # Política de privacidad
├── cookies.html               # Política de cookies
├── css/
│   ├── styles.css             # Estilos globales y UI (modales, notificaciones)
│   ├── plataforma-cliente.css # Estilos del dashboard de cliente
│   ├── profesional.css        # Estilos del portal profesional
│   ├── registro-*.css         # (si aplica) estilos de formularios
│   └── ...
├── js/
│   ├── config.js              # Configuración central (URLs, flags, validaciones)
│   ├── api.js                 # Cliente API (auth, peticiones, manejo de errores)
│   ├── main.js                # Modales, navegación, animaciones, notificaciones
│   ├── plataforma-cliente.js  # Lógica del dashboard (demo)
│   ├── registro.js            # Validaciones de formularios de registro/login
│   ├── contadores.js          # Contadores dinámicos (landing)
│   └── faq.js                 # Interacciones de FAQ
└── img/
    ├── favicon/
    ├── Logo/
    ├── blog/
    └── Profesionales.png
```

---

## Páginas y Rutas

- index.html: Presentación, CTA, modales de login/registro, contadores, secciones de valor.
- profesional.html: Registro/login para profesionales; info de beneficios y flujo.
- plataforma-cliente.html: Panel lateral, tarjetas de profesionales, filtros (demo).
- perfil-cliente.html: Edición de datos básicos del cliente (demo).
- blog.html: Listado/artículos informativos.
- faq.html: Categorías, acordeones y búsqueda simple.
- nuestra-historia.html: Narrativa de marca.
- legales: terminos.html, privacidad.html, cookies.html.

---

## Módulos JavaScript

- config.js
  - BASE_API_URL, rutas de endpoints, timeouts, feature flags, textos de validación.
  - Punto único para cambiar entornos (desarrollo/producción).

- api.js
  - Cliente de autenticación y peticiones fetch con `async/await`.
  - Manejo de estados y errores (offline, 4xx, 5xx), reintentos simples.
  - Helpers previstos: `handleLogin`, `handleRegister`, `getUserProfile`, etc.

- main.js
  - Gestión de modales (abrir/cerrar, cambiar entre login/registro).
  - Notificaciones y estado de conexión (online/offline).
  - Animaciones y pequeños efectos de UI.

- registro.js
  - Validaciones de formularios (campos obligatorios, formatos, profesión).
  - Prevención de envíos inválidos y feedback de errores.

- plataforma-cliente.js
  - Navegación lateral, render de listas (demo) y control de sesión básica.

- contadores.js, faq.js
  - Interacciones específicas de landing y FAQ.

---

## Flujos Principales

1) Autenticación (demo)
- Usuario abre modal → completa formulario → validación cliente → llamada a `api.js`.
- Respuesta positiva: guarda estado de sesión (localStorage o memoria) y redirige a sección/página.

2) Registro de Profesional (demo)
- Selección de tipo → formulario con campo “Profesión” obligatorio → validación → alta.

3) Descubrimiento de Profesionales (demo)
- Filtros por especialidad/ubicación (UI demo) → tarjetas con rating/resumen.

---

## Configuración y Entornos

- Variables en `js/config.js`:
  - `BASE_API_URL`, `ENDPOINTS`, `VALIDATION_RULES`, `FEATURE_FLAGS`.
- Recomendado: crear `config.local.js` (no versionado) para overrides locales y cargarlo antes de `config.js`.

Ejemplo de endpoints esperados (orientativo):

```json
{
  "auth": {"login": "/auth/login", "register": "/auth/register", "me": "/auth/me"},
  "professionals": {"list": "/professionals", "detail": "/professionals/:id"},
  "requests": {"create": "/requests", "list": "/requests"}
}
```

---

## Integración con Backend (Plan)

- Sustituir mocks por llamadas reales en `api.js`.
- Añadir persistencia de sesión (JWT en cookies httpOnly o almacenamiento seguro).
- Implementar flujos: solicitud-propuesta-aceptación, mensajería y agenda.
- Manejar roles (cliente/profesional) y permisos en UI.

---

## Despliegue

- Sitio estático: servible desde cualquier hosting estático (Netlify, Vercel, S3+CloudFront, etc.).
- Recomendaciones:
  - Compresión gzip/brotli, cache control y versiones de activos.
  - HTTPS obligatorio, HSTS y redirecciones canónicas.

---

## SEO y Accesibilidad

- SEO: metas por página, títulos únicos, descripciones, `alt` en imágenes, sitemap y `robots.txt`.
- Accesibilidad: contraste suficiente, foco visible, labels asociados, navegación por teclado.

---

## Seguridad (Front)

- Sanitización de entradas, evitar inyecciones en el DOM.
- Evitar secretos en el cliente; usar variables de entorno del hosting.
- Si hay auth real: cookies httpOnly, CSRF token y CORS correcto.

---

## Analítica y Métricas (opcional)

- Eventos: apertura de modales, envíos de formularios, conversiones de registro.
- Herramientas: Plausible/GA4 con anonimización y cumplimiento RGPD.

---

## Testing Manual Rápido

- Modales: abrir/cerrar, cambio login↔registro, validaciones y mensajes.
- Navegación: enlaces internos/externos funcionales.
- Estados: offline/online, notificaciones visibles.
- Responsive: móvil, tablet, desktop.

---

## Roadmap Técnico

1) Integrar autenticación real (JWT/cookies) y perfiles conectados a API.
2) Flujo completo de matching (filtros, detalle, solicitud, propuesta, aceptación).
3) Mensajería básica y agenda; notificaciones in‑app.
4) Pagos/escrow (fase posterior) y facturación.
5) Observabilidad: logs frontend, trazas y métricas de UX.

---

## Cómo Ejecutar Localmente

1. Clonar el repositorio.
2. Abrir `index.html` en un navegador moderno.
3. Para rutas relativas/recursos, servir con un servidor estático simple (opcional):

```bash
# Node
npx serve .

# Python
python -m http.server 8080
```

---

## Créditos

© 2025 Maik & Co. — Diseño y desarrollo front-end. Preparado para integración con API.


