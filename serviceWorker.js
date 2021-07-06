const CACHE_NAME = "version-1";
const assetsToCache = [
  "/",
  "/icon.png",
  "/index.html",
  "/assets/css/styles.css",
  "/assets/js/script.js",
  "/assets/js/app.js",
];

const self = this;

// install SW
self.addEventListener("install", (installEvent) => {
  installEvent.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");

      return cache.addAll(assetsToCache);
    })
  );
});

// fetch assets
self.addEventListener("fetch", (fetchEvent) => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then((res) => {
      return (
        res ||
        fetch(fetchEvent.request).catch(() => caches.match("offline.html"))
      );
    })
  );
});

// activate SW
self.addEventListener("activate", (activateEvent) => {
  const cacheWhitelist = [];
  cacheWhitelist.push(CACHE_NAME);

  activateEvent.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});
