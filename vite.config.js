import { defineConfig } from 'vite';
import { resolve } from 'path';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  root: resolve(__dirname, 'src'),
  publicDir: resolve(__dirname, 'src', 'public'), // src/public digunakan sebagai public folder
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  plugins: [
    VitePWA({
      srcDir: 'scripts', // relatif dari root: 'src' → berarti src/public
      filename: 'service-worker.js', // nama file hasil build
      strategies: 'injectManifest',
      injectRegister: 'auto', // otomatis register saat load
      manifest: {
        name: 'OurStories',
        short_name: 'OurStories',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#317EFB',
        icons: [
          {
            src: '/favicon.png',
            sizes: '192x192',
            type: 'image/png',
          },
        ],
      },
      injectManifest: {
        swSrc: 'scripts/service-worker.js', 
        swDest: 'service-worker.js',
      },
    }),
  ],
});
