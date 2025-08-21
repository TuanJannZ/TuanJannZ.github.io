const CACHE_NAME='jannz-cache-v1';
const ASSETS=['./','./index_upgraded.html','./manifest.json','./service-worker.js'];

self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS))); self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE_NAME && caches.delete(k))))); self.clients.claim();});
self.addEventListener('fetch',e=>{
  const req=e.request;
  e.respondWith(caches.match(req).then(c=>c||fetch(req).then(res=>{ if(req.method==='GET'){ const clone=res.clone(); caches.open(CACHE_NAME).then(c=>c.put(req,clone)); } return res; }).catch(()=>c)));
});
self.addEventListener('notificationclick',event=>{
  event.notification.close();
  event.waitUntil(self.clients.matchAll({type:'window'}).then(cs=>{const c=cs.find(w=>w.url.includes('/')); if(c) return c.focus(); return self.clients.openWindow('./');}));
});
