export function createInput({canvas,options,active,onAction}){
 const held=new Set(),aim={x:0,y:0},previous=[];let touchAim=null;
 const clamp=v=>Math.max(-.95,Math.min(.95,v));
 function moveAim(dx,dy){aim.x=clamp(aim.x+dx*options().sensitivity);aim.y=clamp(aim.y+dy*options().sensitivity*(options().invertY?-1:1));}
 canvas.addEventListener('pointermove',e=>{if(options().controlMode!=='manual'||!active())return;if(e.pointerType==='touch'){if(touchAim!==null){moveAim((e.clientX-touchAim.x)/innerWidth*2,-(e.clientY-touchAim.y)/innerHeight*2);}touchAim={x:e.clientX,y:e.clientY};}else moveAim(e.movementX/innerWidth*2,-e.movementY/innerHeight*2);});
 canvas.addEventListener('pointerup',()=>touchAim=null);canvas.addEventListener('pointercancel',()=>touchAim=null);
 for(const button of document.querySelectorAll('[data-touch]')){
  const code=button.dataset.touch;
  button.addEventListener('pointerdown',e=>{e.preventDefault();button.setPointerCapture(e.pointerId);held.add(code);if(['Space','KeyQ','Escape'].includes(code))onAction(code);});
  const release=()=>held.delete(code);button.addEventListener('pointerup',release);button.addEventListener('pointercancel',release);button.addEventListener('lostpointercapture',release);
 }
 addEventListener('blur',()=>held.clear());
 function poll(dt){const pad=Array.from(navigator.getGamepads?.()||[]).find(p=>p?.connected&&p.mapping==='standard');let dx=0,dz=0,fire=held.has('KeyF');
  if(pad){const down=i=>!!pad.buttons[i]?.pressed;const edge=i=>down(i)&&!previous[i];
   if(active()){
    dx=Math.abs(pad.axes[0])>.18?pad.axes[0]:0;dz=Math.abs(pad.axes[1])>.18?pad.axes[1]:0;fire ||= down(7);
    if(edge(0))onAction('Space');if(edge(5))onAction('KeyQ');if(edge(9))onAction('Escape');if(edge(3))onAction('KeyH');
    if(options().controlMode==='manual')moveAim((Math.abs(pad.axes[2])>.15?pad.axes[2]:0)*dt,-(Math.abs(pad.axes[3])>.15?pad.axes[3]:0)*dt);
   }else{
    const dialog=document.querySelector('dialog[open]');const root=dialog||document;const buttons=[...root.querySelectorAll('button:not(:disabled),select,input')].filter(e=>e.getClientRects().length);
    if(edge(13)||edge(12)){let i=buttons.indexOf(document.activeElement);buttons[(i+(edge(13)?1:-1)+buttons.length)%buttons.length]?.focus();}
    if(edge(0)&&document.activeElement?.tagName==='BUTTON')document.activeElement.click();if(edge(9))onAction('Escape');
   }
   pad.buttons.forEach((b,i)=>previous[i]=b.pressed);
  }else previous.length=0;
  dx+=(held.has('KeyD')?1:0)-(held.has('KeyA')?1:0);dz+=(held.has('KeyS')?1:0)-(held.has('KeyW')?1:0);
  return {dx,dz,fire};
 }
 return {aim,poll,clear(){held.clear();aim.x=aim.y=0;touchAim=null;}};
}
