# CLAUDE.md — LandingSuma

Landing de canje de premios para **suma** (app de hábitos saludables). El usuario ingresa
email + número de corredor y valida contra Supabase para retirar su premio en el stand.

## Stack

- **Nuxt 4** + Vue 3 + `<script setup>` (JS, nunca `lang="ts"`)
- **Tailwind v3** vía `@nuxtjs/tailwindcss` + `tailwind.config.js`
  ⚠️ Contra la preferencia global (v4 CSS-first). Es el patrón vigente acá; migrar es otra tarea.
- **Supabase** (`@nuxtjs/supabase`) — validación de participantes vía RPC `redeem_prize`.
  `useSsrCookies: false` + `clientOptions.auth.persistSession: false`: no hay login acá.
  ⚠️ La clave del módulo es `clientOptions`, **no** `options` (esa se ignora en silencio).
- **GSAP** (ScrollTrigger, SplitText) + **Lenis** para scroll suave
- **`@nuxt/fonts`** — Montserrat Alternates + Quicksand auto-hospedadas (no hay link a Google)
- **npm**, no pnpm (heredado del proyecto)

## Convenciones

- Un componente por sección de la landing, montados en `app/pages/index.vue`
- `useGsapContext(root, setup)` — wrapper de `gsap.context` con auto-cleanup al desmontar.
  Todo GSAP va adentro; los selectors string quedan scoped al `root`.
- Siempre guardar `prefers-reduced-motion` antes de animar
- Sin comentarios salvo el **por qué** no obvio, en español

## Responsive — LO IMPORTANTE

### Breakpoints

```js
sm: 480px | tab: 600px | md: 768px | mdlg: 992px | lg: 1080px | xl: 1280px | xxl: 1440px
short: (max-height: 860px)   // ← custom, ver abajo
```

`tab` y `mdlg` son custom. `mdlg` (992px) es el corte mobile→desktop de **Recompensas**
solamente (el resto cambia en `lg`).

### Mobile y desktop son layouts distintos (no romper)

Varias secciones tienen **dos markups**, uno para cada lado del breakpoint. No es
duplicación accidental: el diseño de desktop ya estaba aprobado y mobile pide otra cosa.
Al tocar mobile, dejar desktop EXACTO; y al revés.

| Sección | `<lg` (o `<mdlg`) | `lg+` (o `mdlg+`) |
|---|---|---|
| Hero | 2 filas horizontales de fotos | 3 columnas verticales |
| ComoFunciona | vertical: título → números → título del paso → phone | 2 columnas + hilo SVG |
| Recompensas | 3 cards apiladas (`flex-col`) | grid de 3 |
| Reviews | 2 marquees animadas (mismo markup en todos los anchos) | ídem |

### El problema del alto (leer antes de tocar el hero)

Los breakpoints de Tailwind son **de ancho**. Una MacBook Pro (1512×945) y un desktop
grande (1920×1080) caen ambos en `xl`/`xxl` y reciben las mismas medidas — pero difieren
**135px de alto**. El hero es `min-h-dvh`: lo que sobra en desktop, no entra en Mac.

Por eso existe `short: (max-height: 860px)`. Se combina con los de ancho:

```html
xxl:w-[285px] xxl:short:w-[265px]    <!-- desktop grande vs Mac -->
lg:short:hidden                       <!-- ocultar en pantallas bajas -->
```

**Regla:** al dimensionar algo en el hero, pensar en el **alto disponible**, no solo el ancho.
En Mac son ~945px menos header (76) menos padding (~130) = **~739px reales**.

### Cómo verificar (no estimar)

Estimar el alto a mano no funciona — hay que medir el DOM:

**Lio revisa los screenshots él mismo — no spamear screenshots.** Para verificar layout/alto,
medir el DOM con `agent-browser eval` (números), no capturar imágenes salvo que las pida.

```bash
npx nuxt dev --port 3000 --host 0.0.0.0 &   # --host SIN valor se come el --port como rootDir
agent-browser open http://localhost:3000
agent-browser set viewport 1497 765     # ⚠️ ALTO ÚTIL real, no el nominal 945
agent-browser eval "(() => {
  const phone = document.querySelector('[class*=aspect]').getBoundingClientRect();
  const f = document.querySelector('form').getBoundingClientRect();
  return JSON.stringify({
    phoneFits: phone.bottom < innerHeight,
    formFits: f.bottom < innerHeight,
    shortActivo: matchMedia('(max-height: 860px)').matches   // true en Mac
  });
})()"
```

