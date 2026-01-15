(function() {
  const KB = [
    { q: 'registro cliente', a: 'Para registrarte como cliente, pulsa “Iniciar sesión” → “Registrarse” y elige Cliente. Completa los campos y acepta las políticas.' },
    { q: 'registro profesional', a: 'Desde portada o profesional, pulsa “Registrarse”, elige Profesional e indica tu profesión y datos básicos.' },
    { q: 'precio comisiones planes', a: 'Clientes: Plan Básico gratis (3% comisión), Avanzado 9€/mes (sin comisiones) o Premium 19€/mes (sin comisiones). Profesionales: Plan Básico gratis (15% comisión), Premium 29€/mes (10% comisión) o Empresarial 99€/mes (8% comisión).' },
    { q: 'buscar profesional', a: 'Puedes filtrar por categoría y ubicación, y comparar valoraciones antes de enviar tu solicitud.' },
    { q: 'pagos escrow seguridad', a: 'Implementaremos pagos seguros tipo escrow en próximas versiones. Ahora es demo sin cobro real.' },
    { q: 'verificación profesionales', a: 'Verificación documental inicial + reseñas. Se añadirá scoring reputacional avanzado.' },
    { q: 'editar perfil', a: 'Entra en tu panel (Plataforma) y edita tu perfil desde la sección correspondiente.' },
    { q: 'soporte contacto', a: 'Puedes escribir desde la página de Contacto o a info@maikandco.com.' },
    { q: 'offline conexión', a: 'Si pierdes conexión, verás un aviso y se limitarán funciones. Retomarás al volver online.' },
    { q: 'legal privacidad cookies', a: 'Encuentras Términos, Privacidad y Cookies en el pie de la web.' }
  ];

  const STORAGE_KEY = 'maikbot_history_v1';
  const SUGGESTIONS = [
    '¿Cómo me registro como cliente?',
    '¿Cómo me registro como profesional?',
    '¿Cómo funcionan los pagos?',
    '¿Cómo se verifican los profesionales?'
  ];

  const state = { open: false, history: [] };
  function $(id) { return document.getElementById(id); }

  function similarity(a, b) {
    const ta = a.toLowerCase().replace(/[^a-záéíóúñ0-9 ]/gi, ' ').split(/\s+/).filter(Boolean);
    const tb = b.toLowerCase().replace(/[^a-záéíóúñ0-9 ]/gi, ' ').split(/\s+/).filter(Boolean);
    const setA = new Set(ta);
    const setB = new Set(tb);
    let inter = 0;
    setA.forEach(w => { if (setB.has(w)) inter++; });
    return inter / Math.max(1, Math.min(setA.size, setB.size));
  }

  function bestAnswer(query) {
    let best = { score: 0, a: null };
    for (const item of KB) {
      const s1 = similarity(query, item.q);
      const s2 = similarity(query, item.a);
      const score = Math.max(s1, s2);
      if (score > best.score) best = { score, a: item.a };
    }
    if (best.score >= 0.4) return best.a;
    return 'Buena pregunta. De momento no tengo esa respuesta. Puedes revisar el FAQ o escribirnos en Contacto. 😉';
  }

  function appendMessage(role, text) {
    const chat = $('assistantChat');
    if (!chat) return;
    const msg = document.createElement('div');
    msg.className = 'assistant-msg ' + (role === 'user' ? 'user' : 'bot');
    const bubble = document.createElement('div');
    bubble.className = 'assistant-bubble';
    bubble.textContent = text;
    msg.appendChild(bubble);
    chat.appendChild(msg);
    chat.scrollTop = chat.scrollHeight;
    // Persistir historial
    state.history.push({ role, text });
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state.history)); } catch {}
  }

  function greetIfEmpty() {
    const chat = $('assistantChat');
    if (chat && chat.children.length === 0) {
      appendMessage('bot', '¡Hola! Soy MaikBot 🤖. Pregúntame sobre registro, pagos, verificación o cómo funciona la plataforma.');
    }
  }

  function renderSuggestions() {
    const wrap = $('assistantSuggestions');
    if (!wrap) return;
    wrap.innerHTML = '';
    SUGGESTIONS.forEach(text => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'assistant-suggestion';
      chip.textContent = text;
      chip.addEventListener('click', () => {
        const input = $('assistantUserInput');
        if (input) input.value = text;
        send();
      });
      wrap.appendChild(chip);
    });
  }

  function toggle(force) {
    const widget = $('assistantWidget');
    const fab = $('assistantFab');
    if (!widget || !fab) return;
    state.open = typeof force === 'boolean' ? force : !state.open;
    if (state.open) {
      widget.hidden = false;
      widget.style.display = 'flex';
      greetIfEmpty();
      renderSuggestions();
      $('assistantUserInput')?.focus();
      fab.setAttribute('aria-expanded', 'true');
    }
    else {
      widget.hidden = true;
      widget.style.display = 'none';
      fab.setAttribute('aria-expanded', 'false');
    }
  }

  function send(e) {
    e?.preventDefault?.();
    const input = $('assistantUserInput');
    if (!input || !input.value.trim()) return false;
    const text = input.value.trim();
    appendMessage('user', text);
    input.value = '';
    setTimeout(() => {
      const answer = bestAnswer(text);
      appendMessage('bot', answer);
    }, 200);
    return false;
  }

  function init() {
    // Estado inicial asegurado
    const widget = $('assistantWidget');
    if (widget) { widget.hidden = true; widget.style.display = 'none'; }
    // Close with Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !$('assistantWidget')?.hidden) toggle(false);
    });

    // Delegación: cerrar al pulsar en .assistant-close
    document.addEventListener('click', (e) => {
      const target = e.target;
      if (target && target.closest && target.closest('.assistant-close')) {
        e.preventDefault();
        toggle(false);
      }
    });

    // Cerrar al hacer clic fuera del widget (excepto en el FAB)
    document.addEventListener('mousedown', (e) => {
      const widget = $('assistantWidget');
      const fab = $('assistantFab');
      if (!widget || widget.hidden) return;
      const clickInsideWidget = widget.contains(e.target);
      const clickOnFab = fab && fab.contains(e.target);
      if (!clickInsideWidget && !clickOnFab) {
        toggle(false);
      }
    });

    // Cargar historial
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        state.history = JSON.parse(saved) || [];
        const chat = $('assistantChat');
        if (chat) {
          chat.innerHTML = '';
          state.history.forEach(m => {
            const role = m.role === 'user' ? 'user' : 'bot';
            appendMessage(role, m.text);
          });
        }
      }
    } catch {}
  }

  window.MaikAssistant = { toggle, send };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();


