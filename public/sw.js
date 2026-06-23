const CACHE_NAME = 'drop-shop-homys-cache-v1'
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/styles.css'
]

self.addEventListener('install', (event) => {
  // @ts-ignore
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE)
    })
  )
})

self.addEventListener('activate', (event) => {
  // @ts-ignore
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((key) => {
      if (key !== CACHE_NAME) return caches.delete(key)
    })))
  )
})

self.addEventListener('fetch', (event) => {
  // @ts-ignore
  event.respondWith(
    caches.match(event.request).then((resp) => {
      return resp || fetch(event.request)
    })
  )
})
