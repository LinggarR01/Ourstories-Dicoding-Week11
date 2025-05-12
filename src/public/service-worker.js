self.addEventListener("push", (event) => {
  let data = {};

  event.waitUntil(
    (async () => {
      try {
        data = event.data?.json();
      } catch (e) {
        const fallbackText = await event.data?.text();
        data = {
          title: "🔔 Notifikasi Simulasi",
          body: fallbackText || "Push dari DevTools (tanpa payload JSON)",
        };
      }

      const title = data.title || "Notifikasi Baru!";
      const options = {
        body: data.body || "Ada cerita menarik buat kamu.",
        icon: "/favicon.png",
        badge: "/favicon.png",
      };

      await self.registration.showNotification(title, options);
    })()
  );
});

const CACHE_NAME = "ourstories-cache-v1";
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/scripts/index.js",
  "/styles/styles.css",
  "/manifest.webmanifest",
  "/favicon.png",
  "/images/logo.png",
  "/icons/bell.svg",
  "/icons/bell-off.svg",
  "https://unpkg.com/leaflet/dist/leaflet.css",
  "https://unpkg.com/leaflet/dist/leaflet.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
