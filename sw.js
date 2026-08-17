const CACHE='nevo-studio-v2.6';
const ASSETS=['./','./index.html','./style.css','./app.js','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  event.respondWith(fetch(event.request).then(resp=>{
    const copy=resp.clone();caches.open(CACHE).then(c=>c.put(event.request,copy));return resp;
  }).catch(()=>caches.match(event.request).then(c=>c||caches.match('./index.html'))));
});
