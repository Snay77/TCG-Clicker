// Only the public shell belongs in Cache Storage. Player data remains in localStorage.
export function workerSource(release: string) {
  return `
const CACHE = ${JSON.stringify(`tcg-shell-${release}`)};
const PREFIX = 'tcg-shell-';
const ASSETS = ['/manifest.webmanifest','/favicon.ico','/icon.svg','/icons/icon-192.png','/icons/icon-512.png','/icons/maskable-512.png','/icons/apple-touch-icon.png'];
self.addEventListener('install', event => event.waitUntil((async () => {
  const cache = await caches.open(CACHE);
  try {
    const response = await fetch('/', {cache:'reload'});
    if (!response.ok || !response.headers.get('content-type')?.includes('text/html')) throw Error('Shell unavailable');
    const html = await response.clone().text();
    const chunks = [...new Set([...html.matchAll(/(?:src|href)="([^"<>]+)"/g)].map(m => new URL(m[1].replace(/&amp;/g,'&'), self.location.origin)).filter(url => url.origin === self.location.origin && url.pathname.startsWith('/_next/static/')).map(url => url.href))];
    await cache.addAll([...ASSETS, ...chunks]);
    await cache.put('/', response);
  } catch (error) { await caches.delete(CACHE); throw error; }
})()));
self.addEventListener('activate', event => event.waitUntil((async () => {
  // Keep one previous shell so already-open tabs can still fetch their chunks.
  const keys = (await caches.keys()).filter(key => key.startsWith(PREFIX) && key !== CACHE);
  await Promise.all(keys.slice(0,-1).map(key => caches.delete(key)));
  await self.clients.claim();
})()));
self.addEventListener('message', event => {
  if (event.data?.type === 'ACTIVATE_UPDATE') self.skipWaiting();
});
self.addEventListener('fetch', event => {
  const request = event.request, url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  if (request.mode === 'navigate' && url.pathname === '/') {
    event.respondWith(fetch(request).catch(async () => {
      const shell = await (await caches.open(CACHE)).match('/');
      return shell || new Response('Reconnectez-vous pour préparer TCG Clicker.', {status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});
    }));
  } else if (url.pathname.startsWith('/_next/static/') || ASSETS.includes(url.pathname)) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE).catch(() => null), hit = await cache?.match(request,{ignoreSearch:ASSETS.includes(url.pathname)}).catch(() => undefined);
      if (hit) return hit;
      try {
        const response = await fetch(request);
        if (response.ok && response.type === 'basic') await cache?.put(request,response.clone()).catch(() => {});
        return response;
      } catch (error) {
        const keys = (await caches.keys()).filter(key => key.startsWith(PREFIX));
        for (const key of keys) { const previous = await (await caches.open(key)).match(request); if (previous) return previous; }
        throw error;
      }
    })());
  }
});
`;
}
