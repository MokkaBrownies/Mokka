/**
 * Mökka SPA Logic
 * 
 * CHANGELOG:
 * - Refactored to SPA architecture using Hash Routing.
 * - Implemented dynamic Product Rendering from JSON data.
 * - Added Shopping Cart with LocalStorage persistence.
 * - Created WhatsApp Checkout integration.
 * - Added IntersectionObserver for scroll animations.
 * - Optimized performance with lazy loading and event delegation.
 */

// State
const state = {
    cart: JSON.parse(localStorage.getItem('mokka_cart')) || [],
    products: PRODUCTS // Assumes PRODUCTS is loaded globally from data/products.js
};

// DOM Elements
const app = document.getElementById('app');
const cartSheet = document.getElementById('cart-sheet');
const cartOverlay = document.getElementById('cart-overlay');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total-price');
const cartCountEl = document.getElementById('cart-count');
const checkoutModal = document.getElementById('checkout-modal');

// ==========================================
// ROUTER
// ==========================================

function initRouter() {
    window.addEventListener('hashchange', handleRoute);
    handleRoute(); // Initial load
}

function handleRoute() {
    const hash = window.location.hash;

    if (!hash || hash === '#') {
        renderHome();
        window.scrollTo(0, 0);
    } else if (hash.startsWith('#product/')) {
        const slug = hash.split('#product/')[1];
        renderProductDetail(slug);
        window.scrollTo(0, 0);
    }
}

// ==========================================
// RENDERERS
// ==========================================

function renderHome() {
    app.innerHTML = `
        <header class="hero">
            <div class="hero-content">
                <h1>Mökka</h1>
                <p>Brownies de verdad. Intensos, húmedos y artesanales.</p>
                <div class="hero-actions">
                    <button class="btn btn-primary" onclick="document.getElementById('products-grid').scrollIntoView({behavior: 'smooth'})">Encargá el tuyo</button>
                    <button class="btn btn-secondary" onclick="document.getElementById('products-grid').scrollIntoView({behavior: 'smooth'})">Ver productos</button>
                </div>
            </div>
        </header>

        <main class="container products-section">
            <div id="products-grid" class="products-grid">
                ${state.products.map(product => createProductCard(product)).join('')}
            </div>
        </main>
        
        <footer style="text-align: center; padding: 40px; color: var(--text-light); font-size: 0.9rem;">
            <p>&copy; 2025 Mökka. Hecho con ❤️ y 🍫</p>
        </footer>
    `;
}

function createProductCard(product) {
    return `
        <article class="product-card">
            ${product.isLimited ? '<span class="badge-limited">Edición Limitada</span>' : ''}
            <div class="card-image" onclick="window.location.hash='#product/${product.id}'" style="cursor: pointer;">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="card-content">
                <h3 class="card-title">${product.name}</h3>
                <p class="card-desc">${product.shortDesc}</p>
                <div class="card-footer">
                    <span class="card-price">$${product.price}</span>
                    <div class="card-actions">
                        <button class="btn-mini" onclick="cart.add('${product.id}')" aria-label="Agregar al carrito">+</button>
                        <button class="btn-mini" onclick="window.location.hash='#product/${product.id}'" aria-label="Ver detalle">></button>
                    </div>
                </div>
            </div>
        </article>
    `;
}

