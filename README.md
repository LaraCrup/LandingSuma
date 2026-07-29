# LandingSuma

Landing de canje de premios de **suma**, una app de hábitos saludables que premia la constancia
con recompensas de marcas aliadas.

La landing se usa en el stand de una carrera: quien participó ingresa su **correo electrónico** y
su **número de corredor**, la landing valida esos datos contra Supabase y le habilita el retiro
del premio en el stand.

Proyecto final de la carrera de Diseño y Desarrollo Web (Da Vinci).

## Stack

| | |
|---|---|
| Framework | [Nuxt 4](https://nuxt.com) + Vue 3 (`<script setup>`, JavaScript) |
| Estilos | [Tailwind CSS 3](https://tailwindcss.com) vía `@nuxtjs/tailwindcss` |
| Base de datos | [Supabase](https://supabase.com) vía `@nuxtjs/supabase` (función RPC `redeem_prize`) |
| Animación | [GSAP](https://gsap.com) (ScrollTrigger + SplitText) y [Lenis](https://lenis.darkroom.engineering) para el scroll suave |
| Imágenes | `@nuxt/image` |
| Tipografías | `@nuxt/fonts` (Montserrat Alternates + Quicksand, auto-hospedadas) |

## Puesta en marcha

```bash
npm install
cp .env.example .env      # completar con las credenciales del proyecto de Supabase
npm run dev               # http://localhost:3000
```

### Variables de entorno

| Variable | Descripción |
|---|---|
| `SUPABASE_URL` | URL del proyecto de Supabase |
| `SUPABASE_KEY` | Clave **publicable** (`sb_publishable_…`). Nunca la `secret` |
| `NUXT_PUBLIC_SITE_URL` | Dominio de producción, sin barra final. Define el `canonical`, el `og:url`, el `sitemap.xml` y el JSON-LD |

> La clave publicable viaja al navegador por diseño: toda la seguridad del canje vive en la
> función `redeem_prize` de Supabase (`SECURITY DEFINER`) y en las políticas RLS de las tablas.

### Scripts

```bash
npm run dev        # servidor de desarrollo
npm run build      # build de producción
npm run preview    # previsualizar el build
```

## Estructura

```
app/
  app.vue                  Layout raíz + cursor custom
  error.vue                Página de error (404 / 500) en español
  pages/index.vue          La landing entera + JSON-LD
  components/
    Header.vue             Píldora flotante sticky
    Hero.vue               Título, formulario de canje y loop infinito de fotos
    ComoFunciona.vue       Recorrido de 4 pasos con un iPhone interactivo
    Recompensas.vue        Tres tarjetas de "rascá y descubrí"
    Reviews.vue            Reseñas en marquee + contadores animados
    Cierre.vue             Logotipo gigante + CTA de descarga
    AppFooter.vue          Pie de página
    RedeemForm.vue         Formulario de canje contra Supabase
    ModalDialog.vue        Modal accesible (foco atrapado, Escape, scroll bloqueado)
    PhoneShell.vue         Marco del iPhone (UI real de la app, en HTML/CSS)
    HabitCard.vue          Tarjeta de hábito con swipe
    RascaCard.vue          Tarjeta de rasca con canvas
    MarqueeReactive.vue    Marquee cuya velocidad reacciona al scroll
    AppCursor.client.vue   Cursor custom (solo con puntero fino)
  composables/             useGsapContext, useScrollVelocity
  plugins/                 gsap.client, lenis.client
server/routes/             robots.txt y sitemap.xml generados desde NUXT_PUBLIC_SITE_URL
public/images/habitos/     20 fotos en WebP 960×1280, con nombre descriptivo (~2 MB en total)
```

Las notas de implementación —convenciones, decisiones de responsive, el porqué de cada
animación— están en [CLAUDE.md](CLAUDE.md).

## Accesibilidad

- Contrastes verificados contra WCAG 2.1 AA
- Navegación completa por teclado, incluida una alternativa accesible a la tarjeta de rasca
- Modales con `role="dialog"`, foco atrapado, cierre con `Escape` y scroll bloqueado
- `prefers-reduced-motion` respetado en GSAP, en el scroll suave de Lenis y en el CSS
- Marquees que se pausan al pasar el puntero o al recibir foco
- Enlace de salto al contenido, `lang="es-AR"` y jerarquía de encabezados sin saltos

## Deploy

Preparado para Vercel. Hay que cargar `SUPABASE_URL`, `SUPABASE_KEY` y `NUXT_PUBLIC_SITE_URL`
como variables de entorno del proyecto.

## Optimizar fotos nuevas

Las fotos de `public/images/habitos/` son WebP de 960×1280 y se nombran **describiendo la
escena** en kebab-case (`correr-parque.webp`, `preparar-viandas.webp`), no con números: el
nombre de archivo lo indexa Google Imágenes.

Si se agregan más, hay que optimizarlas antes de commitear (una foto de cámara pesa ~3 MB, y
en pantalla se muestra a 300-480 px):

```bash
node -e "
const sharp = require('sharp');
sharp('/ruta/a/la/foto-original.jpg')
  .resize(960, 1280, { fit: 'cover' })
  .webp({ quality: 78 })
  .toFile('public/images/habitos/nadar-pileta.webp');
"
```

Después hay que sumar su `{ src, alt }` al array `filas` de `app/components/Hero.vue`.
Solo se versionan las versiones optimizadas: los originales sin comprimir no van al repo.
