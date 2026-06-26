const CACHE_NAME = 'comparativo-creditos-v1';

// Lista de archivos y recursos esenciales para almacenar en caché
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './acr.png',
  './sol.png',
  './log.png', // ✨ Icono unificado de la aplicación
  'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap'
];

// Evento de Instalación: Guarda los recursos estáticos en la caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Creando caché de la PWA...');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Evento de Activación: Limpia versiones viejas de caché si las hubiera
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('🗑️ Borrando caché antigua:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Evento Fetch: Sirve los archivos desde la caché si no hay internet (Offline)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retorna el archivo desde la caché, o hace la petición a internet si no está cacheado
        return response || fetch(event.request);
      })
  );
});