Verificar **siempre en las dos**, con el ALTO ÚTIL real del navegador (no el nominal de
pantalla — el browser se come ~180px de barras): `1497 765` (Mac) y `1905 963` (desktop
grande). Esto es lo que importa: a 765 el breakpoint `short:` (max-height 860) **dispara**;
a 945 (viewport crudo) NO, y el test no reproduce el caso real de Mac. Si emulás el alto
equivocado, ves el layout descuadrado que en la Mac real está bien.

⚠️ Tocar `tailwind.config.js` requiere **reiniciar el dev server** — Tailwind v3 no lo
recarga en caliente y las clases nuevas simplemente no se aplican (se ve como si el
cambio no hiciera nada).

### Reglas de escala

- **Nunca `clamp()` con `vw`** en tipografía ni layout. Escalar por breakpoint explícito.
  (Los blobs de fondo sí usan `vw` — son decorativos, no layout.)
- Mobile-first, escalar hacia arriba
- `h-dvh` / `min-h-dvh`, nunca `h-screen`

## Arquitectura

```
app/
  app.vue                  Layout raíz (AppCursor + NuxtPage). Sin <style>: todo el CSS global
                           vive en assets/css/main.css
  error.vue                404 / 500 en español (sin esto, Nuxt muestra su página en inglés)
  pages/index.vue          Skip link + Header + main (Hero → ComoFunciona → Recompensas →
                           Reviews → Cierre) + AppFooter + JSON-LD
  components/
    Header.vue             Píldora flotante sticky, transparente salvo el pill interno
    Hero.vue               Contenido + form de canje a la izq, fotos en loop a la der
    ComoFunciona.vue       Recorrido interactivo: pasos + PhoneShell que se usa de verdad
    Recompensas.vue        "Rascá y descubrí": canvas que se rasca y revela el beneficio
    Reviews.vue            Reviews en 2 marquees + contadores animados
    Cierre.vue             "suma" tipográfico enorme + botón "Descargar suma"
    AppFooter.vue          Pie de página (ver abajo por qué está separado de Cierre)
    RedeemForm.vue         Form de canje (compartido; lo usa Hero)
    ModalDialog.vue        Modal accesible reutilizable (lo usa RedeemForm ×2)
    PhoneShell.vue         Marco del iPhone (compartido; lo usa ComoFunciona)
    HabitCard.vue          Card de hábito con swipe (compartido; UI real de la app Suma)
    RascaCard.vue          Card de la rasca con su canvas (la usa Recompensas)
    MarqueeReactive.vue    Marquee con velocidad reactiva al scroll (lo usa Reviews)
    AppCursor.client.vue   Cursor custom (solo pointer fino; se monta en app.vue)
  composables/
    useGsapContext.js      Wrapper gsap.context con auto-cleanup
    useScrollVelocity.js   Velocidad de scroll compartida (la consume MarqueeReactive)
  plugins/
    gsap.client.js         registerPlugin(ScrollTrigger, SplitText)
    lenis.client.js        Scroll suave (no se inicializa con prefers-reduced-motion)
server/routes/
  robots.txt.ts            Generados desde runtimeConfig.public.siteUrl, para que la
  sitemap.xml.ts           directiva Sitemap y el <loc> sigan al dominio real
```

Imágenes de hábitos en `public/images/habitos/`, con **nombre descriptivo en kebab-case**
(`correr-parque.webp`, `preparar-viandas.webp`…) — no numeradas: el nombre de archivo lo lee
Google Imágenes y evita tener que abrirlas para saber cuál es cuál. 960×1280, 3:4 vertical,
~100 KB c/u. **Solo se versiona la versión optimizada**; los originales de cámara (2,9 MB c/u)
no van al repo. Para sumar más: optimizar con sharp, guardar el `.webp` y agregar su
`{ src, alt }` al array `filas` de `Hero.vue`.

```bash
node -e "
const sharp = require('sharp');
sharp('/ruta/a/la/foto-original.jpg')
  .resize(960, 1280, { fit: 'cover' })
  .webp({ quality: 78 })
  .toFile('public/images/habitos/nadar-pileta.webp');
"
```

