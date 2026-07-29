# LandingSuma

Landing de canje de premios de **suma**, una app de hábitos saludables que premia la constancia
con recompensas de marcas aliadas.

Se usa en el stand de una carrera: quien participó ingresa su **correo electrónico** y su
**número de corredor**, la landing los valida contra Supabase y le habilita el retiro del premio.

Proyecto final de la carrera de Diseño y Desarrollo Web (Da Vinci).

## Stack

[Nuxt 4](https://nuxt.com) + Vue 3 · [Tailwind CSS 3](https://tailwindcss.com) ·
[Supabase](https://supabase.com) (RPC `redeem_prize`) · [GSAP](https://gsap.com) +
[Lenis](https://lenis.darkroom.engineering) · `@nuxt/image` · `@nuxt/fonts`

## Puesta en marcha

```bash
npm install
cp .env.example .env      # completar con las credenciales de Supabase
npm run dev               # http://localhost:3000
```

```bash
npm run build      # build de producción
npm run preview    # previsualizar el build
```

### Variables de entorno

| Variable | Descripción |
|---|---|
| `SUPABASE_URL` | URL del proyecto de Supabase |
| `SUPABASE_KEY` | Clave **publicable** (`sb_publishable_…`). Nunca la `secret` |
| `NUXT_PUBLIC_SITE_URL` | Dominio de producción, sin barra final. Define el `canonical`, el `og:url`, el `sitemap.xml` y el JSON-LD |

> La clave publicable viaja al navegador por diseño: la seguridad del canje vive en la función
> `redeem_prize` de Supabase (`SECURITY DEFINER`) y en las políticas RLS de las tablas.

## Deploy

Preparado para Vercel. Hay que cargar las tres variables de entorno en el proyecto.

---

Las notas de implementación —convenciones, decisiones de responsive, el porqué de cada
animación, cómo optimizar fotos nuevas— están en [CLAUDE.md](CLAUDE.md).
