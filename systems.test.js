import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {LightPool,extractionProgress} from './systems.js';
test('lights remain bounded and expire without allocating replacements',()=>{const scene=new THREE.Scene(),pool=new LightPool(scene,3),cam=new THREE.PerspectiveCamera();const ids=pool.slots.map(s=>s.light.uuid);for(let i=0;i<100;i++)pool.emit(new THREE.Vector3(i,0,0),'#fff',30,.2,cam);assert.equal(scene.children.length,3);pool.update(.3);assert.ok(pool.slots.every(s=>s.light.intensity===0));assert.deepEqual(pool.slots.map(s=>s.light.uuid),ids);});
test('distant low priority flash cannot displace nearby overload',()=>{const pool=new LightPool(new THREE.Scene(),1),cam=new THREE.PerspectiveCamera();pool.emit(new THREE.Vector3(),'#fff',100,1,cam,3);pool.emit(new THREE.Vector3(100,0,0),'#f00',1,1,cam);assert.equal(pool.slots[0].power,100);});
test('extraction requires time in zone and decays when leaving',()=>{const goal=new THREE.Vector3(16,0,12);let p=0;for(let i=0;i<180;i++)p=extractionProgress(p,goal,goal,1/60);assert.ok(p>2.99);assert.equal(extractionProgress(p,new THREE.Vector3(),goal,2),0);assert.equal(extractionProgress(2.9,goal,goal,1),3);});
