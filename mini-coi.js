/*! mini-coi - Andrea Giammarchi and contributors, licensed under MIT */
(({ document: d, navigator: { serviceWorker: s } }) => {
  if (d) {
    // 1. Bypass if SharedArrayBuffer is already supported (e.g. localhost with COOP/COEP headers)
    if (typeof SharedArrayBuffer !== "undefined") {
      sessionStorage.removeItem('mini-coi-reloaded');
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
      const triggerReload = () => {
        if (!sessionStorage.getItem(reloadKey)) {
          sessionStorage.setItem(reloadKey, 'true');
          location.reload();
        }
      };

      r.addEventListener('updatefound', triggerReload);
      
      // Case A: Worker is already active but controller is missing (needs reload to claim)
      if (r.active && !s.controller) {
        triggerReload();
      }
      
      // Case B: First time visit. Service worker is installing or waiting.
      // We must listen for when it transitions to the 'activated' state, then reload.
      const pendingWorker = r.installing || r.waiting;
      if (pendingWorker) {
        pendingWorker.addEventListener('statechange', () => {
          if (pendingWorker.state === 'activated' && !s.controller) {
            triggerReload();
          }
        });
      }
      
      if (s.controller) {
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
