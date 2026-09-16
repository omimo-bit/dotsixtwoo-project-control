window.API={
  async call(action,payload={}){
    const token=localStorage.getItem(APP_CONFIG.TOKEN_KEY)||'';
    const res=await fetch(APP_CONFIG.API_URL,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({action,token,payload})});
    if(!res.ok) throw new Error('HTTP '+res.status);
    const data=await res.json();
    if(!data.success) throw new Error(data.error||'Request failed');
    return data.data;
  }
};
