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
 * - Added Custom Product Builder & Enhanced Animations.
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
    // Group products by category
    const categories = {};
    state.products.forEach(product => {
        if (!categories[product.category]) {
            categories[product.category] = [];
        }
        categories[product.category].push(product);
    });

    const productsHtml = Object.keys(categories).map(category => `
        <section class="category-section" style="margin-bottom: 40px;">
            <h2 style="margin-bottom: 20px; padding-left: 10px; color: var(--moka-dark); font-size: 2rem;">${category}</h2>
            <div class="products-grid">
                ${categories[category].map(product => createProductCard(product)).join('')}
            </div>
        </section>
    `).join('');

    app.innerHTML = `
        <header class="hero">
            <div class="hero-content">
                <h1>Mökka</h1>
                <p>Brownies de verdad. Intensos, húmedos y artesanales.</p>
                <div class="hero-actions">
                    <button class="btn btn-primary" onclick="window.open('https://wa.me/542622675384?text=Hola%20Mökka!%20Estuve%20viendo%20su%20página%20y%20quisiera%20hacer%20una%20consulta%20😊', '_blank')">Contactanos</button>
                    <button class="btn btn-secondary" onclick="document.getElementById('products-catalog').scrollIntoView({behavior: 'smooth'})">Ver productos</button>
                </div>
            </div>
        </header>

        <!-- What is Mökka Section -->
        <section class="about-section">
            <div class="container">
                <div style="text-align: center; max-width: 700px; margin: 0 auto 40px;">
                    <h2 style="font-size: 2.5rem; margin-bottom: 15px; color: var(--moka-dark);">¿Qué es Mökka?</h2>
                    <p style="font-size: 1.1rem; color: var(--text-light);">Somos pasión por el chocolate. Elaboramos productos artesanales con ingredientes de primera calidad, sin conservantes ni premezclas.</p>
                </div>
                <div class="about-grid">
                    <div class="feature-card">
                        <span class="feature-icon">🍫</span>
                        <h3 class="feature-title">Chocolate Real</h3>
                        <p>Usamos chocolate semi-amargo al 70% y cacao puro. Nada de saborizantes artificiales.</p>
                    </div>
                    <div class="feature-card">
                        <span class="feature-icon">🧈</span>
                        <h3 class="feature-title">100% Artesanal</h3>
                        <p>Batimos, horneamos y decoramos cada pedido a mano, con la dedicación que te mereces.</p>
                    </div>
                    <div class="feature-card">
                        <span class="feature-icon">🚀</span>
                        <h3 class="feature-title">Siempre Fresco</h3>
                        <p>Horneamos bajo pedido para asegurar que recibas tu producto con la humedad y textura perfecta.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Cómo lo hacemos Section (Restored) -->
        <section class="process-section">
            <div class="container">
                <div class="section-header">
                    <h2>¿Cómo lo hacemos?</h2>
                    <p>El secreto está en los detalles y en la paciencia.</p>
                </div>
                <div class="process-grid">
                    <div class="process-card glass-effect">
                        <div class="process-step">1</div>
                        <h3>Selección</h3>
                        <p>Elegimos el mejor cacao y manteca de primera calidad.</p>
                    </div>
                    <div class="process-card glass-effect">
                        <div class="process-step">2</div>
                        <h3>Batido</h3>
                        <p>Técnica envolvente para lograr esa costra crocante única.</p>
                    </div>
                    <div class="process-card glass-effect">
                        <div class="process-step">3</div>
                        <h3>Horneado</h3>
                        <p>Tiempo exacto para garantizar un corazón húmedo.</p>
                    </div>
                </div>
            </div>
        </section>

        <main id="products-catalog" class="container products-section">
            ${productsHtml}
        </main>

        <!-- CTA Section (Restored) -->
        <section class="cta-section">
            <div class="container">
                <div class="cta-content glass-effect">
                    <h2>¿Listo para probar Mökka?</h2>
                    <p>Hacé tu pedido ahora y recibilo en la puerta de tu casa.</p>
                    <button class="btn btn-primary btn-lg" onclick="window.open('https://wa.me/542622675384?text=Hola%20Mökka!%20Quiero%20hacer%20un%20pedido%20🍫', '_blank')">
                        Contactar por WhatsApp
                    </button>
                </div>
            </div>
        </section>
        
        <footer style="text-align: center; padding: 40px; color: var(--text-light); font-size: 0.9rem;">
            <p>&copy; 2025 Mökka. Hecho con ❤️ y 🍫</p>
        </footer>
    `;
}