El `alt` es obligatorio y descriptivo, aunque el contenedor sea `aria-hidden`: son 3 copias
duplicadas de cada foto en un loop decorativo, así que el lector de pantalla no las anuncia,
pero el `alt` sirve igual para buscadores y si algún día se saca el `aria-hidden`.

UI de la app (`PhoneShell`, `HabitCard`) replica la app Suma real (repo de referencia:
`~/Desktop/La/Da Vinci/Suma`, misma paleta Tailwind).

**El footer ya NO está dentro de `Cierre`**: un `<footer>` anidado en `<section>`, y encima
dentro de `<main>`, no mapea al landmark `contentinfo`. Por eso `AppFooter` se monta en
`index.vue` **después de `</main>`**. No volver a meterlo adentro de `Cierre`.

Los botones "Descargar suma" (Header y Cierre) leen la URL de
`runtimeConfig.public.appUrl` — no hardcodearla de nuevo.

### ModalDialog

Modal accesible reutilizable. Encapsula todo lo que un modal necesita y que es fácil olvidar:
`role="dialog"` + `aria-modal`, `aria-labelledby`/`aria-describedby`, **foco atrapado** con
ciclado de Tab, foco al botón de cerrar al abrir, **devolución del foco al disparador** al
cerrar (con `nextTick`, porque el disparador suele seguir `disabled` mientras carga), cierre
con `Escape` y bloqueo del scroll del `body` (indispensable con Lenis: si no, el fondo
scrollea detrás del modal).

```vue
<ModalDialog :open="showSuccessModal" titulo="¡Felicitaciones!" accion="¡Voy al stand!"
  icono="🎉" icono-fondo="bg-accent" @close="cerrar">
  Texto con <span class="text-primary">markup</span> (slot); o usar la prop `mensaje` si es plano.
</ModalDialog>
```

### Parallax del Hero (patrón Mecha — no romper)

El Hero es `lg:fixed lg:inset-0 lg:z-[1]` (fijo detrás en desktop). En `index.vue`, tras el
Hero hay un **spacer** `hidden lg:block h-dvh` que da el "runway" donde se ve el hero fijo;
luego el bloque de contenido (`relative z-10 bg-light`) **sube por encima y lo tapa** al
scrollear. En mobile el Hero es `relative` (flujo normal, sin fixed). Ya NO existe el
`-mt` viejo: el hero fixed arranca en top:0 y su `pt-[80px] lg:pt-[92px]` reserva el header.
Patrón copiado de `~/Desktop/Estudio/Kase/WebMecha`.

### Detalles con historia (no romper sin leer)

- **Loop de fotos del Hero (GSAP + wrap):** el track son **3 copias** del set
  (`[...col, ...col, ...col]`), `n = hijos.length / 3`. El desplazamiento avanza sin fin y
  `gsap.utils.wrap(-dist, 0)` lo envuelve → siempre hay contenido llenando la vista, sin
  hueco ni salto. Se **re-mide cuando cargan las imágenes** (si no, la medida da mal y el
  loop no arranca). Con 2 copias dejaba un hueco; por eso 3.
  La re-medición ocurre **una sola vez**, cuando ya cargaron todas (contador `pendientes`).
  Dos cosas que ya se probaron y **rompen el loop**:
  1. Re-armar en cada carga suelta (debounce): el loop se reinicia y se ve un salto cada tanto.
     Si hay que re-armar igual (resize), `armarLoops` guarda y restaura el `progress()`.
  2. `loading="lazy"` en estas fotos: el track se mueve infinitamente, así que entran fotos al
     viewport todo el tiempo → cargas continuas → re-mediciones continuas. Y las del layout
     oculto no cargan nunca, así que el contador jamás llegaría a cero.
  Hay **dos pistas** (`.fila` horizontal en mobile, `.columna` vertical en desktop): el array
  `pistas` arma el loop sobre el eje que corresponda (`x`/`offsetLeft` vs `y`/`offsetTop`) y
  saltea la que esté oculta (`!el.offsetParent`). Se re-arma en `resize` para que funcione al
  cruzar el breakpoint sin recargar.

- **Blobs del Hero:** 3 masas de color de la paleta (`primary/accent/green-light`) con blur,
  `z-0`, detrás del contenido. Se **mueven, rotan, cambian de `border-radius` (morphing) y
  ciclan de color** con GSAP, cada uno desfasado. Decorativos; el `overflow-hidden` del hero
  los recorta.

