# CLAUDE.md — LandingSuma

Landing de canje de premios para **suma** (app de hábitos saludables). El usuario ingresa
email + número de corredor y valida contra Supabase para retirar su premio en el stand.

## Stack

- **Nuxt 4** + Vue 3 + `<script setup>` (JS, nunca `lang="ts"`)
- **Tailwind v3** vía `@nuxtjs/tailwindcss` + `tailwind.config.js`
  ⚠️ Contra la preferencia global (v4 CSS-first). Es el patrón vigente acá; migrar es otra tarea.
- **Supabase** (`@nuxtjs/supabase`) — validación de participantes vía RPC `redeem_prize`
- **GSAP** (ScrollTrigger, SplitText) + **Lenis** para scroll suave
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

`tab` y `mdlg` son custom. `mdlg` (992px) es el corte mobile→desktop de **Recompensas y
Reviews** solamente (el resto cambia en `lg`); `tab` existe para afinar los carruseles.

### Mobile y desktop son layouts distintos (no romper)

Varias secciones tienen **dos markups**, uno para cada lado del breakpoint. No es
duplicación accidental: el diseño de desktop ya estaba aprobado y mobile pide otra cosa.
Al tocar mobile, dejar desktop EXACTO; y al revés.

| Sección | `<lg` (o `<mdlg`) | `lg+` (o `mdlg+`) |
|---|---|---|
| Hero | 2 filas horizontales de fotos | 3 columnas verticales |
| ComoFunciona | vertical: título → números → título del paso → phone | 2 columnas + hilo SVG |
| Recompensas | carousel con flechas | grid de 3 |
| Reviews | carousel con swipe | 2 marquees animadas |

### El problema del alto (leer antes de tocar el hero)

Los breakpoints de Tailwind son **de ancho**. Una MacBook Pro (1512×945) y un desktop
grande (1920×1080) caen ambos en `xl`/`xxl` y reciben las mismas medidas — pero difieren
**135px de alto**. El hero es `min-h-dvh`: lo que sobra en desktop, no entra en Mac.

Por eso existe `short: (max-height: 1000px)`. Se combina con los de ancho:

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
  pages/index.vue          Header + main (Hero → ComoFunciona → Recompensas → Reviews) + Cierre
  components/
    Header.vue             Píldora flotante sticky, transparente salvo el pill interno
    Hero.vue               Contenido + form de canje a la izq, fotos en loop a la der
    ComoFunciona.vue       Recorrido interactivo: pasos + PhoneShell que se usa de verdad
    Recompensas.vue        "Rascá y descubrí": canvas que se rasca y revela el beneficio
    Reviews.vue            Reviews (carousel o marquees según viewport) + contadores animados
    Cierre.vue             "suma." tipográfico enorme + botón "Descargar" + footer (lo incluye)
    RedeemForm.vue         Form de canje con modales (compartido; lo usa Hero)
    PhoneShell.vue         Marco del iPhone (compartido; lo usa ComoFunciona)
    HabitCard.vue          Card de hábito con swipe (compartido; UI real de la app Suma)
    RascaCard.vue          Card de la rasca con su canvas (la usan grid y carousel)
    CarouselStatic.vue     Carousel con drag/swipe, flechas y slidesPerView (Recompensas, Reviews)
    MarqueeReactive.vue    Marquee con velocidad reactiva al scroll (lo usa Reviews en mdlg+)
    AppCursor.client.vue   Cursor custom (solo pointer fino; se monta en app.vue)
  composables/
    useGsapContext.js      Wrapper gsap.context con auto-cleanup
    useScrollVelocity.js   Velocidad de scroll compartida (la consume MarqueeReactive)
  plugins/
    gsap.client.js         registerPlugin(ScrollTrigger, SplitText)
    lenis.client.js        Scroll suave
```

Imágenes de hábitos en `public/images/habitos/` nombradas **`1.jpg` … `20.jpg`** (3:4 vertical).
Para sumar más: agregar archivo + su `{ src }` al array `filas` de `Hero.vue`.
UI de la app (`PhoneShell`, `HabitCard`) replica la app Suma real (repo de referencia:
`~/Desktop/La/Da Vinci/Suma`, misma paleta Tailwind). `Cierre` ya trae su footer: NO montar
un `<Footer>` aparte.

Los botones "Descargar" (Header y Cierre) apuntan a
`https://suma-proyecto-final.vercel.app/iniciar-sesion`.

### CarouselStatic

Portado de `~/Desktop/La/TEX/WebTEX/app/components/carousel/Static.vue`. Arrastra con
`mousedown`/`touchstart` y **clasifica la dirección del gesto** en el primer movimiento
(`dx > dy`): si es vertical suelta el drag para que la página siga scrolleando. Eso es lo
que hace que el carrusel no secuestre el scroll en mobile — no usar `snap-x` ni
`touch-action` contradictorios, que fue el bug original.

