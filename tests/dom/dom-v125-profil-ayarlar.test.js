/* ============================================================
   v125 — GERÇEK DOM'DA AYARLAR/PROFİL KONTROLÜ
   tests/dom/dom-v125-profil-ayarlar.test.js
   ------------------------------------------------------------
   Site GERÇEK index.html olarak yüklenir ve app-pwa.js sayfa bağlamında
   değerlendirilir. Ölçülen: Ayarlar çekmecesinin içindeki üç bölüm
   (HESAP · BİLGİLER · VERİ) gerçekten doluyor mu; kaldırılanlar gerçekten
   yok mu (Uygulamayı Tanı, ayrı profil penceresi, "Kilitle" düğmesi).
   ============================================================ */
const fs=require("fs"), path=require("path");
const {JSDOM, VirtualConsole}=require("jsdom");
const KOK="/home/user/Analiz-merkezi-";
const html=fs.readFileSync(path.join(KOK,"site/index.html"),"utf8");
const vc=new VirtualConsole(); const hatalar=[];
vc.on("jsdomError",e=>hatalar.push(String(e&&e.message||e)));
const dom=new JSDOM(html,{url:"https://analiz-merkezi.vercel.app/",pretendToBeVisual:true,virtualConsole:vc,runScripts:"outside-only"});
const {window}=dom, {document}=window;
window.state={user:{name:"Ahmet İbrahim",grade:"10"},
  settings:{okulizyon:{ad:"AHMET İBRAHİM",okulNo:"1234",sinif:"10",il:"Gaziantep",ilce:"Şahinbey",okulAdi:"Akken Anadolu Lisesi"},
            aydinlatma:{surum:"2026-10-27",tarih:"2026-10-27T00:00:00Z"}},
  okulizyon:{pending:[],importedKeys:[],pulledAt:0,durum:{kod:"ok",zaman:Date.now(),mesaj:"2 deneme"}},
  exams:[],questions:[],topics:{},dailyTasks:{study:false,read:false,solve:false,date:null}};
window.saveState=()=>{}; window.toast=(m,k)=>{window.__toasts=(window.__toasts||[]).concat([k+":"+m]);};
window.escHtml=t=>String(t==null?"":t).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
window.lucide={createIcons(){}};
window.fetch=()=>Promise.reject(new Error("ağ kapalı"));
let src=fs.readFileSync(path.join(KOK,"site/app-pwa.js"),"utf8").replace(/^import .*$/gm,"");
src='window.SUPABASE_CONFIG={url:"",anonKey:""}; window.FIREBASE_CONFIG={}; window.FCM_VAPID_KEY="";\n'+src;
let hata=null; try{window.eval(src);}catch(e){hata=String(e&&(e.stack||e.message));}
const hazir=new Promise(r=>{ if(document.readyState==="complete")return r(); window.addEventListener("load",()=>r()); setTimeout(r,3000); });
(async()=>{
 await hazir;
 const ok=[];
 const bekle=(ad,kosul,ek)=>ok.push([ad,!!kosul,ek]);
 bekle("modül hatasız yüklendi",!hata,hata);
 // SATIR İÇİ BETİKLER jsdom'da koşmadığı için openSettings yok.
 // Ölçülen asıl şey: gerçek renderer bölümleri dolduruyor mu.
 bekle("renderer tanımlı", typeof window.renderProfileModal === "function");
 window.renderProfileModal();
 await new Promise(r=>setTimeout(r,50));
 bekle("HESAP bölümü doldu", (document.getElementById("profil-hesap-icerik").innerHTML||"").length>50);
 bekle("HESAP'ta e-posta/hesap satırı", /Giriş Yap|Çıkış|Yedek/.test(document.getElementById("profil-hesap-icerik").innerHTML));
 bekle("BİLGİLER bölümü doldu", (document.getElementById("profil-bilgiler-icerik").innerHTML||"").length>200);
 bekle("BİLGİLER'de okul no alanı", !!document.getElementById("okz-okulNo"));
 bekle("BİLGİLER'de ad kayıtlı değerle dolu", (document.getElementById("okz-ad")||{}).value==="AHMET İBRAHİM");
 bekle("BİLGİLER'de son çekim satırı", /Son çekim/.test(document.getElementById("profil-bilgiler-icerik").innerHTML));
 bekle("VERİ bölümü doldu", (document.getElementById("profil-veri-icerik").innerHTML||"").length>50);
 bekle("VERİ'de kilidin DÜRÜST durumu", /KAPALI|KİLİTLİ|AÇIK/.test(document.getElementById("profil-veri-icerik").innerHTML));
 bekle("VERİ'de 'Kilitle' aç/kapa düğmesi YOK", !/data-act="kasaKilitle"/.test(document.getElementById("profil-veri-icerik").innerHTML));
 bekle("VERİ'de teknik cümle yok", !/anlamsız harf|sunucuya hiç gitmez/.test(document.getElementById("profil-veri-icerik").innerHTML));
 bekle("silme düğmeleri VERİ altında", !!document.querySelector("[data-profil-grup='veri'] [data-act='confirmReset']"));
 bekle("Uygulamayı Tanı düğmesi yok", !/Uygulamayı Tanı/.test(document.getElementById("settings-drawer").innerHTML));
 bekle("kılavuz düğmesi duruyor", !!document.querySelector("#settings-drawer [data-act='openHelp']"));
 // profil sekmesine basınca AYNI çekmece açılmalı
 const nav=document.getElementById("pwa-profile-nav");
 if(nav) nav.dispatchEvent(new window.MouseEvent("click",{bubbles:true}));
 await new Promise(r=>setTimeout(r,80));
 bekle("profil sekmesi ayrı tam ekran pencere AÇMIYOR", !document.getElementById("pwa-profile-modal"));
 let kalan=0;
 ok.forEach(([ad,g,e])=>{ if(!g){kalan++; console.log("❌ "+ad+(e?" → "+e:""));} else console.log("✅ "+ad); });
 const onemli=hatalar.filter(h=>!/Not implemented/.test(h));
 if(onemli.length) console.log("JSDOM:",onemli.slice(0,3));
 console.log("\n"+(ok.length-kalan)+"/"+ok.length+" DOM kontrolü geçti");
 process.exit(kalan?1:0);
})().catch(e=>{console.log("ÇÖKTÜ:",e&&(e.stack||e.message));process.exit(1);});
