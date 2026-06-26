self.addEventListener('install', event => {
  // Force this new worker to take control immediately
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    // Delete all caches associated with this origin
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => caches.delete(key))
      );
    }).then(() => {
      // Unregister the service worker itself
      return self.registration.unregister();
    }).then(() => {
      // Claim clients and reload them to get uncached files
      return self.clients.claim();
    }).then(() => {
      return self.clients.matchAll();
    }).then(clients => {
      clients.forEach(client => {
        if (client.url) {
          client.navigate(client.url);
        }
      });
    })
  );
});