```vue
<CarouselStatic arrows :gap="20" :slides-per-view="{ base: 1.3, sm: 1.8, tab: 2.2, md: 2.6 }"
  track-class="pb-7" />
```

- `slidesPerView` acepta decimales (peek) y **hereda** del breakpoint anterior si se omite.
- El componente fija el ancho de los slides por CSS (`100cqw`): NO ponerles clase de ancho.
- `edge`/`edgeLg` son el respiro de los extremos. Va como **margin del primer/último slide**,
  no como padding del contenedor: con padding, el último slide queda recortado al final.
- `trackClass="pb-7"` da aire abajo cuando los slides tienen sombra (el `overflow-x` la corta).

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

- **`PhoneShell` + `HabitCard` son código, no imagen.** UI real de la app en HTML/CSS con
  animación GSAP. Tipografías en px fijos: por debajo de ~255px de ancho el layout se rompe.
  Solo se usan en `ComoFunciona`, contenidos dentro del marco del teléfono.

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
  El canvas es `touch-pan-y`: **nunca `touch-none`**, que bloquea el scroll de la página.
  El `<p>` del nombre lleva `min-h-[2lh]` para que las 3 cards midan igual (si no, el nombre
  de una línea las desnivela y el canvas deja de tapar su contenedor) + `flex items-center`
  para que los nombres de una sola línea queden centrados en esa caja de 2 líneas.

## Mecánicas por sección (estado al día)

- **Hero:** título + `RedeemForm` a la izq (`h1` en `text-3xl sm:4xl xl:5xl xxl:short:5xl`),
  fotos en loop infinito contrapuesto a la der, blobs de color morfológicos de fondo.
  Parallax fixed en desktop. Los casilleros del código son `h-16 lg:h-14` (más altos en mobile,
  donde el tap target importa).
- **ComoFunciona:** 4 pasos + `PhoneShell` con UI real interactiva, una pantalla por paso:
  (0) crear hábito, (1) completar los hábitos, (2) racha + botón "Ver mis recompensas" con
  gradiente animado que fluye, (3) beneficios canjeables. Datos coherentes: `RACHA_BASE=5`,
  `PUNTOS_BASE=280` (+40/hábito) → premio de 250 canjeable de entrada, 400 con todos hechos.
  Paso activo con gradiente `from-accent/70 via-accent/40 to-green-light/25`; inactivos
  blancos. `canjeados` es un array que bloquea el re-canje y muestra "✓ Canjeado".
  El `short` achica phone/gaps/padding; ver reglas de alto arriba.
- **Recompensas:** solo título "Rascá tu racha y descubrí el beneficio". 3 `RascaCard` con
  canvas de scratch-foil (gris plata + logo real de la marca al 55% + "Rascá acá"). Pincel
  radio 34, borra con arco+línea (sin estela), revela al **60%** rascado. Debajo del foil
  va **solo el nombre del premio** sobre el gradiente verde: el logo existe únicamente
  pintado en el canvas, si se pone también abajo se asoma por los huecos al rascar.
  La banda inferior (62px) es un solo `span` que la llena entera: nivel requerido en reposo,
  `bg-accent` + "Desbloqueado" al revelar, con transición `translateY`.
- **Reviews:** título + reviews (carousel o marquees según viewport) + 3 stat-cards sobre
  `green-dark` con contador animado (label `text-base lg:text-lg text-light`).
- **Cierre:** "suma." tipográfico gigante + botón "Descargar" + footer. Brillos flotantes,
  atenuados en mobile (`calc(var(--op) * 0.45)`) porque ahí tapan el botón.

## Estado / pendientes

- ✅ Toda la landing iterada y **full responsive** (mobile-first, con markup propio de mobile
  y desktop en las 4 secciones grandes — ver tabla arriba).
- ✅ `.env` configurado con las claves reales (key `sb_publishable_…`). La RPC `redeem_prize`
  responde OK; con datos inexistentes devuelve `"not_found"`, que el form mapea a su modal.
- ✅ SEO completo: og:image propia (`public/og-suma.jpg` 1200×630) + apple-touch-icon,
  canonical y `og:url` dinámicos con `useRequestURL()`, JSON-LD (Organization + WebSite +
  MobileApplication) en `index.vue`, twitter card, `lang="es-AR"`.
  **Sin `Review`/`aggregateRating` a propósito:** las reseñas de la sección Reviews son
  inventadas y marcarlas como datos estructurados reales es spam de rich snippets.
- ✅ Fotos de hábitos optimizadas vía `@nuxt/image`: los originales pesan 52 MB en total
  (~3 MB c/u, 1856×2304). Los `NuxtImg` del Hero llevan `width`/`height`/`format="webp"`
  → 28 KB por foto. **Si se agregan fotos, copiar esos props o vuelve el problema.**
- ⏳ Los links de Instagram y TikTok del footer apuntan a `#`. Al ponerlos, sumarlos también
  como `sameAs` en el `Organization` del JSON-LD de `index.vue`.
- ⏳ `README.md` sigue siendo el starter de Nuxt sin tocar.
