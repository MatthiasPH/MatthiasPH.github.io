(() => {
  const menu = document.querySelector('.menu-toggle');
  const mobile = document.getElementById('mobile-menu');
  if (menu && mobile) {
    const close = () => {menu.setAttribute('aria-expanded','false'); mobile.hidden=true;};
    menu.addEventListener('click', () => {
      const on = menu.getAttribute('aria-expanded')==='true';
      menu.setAttribute('aria-expanded',String(!on)); mobile.hidden=on;
    });
    mobile.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
    window.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
  }
  const shell = document.querySelector('[data-demo-viewer]');
  if (!shell) return;
  const canvas=shell.querySelector('canvas');
  const model=shell.querySelector('model-viewer');
  const ctx=canvas.getContext('2d');
  let w=0,h=0,az=.65,elev=.35,scale=1,drag=false,px=0,py=0;
  const dims=()=>{
    const dpr=Math.min(window.devicePixelRatio||1,2);const rect=canvas.getBoundingClientRect();
    w=rect.width;h=rect.height;canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);render();
  };
  const rot=p=>{
    const [x,y,z]=p;
    const X=x*Math.cos(az)-y*Math.sin(az),Y=x*Math.sin(az)+y*Math.cos(az);
    const Z=z*Math.cos(elev)-Y*Math.sin(elev), D=z*Math.sin(elev)+Y*Math.cos(elev);
    const s=Math.min(w*.26,h*.35)*scale;
    return [w*.48+X*s,h*.70-Z*s,D];
  };
  const parts=[];
  const addBox=(name,a,b,thick,fill)=>{
    const va=[b[0]-a[0],b[1]-a[1],b[2]-a[2]];
    const L=Math.hypot(...va), u=va.map(x=>x/L),v=[-u[1],u[0],0];
    let vn=Math.hypot(...v);const V=vn>0.02?v.map(x=>x/vn):[0,1,0];
    const W=[u[1]*V[2]-u[2]*V[1],u[2]*V[0]-u[0]*V[2],u[0]*V[1]-u[1]*V[0]];
    const p0=[a[0],a[1],a[2]];
    const vertices=[];
    for(const pt of [a,b])for(const s1 of [-1,1])for(const s2 of [-1,1])vertices.push(pt.map((x,i)=>x+V[i]*thick*s1+W[i]*thick*s2));
    const faces=[[0,1,3,2],[4,6,7,5],[0,4,5,1],[2,3,7,6],[0,2,6,4],[1,5,7,3]];
    parts.push({vertices,faces,fill});
  };
  const addCyl=(name,center,r,depth,fill)=>{
    // Cylinders are drawn as simple octagonal disc housings, aligned with Y axis.
    const pts=[];
    for(let side of [-1,1])for(let j=0;j<12;j++){
      const ang=j*Math.PI/6;pts.push([center[0]+r*Math.cos(ang),center[1]+side*depth/2,center[2]+r*Math.sin(ang)]);
    }
    const faces=[];faces.push([...Array(12).keys()]);faces.push([...Array(12).keys()].map(x=>x+12).reverse());
    for(let j=0;j<12;j++)faces.push([j,(j+1)%12,(j+1)%12+12,j+12]);
    parts.push({vertices:pts,faces,fill});
  };
  addCyl('base',[0,0,.10],.34,.18,'#e15e25');
  addBox('pedestal',[0,0,.18],[0,0,.55],.16,'#767676');
  addCyl('shoulder',[.03,0,.64],.17,.30,'#ff742e');
  addBox('upper arm',[.09,0,.65],[.59,0,1.23],.085,'#adadad');
  addCyl('elbow',[.59,0,1.23],.145,.27,'#e15e25');
  addBox('forearm',[.65,0,1.26],[1.10,0,1.43],.095,'#858585');
  addCyl('wrist',[1.10,0,1.43],.117,.18,'#ff742e');
  addBox('gripper body',[1.12,0,1.43],[1.32,0,1.43],.11,'#e15e25');
  addBox('finger one',[1.30,-.15,1.43],[1.56,-.15,1.43],.039,'#d7d7d7');
  addBox('finger two',[1.30,.15,1.43],[1.56,.15,1.43],.039,'#d7d7d7');
  function render(){
    if(!ctx||!w||!h)return;
    ctx.clearRect(0,0,w,h);
    // Ground plane in perspective
    ctx.lineWidth=1;ctx.strokeStyle='#aaaaaa16';
    for(let i=-5;i<=5;i++){
      let a=rot([-2.5,i*.48,0]),b=rot([2.5,i*.48,0]);ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();
      a=rot([i*.48,-2.5,0]);b=rot([i*.48,2.5,0]);ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();
    }
    const surfaces=[];
    for(const part of parts){
      const p=part.vertices.map(rot);
      for(let j=0;j<part.faces.length;j++){
        const face=part.faces[j],v=face.map(i=>p[i]);
        const depth=v.reduce((s,q)=>s+q[2],0)/v.length;
        surfaces.push({v,depth,fill:part.fill,shade:Math.max(.6,1-j*.017)});
      }
    }
    surfaces.sort((a,b)=>b.depth-a.depth);
    for(const {v,fill,shade} of surfaces){
      ctx.beginPath();ctx.moveTo(v[0][0],v[0][1]);for(let k=1;k<v.length;k++)ctx.lineTo(v[k][0],v[k][1]);ctx.closePath();ctx.fillStyle=fill;ctx.globalAlpha=.92*shade;ctx.fill();ctx.globalAlpha=1;ctx.strokeStyle='#121212bb';ctx.lineWidth=1.25;ctx.stroke();
    }
  }
  canvas.addEventListener('pointerdown',e=>{drag=true;px=e.clientX;py=e.clientY;canvas.setPointerCapture(e.pointerId)});
  canvas.addEventListener('pointermove',e=>{if(!drag)return;az+=(e.clientX-px)*.007;elev=Math.max(-.7,Math.min(1.2,elev+(e.clientY-py)*.004));px=e.clientX;py=e.clientY;render()});
  canvas.addEventListener('pointerup',()=>drag=false);
  canvas.addEventListener('wheel',e=>{if(!e.ctrlKey&&!e.metaKey){e.preventDefault();scale=Math.max(.55,Math.min(2.3,scale*(1-e.deltaY*.0008)));render();}},{passive:false});
  const reset=shell.querySelector('.reset-viewer');
  reset.addEventListener('click',()=>{az=.65;elev=.35;scale=1;render();if(model&&model.classList.contains('ready')){model.cameraOrbit='30deg 66deg 125%';}});
  window.addEventListener('resize',dims);dims();
  // The offline fallback is always interactive. Replace it when the actual GLB renderer is ready.
  if(model){
    window.customElements.whenDefined('model-viewer').then(()=>{
      model.addEventListener('load',()=>{model.classList.add('ready');canvas.style.display='none';},{once:true});
      model.addEventListener('error',()=>{model.classList.remove('ready');canvas.style.display='block';});
    });
  }
})();
