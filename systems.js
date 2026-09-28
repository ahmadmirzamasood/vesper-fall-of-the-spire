import * as THREE from 'three';

// Fixed-size event lighting; visibility stays constant to avoid shader recompiles.
export class LightPool {
  constructor(scene, count = 3) {
    this.slots = Array.from({length: count}, () => {
      const light = new THREE.PointLight(0xffffff, 0, 16, 2);
      light.castShadow = false;
      scene.add(light);
      return {light, life: 0, duration: 1, power: 0, score: 0};
    });
  }
  emit(position, color, power, duration, camera, priority = 1) {
    const score = priority / (1 + position.distanceToSquared(camera.position) * .005);
    const slot = this.slots.find(s => s.life <= 0) || this.slots.reduce((a,b) => a.score < b.score ? a : b);
    if (slot.life > 0 && slot.score > score) return;
    slot.light.position.copy(position); slot.light.color.set(color);
    Object.assign(slot, {life: duration, duration, power, score});
    slot.light.intensity = power;
  }
  update(dt) { for (const s of this.slots) {s.life = Math.max(0, s.life-dt); s.light.intensity = s.power * (s.life/s.duration) ** 2;} }
  clear() {for(const s of this.slots){s.life=0;s.light.intensity=0;}}
}

export function makeSurfaceMaps() {
  const canvas = document.createElement('canvas'); canvas.width=canvas.height=256;
  const ctx=canvas.getContext('2d'); const image=ctx.createImageData(256,256);
  let seed=173;
  for(let y=0;y<256;y++)for(let x=0;x<256;x++){
    seed=(seed*1664525+1013904223)>>>0;
    const weave=((x>>2)+(y>>2))%2 ? 12 : -12;
    const value=145+weave+(seed>>>25);
    const i=(y*256+x)*4; image.data.set([value,value,value,255],i);
  }
  ctx.putImageData(image,0,0);
  ctx.strokeStyle='#454545';ctx.lineWidth=1;
  for(let i=0;i<25;i++){ctx.beginPath();ctx.moveTo(i*11,0);ctx.lineTo(i*11+30,256);ctx.stroke();}
  const map=new THREE.CanvasTexture(canvas);map.wrapS=map.wrapT=THREE.RepeatWrapping;
  map.colorSpace=THREE.NoColorSpace;return map;
}

// Two instanced draws for all sparks and smoke. No per-impact geometry allocation.
export class ImpactPool {
  constructor(scene, capacity=240) {
    this.capacity=capacity;this.cursor=0;this.dummy=new THREE.Object3D();
    this.spark=new THREE.InstancedMesh(new THREE.SphereGeometry(1,8,6),new THREE.MeshBasicMaterial({color:0xffffff}),capacity);
    this.spark.instanceMatrix.setUsage(THREE.DynamicDrawUsage);this.spark.frustumCulled=false;scene.add(this.spark);
    const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');const g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'#ffffff70');g.addColorStop(.4,'#ffffff40');g.addColorStop(1,'#ffffff00');x.fillStyle=g;x.fillRect(0,0,64,64);
    this.smoke=new THREE.InstancedMesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c),transparent:true,depthWrite:false,color:'#77909b'}),capacity);
    this.smoke.instanceMatrix.setUsage(THREE.DynamicDrawUsage);this.smoke.frustumCulled=false;scene.add(this.smoke);
    this.items=Array.from({length:capacity},()=>({p:new THREE.Vector3(),v:new THREE.Vector3(),life:0,max:1,size:0,smoke:false}));
    this.color=new THREE.Color(); this.clear();
  }
  emit(position,color,n=25,power=6) {
    for(let i=0;i<n;i++){
      const index=this.cursor++%this.capacity,s=this.items[index];
      s.smoke=i%5===0;s.max=s.smoke?2.4:.35+Math.random()*.5;s.life=s.max;s.size=s.smoke?.8:.025+Math.random()*.06;
      s.p.copy(position);s.v.set((Math.random()-.5)*power,Math.random()*power,(Math.random()-.5)*power);
      if(s.smoke)s.v.multiplyScalar(.18);
      this.spark.setColorAt(index,this.color.set(color));
    }
    this.spark.instanceColor.needsUpdate=true;
  }
  update(dt,camera){for(let i=0;i<this.capacity;i++){
    const s=this.items[i];s.life=Math.max(0,s.life-dt);
    if(s.life>0){s.p.addScaledVector(s.v,dt);s.v.y+=dt*(s.smoke?.7:-9);}
    this.dummy.position.copy(s.p);this.dummy.quaternion.copy(camera.quaternion);
    this.dummy.scale.setScalar(s.life>0&&!s.smoke?s.size*s.life/s.max:0);this.dummy.updateMatrix();this.spark.setMatrixAt(i,this.dummy.matrix);
    this.dummy.scale.setScalar(s.life>0&&s.smoke?s.size*(1+(s.max-s.life)*2)*Math.min(1,s.life):0);this.dummy.updateMatrix();this.smoke.setMatrixAt(i,this.dummy.matrix);
  }this.spark.instanceMatrix.needsUpdate=true;this.smoke.instanceMatrix.needsUpdate=true;}
  clear(){for(const s of this.items)s.life=0;this.dummy.scale.setScalar(0);this.dummy.updateMatrix();for(let i=0;i<this.capacity;i++){this.spark.setMatrixAt(i,this.dummy.matrix);this.smoke.setMatrixAt(i,this.dummy.matrix);}this.spark.instanceMatrix.needsUpdate=true;this.smoke.instanceMatrix.needsUpdate=true;}
}

export function extractionProgress(current,position,target,dt){
  return position.distanceTo(target)<3 ? Math.min(3,current+dt) : Math.max(0,current-dt*2);
}
