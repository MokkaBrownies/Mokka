const PRODUCTS = [
    // Brownies
    {
        id: "brownie-limon",
        name: "Brownie Limón",
        category: "Brownies",
        price: 600,
        shortDesc: "Frescura cítrica.",
        longDesc: "El equilibrio perfecto entre la intensidad del chocolate y la frescura del limón real.",
        image: "🍫", // Placeholder
        isLimited: false
    },
    {
        id: "brownie-clasico",
        name: "Brownie Clásico",
        category: "Brownies",
        price: 600,
        shortDesc: "Intenso y húmedo.",
        longDesc: "Nuestro brownie insignia. Chocolate semi-amargo al 70% y el punto exacto de humedad.",
        image: "🍫",
        isLimited: false
    },
    {
        id: "brownie-almendras",
        name: "Brownie con Almendras",
        category: "Brownies",
        price: 700,
        shortDesc: "Crocante y delicioso.",
        longDesc: "La versión clásica elevada con almendras tostadas seleccionadas.",
        image: "🍫",
        isLimited: false
    },
    {
        id: "mokka-brownie",
        name: "Mökka Brownie",
        category: "Brownies",
        price: 750,
        shortDesc: "Edición especial con café.",
        longDesc: "Infusionado con café de especialidad. Un sabor profundo y sofisticado.",
        image: "🍫",
        isLimited: true
    },

    // Marquise
    {
        id: "marquise",
        name: "Marquise",
        category: "Marquise",
        price: 800,
        shortDesc: "Pura decadencia.",
        longDesc: "Base densa de chocolate, dulce de leche repostero y merengue italiano.",
        image: "🍰",
        isLimited: false
    },

    // Budines
    {
        id: "budin-chocolate",
        name: "Budín de Chocolate",
        category: "Budines",
        price: 500,
        shortDesc: "Intenso sabor.",
        longDesc: "Budín húmedo de chocolate con trozos de chocolate real.",
        image: "🍞",
        isLimited: false
    },
    {
        id: "budin-vainilla",
        name: "Budín de Vainilla",
        category: "Budines",
        price: 500,
        shortDesc: "Clásico y suave.",
        longDesc: "Esponjoso budín de vainilla natural.",
        image: "🍞",
        isLimited: false
    },
    {
        id: "budin-limon",
        name: "Budín de Limón",
        category: "Budines",
        price: 500,
        shortDesc: "Fresco y aromático.",
        longDesc: "Con ralladura y jugo de limones frescos.",
        image: "🍞",
        isLimited: false
    },
    {
        id: "budin-marmolado",
        name: "Budín Marmolado",
        category: "Budines",
        price: 500,
        shortDesc: "Vainilla y chocolate.",
        longDesc: "La combinación perfecta para los indecisos.",
        image: "🍞",
        isLimited: false
    },
    {
        id: "budin-frutas",
        name: "Budín con Frutas",
        category: "Budines",
        price: 550,
        shortDesc: "Con frutas abrillantadas.",
        longDesc: "Estilo tradicional con mix de frutas seleccionadas.",
        image: "🍞",
        isLimited: false
    },
    {
        id: "budin-chips",
        name: "Budín con Chips",
        category: "Budines",
        price: 550,
        shortDesc: "Con chips de chocolate.",
        longDesc: "Masa de vainilla sembrada con abundantes chips de chocolate.",
        image: "🍞",
        isLimited: false
    },

    // Mökka Cookies
    {
        id: "cookie-chocolate",
        name: "Cookie con Chocolate",
        category: "Mökka Cookies",
        price: 400,
        shortDesc: "Estilo New York.",
        longDesc: "Cookie gigante con trozos de chocolate. Crocante por fuera, tierna por dentro.",
        image: "🍪",
        isLimited: false
    }
];

// Export for usage if needed in module environments, but we are using vanilla JS script tags
if (typeof module !== 'undefined') module.exports = PRODUCTS;
