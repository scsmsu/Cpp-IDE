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

    // 3. Prevent infinite reload loop using sessionStorage
    const reloadKey = 'mini-coi-reload-count';
    const reloadCount = parseInt(sessionStorage.getItem(reloadKey) || '0', 10);

    if (reloadCount > 3) {
      console.warn("mini-coi: Infinite reload loop detected and stopped. Please check browser settings or clear site data.");
      sessionStorage.removeItem(reloadKey);
      return;
    }

    const { currentScript: c } = d;
    s.register(c.src, { scope: c.getAttribute('scope') || '.' }).then(r => {
      r.addEventListener('updatefound', () => {
        sessionStorage.setItem(reloadKey, (reloadCount + 1).toString());
        location.reload();
      });
      if (r.active && !s.controller) {
        sessionStorage.setItem(reloadKey, (reloadCount + 1).toString());
        location.reload();
      } else if (s.controller) {
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