- **`overflow-x-clip` en `app.vue`**: contenido puede desbordar el viewport. Es `clip` y **no
  `hidden`** porque `hidden` rompe el `position: sticky` del header.

- **`.col-in` (Hero) y `.tipo-in` (Cierre) arrancan en `opacity: 0`** y se revelan dentro del
  callback de `document.fonts.ready`. Ahí adentro viven el **form de canje** y el botón
  "Descargar": si SplitText tira o las fuentes nunca resuelven, quedaban invisibles para
  siempre. Por eso hay un `setTimeout` salvavidas de 2.5 s + `.catch()` que los revela igual.
  **No sacar el salvavidas.**

- **`PhoneShell` + `HabitCard` son código, no imagen.** UI real de la app en HTML/CSS con
  animación GSAP. Tipografías en px fijos: por debajo de ~255px de ancho el layout se rompe.
  Solo se usan en `ComoFunciona`, contenidos dentro del marco del teléfono.
  El marco es **`aspect-[390/700] lg:aspect-[390/830]`**: en mobile ocupa `w-full max-w-[400px]`
  y con el aspect real de un iPhone (390/830) daba 851px de alto, más que la pantalla. El aspect
  achatado es a propósito — se pierde proporción de teléfono, se gana que entre entero.

- **Hilo SVG en `ComoFunciona`:** una curva Bézier (`hiloPath`) conecta el borde derecho del
  paso activo con el borde izquierdo del teléfono, en coords relativas a `filaRef`. Se re-pinta
  (stroke-dashoffset animado) al cambiar `activo` (watch) y al cargar fuentes/resize. La ref
  del teléfono es el componente PhoneShell → se accede con `.$el`. **Solo lg**: la lista de
  pasos con hilo no existe en mobile, por eso `actualizarHilo` corta si `!el.offsetParent`.

- **MarqueeReactive — dirección:** ambas filas corren con `timeScale +1` (hacia adelante,
  para que `repeat:-1` loopee bien). La dirección la da el sentido del tween: `left` anima
  `xPercent 0 → -50`, `right` anima `-50 → 0`. NO usar timeScale negativo: retrocediendo con
  `repeat:-1` se clava en progress 0 y la fila deja de moverse (era el bug de la fila gris).

- **MarqueeReactive — velocidad:** `duración = anchoDeUnaCopia / speed`, con `speed` en px/s
  (45 en Reviews). Es velocidad **absoluta**, igual en todo ancho. Ya se probó escalarla por
  viewport para que no se perciba rápida en pantallas angostas: quedaba lenta en todos lados
  y **se clavaba** al agrandar la ventana (solo recalcula si cambia el ancho de las cards, que
  es fijo). Si molesta a ~992px, achicar las cards en ese rango, no tocar la velocidad.

- **Canvas de la rasca (`RascaCard`):** el canvas se dibuja en px reales, así que si se pinta
  antes de que el layout fije el ancho de la card, el buffer queda estirado y el logo se ve
  **borroso**. Por eso `pintarFoil` está separado de `conectarRasca` (los listeners se
  enganchan una sola vez) y se re-pinta con `ResizeObserver`, salvo que ya esté rascado —
  repintar perdería el progreso. `getContext('2d', { willReadFrequently: true })` porque
  `medirRevelado` llama `getImageData` en cada `pointermove`.
  El canvas arranca `touch-pan-y` (el dedo hacia abajo scrollea la página, no rasca). En cuanto
  el primer trazo resulta **horizontal** (`dx > 8 && dx > dy`) se prende `enganchado` y el canvas
  pasa a `touch-none`, así los trazos siguientes rascan en cualquier dirección. Se apaga solo
  1,2 s después de soltar (y al revelar): **`touch-none` fijo bloquea el scroll de la página**, por
  eso es condicional y con auto-reset. `pointercancel` cuenta como soltar — cuando el navegador
  se queda con el gesto para scrollear no manda `pointerup`. El pincel es más grande con
  `(pointer: coarse)` (46 vs 34) porque el dedo tapa el trazo, y `medirRevelado` corre 1 de cada
  4 `pointermove` (`getImageData` de todo el canvas en cada move hace tironear el dedo).
  El `<p>` del nombre lleva `min-h-[2lh]` para que las 3 cards midan igual (si no, el nombre
  de una línea las desnivela y el canvas deja de tapar su contenedor) + `flex items-center`
  para que los nombres de una sola línea queden centrados en esa caja de 2 líneas.
  Rascar es un gesto de trayectoria y no existe en teclado (WCAG 2.1.1 / 2.5.1): por eso hay
  un botón "Revelar el beneficio de X" que es `sr-only` hasta que recibe foco, y el nombre de
  la marca —que solo existía pintado en el canvas— va además como texto `sr-only`.

