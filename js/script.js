// ============================================
// BLOG PERSONAL - JAVASCRIPT PROFESIONAL
// ============================================

(function() {
  'use strict';

  // Inicialización cuando el DOM está listo
  document.addEventListener('DOMContentLoaded', function() {
    Navigation.init();
    ScrollEffects.init();
    Animations.init();
    InteractiveElements.init();
    PerformanceOptimizer.init();
  });

  // ============================================
  // NAVEGACIÓN
  // ============================================
  const Navigation = {
    menuToggle: null,
    navMenu: null,
    header: null,
    lastScroll: 0,

    init: function() {
      this.menuToggle = document.getElementById('menuToggle');
      this.navMenu = document.getElementById('navMenu');
      this.header = document.querySelector('.blog-header');

      if (this.menuToggle && this.navMenu) {
        this.setupMobileMenu();
      }

      if (this.header) {
        this.setupScrollHeader();
      }
    },

    setupMobileMenu: function() {
      this.menuToggle.addEventListener('click', () => {
        this.toggleMenu();
      });

      // Cerrar menú al hacer clic en un enlace
      const navLinks = this.navMenu.querySelectorAll('a');
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          this.closeMenu();
        });
      });

      // Cerrar menú al hacer clic fuera
      document.addEventListener('click', (e) => {
        if (!this.navMenu.contains(e.target) && !this.menuToggle.contains(e.target)) {
          this.closeMenu();
        }
      });

      // Cerrar menú con Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.navMenu.classList.contains('active')) {
          this.closeMenu();
        }
      });
    },

    toggleMenu: function() {
      this.navMenu.classList.toggle('active');
      this.menuToggle.classList.toggle('active');
      document.body.style.overflow = this.navMenu.classList.contains('active') ? 'hidden' : '';
    },

    closeMenu: function() {
      this.navMenu.classList.remove('active');
      this.menuToggle.classList.remove('active');
      document.body.style.overflow = '';
    },

    setupScrollHeader: function() {
      window.addEventListener('scroll', Utils.throttle(() => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
          this.header.style.boxShadow = '0 4px 12px rgba(139, 90, 60, 0.15)';
          this.header.style.borderBottomColor = 'rgba(139, 90, 60, 0.2)';
        } else {
          this.header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
          this.header.style.borderBottomColor = 'rgba(139, 90, 60, 0.1)';
        }

        this.lastScroll = currentScroll;
      }, 10));
    }
  };

  // ============================================
  // EFECTOS DE SCROLL
  // ============================================
  const ScrollEffects = {
    observer: null,
    parallaxElements: [],

    init: function() {
      this.setupIntersectionObserver();
      this.setupParallax();
      this.setupSmoothScroll();
    },

    setupIntersectionObserver: function() {
      const options = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      };

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
            this.observer.unobserve(entry.target);
          }
        });
      }, options);

      // Observar elementos para animar
      const elementsToAnimate = document.querySelectorAll(
        '.post-card, .about-content, .stat-item, .skill-tag, .value-item'
      );

      elementsToAnimate.forEach(el => {
        this.observer.observe(el);
      });
    },

    setupParallax: function() {
      if (window.innerWidth <= 768) return;

      const heroImage = document.querySelector('.hero-image');
      if (heroImage) {
        window.addEventListener('scroll', Utils.throttle(() => {
          const scrolled = window.pageYOffset;
          const rate = scrolled * 0.2;
          heroImage.style.transform = `translateY(${rate}px)`;
        }, 10));
      }
    },

    setupSmoothScroll: function() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
          const href = this.getAttribute('href');
          if (href === '#' || href === '#!') return;

          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        });
      });
    }
  };

  // ============================================
  // ANIMACIONES
  // ============================================
  const Animations = {
    init: function() {
      this.animateHeroTitle();
      this.animateCounters();
      this.setupImageLazyLoading();
    },

    animateHeroTitle: function() {
      const heroTitle = document.querySelector('.hero-title');
      if (!heroTitle) return;

      const text = heroTitle.textContent;
      heroTitle.textContent = '';
      heroTitle.style.opacity = '1';

      let i = 0;
      const typeWriter = () => {
        if (i < text.length) {
          heroTitle.textContent += text.charAt(i);
          i++;
          requestAnimationFrame(() => setTimeout(typeWriter, 80));
        }
      };

      setTimeout(typeWriter, 300);
    },

    animateCounters: function() {
      const statNumbers = document.querySelectorAll('.stat-number');
      if (statNumbers.length === 0) return;

      const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animateCounter(entry.target);
            statsObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      statNumbers.forEach(stat => {
        if (stat.textContent !== '∞') {
          statsObserver.observe(stat);
        }
      });
    },

    animateCounter: function(element) {
      const target = element.textContent;
      const isNumber = !isNaN(target.replace(/\D/g, ''));

      if (!isNumber) return;

      const finalNumber = parseInt(target.replace(/\D/g, ''));
      const suffix = target.replace(/\d/g, '');
      const duration = 2000;
      const steps = 60;
      const increment = finalNumber / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= finalNumber) {
          element.textContent = finalNumber + suffix;
          clearInterval(timer);
        } else {
          element.textContent = Math.floor(current) + suffix;
        }
      }, duration / steps);
    },

    setupImageLazyLoading: function() {
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
              }
            }
          });
        }, { rootMargin: '50px' });

        document.querySelectorAll('img[data-src]').forEach(img => {
          imageObserver.observe(img);
        });
      }
    }
  };

  // ============================================
  // ELEMENTOS INTERACTIVOS
  // ============================================
  const InteractiveElements = {
    init: function() {
      this.setupCardHovers();
      this.setupButtonRipples();
      this.setupPostCards();
    },

    setupCardHovers: function() {
      const cards = document.querySelectorAll('.post-card');
      cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
          this.style.transform = 'translateY(-8px) scale(1.01)';
        });

        card.addEventListener('mouseleave', function() {
          this.style.transform = 'translateY(0) scale(1)';
        });
      });
    },

    setupButtonRipples: function() {
      const buttons = document.querySelectorAll('.btn');
      buttons.forEach(button => {
        button.addEventListener('click', function(e) {
          const ripple = document.createElement('span');
          const rect = this.getBoundingClientRect();
          const size = Math.max(rect.width, rect.height);
          const x = e.clientX - rect.left - size / 2;
          const y = e.clientY - rect.top - size / 2;

          ripple.className = 'ripple-effect';
          ripple.style.width = ripple.style.height = size + 'px';
          ripple.style.left = x + 'px';
          ripple.style.top = y + 'px';

          this.appendChild(ripple);

          setTimeout(() => ripple.remove(), 600);
        });
      });
    },

    setupPostCards: function() {
      const postCards = document.querySelectorAll('.post-card');
      postCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
          const image = this.querySelector('.post-image');
          if (image) {
            image.style.transform = 'scale(1.05)';
            image.style.transition = 'transform 0.5s ease';
          }
        });

        card.addEventListener('mouseleave', function() {
          const image = this.querySelector('.post-image');
          if (image) {
            image.style.transform = 'scale(1)';
          }
        });
      });
    }
  };

  // ============================================
  // OPTIMIZACIÓN DE RENDIMIENTO
  // ============================================
  const PerformanceOptimizer = {
    init: function() {
      this.preloadCriticalResources();
      this.optimizeImages();
    },

    preloadCriticalResources: function() {
      const criticalImages = document.querySelectorAll('.hero-image img');
      criticalImages.forEach(img => {
        if (img.complete) return;
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = img.src;
        document.head.appendChild(link);
      });
    },

    optimizeImages: function() {
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        img.loading = 'lazy';
        img.decoding = 'async';
      });
    }
  };

  // ============================================
  // UTILIDADES
  // ============================================
  const Utils = {
    throttle: function(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },

    debounce: function(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    }
  };

  // ============================================
  // ESTILOS DINÁMICOS
  // ============================================
  const style = document.createElement('style');
  style.textContent = `
    .ripple-effect {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.6);
      transform: scale(0);
      animation: ripple-animation 0.6s ease-out;
      pointer-events: none;
    }

    @keyframes ripple-animation {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }

    .btn {
      position: relative;
      overflow: hidden;
    }

    .post-image {
      transition: transform 0.5s ease;
      overflow: hidden;
    }
  `;
  document.head.appendChild(style);

  // ============================================
  // CONSOLA DE BIENVENIDA
  // ============================================
  console.log('%c👋 ¡Hola!', 'font-size: 20px; font-weight: bold; color: #8b5a3c;');
  console.log('%cBienvenido al blog de Mikel Barajas', 'font-size: 14px; color: #6b7280;');
  console.log('%cSi estás interesado en colaborar, contáctame en mikelbarajaswork@gmail.com', 'font-size: 12px; color: #9ca3af;');

})();
