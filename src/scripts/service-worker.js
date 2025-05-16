import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';

// Precaching file hasil build
precacheAndRoute(self.__WB_MANIFEST);

// Push Notification handler
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

// Tambahkan runtime cache untuk CDN eksternal (Leaflet)
registerRoute(
  ({ url }) =>
    url.origin === "https://unpkg.com" &&
    (url.pathname.includes("leaflet.css") || url.pathname.includes("leaflet.js")),
  new CacheFirst({
    cacheName: "leaflet-cdn-cache",
  })
);

// Tidak perlu lagi manual install/fetch caching
// Karena precache & runtime route sudah handle