- **A11y transversal (no romper):** `main.css` define el `:focus-visible` global y un bloque
  `prefers-reduced-motion` que neutraliza **todas** las transiciones y animaciones CSS de una
  (modales, toast, transiciones de pantalla, rasca, swipe). No hace falta repetir el guard en
  cada `<style scoped>`; lo que sí necesita guard propio es el JS de GSAP.
  Lenis directamente **no se inicializa** con `prefers-reduced-motion`.
  Las marquees se pausan con `pointerenter`/`focusin` (WCAG 2.2.2).

## Mecánicas por sección (estado al día)

- **Hero:** título + `RedeemForm` a la izq (`h1` en `text-3xl sm:4xl xl:5xl xxl:short:5xl`),
  fotos en loop infinito contrapuesto a la der, blobs de color morfológicos de fondo.
  Parallax fixed en desktop. Los casilleros del código son `h-16 lg:h-14` (más altos en mobile,
  donde el tap target importa).
- **ComoFunciona:** 4 pasos + `PhoneShell` con UI real interactiva, una pantalla por paso:
  (0) crear hábito, (1) completar los hábitos, (2) racha + botón "Ver mis recompensas" con
  gradiente animado que fluye, (3) beneficios canjeables. Datos coherentes: `RACHA_BASE=5`,
  `PUNTOS_BASE=280` (+40/hábito) → premio de 250 canjeable de entrada, 400 con todos hechos.
  Paso activo `bg-green-dark`, ya recorridos `bg-primary` (era `green-dark/45`, que daba
  2.03:1 de contraste), pendientes blancos. `canjeados` bloquea el re-canje.
  La unidad de gamificación es **XP** en toda la sección (antes convivían "pts" y "XP").
  El teléfono es `w-full max-w-[400px]` en mobile y vuelve a anchos fijos desde `lg`
  (`lg:max-w-none`); el `short` achica phone/gaps/padding, ver reglas de alto arriba.
- **Recompensas:** solo título "Rascá y descubrí tu beneficio". 3 `RascaCard` con
  canvas de scratch-foil (gris plata + logo real de la marca al 55% + "Rascá acá", que en
  táctil dice "Deslizá acá 👉" porque el gesto que funciona ahí es el horizontal). Pincel
  radio 34 (46 en táctil), borra con arco+línea (sin estela), revela al **50%** rascado.
  Debajo del foil
  va **solo el nombre del premio** sobre el gradiente verde: el logo existe únicamente
  pintado en el canvas, si se pone también abajo se asoma por los huecos al rascar.
  La banda inferior (62px) es un solo `span` que la llena entera: nivel requerido en reposo,
  `bg-accent` + "Desbloqueado" al revelar, con transición `translateY`.
- **Reviews:** título + 2 marquees de reseñas (mismo markup en todo ancho) + 3 stat-cards
  sobre `green-dark` con contador animado. Son **12 reseñas**, 6 por fila y sin repetirse entre
  filas (`slice(0,6)` / `slice(6)`); con menos de 6 por fila la copia no llena el ancho y se
  ve el hueco del loop. Cada reseña es `<figure>` + `<blockquote>` + `<figcaption>`, y el
  `figcaption` **cuelga directo del `figure`** (envuelve avatar y nombre): anidado en un `div`
  el HTML no valida. El degradado de los bordes va como `style` en el `<MarqueeReactive>` y
  funciona porque el componente re-bindea `$attrs.style` — tiene `inheritAttrs: false`, así
  que si se agrega otro atributo hay que re-bindearlo a mano o se descarta en silencio.
- **Cierre:** "suma" tipográfico gigante + botón "Descargar suma". Brillos flotantes,
  atenuados en mobile (`calc(var(--op) * 0.45)`) porque ahí tapan el botón.
  El footer ya no vive acá (ver Arquitectura).

## Estado / pendientes

