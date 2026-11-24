// Guarda o app e a biblioteca do Firebase no aparelho, para abrir mesmo sem internet.
// Com internet, o app sempre busca a versão mais nova primeiro.
const CACHE = 'goals-v5';
const SDK_BASE = 'https://www.gstatic.com/firebasejs/13.2.0/';
const CORE = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-maskable-512.png', './apple-touch-icon.png'];
const SDK = ['firebase-app.js', 'firebase-auth.js', 'firebase-firestore.js'].map((f) => SDK_BASE + f);

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(CORE)).then(() => self.skipWaiting()));
});

// Guarda a biblioteca do Firebase sem travar a instalação, com tempo-limite.
function saveSdk() {
  const job = caches.open(CACHE).then((cache) => Promise.all(SDK.map((url) =>
    cache.match(url).then((hit) => hit || cache.add(new Request(url, { mode: 'cors' })).catch(() => null)))));
  return Promise.race([job, new Promise((resolve) => setTimeout(resolve, 15000))]);
}

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
      .then(saveSdk)
  );
});

function cacheFirst(req) {
  return caches.open(CACHE).then((cache) =>
    cache.match(req).then((hit) => hit || fetch(req).then((res) => {
      if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
      return res;
    }))
  );
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Biblioteca do Firebase: a versão é fixa, então a cópia guardada vale sempre.
  if (req.url.startsWith(SDK_BASE)) {
    event.respondWith(cacheFirst(req));
    return;
  }

  // Fontes do Google: usa a cópia guardada e atualiza quando der.
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.open(CACHE).then((cache) =>
        cache.match(req).then((hit) => {
          const net = fetch(req).then((res) => {
            if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
            return res;
          }).catch(() => hit);
          return hit || net;
        })
      )
    );
    return;
  }

  // Conexões com o login e o banco do Firebase passam direto, sem cópia.
  if (url.origin !== self.location.origin) return;

  // Arquivos do próprio site: internet primeiro, cópia guardada sem sinal.
  // A página sempre confere com o servidor se há versão nova, sem esperar o cache do navegador.
  const fresh = req.mode === 'navigate' ? new Request(req.url, { cache: 'no-cache', credentials: 'same-origin' }) : req;
  event.respondWith(
    fetch(fresh)
      .then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(req, copy));
        }
        return res;
      })
      .catch(() =>
        caches.match(req, { ignoreSearch: true }).then((hit) => hit || (req.mode === 'navigate' ? caches.match('./index.html') : undefined))
      )
  );
});
