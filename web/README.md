# MECHA Tattoo — Web

Primera versión funcional de la web de Mecha (Ángel Sánchez), tatuador en Profano Tattoo, Murcia.

## Stack

**HTML + CSS + JavaScript vanilla, sin build ni dependencias.**

Motivos: la web es una landing de portfolio con contenido estático; un framework no aporta nada aquí y sí añadiría peso, mantenimiento y fricción de despliegue. Resultado: carga rápida, SEO directo y publicable en cualquier hosting estático (Netlify, Vercel, Cloudflare Pages, GitHub Pages o un hosting clásico) arrastrando la carpeta `web/`.

## Cómo ejecutar en local

Cualquier servidor estático sirve. Con Node instalado:

```
npx serve web
```

y abrir la URL que indique (p. ej. `http://localhost:3000`). También funciona abriendo `web/index.html` directamente en el navegador (todo es relativo).

## Estructura

```
web/
├── index.html          Landing completa (one-page con anclas)
├── css/styles.css      Sistema visual completo (variables de marca arriba del todo)
├── js/main.js          Menú móvil, filtros de portfolio, lightbox, reveal on scroll
└── assets/img/
    ├── logo-demonio.png        Logo extraído de la guía de branding (transparente, crema)
    ├── favicon-32.png / favicon-256.png
    ├── hero.jpg / og-cover.jpg
    ├── sobre-mecha.jpg
    └── portfolio/              18 piezas optimizadas (≤1400px, JPEG q82)
```

## Decisiones de diseño

- **Arquitectura one-page** con anclas (`#portfolio`, `#flash`, `#proceso`, `#sobre`, `#contacto`): el volumen de contenido no justifica multipágina y la landing única maximiza conversión a WhatsApp/Instagram.
- **Paleta**: extraída de `branding/guia-visual/paleta de colores, fuentes.JPG` → `#4B0C00` (rojo de marca), `#001014` (negro), `#EFC29A` (crema), `#DCDCDC` (gris). Se añadió un acento cálido derivado (`#C2521F`) para textos pequeños que necesitan contraste sobre negro.
- **Tipografías de la guía**: Yanone Kaffeesatz (titulares) + Montserrat (cuerpo), vía Google Fonts.
- **Logo**: recortado de la guía de branding con máscara de transparencia (script en `tools/extract-logo.ps1`).
- **Portfolio**: curación propia desde `portfolio-original/` (la carpeta `portfolio-seleccionado/` estaba vacía). La selección copiada por categorías está en `portfolio-seleccionado/` para validación del cliente. Originales intactos.
- **Flash**: no hay láminas de flash en el archivo de imágenes, así que la sección Flash es un bloque destacado en rojo de marca con CTA a Instagram (donde se publican). Cuando haya flash escaneados, se puede convertir en galería propia.
- **Categorías del portfolio en la web**: Orgánico, Ornamental, Ilustrativo, Black & gray y Proceso. Tribal se menciona como estilo pero no tiene filtro propio porque no hay piezas claramente tribales en el archivo actual.
- **WhatsApp con mensaje precargado** que pide idea + zona del cuerpo + flash/personalizado → contactos cualificados desde el primer mensaje.
- **Animación de scroll** (vanilla, solo `transform`/`opacity`, throttled con `requestAnimationFrame`): "mecha encendida" como barra de progreso bajo el header, parallax del hero con fundido del texto, manifiesto que se enciende palabra a palabra, dos cintas marquee con texto outline ligadas al scroll en direcciones opuestas, reveals escalonados en tarjetas/galería/pasos/contacto y header que se oculta al bajar y reaparece al subir. Todo se desactiva con `prefers-reduced-motion`.
- Accesibilidad: contraste AA sobre fondo oscuro, skip-link, focus visible, `prefers-reduced-motion`, targets táctiles ≥44px, alt descriptivo en todas las imágenes.
- SEO básico: title/description, Open Graph, JSON-LD (`Person`), HTML semántico, lazy-loading y dimensiones declaradas en imágenes.

## Pendiente de revisión manual

1. **Textos**: todos los copys son redacción propia a partir del briefing; revisar con Ángel (especialmente manifiesto, bio y descripciones de estilos).
2. **Selección de fotos**: validar la curación en `portfolio-seleccionado/`. Hay material adicional en HEIC/RAW/MOV que no se pudo procesar sin herramientas extra.
3. **Legal**: el footer indica "Aviso legal, privacidad y cookies — en preparación". Ver `legal/pendiente-legal.md` antes de publicar. No se ha inventado ningún dato legal.
4. **Dominio**: al tener dominio definitivo, añadir `og:url`, `link rel=canonical`, `sitemap.xml` y `robots.txt` con la URL real.
5. **Dirección exacta del estudio**: el enlace de Murcia en el footer apunta a una búsqueda de Google Maps de "Profano Tattoo Murcia"; confirmar.
6. **Consentimiento de imagen** de los clientes que aparecen en las fotos del portfolio.

## Recomendaciones para fase 2

- **Galería de flash real**: escanear/exportar las láminas de flash y montar una galería con estado (disponible/tatuado).
- **Formatos modernos de imagen**: generar WebP/AVIF con `srcset` (requiere una herramienta como sharp o squoosh; los JPEG actuales ya están optimizados).
- **Logotipo MECHA vectorial**: la guía incluye un logotipo tipográfico custom (estilo blackletter); vectorizarlo a SVG para el header en lugar del texto en Yanone Kaffeesatz.
- **Página propia por estilo** (SEO local: "tatuaje blackwork Murcia", etc.) si se quiere atacar búsqueda orgánica.
- **Vídeo**: hay .MOV/.MP4 en `portfolio-original/` que podrían dar un clip de fondo para el hero (comprimido y silenciado).
- **Analítica respetuosa** (Plausible/Umami) cuando exista la política de cookies.
- **Microinteracciones**: cursor custom o distorsión sutil al hover en el portfolio si se quiere subir el nivel de detalle.

## Herramientas auxiliares

En `tools/`:
- `optimize-images.ps1` — re-genera las imágenes web desde los originales (curación + resize + EXIF).
- `extract-logo.ps1` — re-extrae el logo desde la guía de branding.
- `shots/` — capturas de verificación (desktop y móvil).
