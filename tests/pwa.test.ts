import test from 'node:test';
import assert from 'node:assert/strict';
import { runInNewContext } from 'node:vm';
import { workerSource } from '../lib/pwa-worker';
function worker(failAsset = false) {
  const handlers: Record<string, (event: any) => void> = {};
  const stores = new Map<string, Map<string, Response>>();
  let offline = false, activations = 0, claims = 0;
  const cache = (name: string) => {
    if (!stores.has(name)) stores.set(name, new Map());
    const data = stores.get(name)!;
    return { match: async (request: string | { url: string }) => data.get(typeof request === 'string' ? request : request.url),
      put: async (key: string | { url: string }, response: Response) => { data.set(typeof key === 'string' ? key : key.url, response); },
      addAll: async (urls: string[]) => { for (const url of urls) { if (failAsset && url.includes('icon-512')) throw Error('Asset failed'); data.set(url, new Response('asset')); } } };
  };
  runInNewContext(workerSource('0.2.0-test'), {
    self: { location: { origin: 'https://tcg.test' }, addEventListener: (name: string, handler: (event: any) => void) => { handlers[name] = handler; },
      skipWaiting: () => { activations++; }, clients: { claim: async () => { claims++; } } },
    caches: { open: async (name: string) => cache(name), keys: async () => [...stores.keys()], delete: async (name: string) => stores.delete(name) },
    fetch: async () => { if (offline) throw Error('Offline'); return new Response('<script src="/_next/static/game.js"></script><link href="https://external.test/file.css"><a href="/dev">dev</a>', {headers:{'Content-Type':'text/html'}}); },
    Response, URL,
  });
  async function lifecycle(name: string) { let task: Promise<void> | undefined; handlers[name]({ waitUntil: (promise: Promise<void>) => { task = promise; } }); await task; }
  function request(url: string, mode = 'navigate', method = 'GET') { let result: Promise<Response> | undefined; handlers.fetch({request:{url,mode,method},respondWith:(promise:Promise<Response>)=>{result=promise;}}); return result; }
  return { stores, lifecycle, request, handlers, offline: () => { offline = true; }, activations: () => activations, claims: () => claims };
}
test('PWA shell: required chunks cached, external assets/dev/player data excluded', async () => {
  const w=worker(); await w.lifecycle('install'); const entries=[...w.stores.get('tcg-shell-0.2.0-test')!.keys()];
  assert.ok(entries.includes('/')); assert.ok(entries.includes('https://tcg.test/_next/static/game.js'));
  assert.ok(!entries.some(key=>key.includes('external')||key.includes('/dev')||key.includes('sauvegarde')));
  assert.equal(w.activations(),0);
});
test('PWA failed asset installation removes incomplete shell', async () => {
  const w=worker(true); await assert.rejects(w.lifecycle('install')); assert.equal(w.stores.size,0);
});
test('PWA offline navigation restores shell, /dev and non-GET requests bypass cache', async () => {
  const w=worker(); await w.lifecycle('install'); w.offline(); assert.equal((await w.request('https://tcg.test/')!).status,200);
  assert.equal(w.request('https://tcg.test/dev'),undefined); assert.equal(w.request('https://external.test/'),undefined);
  assert.equal(w.request('https://tcg.test/','navigate','POST'),undefined);
});
test('PWA update activates only by explicit message; previous shell and unrelated caches retained', async () => {
  const w=worker(); await w.lifecycle('install'); w.stores.set('tcg-shell-oldest',new Map());w.stores.set('tcg-shell-previous',new Map());w.stores.set('other-app',new Map());
  w.handlers.message({data:{type:'UNRELATED'}});assert.equal(w.activations(),0);
  w.handlers.message({data:{type:'ACTIVATE_UPDATE'}});assert.equal(w.activations(),1);
  await w.lifecycle('activate');assert.equal(w.claims(),1);assert.ok(w.stores.has('tcg-shell-previous'));assert.ok(w.stores.has('other-app'));assert.ok(!w.stores.has('tcg-shell-oldest'));
});
