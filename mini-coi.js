/*! mini-coi - Andrea Giammarchi and contributors, licensed under MIT */
(({ document: d, navigator: { serviceWorker: s } }) => {
  if (d) {
    // 1. Bypass if SharedArrayBuffer is already supported (e.g. localhost with COOP/COEP headers)
    if (typeof SharedArrayBuffer !== "undefined") {
      sessionStorage.removeItem('mini-coi-reloaded-time');
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

    // 3. Prevent infinite reload loop using a 10-second session cooldown window.
    // This blocks fast rapid loops while allowing manually triggered refreshes to retry.
    const reloadKey = 'mini-coi-reloaded-time';
    const lastReloadTime = parseInt(sessionStorage.getItem(reloadKey) || '0', 10);
    const now = Date.now();
    const isLimitActive = (now - lastReloadTime) < 10000; // Active if reloaded in the last 10 seconds

    const { currentScript: c } = d;
    s.register(c.src, { scope: c.getAttribute('scope') || '.' }).then(r => {
      // Enforce cooldown limit on updatefound
      r.addEventListener('updatefound', () => {
        if (!isLimitActive) {
          sessionStorage.setItem(reloadKey, Date.now().toString());
          location.reload();
        }
      });
      
      if (r.active && !s.controller) {
        // Enforce cooldown limit on active check
        if (!isLimitActive) {
          sessionStorage.setItem(reloadKey, Date.now().toString());
          location.reload();
        }
      } else if (s.controller) {
        // Reset state upon successful control
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
      
      // Safari Stream/Memory Bug Bypass:
      // Only process HTML, JS, CSS files which are strictly needed for Cross-Origin Isolation.
      // Large binary assets (clang, lld, sysroot.tar, memfs) do not need to be intercepted.
      const url = new URL(r.url);
      const pathname = url.pathname.toLowerCase();
      const shouldIsolate = pathname.endsWith('/') || 
                            pathname.endsWith('.html') || 
                            pathname.endsWith('.js') || 
                            pathname.endsWith('.css');
      
      if (!shouldIsolate) {
        return;
      }
      
      e.respondWith(fetch(r).then(res => {
        const { body, status, statusText } = res;
        if (!status || status > 399) return res;
        const h = new Headers(res.headers);
        h.set('Cross-Origin-Opener-Policy', 'same-origin');
        h.set('Cross-Origin-Embedder-Policy', 'require-corp');
        h.set('Cross-Origin-Resource-Policy', 'cross-origin');
        return new Response(body, { status, statusText, headers: h });
      }));
    });
  }
})(self);