function renderProductDetail(slug) {
    const product = state.products.find(p => p.id === slug);

    if (!product) {
        app.innerHTML = '<div class="container" style="padding: 100px; text-align: center;"><h1>Producto no encontrado</h1><a href="#" class="btn btn-primary">Volver al inicio</a></div>';
        return;
    }

    app.innerHTML = `
        <div class="product-detail-view">
            <div class="container">
                <button class="btn-text" onclick="window.history.back()" style="margin-bottom: 20px; display: flex; align-items: center; gap: 5px;">
                    ← Volver
                </button>
                
                <div class="detail-container">
                    <div class="detail-image">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="detail-info">
                        ${product.isLimited ? '<span class="badge-limited" style="position:relative; top:0; right:0; display:inline-block; margin-bottom:10px;">Edición Limitada</span>' : ''}
                        <h1>${product.name}</h1>
                        <span class="detail-price">$${product.price}</span>
                        <p class="detail-desc">${product.longDesc}</p>
                        
                        <div class="detail-actions">
                            <div class="qty-selector">
                                <button class="qty-btn" onclick="updateDetailQty(-1)">-</button>
                                <span id="detail-qty" class="qty-val">1</span>
                                <button class="qty-btn" onclick="updateDetailQty(1)">+</button>
                            </div>
                            <button class="btn btn-primary" onclick="addToCartFromDetail('${product.id}')">
                                Agregar al carrito
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

let currentDetailQty = 1;
function updateDetailQty(change) {
    const newQty = currentDetailQty + change;
    if (newQty >= 1) {
        currentDetailQty = newQty;
        document.getElementById('detail-qty').innerText = currentDetailQty;
    }
}

function addToCartFromDetail(id) {
    cart.add(id, currentDetailQty);
    currentDetailQty = 1; // Reset
    document.getElementById('detail-qty').innerText = 1;
    cart.open();
}

// ==========================================
// CART LOGIC
// ==========================================

const cart = {
    add: (id, qty = 1) => {
        const existingItem = state.cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.qty += qty;
        } else {
            const product = state.products.find(p => p.id === id);
            state.cart.push({ ...product, qty });
        }
        cart.save();
        cart.render();
        cart.animateFab();
    },

    remove: (id) => {
        state.cart = state.cart.filter(item => item.id !== id);
        cart.save();
        cart.render();
    },

    updateQty: (id, change) => {
        const item = state.cart.find(item => item.id === id);
        if (item) {
            item.qty += change;
            if (item.qty <= 0) {
                cart.remove(id);
            } else {
                cart.save();
                cart.render();
            }
        }
    },

    save: () => {
        localStorage.setItem('mokka_cart', JSON.stringify(state.cart));
        cart.updateCount();
    },

    render: () => {
        if (state.cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart-msg">
                    <p>Tu carrito está vacío 😢</p>
                    <button class="btn-text" onclick="cart.close(); window.location.hash=''">Ver productos</button>
                </div>
            `;
            document.getElementById('checkout-btn').disabled = true;
            cartTotalEl.innerText = '$0';
        } else {
            let total = 0;
            cartItemsContainer.innerHTML = state.cart.map(item => {
                const subtotal = item.price * item.qty;
                total += subtotal;
                return `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="cart-item-info">
                            <div class="cart-item-title">${item.name}</div>
                            <div class="cart-item-price">$${item.price} x ${item.qty} = $${subtotal}</div>
                            <div class="qty-selector" style="width: fit-content; margin-top: 5px; padding: 2px 8px;">
                                <button class="qty-btn" style="width: 24px; height: 24px;" onclick="cart.updateQty('${item.id}', -1)">-</button>
                                <span class="qty-val">${item.qty}</span>
                                <button class="qty-btn" style="width: 24px; height: 24px;" onclick="cart.updateQty('${item.id}', 1)">+</button>
                            </div>
                        </div>
                        <button class="btn-icon" onclick="cart.remove('${item.id}')" style="align-self: flex-start;">✕</button>
                    </div>
                `;
            }).join('');

            cartTotalEl.innerText = `$${total}`;
            document.getElementById('checkout-btn').disabled = false;
        }
    },

    updateCount: () => {
        const count = state.cart.reduce((acc, item) => acc + item.qty, 0);
        cartCountEl.innerText = count;
        if (count > 0) {
            cartCountEl.classList.remove('hidden');
        } else {
            cartCountEl.classList.add('hidden');
        }
    },

    open: () => {
        cartSheet.classList.remove('hidden');
        cartOverlay.classList.remove('hidden');
        cart.render();
    },

    close: () => {
        cartSheet.classList.add('hidden');
        cartOverlay.classList.add('hidden');
    },

    animateFab: () => {
        const fab = document.getElementById('cart-fab');
        fab.style.transform = 'scale(1.2)';
        setTimeout(() => fab.style.transform = 'scale(1)', 200);
    }
};

