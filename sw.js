const CACHE = 'certeiro-v6';
const STATIC = [
  './index.html',
  './registro.html',
  './vendedor.html',
  './manifest.json',
  './icon.svg'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(STATIC))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = e.request.url;
  // Deixa passar: Supabase, fontes externas, CDN
  if (url.includes('supabase.co') || url.includes('googleapis.com') || url.includes('jsdelivr.net')) return;
  // Stale-while-revalidate: serve cache imediatamente, atualiza em background
  e.respondWith(
    caches.open(CACHE).then(cache =>
      cache.match(e.request).then(cached => {
        const fetchPromise = fetch(e.request).then(res => {
          if (res && res.status === 200 && e.request.method === 'GET') {
            cache.put(e.request, res.clone());
          }
          return res;
        }).catch(() => cached);
        return cached || fetchPromise;
      })
    )
  );
});
