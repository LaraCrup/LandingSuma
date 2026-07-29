// Nuxt sobreescribe runtimeConfig.public.siteUrl desde NUXT_PUBLIC_SITE_URL en runtime,
// salteándose el normalizado del nuxt.config. Sin esto, cargar la variable con barra final
// deja el canonical en "https://dominio//".
export function sinBarraFinal(url) {
  return String(url ?? '').replace(/\/+$/, '')
}
