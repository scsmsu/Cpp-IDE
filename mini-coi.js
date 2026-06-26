/*! mini-coi - Andrea Giammarchi and contributors, licensed under MIT */
(({ document: d, navigator: { serviceWorker: s } }) => {
  if (d) {
    // 1. Bypass if SharedArrayBuffer is already supported (e.g. localhost with COOP/COEP headers)
    if (typeof SharedArrayBuffer !== "undefined") {
      return;
    }

    // 2. Redirect to end with trailing slash if pathname is a directory without one
    const loc = location;
    if (loc.pathname && !loc.pathname.endsWith('/')) {
      const parts = loc.pathname.split('/');
      const lastPart = parts[parts.length - 1];
      if (!lastPart.includes('.')) {
        loc.replace(loc.origin + loc.pathname + '/' + loc.search + loc.hash);
        return;
      }
    }

    // 3. Prevent rapid reload loop using a cooldown timestamp (3 seconds)
    const lastReloadKey = 'mini-coi-last-reload-time';
    const lastReload = parseInt(sessionStorage.getItem(lastReloadKey) || '0', 10);
    const now = Date.now();

    const { currentScript: c } = d;
    s.register(c.src, { scope: c.getAttribute('scope') || '.' }).then(r => {
      r.addEventListener('updatefound', () => {
        if (Date.now() - lastReload > 3000) {
          sessionStorage.setItem(lastReloadKey, Date.now().toString());
          location.reload();
        }
      });
      
      if (r.active && !s.controller) {
        // Cooldown defense: if we reloaded less than 3 seconds ago, do not reload again.
        // This gives the browser time to bind the active controller without looping.
        if (now - lastReload > 3000) {
          sessionStorage.setItem(lastReloadKey, now.toString());
          location.reload();
        } else {
          console.warn("mini-coi: Reload deferred to let browser bind controller.");
          // Listen to controller changes dynamically to resume without infinite reloading
          s.addEventListener('controllerchange', () => {
            console.log("mini-coi: Controller resolved successfully.");
            location.reload(); // Reload once to enforce COOP/COEP after binding
          }, { once: true });
        }
      } else if (s.controller) {
        // Reset timestamp on successful control
        sessionStorage.removeItem(lastReloadKey);
      }
    }).catch(err => {
      console.error("mini-coi: Service worker registration failed:", err);
    });
  } else {
    addEventListener('install', () => skipWaiting());
    addEventListener('activate', e => e.waitUntil(clients.claim()));
    addEventListener('fetch', e => {
      const { request: r } = e;
      if (r.cache === 'only-if-cached' && r.mode !== 'same-origin') return;
      e.respondWith(fetch(r).then(r => {
        const { body, status, statusText } = r;
        if (!status || status > 399) return r;
        const h = new Headers(r.headers);
        h.set('Cross-Origin-Opener-Policy', 'same-origin');
        h.set('Cross-Origin-Embedder-Policy', 'require-corp');
        h.set('Cross-Origin-Resource-Policy', 'cross-origin');
        return new Response(body, { status, statusText, headers: h });
      }));
    });
  }
})(self);
