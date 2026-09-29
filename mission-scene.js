import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
// Imported only on first deployment. Two shared instanced meshes serve all missions.
export function createMissionSet(scene){
 const material=new THREE.MeshStandardMaterial({color:'#55747c',metalness:.7,roughness:.35});
 const edge=new THREE.MeshStandardMaterial({color:'#8de5e9',emissive:'#8de5e9',emissiveIntensity:.8,metalness:.4,roughness:.3});
 const pylons=new THREE.InstancedMesh(new RoundedBoxGeometry(1,1,1,3,.12),material,20);
 const arcs=new THREE.InstancedMesh(new THREE.TorusGeometry(2,.045,8,48),edge,8);
 pylons.frustumCulled=arcs.frustumCulled=false;pylons.receiveShadow=true;scene.add(pylons,arcs);
 const dummy=new THREE.Object3D();
 return {apply(level){material.color.set(level.environmentTheme==='ember'?'#74594d':'#42606e');edge.color.set(level.color);edge.emissive.set(level.color);
  for(let i=0;i<20;i++){const side=i%2?1:-1,row=Math.floor(i/2);dummy.position.set(side*(level.id===3?24:26),1.5,-34+row*5.5);dummy.rotation.set(0,0,0);dummy.scale.set(1,3,1.4);
   if(level.id===2){dummy.scale.set(2,1.3,2);dummy.position.y=.4;}
   if(level.id===3){dummy.scale.set(.4,5+(row%3),.4);dummy.position.y=dummy.scale.y/2;}
   if(level.id===4){dummy.scale.set(1.3,7,1);dummy.position.y=3;dummy.rotation.z=side*.2;}
   if(level.id===5){dummy.scale.set(2.2,6+row%2*3,1.2);dummy.position.y=dummy.scale.y/2;}
   dummy.updateMatrix();pylons.setMatrixAt(i,dummy.matrix);
  }
  for(let i=0;i<8;i++){dummy.position.set(i%2?25:-25,level.id===2?2:6,-30+Math.floor(i/2)*12);dummy.scale.setScalar(level.id===5?1.4:.7);dummy.rotation.set(level.id===2?Math.PI/2:0,0,level.id*.2);dummy.updateMatrix();arcs.setMatrixAt(i,dummy.matrix);}
  pylons.instanceMatrix.needsUpdate=true;arcs.instanceMatrix.needsUpdate=true;pylons.visible=arcs.visible=true;
 },hide(){pylons.visible=arcs.visible=false;}};
}