- ✅ Toda la landing iterada y **full responsive** (mobile-first, con markup propio de mobile
  y desktop en Hero, ComoFunciona y Recompensas — ver tabla arriba).
- ✅ `.env` configurado con las claves reales (key `sb_publishable_…`). La RPC `redeem_prize`
  responde OK; con datos inexistentes devuelve `"not_found"`, que el form mapea a su modal.
  El form manda el email en `toLowerCase()`, valida formato con regex, tiene timeout de 15 s
  y mapea **solo** `ok` / `already_redeemed` / `not_found`; cualquier otro valor cae en el
  modal genérico de error (antes decía "no figurás en el listado", que podía ser falso).
- ✅ SEO: og:image propia (`public/og-suma.jpg` 1200×630) + apple-touch-icon + favicon SVG +
  `site.webmanifest`. El favicon SVG es **`public/favicon.svg`**, generado a partir del isotipo
  pero en lienzo **cuadrado** sobre el verde de marca: el `isotipo.svg` suelto es apaisado
  (76.96×65.44) y transparente, y a 16px en la pestaña quedaba diminuto e ilegible.
  Canonical/`og:url` desde **`NUXT_PUBLIC_SITE_URL`** (fijo, no
  `useRequestURL()`: con el origin del request cada preview de Vercel se auto-canonicalizaba),
  JSON-LD (Organization + WebSite + **WebApplication**) en `index.vue`, `robots.txt` y
  `sitemap.xml` como rutas de Nitro, twitter card, `lang="es-AR"`.
  **Sin `Review`/`aggregateRating` a propósito:** las 12 reseñas de la sección Reviews son
  inventadas y marcarlas como datos estructurados reales es spam de rich snippets.
- ✅ Fotos optimizadas **en origen**: 20 WebP de 960×1280 (~2 MB en total, antes 52 MB de JPG
  a 1856×2304). Van con `decoding="async"` (sin `lazy`, ver arriba) y con `alt` descriptivo;
  los `width`/`height` (300×400 mobile, 480×640 desktop) son exactamente 2× el tamaño de
  render, así que ya cubren retina. Los logos de marca también se redujeron (bhumi 150 → 26 KB).
- ✅ `:focus-visible` global **sin `border-radius` propio**: si se le pone uno, el outline le
  cuadra las esquinas a los inputs `rounded-full`. Los `input` lo suprimen porque ya traen su
  propio anillo (`focus:ring-2`) con el radio correcto.
- ✅ HTML válido en el validador del W3C (los 24 errores eran `figcaption` colgando de un `div`
  en `Reviews`; ahora el `figcaption` es hijo directo de `figure` y envuelve avatar + nombre).
  ⚠️ Validar siempre el **build** (`node .output/server/index.mjs`), no el dev server: en dev
  las URLs `/_nuxt/@fs/…` traen la ruta del proyecto, que tiene espacios, y dan errores falsos.
- ✅ Lighthouse: los casilleros del código ya **no cancelan el pegado**. El reparto de un código
  pegado se hace desde el `input` (`inputType === 'insertFromPaste'`) en vez de un handler de
  `paste` con `preventDefault`, que Lighthouse marca como bloquear el pegado. Por eso el
  `maxlength` es 6 y no 1: con 1 el navegador trunca el pegado y se pierden los otros dígitos.
  `sourcemap: { client: true }` en `nuxt.config` para que Lighthouse pueda auditar el JS propio.
- ⏳ Los links de Instagram y TikTok de `AppFooter` apuntan a `#`. Al ponerlos, sumarlos
  también como `sameAs` en el `Organization` del JSON-LD de `index.vue`.
- ⏳ `NUXT_PUBLIC_SITE_URL` tiene como default `https://landing-suma.vercel.app`, que es una
  **suposición**. Hay que confirmarlo contra el dominio real y cargarlo en Vercel.
- ⏳ Los CTA dicen "Descargar suma" pero llevan a `…/iniciar-sesion`: el texto no describe el
  destino (WCAG 2.4.4). Falta decidir si cambia el texto o el destino.
- ⏳ `npm audit` reporta vulnerabilidades en dependencias transitivas de build (sharp/libvips
  vía `@nuxt/image`, tar, brace-expansion, esbuild). No hay fix sin `--force`, que rompería
  `@nuxt/image`. Nada de eso llega al bundle del cliente.