function createProductCard(product) {
    // Handle emoji vs image URL
    const isUrl = product.image.startsWith('http') || product.image.startsWith('data:');
    const imageHtml = isUrl
        ? `<img src="${product.image}" alt="${product.name}" loading="lazy">`
        : `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 6rem; background: var(--crema);">${product.image}</div>`;

    const badgeHtml = product.isCustom
        ? '<span class="badge-personal">A tu medida</span>'
        : (product.isLimited ? '<span class="badge-limited">Edición Limitada</span>' : '');

    return `
        <article class="product-card">
            ${badgeHtml}
            <div class="card-image" onclick="window.location.hash='#product/${product.id}'" style="cursor: pointer;">
                ${imageHtml}
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

    // Check if custom product
    if (product.isCustom) {
        renderCustomBuilder(product);
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
                        ${product.image.startsWith('http') || product.image.startsWith('data:')
            ? `<img src="${product.image}" alt="${product.name}">`
            : `<div style="width: 100%; aspect-ratio: 1; display: flex; align-items: center; justify-content: center; font-size: 10rem; background: var(--crema); border-radius: 20px;">${product.image}</div>`
        }
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

// Custom Builder Logic
let customOptions = {
    base: 'clasico',
    chocolate: 'semi',
    sugar: true,
    toppings: [],
    portions: 4
};
let currentCustomProduct = null;

function renderCustomBuilder(product) {
    currentCustomProduct = product;
    // Reset options
    customOptions = {
        base: 'clasico',
        chocolate: 'semi',
        sugar: true,
        toppings: [],
        portions: 4
    };

    app.innerHTML = `
        <div class="product-detail-view">
            <div class="container">
                <button class="btn-text" onclick="window.history.back()" style="margin-bottom: 20px; display: flex; align-items: center; gap: 5px;">
                    ← Volver
                </button>
                
                <div class="detail-container">
                    <div class="detail-info" style="grid-column: 1 / -1;">
                        <span class="badge-personal" style="position:relative; top:0; right:0; display:inline-block; margin-bottom:10px;">A tu medida</span>
                        <h1>${product.name}</h1>
                        <p class="detail-desc">${product.longDesc}</p>
                        
                        <div class="custom-builder">
                            <!-- Base -->
                            <div class="custom-section">
                                <h3>1. Elegí la Base</h3>
                                <div class="options-grid">
                                    ${['Clásico', 'Vainilla', 'Limón', 'Marmolado', 'Mökka'].map(opt => {
        const val = opt.toLowerCase().replace('á', 'a').replace('ó', 'o').replace('ö', 'o');
        return `
                                        <label class="option-card">
                                            <input type="radio" name="base" value="${val}" ${val === 'clasico' ? 'checked' : ''} onchange="updateCustomOption('base', '${val}')">
                                            <span class="option-label">${opt}</span>
                                        </label>`;
    }).join('')}
                                </div>
                            </div>

                            <!-- Chocolate -->
                            <div class="custom-section">
                                <h3>2. Intensidad de Chocolate</h3>
                                <div class="options-grid">
                                    ${['Sin chocolate', 'Semi-amargo', 'Amargo'].map(opt => {
        const val = opt.toLowerCase().replace(' ', '-');
        return `
                                        <label class="option-card">
                                            <input type="radio" name="chocolate" value="${val}" ${val === 'semi-amargo' ? 'checked' : ''} onchange="updateCustomOption('chocolate', '${val}')">
                                            <span class="option-label">${opt}</span>
                                        </label>`;
    }).join('')}
                                </div>
                            </div>

                            <!-- Toppings -->
                            <div class="custom-section">
                                <h3>3. Toppings (+$100 c/u)</h3>
                                <div class="options-grid">
                                    ${['Nueces', 'Almendras', 'Chips Choco', 'Dulce de Leche', 'Frutillas', 'Crema'].map(opt => {
        const val = opt.toLowerCase().replace(/ /g, '-');
        return `
                                        <label class="option-card">
                                            <input type="checkbox" name="toppings" value="${val}" onchange="updateCustomOption('toppings', '${val}', this.checked)">
                                            <span class="option-label">${opt}</span>
                                        </label>`;
    }).join('')}
                                </div>
                            </div>

                            <!-- Portions -->
                            <div class="custom-section">
                                <h3>4. Tamaño / Porciones</h3>
                                <div class="options-grid">
                                    ${[1, 4, 8, 12].map(num => `
                                        <label class="option-card">
                                            <input type="radio" name="portions" value="${num}" ${num === 4 ? 'checked' : ''} onchange="updateCustomOption('portions', ${num})">
                                            <span class="option-label">${num} porción${num > 1 ? 'es' : ''}</span>
                                        </label>
                                    `).join('')}
                                </div>
                            </div>

                            <!-- Summary & Add -->
                            <div class="custom-summary-preview">
                                <h4>Resumen de tu creación:</h4>
                                <div id="custom-summary-text" class="custom-summary-list">
                                    Base Clásico, Chocolate Semi-amargo, 4 porciones.
                                </div>
                                <div class="custom-total-price" id="custom-total-display">
                                    $${calculateCustomPrice()}
                                </div>
                            </div>

                            <button class="btn btn-primary full-width" style="margin-top: 20px;" onclick="addCustomToCart()">
                                Agregar Creación al Carrito
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function updateCustomOption(key, value, isChecked) {
    if (key === 'toppings') {
        if (isChecked) {
            // Validation: Chips requires chocolate (unless base is chocolatey, but let's keep simple)
            if (value === 'chips-choco' && customOptions.chocolate === 'sin-chocolate') {
                showToast('⚠️ Los chips requieren una base de chocolate o cobertura.');
                // Revert checkbox visually would require DOM access, simplified here by just not adding
                document.querySelector('input[value="chips-choco"]').checked = false;
                return;
            }
            customOptions.toppings.push(value);
        } else {
            customOptions.toppings = customOptions.toppings.filter(t => t !== value);
        }
    } else {
        customOptions[key] = value;

        // Validation: If switching to 'sin-chocolate', remove chips if present
        if (key === 'chocolate' && value === 'sin-chocolate') {
            if (customOptions.toppings.includes('chips-choco')) {
                customOptions.toppings = customOptions.toppings.filter(t => t !== 'chips-choco');
                const chipsInput = document.querySelector('input[value="chips-choco"]');
                if (chipsInput) chipsInput.checked = false;
                showToast('ℹ️ Se quitaron los chips al elegir "Sin chocolate"');
            }
            // Disable chips input
            const chipsInput = document.querySelector('input[value="chips-choco"]');
            if (chipsInput) {
                chipsInput.disabled = true;
                chipsInput.parentElement.querySelector('.option-label').innerText = 'Chips (No disponible)';
            }
        } else if (key === 'chocolate' && value !== 'sin-chocolate') {
            // Re-enable chips
            const chipsInput = document.querySelector('input[value="chips-choco"]');
            if (chipsInput) {
                chipsInput.disabled = false;
                chipsInput.parentElement.querySelector('.option-label').innerText = 'Chips Choco';
            }
        }
    }
    updateCustomSummary();
}

function calculateCustomPrice() {
    // Base price per portion logic (simplified)
    // Base product price is for 1 portion? Or base price is generic?
    // Let's say Product Price (950) is base for 1 unit of "Mimo" which is 4 portions default?
    // Let's redefine: Product Price is per portion base.

    const basePrice = currentCustomProduct.price; // 950
    const toppingPrice = 100;

    // Price formula: (Base + Toppings) * Portions multiplier? 
    // Or just Base + Toppings * Portions?
    // Let's assume 950 is the price for a standard 4-portion block.
    // So 1 portion = 950/4 ~ 240.

    // Let's use a simpler model:
    // Base Price (950) includes 4 portions standard configuration.
    // Portions factor: 1=0.3x, 4=1x, 8=1.8x, 12=2.5x

    const portionFactors = { 1: 0.3, 4: 1, 8: 1.9, 12: 2.7 };
    const factor = portionFactors[customOptions.portions];

    let total = basePrice * factor;

    // Add toppings
    total += (customOptions.toppings.length * toppingPrice * (customOptions.portions / 4));

    return Math.round(total);
}

function updateCustomSummary() {
    const summary = [
        `Base ${capitalize(customOptions.base)}`,
        `Chocolate ${capitalize(customOptions.chocolate)}`,
        customOptions.toppings.length ? `Toppings: ${customOptions.toppings.map(t => capitalize(t.replace('-', ' '))).join(', ')}` : 'Sin toppings',
        `${customOptions.portions} porciones`
    ].join(' • ');

    document.getElementById('custom-summary-text').innerText = summary;
    document.getElementById('custom-total-display').innerText = `$${calculateCustomPrice()}`;
}

function addCustomToCart() {
    const finalPrice = calculateCustomPrice();
    const customItem = {
        ...currentCustomProduct,
        id: `custom-${Date.now()}`, // Unique ID for every custom creation
        price: finalPrice,
        custom: { ...customOptions },
        isCustomItem: true
    };

    cart.addCustom(customItem);
    showToast('✨ ¡Creación agregada al carrito!');
    window.history.back();
}

function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
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
        // Standard add
        const existingItem = state.cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.qty += qty;
        } else {
            const product = state.products.find(p => p.id === id);
            // If trying to add a custom product via standard button, redirect to detail
            if (product.isCustom) {
                window.location.hash = `#product/${product.id}`;
                return;
            }
            state.cart.push({ ...product, qty });
        }
        cart.save();
        cart.render();
        cart.animateFab();
        showToast('Agregado al carrito');
    },

    addCustom: (customItem) => {
        state.cart.push({ ...customItem, qty: 1 });
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
            cartItemsContainer.innerHTML = state.cart.map((item, index) => {
                const subtotal = item.price * item.qty;
                total += subtotal;

                // Custom details rendering
                let customDetailsHtml = '';
                if (item.custom) {
                    customDetailsHtml = `
                        <div class="cart-item-custom-details">
                            ${capitalize(item.custom.base)} • ${capitalize(item.custom.chocolate)} <br>
                            ${item.custom.toppings.length ? item.custom.toppings.map(t => capitalize(t)).join(', ') : 'Sin toppings'} <br>
                            ${item.custom.portions} porciones
                        </div>
                    `;
                }

                // Stagger animation delay
                const delay = index * 40;

                return `
                    <div class="cart-item" style="transition-delay: ${delay}ms">
                        ${item.image.startsWith('http') || item.image.startsWith('data:')
                        ? `<img src="${item.image}" alt="${item.name}">`
                        : `<div style="width: 70px; height: 70px; border-radius: 12px; background: var(--crema); display: flex; align-items: center; justify-content: center; font-size: 2rem;">${item.image}</div>`
                    }
                        <div class="cart-item-info">
                            <div class="cart-item-title">${item.name}</div>
                            <div class="cart-item-price">$${item.price} x ${item.qty} = $${subtotal}</div>
                            ${customDetailsHtml}
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

            // FIX: If cart is already open, ensure items are visible immediately
            if (cartSheet.classList.contains('open')) {
                requestAnimationFrame(() => {
                    document.querySelectorAll('.cart-item').forEach(item => item.classList.add('in-view'));
                });
            }
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

        // Animation sequence
        requestAnimationFrame(() => {
            cartSheet.classList.add('open');
            cartSheet.classList.add('overshoot');
            cartOverlay.classList.add('visible');

            // Stagger items
            const items = document.querySelectorAll('.cart-item');
            items.forEach(item => item.classList.add('in-view'));

            // Animate checkout button
            document.getElementById('checkout-btn').classList.add('in-view');

            // Remove overshoot after animation
            setTimeout(() => {
                cartSheet.classList.remove('overshoot');
            }, 300);
        });

        cart.render();
    },

    close: () => {
        cartSheet.classList.remove('open');
        cartOverlay.classList.remove('visible');

        // Wait for transition to finish before hiding
        setTimeout(() => {
            cartSheet.classList.add('hidden');
            cartOverlay.classList.add('hidden');
            document.querySelectorAll('.cart-item').forEach(i => i.classList.remove('in-view'));
            document.getElementById('checkout-btn').classList.remove('in-view');
        }, 300);
    },

    animateFab: () => {
        const fab = document.getElementById('cart-fab');
        fab.classList.add('bounce');
        setTimeout(() => fab.classList.remove('bounce'), 500);

        // Animate badge
        const badge = document.getElementById('cart-count');
        if (badge && !badge.classList.contains('hidden')) {
            badge.style.animation = 'none';
            setTimeout(() => {
                badge.style.animation = 'scaleIn 0.3s ease-out';
            }, 10);
        }
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
            message += `- ${item.name} x${item.qty} — $${item.price * item.qty}\n`;
            if (item.custom) {
                message += `  _Personalización:_\n`;
                message += `    Base: ${capitalize(item.custom.base)}\n`;
                message += `    Chocolate: ${capitalize(item.custom.chocolate)}\n`;
                if (item.custom.toppings.length) {
                    message += `    Toppings: ${item.custom.toppings.map(t => capitalize(t)).join(', ')}\n`;
                }
                message += `    Porciones: ${item.custom.portions}\n`;
            }
        });
        message += `\n*Total: $${total}*\n\n`;

        message += `*Datos:*\n`;
        message += `Nombre: ${formData.name}\n`;
        message += `Tel: ${formData.phone}\n`;
        message += `Email: ${formData.email}\n`;
        message += `Dirección: ${formData.address}\n`;
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
        document.querySelectorAll('.product-card, .hero-content, .detail-container, .feature-card').forEach(el => {
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

// Toast Notification System
function showToast(message) {
    const container = document.getElementById('toast-container') || createToastContainer();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <span>${message}</span>
        <button class="toast-btn" onclick="cart.open()">Ver carrito</button>
    `;

    container.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => toast.classList.add('visible'));

    // Auto dismiss
    setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function createToastContainer() {
    const div = document.createElement('div');
    div.id = 'toast-container';
    div.className = 'toast-container';
    document.body.appendChild(div);
    return div;
}
