const PRODUCTS = [
    {
        id: "limon",
        name: "Brownie Limón",
        price: 600,
        shortDesc: "Frescura cítrica en cada bocado.",
        longDesc: "El equilibrio perfecto entre la intensidad del chocolate y la frescura del limón real. Una capa de crema de limón artesanal sobre nuestra base húmeda de brownie.",
        image: "https://placehold.co/600x600/6F3E32/FAE2C8?text=Brownie+Limon",
        isLimited: false
    },
    {
        id: "clasico",
        name: "Brownie Clásico",
        price: 600,
        shortDesc: "El original. Intenso y húmedo.",
        longDesc: "Nuestro brownie insignia. Chocolate semi-amargo al 70%, manteca de primera calidad y el punto exacto de cocción para una humedad irresistible.",
        image: "https://placehold.co/600x600/3A1F14/FAE2C8?text=Brownie+Clasico",
        isLimited: false
    },
    {
        id: "con-almendras",
        name: "Brownie con Almendras",
        price: 700,
        shortDesc: "Crocante y delicioso.",
        longDesc: "La versión clásica elevada con almendras tostadas seleccionadas. Un contraste de texturas que te va a enamorar.",
        image: "https://placehold.co/600x600/6F3E32/FAE2C8?text=Con+Almendras",
        isLimited: false
    },
    {
        id: "mokka-brownie",
        name: "Mökka Brownie",
        price: 750,
        shortDesc: "Edición especial con café.",
        longDesc: "Infusionado con café de especialidad. Un sabor profundo y sofisticado para los verdaderos amantes del moka.",
        image: "https://placehold.co/600x600/C77A58/FAE2C8?text=Mokka+Brownie",
        isLimited: true
    },
    {
        id: "marquise",
        name: "Marquise",
        price: 800,
        shortDesc: "Pura decadencia de chocolate.",
        longDesc: "Más que un brownie, una experiencia. Base densa de chocolate, dulce de leche repostero y merengue italiano.",
        image: "https://placehold.co/600x600/3A1F14/FAE2C8?text=Marquise",
        isLimited: false
    },
    {
        id: "budin",
        name: "Budín",
        price: 500,
        shortDesc: "Suave y esponjoso.",
        longDesc: "Budín artesanal de vainilla con chips de chocolate. Ideal para acompañar el café de la tarde.",
        image: "https://placehold.co/600x600/FAE2C8/3A1F14?text=Budin",
        isLimited: false
    },
    {
        id: "chocolate",
        name: "Brownie Chocolate",
        price: 650,
        shortDesc: "Doble chocolate, doble placer.",
        longDesc: "Para los que nunca tienen suficiente. Base de chocolate con chunks de chocolate blanco y con leche.",
        image: "https://placehold.co/600x600/3A1F14/FAE2C8?text=Chocolate",
        isLimited: false
    },
    {
        id: "vainilla",
        name: "Brownie Vainilla",
        price: 600,
        shortDesc: "Un giro rubio al clásico.",
        longDesc: "Blondie de vainilla natural con azúcar mascabo y nueces. Una alternativa suave y aromática.",
        image: "https://placehold.co/600x600/FAE2C8/3A1F14?text=Vainilla",
        isLimited: false
    },
    {
        id: "limon-extra",
        name: "Brownie Limón Extra",
        price: 650,
        shortDesc: "Más limón, más frescura.",
        longDesc: "Para los fanáticos del cítrico. Doble capa de curd de limón y ralladura fresca.",
        image: "https://placehold.co/600x600/6F3E32/FAE2C8?text=Limon+Extra",
        isLimited: false
    },
    {
        id: "marmolado",
        name: "Brownie Marmolado",
        price: 650,
        shortDesc: "Lo mejor de dos mundos.",
        longDesc: "La unión perfecta entre nuestro brownie clásico y una mezcla suave de queso crema y vainilla.",
        image: "https://placehold.co/600x600/3A1F14/FAE2C8?text=Marmolado",
        isLimited: false
    },
    {
        id: "frutas",
        name: "Brownie Frutas",
        price: 700,
        shortDesc: "Con frutos rojos de estación.",
        longDesc: "La acidez de los frutos rojos corta la dulzura del chocolate creando un balance perfecto.",
        image: "https://placehold.co/600x600/C77A58/FAE2C8?text=Frutas",
        isLimited: false
    },
    {
        id: "chips",
        name: "Brownie Chips",
        price: 650,
        shortDesc: "Crocantez extra.",
        longDesc: "Lleno de chips de chocolate que aportan textura y sabor en cada mordida.",
        image: "https://placehold.co/600x600/3A1F14/FAE2C8?text=Chips",
        isLimited: false
    },
    {
        id: "mokka-cookies",
        name: "Mökka Cookies",
        price: 400,
        shortDesc: "Crocantes por fuera, tiernas por dentro.",
        longDesc: "Nuestras cookies estilo New York. Grandes, mantecosas y llenas de sabor.",
        image: "https://placehold.co/600x600/FAE2C8/3A1F14?text=Cookies",
        isLimited: false
    },
    {
        id: "con-chocolate",
        name: "Mökka Cookies con Chocolate",
        price: 450,
        shortDesc: "Cookies recargadas.",
        longDesc: "Nuestras cookies clásicas bañadas en chocolate semi-amargo. El snack definitivo.",
        image: "https://placehold.co/600x600/3A1F14/FAE2C8?text=Cookies+Choco",
        isLimited: false
    }
];

// Export for usage if needed in module environments, but we are using vanilla JS script tags
if (typeof module !== 'undefined') module.exports = PRODUCTS;
