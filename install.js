(()=>{
'use strict';
const KEY='pwa-build-version';
let deferredPrompt=null;
const isStandalone=()=>window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true;
function ready(){document.documentElement.dataset.pwaInstalled=isStandalone()?'true':'false';}
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;document.dispatchEvent(new CustomEvent('pwa-install-ready'));});
window.pwaInstall=async()=>{if(!deferredPrompt)return false;deferredPrompt.prompt();const choice=await deferredPrompt.userChoice;deferredPrompt=null;return choice&&choice.outcome==='accepted';};
window.pwaIsInstalled=isStandalone;
async function checkVersion(){try{const r=await fetch('./version.json?ts='+Date.now(),{cache:'no-store'});const v=await r.json();const old=localStorage.getItem(KEY);if(old&&old!==String(v.version)){if('serviceWorker'in navigator){const regs=await navigator.serviceWorker.getRegistrations();await Promise.all(regs.map(reg=>reg.update()));}const keys=await caches.keys();await Promise.all(keys.map(k=>caches.delete(k)));localStorage.setItem(KEY,String(v.version));location.reload();return;}localStorage.setItem(KEY,String(v.version));}catch(e){}}
if('serviceWorker'in navigator){window.addEventListener('load',async()=>{try{const reg=await navigator.serviceWorker.register('./sw.js');await reg.update();navigator.serviceWorker.addEventListener('controllerchange',()=>location.reload());}catch(e){}ready();checkVersion();});}
})();
