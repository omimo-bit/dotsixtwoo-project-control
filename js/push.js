(function(){
  const CFG=window.PUSH_CONFIG||{};
  const TOKEN_KEY='d62_fcm_token';
  const DEVICE_KEY='d62_device_id';
  const seen=window.__d2PushSeen=window.__d2PushSeen||new Set();
  let messaging=null,swReg=null,uiReady=false;
  const isIOS=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  const standalone=()=>window.matchMedia?.('(display-mode: standalone)').matches||window.navigator.standalone===true;
  const supported=()=>!!(CFG.ENABLED&&'serviceWorker' in navigator&&'Notification' in window&&window.firebase?.messaging);
  const deviceId=()=>{let id=localStorage.getItem(DEVICE_KEY);if(!id){id=(crypto.randomUUID?crypto.randomUUID():'D-'+Date.now()+'-'+Math.random().toString(36).slice(2));localStorage.setItem(DEVICE_KEY,id)}return id};
  const platform=()=>isIOS?'iOS':(/Android/i.test(navigator.userAgent)?'Android':'Web');
  const remember=id=>{if(id)seen.add(String(id))};
  async function badge(count){try{count=Number(count||0);if('setAppBadge' in navigator){if(count>0)await navigator.setAppBadge(count);else if('clearAppBadge' in navigator)await navigator.clearAppBadge()}}catch(e){}}
  function statusText(){
    if(!CFG.ENABLED)return'Belum dikonfigurasi oleh admin.';
    if(isIOS&&!standalone())return'Di iPhone/iPad: tambahkan DOTSIXTWOO ke Home Screen terlebih dahulu.';
    if(!('Notification' in window))return'Perangkat/browser ini belum mendukung notification.';
    if(Notification.permission==='denied')return'Notifikasi diblokir. Aktifkan dari Settings perangkat.';
    if(Notification.permission==='granted'&&localStorage.getItem(TOKEN_KEY))return'Notification shade, banner, badge dan suara sistem aktif.';
    return'Tekan Aktifkan agar update masuk ke notification shade / Notification Center.';
  }
  function renderPushUI(){
    const list=document.getElementById('notificationList');if(!list||uiReady)return;uiReady=true;
    const box=document.createElement('div');box.id='pushDeviceCard';box.className='card';
    box.innerHTML='<div class="row"><div><strong>Notifikasi Perangkat</strong><div id="pushDeviceStatus" class="muted">'+statusText()+'</div></div><span class="badge yellow">PUSH</span></div><div class="row" style="margin-top:12px;gap:8px;justify-content:flex-start;flex-wrap:wrap"><button type="button" id="enablePushBtn" class="btn primary small">Aktifkan</button><button type="button" id="testPushBtn" class="btn small">Tes</button><button type="button" id="disablePushBtn" class="btn ghost small">Nonaktifkan</button></div><p class="muted tiny" style="margin-bottom:0">Suara mengikuti ringtone/notifikasi bawaan Android atau iPhone. Pengaturannya dilakukan dari Settings perangkat.</p>';
    list.parentNode.insertBefore(box,list);
    document.getElementById('enablePushBtn').onclick=enable;
    document.getElementById('testPushBtn').onclick=test;
    document.getElementById('disablePushBtn').onclick=disable;
    refreshUI();
  }
  function refreshUI(msg){const s=document.getElementById('pushDeviceStatus');if(s)s.textContent=msg||statusText();const token=localStorage.getItem(TOKEN_KEY);const en=document.getElementById('enablePushBtn'),dis=document.getElementById('disablePushBtn'),test=document.getElementById('testPushBtn');if(en)en.style.display=token?'none':'inline-block';if(dis)dis.style.display=token?'inline-block':'none';if(test)test.style.display=token?'inline-block':'none'}
  function initFirebase(){
    if(!supported())throw new Error(CFG.ENABLED?'Firebase Messaging tidak tersedia pada browser ini.':'Push belum dikonfigurasi admin.');
    if(!firebase.apps.length)firebase.initializeApp(CFG.FIREBASE);
    if(!messaging){messaging=firebase.messaging();messaging.onMessage(onForegroundMessage)}
    return messaging;
  }
  async function ensureSW(){if(swReg)return swReg;swReg=await navigator.serviceWorker.ready;return swReg}
  async function enable(){
    try{
      if(isIOS&&!standalone())throw new Error('Di iPhone/iPad, pilih Share → Add to Home Screen, lalu buka DOTSIXTWOO dari icon Home Screen.');
      initFirebase();
      const perm=await Notification.requestPermission();if(perm!=='granted')throw new Error('Izin notifikasi belum diberikan.');
      const reg=await ensureSW();
      const token=await messaging.getToken({vapidKey:CFG.VAPID_KEY,serviceWorkerRegistration:reg});if(!token)throw new Error('Token notifikasi gagal dibuat.');
      await API.call('savePushSubscription',{fcmToken:token,deviceId:deviceId(),platform:platform(),userAgent:navigator.userAgent});
      localStorage.setItem(TOKEN_KEY,token);refreshUI('Aktif. Suara memakai notification sound bawaan perangkat.');
      try{await API.call('sendTestPush')}catch(e){}
    }catch(e){refreshUI(e.message||String(e));if(window.toast)toast(e.message||'Gagal mengaktifkan notifikasi')}
  }
  async function disable(){
    try{
      initFirebase();const token=localStorage.getItem(TOKEN_KEY)||'';
      try{await API.call('removePushSubscription',{fcmToken:token,deviceId:deviceId()})}catch(e){}
      try{await messaging.deleteToken()}catch(e){}
      localStorage.removeItem(TOKEN_KEY);await badge(0);refreshUI('Notifikasi perangkat dinonaktifkan pada device ini.');
    }catch(e){refreshUI(e.message||String(e))}
  }
  async function test(){try{await API.call('sendTestPush');refreshUI('Test push dikirim. Cek notification shade / Notification Center.')}catch(e){refreshUI(e.message||String(e))}}
  async function onForegroundMessage(payload){
    try{
      const d=payload?.data||{},id=d.notificationId||'';remember(id);await badge(Number(d.unreadCount||1));
      const reg=await ensureSW();await reg.showNotification(d.title||'DOTSIXTWOO',{body:d.body||d.message||'Update baru',icon:'./assets/icons/icon-192.png',badge:'./assets/icons/icon-192.png',tag:id||'d2-'+Date.now(),renotify:true,silent:false,data:{route:d.route||'notifications',recordId:d.recordId||'',notificationId:id}});
      if(window.toast)toast(d.title||'Update baru');
    }catch(e){}
  }
  function observeBadge(){const el=document.getElementById('notifCount');if(!el)return;const sync=()=>badge(parseInt(el.textContent||'0',10)||0);new MutationObserver(sync).observe(el,{childList:true,characterData:true,subtree:true});sync()}
  function routeFromPush(route,recordId){
    if(!route)return;const attempt=()=>{const main=document.getElementById('mainView');if(!main||main.classList.contains('hidden'))return false;try{if(route==='projects'&&recordId&&typeof window.openProject==='function')openProject(recordId);else if(typeof window.go==='function')go(route);return true}catch(e){return false}};
    if(attempt())return;let n=0;const t=setInterval(()=>{if(attempt()||++n>30)clearInterval(t)},500)
  }
  function handleStartupRoute(){const q=new URLSearchParams(location.search),route=q.get('pushRoute'),record=q.get('recordId');if(route){routeFromPush(route,record);q.delete('pushRoute');q.delete('recordId');q.delete('notificationId');const next=location.pathname+(q.toString()?'?'+q.toString():'')+location.hash;history.replaceState({},'',next)}}
  navigator.serviceWorker?.addEventListener('message',e=>{const d=e.data||{};if(d.type==='D2_PUSH_RECEIVED'){remember(d.notificationId);badge(d.unreadCount);if(d.route&&document.visibilityState==='visible')routeFromPush(d.route,d.recordId)}if(d.type==='D2_NOTIFICATION_CLICK')routeFromPush(d.route,d.recordId)});
  document.addEventListener('DOMContentLoaded',()=>{renderPushUI();observeBadge();handleStartupRoute()});
  if(document.readyState!=='loading'){renderPushUI();observeBadge();handleStartupRoute()}
  window.PushLayer={enable,disable,test,badge,remember,systemSoundPreferred:()=>!!localStorage.getItem(TOKEN_KEY),isEnabled:()=>!!localStorage.getItem(TOKEN_KEY)};
})();
