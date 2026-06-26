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

    // 3. Prevent infinite reload loop using a single session flag across ALL reload triggers
    const reloadKey = 'mini-coi-reloaded';
    const { currentScript: c } = d;
    s.register(c.src, { scope: c.getAttribute('scope') || '.' }).then(r => {
      // Enforce the one-reload constraint on the updatefound event as well
      r.addEventListener('updatefound', () => {
        if (!sessionStorage.getItem(reloadKey)) {
          sessionStorage.setItem(reloadKey, 'true');
          location.reload();
        }
      });
      
      if (r.active && !s.controller) {
        // Enforce the one-reload constraint on active check
        if (!sessionStorage.getItem(reloadKey)) {
          sessionStorage.setItem(reloadKey, 'true');
          location.reload();
        }
      } else if (s.controller) {
        // Reset the reload state on successful control
        sessionStorage.removeItem(reloadKey);
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
