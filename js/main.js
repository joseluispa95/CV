/* ---------- LANGUAGE ---------- */
let LANG = 'es';
function setLang(l){
  LANG = l;
  document.documentElement.lang = l;
  document.querySelectorAll('[data-es]').forEach(el=>{
    const v = el.getAttribute('data-'+l);
    if(v!==null) el.textContent = v;
  });
  document.getElementById('btn-es').classList.toggle('active', l==='es');
  document.getElementById('btn-en').classList.toggle('active', l==='en');
  const cv=document.getElementById('cv-download');
  if(cv){
    cv.setAttribute('href', l==='es' ? 'CV_ES.pdf' : 'CV_EN.pdf');
    cv.setAttribute('download', l==='es' ? 'CV_Jose_Luis_Pastor_ES.pdf' : 'CV_Jose_Luis_Pastor_EN.pdf');
  }
  const ph = l==='es'
    ? {name:'¿Cómo te llamas?', email:'tu@email.com', msg:'Cuéntame sobre tu proyecto...'}
    : {name:'Your name', email:'you@email.com', msg:'Tell me about your project...'};
  document.getElementById('f-name').placeholder = ph.name;
  document.getElementById('f-email').placeholder = ph.email;
  document.getElementById('f-msg').placeholder = ph.msg;
}

/* ---------- CONTACT (mailto) ---------- */
function sendMail(e){
  e.preventDefault();
  const n=document.getElementById('f-name').value;
  const em=document.getElementById('f-email').value;
  const m=document.getElementById('f-msg').value;
  const subj = encodeURIComponent((LANG==='es'?'Contacto web · ':'Web contact · ')+n);
  const body = encodeURIComponent(m+'\n\n— '+n+' ('+em+')');
  window.location.href='mailto:joseluispastoralemany@gmail.com?subject='+subj+'&body='+body;
  return false;
}

/* ---------- NAV ---------- */
window.addEventListener('scroll',()=>{
  document.getElementById('nav').classList.toggle('scrolled', window.scrollY>40);
});
document.querySelectorAll('.nav-links a').forEach(a=>a.addEventListener('click',()=>document.getElementById('navLinks').classList.remove('open')));
document.getElementById('year').textContent=new Date().getFullYear();

/* ---------- REVEAL + SKILL BARS ---------- */
const io=new IntersectionObserver((es)=>{
  es.forEach(en=>{
    if(en.isIntersecting){
      en.target.classList.add('in');
      en.target.querySelectorAll('.bar i').forEach(b=>b.style.width=b.dataset.w+'%');
      io.unobserve(en.target);
    }
  });
},{threshold:.15});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