// ==========================================
// CHECKOUT LOGIC
// ==========================================

const checkout = {
    open: () => {
        cart.close();
        checkoutModal.classList.remove('hidden');
        checkout.renderSummary();
    },

    close: () => {
        checkoutModal.classList.add('hidden');
    },

    renderSummary: () => {
        const total = state.cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
        const summaryHtml = `
            <div style="background: var(--crema-light); padding: 15px; border-radius: 12px; margin-bottom: 20px;">
                <h4>Resumen del pedido</h4>
                <ul style="margin-top: 10px; font-size: 0.9rem;">
                    ${state.cart.map(item => `<li>${item.qty}x ${item.name}</li>`).join('')}
                </ul>
                <div style="margin-top: 10px; font-weight: 700; text-align: right;">Total: $${total}</div>
            </div>
        `;
        document.getElementById('checkout-summary').innerHTML = summaryHtml;
    },

    submit: (e) => {
        e.preventDefault();

        const formData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            email: document.getElementById('email').value,
            payment: document.querySelector('input[name="payment"]:checked').value,
            notes: document.getElementById('notes').value
        };

        const total = state.cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

        // Construct WhatsApp Message
        let message = `*Pedido Mökka* 🍫\n\n`;
        state.cart.forEach(item => {
            message += `${item.qty}x ${item.name} - $${item.price * item.qty}\n`;
        });
        message += `\n*Total: $${total}*\n\n`;

        message += `*Datos del Cliente:*\n`;
        message += `Nombre: ${formData.name}\n`;
        message += `Teléfono: ${formData.phone}\n`;
        message += `Dirección: ${formData.address}\n`;
        message += `Email: ${formData.email}\n`;
        message += `Pago: ${formData.payment}\n`;
        if (formData.notes) message += `Observaciones: ${formData.notes}\n`;

        const encodedMessage = encodeURIComponent(message);
        const waNumber = '542622675384'; // Configurable

        window.open(`https://wa.me/${waNumber}?text=${encodedMessage}`, '_blank');

        // Optional: Clear cart after successful order
        // state.cart = [];
        // cart.save();
        // checkout.close();
        // window.location.reload();
    }
};

// ==========================================
// EVENT LISTENERS
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    initRouter();
    cart.updateCount();

    // Cart UI Events
    document.getElementById('cart-fab').addEventListener('click', cart.open);
    document.getElementById('close-cart').addEventListener('click', cart.close);
    cartOverlay.addEventListener('click', cart.close);
    document.getElementById('checkout-btn').addEventListener('click', checkout.open);

    // Checkout UI Events
    document.getElementById('close-checkout').addEventListener('click', checkout.close);
    document.getElementById('checkout-form').addEventListener('submit', checkout.submit);

    // Initialize Scroll Observer
    initScrollObserver();
});

function initScrollObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements after they are rendered
    // We need to re-attach observer when route changes or content renders
    const observeElements = () => {
        document.querySelectorAll('.product-card, .hero-content, .detail-container').forEach(el => {
            el.classList.add('fade-in-scroll');
            observer.observe(el);
        });
    };

    // Hook into renderers
    const originalRenderHome = renderHome;
    renderHome = () => {
        originalRenderHome();
        observeElements();
    };

    const originalRenderDetail = renderProductDetail;
    renderProductDetail = (slug) => {
        originalRenderDetail(slug);
        observeElements();
    };

    // Initial observation
    observeElements();
}
