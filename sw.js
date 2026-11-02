// MR Production · service worker (sirve para que la app funcione sin internet)
// El nombre del caché sale de "?app=" (APP.id en index.html), así varias apps
// publicadas en el mismo dominio no se pisan entre sí. Subí "V" cuando publiques cambios.
const APP=new URL(self.location).searchParams.get("app")||"app";
const V="5.0";
const C="mrp-"+APP+"-"+V;
const F=["./","./index.html","./manifest.json","./icon-192.png","./icon-512.png","./pdf.js"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k
  .filter(x=>x!==C&&(x.startsWith("mrp-"+APP+"-")||(APP==="mtms"&&x.startsWith("mtms-"))))  // solo borra cachés viejos de ESTA app
  .map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener("fetch",e=>{if(e.request.method!=="GET"||!e.request.url.startsWith(self.location.origin))return;
 e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));return r}).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match("./index.html"))))});
