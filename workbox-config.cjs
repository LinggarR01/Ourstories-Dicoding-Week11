// module.exports = {
//   globDirectory: 'dist/',
//   globPatterns: [
//     '**/*.{html,js,css,png,svg,webmanifest}'
//   ],
//   swDest: 'dist/service-worker.js', // ✅ inilah yang wajib ada
//   skipWaiting: true,
//   clientsClaim: true,
//   runtimeCaching: [
//     {
//       urlPattern: ({ request }) => request.destination === 'document',
//       handler: 'NetworkFirst',
//       options: {
//         cacheName: 'pages-cache',
//       },
//     },
//     {
//       urlPattern: ({ request }) => request.destination === 'style' || request.destination === 'script',
//       handler: 'StaleWhileRevalidate',
//       options: {
//         cacheName: 'static-resources',
//       },
//     },
//     {
//       urlPattern: ({ request }) => request.destination === 'image',
//       handler: 'CacheFirst',
//       options: {
//         cacheName: 'image-cache',
//         expiration: {
//           maxEntries: 50,
//           maxAgeSeconds: 30 * 24 * 60 * 60,
//         },
//       },
//     }
//   ]
// };
