const CACHE='dotsixtwoo-v32-mom-workspace-20261002';
const ASSETS=['./','./index.html','./css/style.css','./js/config.js','./js/api.js','./js/app.js','./js/push-config.js','./js/push.js','./manifest.json','./assets/logo.png','./assets/icons/icon-192.png','./assets/icons/icon-512.png'];

// Existing offline/PWA behavior remains intact. Push is an additive layer.
try{
  importScripts('./js/push-config.js');
  if(self.PUSH_CONFIG&&self.PUSH_CONFIG.ENABLED){
    importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
    importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');
    if(!firebase.apps.length)firebase.initializeApp(self.PUSH_CONFIG.FIREBASE);
    const messaging=firebase.messaging();
    messaging.onBackgroundMessage(payload=>{
      const d=(payload&&payload.data)||{};
      const count=Number(d.unreadCount||1);
      const tasks=[];
      if(self.navigator&&'setAppBadge' in self.navigator){tasks.push(count>0?self.navigator.setAppBadge(count):self.navigator.clearAppBadge())}
      tasks.push(self.registration.showNotification(d.title||'DOTSIXTWOO',{body:d.body||d.message||'Update baru',icon:'./assets/icons/icon-192.png',badge:'./assets/icons/icon-192.png',tag:d.notificationId||('d2-'+Date.now()),renotify:true,silent:false,data:{route:d.route||'notifications',recordId:d.recordId||'',notificationId:d.notificationId||'',unreadCount:count}}));
      tasks.push(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(list=>Promise.all(list.map(c=>c.postMessage({type:'D2_PUSH_RECEIVED',notificationId:d.notificationId||'',route:d.route||'notifications',recordId:d.recordId||'',unreadCount:count})))));
      return Promise.all(tasks);
    });
  }
}catch(e){/* Push config failure must never break the existing PWA. */}

self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));self.skipWaiting()});
self.addEventListener('activate',e=>e.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))),self.clients.claim()])));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))))});

self.addEventListener('notificationclick',e=>{
  e.notification.close();
  const d=e.notification.data||{},route=d.route||'notifications',recordId=d.recordId||'',url='./?pushRoute='+encodeURIComponent(route)+'&recordId='+encodeURIComponent(recordId)+'&notificationId='+encodeURIComponent(d.notificationId||'');
  e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(async list=>{
    for(const c of list){
      if('focus' in c){await c.focus();c.postMessage({type:'D2_NOTIFICATION_CLICK',route,recordId,notificationId:d.notificationId||''});return}
    }
    return clients.openWindow?clients.openWindow(url):null;
  }));
});
