window.API={
  async call(action,payload={}){
    if(!navigator.onLine) throw new Error('Sedang offline. Hubungkan internet lalu coba lagi.');
    const token=localStorage.getItem(APP_CONFIG.TOKEN_KEY)||'';
    const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),20000);
    try{
      const res=await fetch(APP_CONFIG.API_URL,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({action,token,payload}),signal:controller.signal});
      if(!res.ok) throw new Error('HTTP '+res.status);
      const data=await res.json();
      if(!data.success) throw new Error(data.error||'Request failed');
      return data.data;
    }catch(e){if(e.name==='AbortError')throw new Error('Server terlalu lama merespons. Coba lagi.');throw e}finally{clearTimeout(timer)}
  }
};