/* ---------- SPACE BACKGROUND: stars + wireframe globe + satellites ---------- */
(function(){
  const cv=document.getElementById('space-bg');
  const ctx=cv.getContext('2d');
  let W,H,DPR,stars=[],cx,cy,R;
  const mouse={x:0,y:0};
  function resize(){
    DPR=Math.min(window.devicePixelRatio||1,2);
    W=cv.width=innerWidth*DPR; H=cv.height=innerHeight*DPR;
    cv.style.width=innerWidth+'px'; cv.style.height=innerHeight+'px';
    cx=W*0.74; cy=H*0.42; R=Math.min(W,H)*0.26;
    stars=[];
    const n=Math.floor((innerWidth*innerHeight)/6500);
    for(let i=0;i<n;i++){
      stars.push({x:Math.random()*W,y:Math.random()*H,z:Math.random(),tw:Math.random()*Math.PI*2});
    }
  }
  addEventListener('resize',resize); resize();
  addEventListener('mousemove',e=>{mouse.x=(e.clientX/innerWidth-.5);mouse.y=(e.clientY/innerHeight-.5);});

  // globe wireframe points (lat/long grid)
  function globeLines(rot){
    const lines=[];
    // meridians
    for(let lon=0;lon<180;lon+=20){
      const pts=[];
      for(let lat=-90;lat<=90;lat+=8){
        pts.push(sphere(lat, lon, rot));
      }
      lines.push(pts);
    }
    // parallels
    for(let lat=-60;lat<=60;lat+=30){
      const pts=[];
      for(let lon=0;lon<=360;lon+=12){
        pts.push(sphere(lat, lon, rot));
      }
      lines.push(pts);
    }
    return lines;
  }
  function sphere(latD, lonD, rot){
    const lat=latD*Math.PI/180, lon=lonD*Math.PI/180 + rot;
    const tilt=0.41; // ~23.5deg
    let x=Math.cos(lat)*Math.cos(lon);
    let y=Math.sin(lat);
    let z=Math.cos(lat)*Math.sin(lon);
    // tilt around X
    const y2=y*Math.cos(tilt)-z*Math.sin(tilt);
    const z2=y*Math.sin(tilt)+z*Math.cos(tilt);
    return {x:x, y:y2, z:z2};
  }
  const sats=[
    {r:1.35, sp:0.6, ph:0, inc:0.5},
    {r:1.6, sp:0.42, ph:2, inc:-0.9},
    {r:1.18, sp:0.85, ph:4, inc:1.4}
  ];

  let t=0;
  function draw(){
    t+=0.0025;
    ctx.clearRect(0,0,W,H);
    const px=mouse.x*20*DPR, py=mouse.y*20*DPR;

    // stars
    for(const s of stars){
      s.tw+=0.03;
      const a=(0.35+0.65*Math.abs(Math.sin(s.tw)))*(0.3+s.z*0.7);
      const sz=(s.z*1.6+0.3)*DPR;
      ctx.beginPath();
      ctx.fillStyle='rgba(200,225,255,'+a+')';
      ctx.arc(s.x+px*s.z, s.y+py*s.z, sz, 0, Math.PI*2);
      ctx.fill();
    }

    // globe
    const rot=t;
    const lines=globeLines(rot);
    // glow halo
    const g=ctx.createRadialGradient(cx+px,cy+py,R*0.2,cx+px,cy+py,R*1.5);
    g.addColorStop(0,'rgba(77,225,255,0.10)');
    g.addColorStop(1,'rgba(77,225,255,0)');
    ctx.fillStyle=g;
    ctx.beginPath();ctx.arc(cx+px,cy+py,R*1.5,0,Math.PI*2);ctx.fill();

    for(const line of lines){
      ctx.beginPath();
      let started=false;
      for(const p of line){
        const sx=cx+px+p.x*R, sy=cy+py-p.y*R;
        const front=p.z>=-0.02;
        if(!front){ started=false; continue; }
        if(!started){ctx.moveTo(sx,sy);started=true;} else ctx.lineTo(sx,sy);
      }
      const depth=0.5;
      ctx.strokeStyle='rgba(90,170,255,0.28)';
      ctx.lineWidth=1*DPR;
      ctx.stroke();
    }
    // globe rim
    ctx.beginPath();
    ctx.arc(cx+px,cy+py,R,0,Math.PI*2);
    ctx.strokeStyle='rgba(124,92,255,0.5)';
    ctx.lineWidth=1.4*DPR;
    ctx.stroke();

    // satellites
    for(const sat of sats){
      sat.ph+=sat.sp*0.01;
      const a=sat.ph;
      let x=Math.cos(a)*sat.r, y=Math.sin(a)*0.25, z=Math.sin(a)*sat.r;
      const y2=y*Math.cos(sat.inc)-z*Math.sin(sat.inc);
      const z2=y*Math.sin(sat.inc)+z*Math.cos(sat.inc);
      const sx=cx+px+x*R, sy=cy+py-y2*R;
      const front=z2>=0;
      const rad=(front?3.2:1.8)*DPR;
      ctx.beginPath();
      ctx.fillStyle=front?'rgba(56,255,206,0.95)':'rgba(56,255,206,0.4)';
      ctx.arc(sx,sy,rad,0,Math.PI*2);
      ctx.fill();
      if(front){
        ctx.beginPath();
        ctx.fillStyle='rgba(56,255,206,0.18)';
        ctx.arc(sx,sy,rad*2.6,0,Math.PI*2);
        ctx.fill();
      }
      // orbit trail
      ctx.beginPath();
      for(let k=0;k<=64;k++){
        const aa=a-(k/64)*1.1;
        let ox=Math.cos(aa)*sat.r, oy=Math.sin(aa)*0.25, oz=Math.sin(aa)*sat.r;
        const oy2=oy*Math.cos(sat.inc)-oz*Math.sin(sat.inc);
        const osx=cx+px+ox*R, osy=cy+py-oy2*R;
        if(k===0)ctx.moveTo(osx,osy);else ctx.lineTo(osx,osy);
      }
      ctx.strokeStyle='rgba(56,255,206,0.15)';
      ctx.lineWidth=1*DPR;ctx.stroke();
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ---------- PROJECT MINI-VISUALS ---------- */
document.querySelectorAll('canvas.visual').forEach(cv=>{
  const ctx=cv.getContext('2d');
  const type=cv.dataset.viz;
  function fit(){cv.width=cv.offsetWidth;cv.height=cv.offsetHeight;}
  const ro=new ResizeObserver(fit);ro.observe(cv);fit();
  let t=Math.random()*10;
  function loop(){
    t+=0.02;const w=cv.width,h=cv.height;ctx.clearRect(0,0,w,h);
    ctx.strokeStyle='rgba(77,225,255,0.35)';ctx.fillStyle='rgba(56,255,206,0.5)';ctx.lineWidth=1;
    if(type==='mesh'){
      const cols=8,rows=6;
      for(let i=0;i<=cols;i++)for(let j=0;j<=rows;j++){
        const x=(i/cols)*w, y=(j/rows)*h*0.9+h*0.05;
        const z=Math.sin(i*0.6+t)+Math.cos(j*0.7+t*0.8);
        const yy=y+z*7;
        if(i<cols){const z2=Math.sin((i+1)*0.6+t)+Math.cos(j*0.7+t*0.8);ctx.beginPath();ctx.moveTo(x,yy);ctx.lineTo(((i+1)/cols)*w,y+z2*7);ctx.stroke();}
        if(j<rows){const z3=Math.sin(i*0.6+t)+Math.cos((j+1)*0.7+t*0.8);ctx.beginPath();ctx.moveTo(x,yy);ctx.lineTo(x,(j+1)/rows*h*0.9+h*0.05+z3*7);ctx.stroke();}
      }
    } else if(type==='globe'){
      const cx=w/2,cy=h/2,r=Math.min(w,h)*0.32;
      ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.strokeStyle='rgba(124,92,255,0.5)';ctx.stroke();
      for(let lat=-60;lat<=60;lat+=30){const rr=r*Math.cos(lat*Math.PI/180);const yy=cy-r*Math.sin(lat*Math.PI/180);ctx.beginPath();ctx.ellipse(cx,yy,rr,rr*0.28,0,0,Math.PI*2);ctx.strokeStyle='rgba(77,225,255,0.25)';ctx.stroke();}
      for(let k=0;k<6;k++){const a=t+k*Math.PI/3;ctx.beginPath();ctx.ellipse(cx,cy,r*Math.abs(Math.cos(a)),r,0,0,Math.PI*2);ctx.strokeStyle='rgba(77,225,255,0.18)';ctx.stroke();}
    } else {
      const g=10;
      for(let i=0;i<w;i+=g){for(let j=0;j<h;j+=g){const d=Math.sin(i*0.05+t)+Math.cos(j*0.05+t);if(d>1.2){ctx.fillStyle='rgba(56,255,206,'+(d-1.2)*0.5+')';ctx.fillRect(i,j,g-2,g-2);}}}
    }
    requestAnimationFrame(loop);
  }
  loop();
});

setLang('es');
