export async function registerPwa() {
  if (!import.meta.env.PROD || typeof window === "undefined") return;

  const hostname = window.location.hostname;
  const isPreview =
    window.self !== window.top ||
    hostname.startsWith("id-preview--") ||
    hostname.startsWith("preview--") ||
    hostname === "lovableproject.com" ||
    hostname.endsWith(".lovableproject.com") ||
    hostname === "lovableproject-dev.com" ||
    hostname.endsWith(".lovableproject-dev.com") ||
    hostname === "beta.lovable.dev" ||
    hostname.endsWith(".beta.lovable.dev") ||
    new URLSearchParams(window.location.search).has("sw") === false;

  if (isPreview) return;

  const { registerSW } = await import("virtual:pwa-register");
  registerSW({ immediate: true });
}
