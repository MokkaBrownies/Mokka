/**
 * MÖKKA - Brownies Premium
 * JavaScript Moderno con Mejores Prácticas
 */

// ==========================================
// MENÚ MÓVIL
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Abrir/cerrar menú
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', navToggle.classList.contains('active'));
        });
    }

    // Cerrar menú al hacer click en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Cerrar menú al hacer click fuera
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.navbar')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // Cerrar menú al hacer scroll
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', function() {
        if (Math.abs(window.scrollY - lastScrollY) > 50) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
        lastScrollY = window.scrollY;
    });
});

// ==========================================
// SCROLL SUAVE PARA ENLACES INTERNOS
// ==========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(event) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            event.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ==========================================
// INTERSECTION OBSERVER - Animaciones al scroll
// ==========================================

const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in-view');
            // Desanimar después de que entre a la vista para permitir re-animaciones
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observar elementos con animación - Solo tarjetas que no tienen animación por defecto
document.querySelectorAll('.section-title, .section-text').forEach(element => {
    observer.observe(element);
});

// Las animaciones de productos e ingredientes ya están manejadas por CSS keyframes

// ==========================================
// FUNCIONALIDAD DE BOTONES (Para futura integración)
// ==========================================

const buttonConfigs = {
    heroBtn: {
        id: 'heroBtn',
        action: 'order',
        product: 'general'
    },
    ctaBtn: {
        id: 'ctaBtn',
        action: 'order',
        product: 'general'
    }
};

// Estructura preparada para futura integración con backend/API
function handleButtonClick(button) {
    const config = buttonConfigs[button.id];
    if (config && config.action === 'order') {
        // Aquí se puede integrar con formulario o WhatsApp
        console.log(`Pedido iniciado para: ${config.product}`);
    }
}

// ==========================================
// DETECCIÓN DE NAVEGADOR Y CARACTERÍSTICAS
// ==========================================

// Detectar soporte de scroll suave
if (!CSS.supports('scroll-behavior', 'smooth')) {
    document.documentElement.style.scrollBehavior = 'auto';
}

// ==========================================
// PERFORMANCE - Lazy Loading
// ==========================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ==========================================
// TRACKING BÁSICO (Opcional)
// ==========================================

function trackEvent(eventName, eventData = {}) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    }
    // También loguear en consola para debugging
    console.log(`Event: ${eventName}`, eventData);
}

// Rastrear clics en botones principales
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function() {
        trackEvent('button_click', {
            button_text: this.textContent,
            button_id: this.id
        });
    });
});

// Rastrear navegación
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function() {
        trackEvent('navigation_click', {
            section: this.getAttribute('href'),
            link_text: this.textContent
        });
    });
});

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

// Función para validar emails
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Función para copiar al portapapeles
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        console.log('Texto copiado al portapapeles');
    }).catch(err => {
        console.error('Error al copiar:', err);
    });
}

// ==========================================
// READY STATE
// ==========================================

console.log('Mökka - JavaScript cargado exitosamente ✨🍫');
