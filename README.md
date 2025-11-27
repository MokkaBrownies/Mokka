# Mökka - Brownies Premium (SPA Refactor)

Refactorización del sitio de Mökka a una Single Page Application (SPA) moderna, responsiva y optimizada.

## Características

- **SPA (Single Page Application)**: Navegación fluida sin recargas usando Hash Routing (`/#product/slug`).
- **Diseño Premium**: Paleta de colores Mökka, tipografía cuidada y animaciones sutiles.
- **Carrito Bottom-Sheet**: Carrito de compras accesible y persistente (localStorage).
- **Checkout WhatsApp**: Generación automática de mensajes de pedido para WhatsApp.
- **Performance**: Carga diferida de imágenes, animaciones optimizadas y sin dependencias pesadas.

## Estructura del Proyecto

```
/
├── index.html          # Shell de la aplicación
├── styles/
│   └── main.css        # Estilos globales y componentes
├── scripts/
│   └── app.js          # Lógica principal (Router, Cart, Renderers)
├── data/
│   └── products.js     # Base de datos de productos (JSON array)
├── assets/             # Imágenes y recursos estáticos
└── fonts/              # Archivos de fuentes (Glicker.woff2)
```

## Cómo Probar

1.  **Abrir el proyecto**: Simplemente abre el archivo `index.html` en tu navegador. No requiere servidor (aunque se recomienda Live Server para mejor experiencia).
2.  **Navegación**:
    -   Haz scroll para ver el listado de productos.
    -   Haz clic en un producto para ver su detalle.
    -   Usa el botón "Atrás" del navegador o el botón "Volver" en la UI.
3.  **Carrito**:
    -   Agrega productos desde el home (+) o desde el detalle.
    -   Abre el carrito con el botón flotante (FAB) o al agregar un producto.
    -   Modifica cantidades o elimina items.
4.  **Checkout**:
    -   Haz clic en "Finalizar compra".
    -   Completa el formulario (validación básica incluida).
    -   Haz clic en "Confirmar pedido" para abrir WhatsApp con el mensaje pre-llenado.

## Configuración

-   **Productos**: Editar `data/products.js` para agregar o modificar productos.
-   **WhatsApp**: El número de destino está configurado en `scripts/app.js` (variable `waNumber`).

## Notas de Desarrollo

-   **Accesibilidad**: Se usaron etiquetas semánticas, atributos ARIA y contrastes adecuados.
-   **Performance**: Uso de `IntersectionObserver` para animaciones al hacer scroll y `loading="lazy"` en imágenes.
-   **Estilos**: CSS puro con variables para fácil mantenimiento. Diseño Mobile-First.
