import { defineConfig } from 'vite';
import { dirname, resolve } from 'path';
import { VitePWA } from 'vite-plugin-pwa';
import { fileURLToPath } from 'url';

// Buat __dirname di ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  root: resolve(__dirname, 'src'),
  publicDir: resolve(__dirname, 'src', 'public'),
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
  },
  resolve: {
    alias: { '@': resolve(__dirname, 'src') },
  },
  plugins: [
    VitePWA({
      strategies: 'injectManifest',
      injectRegister: 'auto',
      srcDir: 'scripts',
      filename: 'service-worker.js',
      manifest: {
        name: 'OurStories',
        short_name: 'OurStories',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#317EFB',
        icons: [{ src: '/favicon.png', sizes: '192x192', type: 'image/png' }],
      },
      workbox: {
        globPatterns: ['*/.{js,css,html,ico,png,svg,webmanifest}'],
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'document',
            handler: 'NetworkFirst',
            options: { cacheName: 'pages-cache' },
          },
          {
            urlPattern: ({ request }) =>
              ['style', 'script'].includes(request.destination),
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'static-resources' },
          },
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 302460 * 60 },
            },
          },
        ],
      },
    }),
  ],
});
