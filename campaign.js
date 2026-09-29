// Campaign metadata is cheap; mission geometry is loaded separately on deployment.
export const LEVELS = [
  {id:1,title:'Rainline',subtitle:'HELIX TRANSIT / 01',briefing:'Retake the transit platform. Break the Warden before it silences the evacuation channel.',environmentTheme:'rain',difficulty:1,objectives:[{id:'eliminate',text:'Neutralize the Warden'}],enemyWaves:[{name:'WARDEN',health:65,scale:1.45,pattern:'single',interval:3.8,warning:1.9,radius:3.5,damage:18}],rewards:{scrap:250,unlock:'pulse'},parTime:65,unlockRequirement:0,color:'#7acdda',sky:'#122a3b'},
  {id:2,title:'Ember Foundry',subtitle:'THERMAL WORKS / 02',briefing:'A furnace guardian controls the cooling grid. Watch for paired strikes on both sides of your position.',environmentTheme:'ember',difficulty:2,objectives:[{id:'eliminate',text:'Shut down the furnace guardian'}],enemyWaves:[{name:'CRUCIBLE',health:90,scale:1.65,pattern:'twin',interval:3.3,warning:1.7,radius:3.7,damage:20}],rewards:{scrap:320,unlock:'modules'},parTime:80,unlockRequirement:1,color:'#eda575',sky:'#2d232a'},
  {id:3,title:'Ghost Relay',subtitle:'SIGNAL ARRAY / 03',briefing:'Two relay frames guard the orbital uplink. Clear both in sequence; a short field repair follows the first kill.',environmentTheme:'relay',difficulty:3,objectives:[{id:'eliminate',text:'Disable both relay frames'}],enemyWaves:[{name:'ECHO',health:60,scale:1.35,pattern:'single',interval:2.8,warning:1.5,radius:3.6,damage:20},{name:'REVENANT',health:80,scale:1.6,pattern:'line',interval:2.7,warning:1.5,radius:3.6,damage:22}],rewards:{scrap:400,unlock:'lance'},parTime:115,unlockRequirement:2,color:'#b798e8',sky:'#242039'},
  {id:4,title:'Stormbreak',subtitle:'ORBITAL ANCHOR / 04',briefing:'The anchor defense predicts your position and blankets the deck in crossfire. Move decisively when the markers appear.',environmentTheme:'storm',difficulty:4,objectives:[{id:'eliminate',text:'Destroy the anchor defense'}],enemyWaves:[{name:'TEMPEST',health:160,scale:1.85,pattern:'cross',interval:2.5,warning:1.4,radius:4,damage:24}],rewards:{scrap:500,unlock:null},parTime:105,unlockRequirement:3,color:'#8ebcf8',sky:'#152338'},
  {id:5,title:'Last Orbit',subtitle:'CROWN PLATFORM / 05',briefing:'Acheron is charging the orbital weapon. Defeat its outrider, then destroy the siege core. This is the last line above the clouds.',environmentTheme:'orbit',difficulty:5,objectives:[{id:'eliminate',text:'Defeat the outrider and Acheron'}],enemyWaves:[{name:'HERALD',health:80,scale:1.5,pattern:'twin',interval:2.4,warning:1.35,radius:3.7,damage:24},{name:'ACHERON',health:190,scale:2,pattern:'cross',interval:2.2,warning:1.25,radius:4.3,damage:26}],boss:{name:'ACHERON'},rewards:{scrap:650,unlock:null},parTime:170,unlockRequirement:4,color:'#ef9290',sky:'#292335'}
];
export const WEAPONS={arc:{name:'Arc Rifle',description:'Balanced sustained fire.',damage:2.6,interval:.16,heat:7,color:'#9ceeff',unlock:0},pulse:{name:'Pulse Repeater',description:'Fast pulses; more forgiving heat.',damage:1.65,interval:.09,heat:4.2,color:'#a2f3c6',unlock:1},lance:{name:'Ion Lance',description:'Heavy armor-piercing discharge.',damage:13,interval:.7,heat:22,color:'#e8b5ff',unlock:3}};
export const MODULES={balanced:{name:'Standard core',description:'100 hull · 19 cooling/s · 6 movement speed',hull:100,cooling:19,speed:6},radiator:{name:'Thermal radiator',description:'100 hull · 28 cooling/s · 6 movement speed',hull:100,cooling:28,speed:6},bulwark:{name:'Bulwark plating',description:'130 hull · 19 cooling/s · 5.4 movement speed',hull:130,cooling:19,speed:5.4}};
export const DEFAULT_OPTIONS={quality:'high',shadows:'high',bloom:true,particles:'high',shake:true,reducedMotion:false,volume:.6,mute:true,sensitivity:1,aimAssist:true,invertY:false,controlMode:'assisted'};
export const SAVE_KEY='neon-titan-campaign-v1', OPTIONS_KEY='neon-titan-options-v1';
const num=(v,lo,hi,fallback)=>Number.isFinite(v)?Math.max(lo,Math.min(hi,v)):fallback;
export function freshCampaign(){return {version:1,active:true,credits:0,completed:{},equipped:'arc',module:'balanced',upgrades:{arc:0,pulse:0,lance:0},paidRuns:[]};}
export function highestUnlocked(save){let id=1;while(id<5&&save?.completed?.[id])id++;return id;}
export function unlockedWeapon(save,id){const w=Object.hasOwn(WEAPONS,id)?WEAPONS[id]:null;return !!w&&(w.unlock===0||!!save?.completed?.[w.unlock]);}
export function sanitizeSave(raw){
 if(!raw||raw.version!==1||raw.active!==true)return null;
 const s=freshCampaign();s.credits=Math.floor(num(raw.credits,0,1e7,0));
 for(const level of LEVELS){const r=raw.completed?.[level.id];if(!r||!Number.isFinite(r.score)||!Number.isFinite(r.time)||r.time<=0)break;s.completed[level.id]={score:Math.floor(num(r.score,0,1e7,0)),time:num(r.time,.01,86400,86400),rating:['S','A','B','C'].includes(r.rating)?r.rating:'C',clears:Math.floor(num(r.clears,1,1e6,1))};}
 for(const id of Object.keys(WEAPONS))s.upgrades[id]=Math.floor(num(raw.upgrades?.[id],0,3,0));
 s.equipped=unlockedWeapon(s,raw.equipped)?raw.equipped:'arc';
 s.module=Object.hasOwn(MODULES,raw.module)&&(raw.module==='balanced'||s.completed[2])?raw.module:'balanced';
 s.paidRuns=Array.isArray(raw.paidRuns)?raw.paidRuns.filter(x=>typeof x==='string').slice(-30):[];return s;
}
export function sanitizeOptions(raw={}){const o={...DEFAULT_OPTIONS};for(const k of ['bloom','shake','reducedMotion','mute','aimAssist','invertY'])if(typeof raw[k]==='boolean')o[k]=raw[k];for(const k of ['quality','shadows','particles'])if(['high','medium',...(k==='shadows'?['off']:[])].includes(raw[k]))o[k]=raw[k];o.volume=num(raw.volume,0,1,.6);o.sensitivity=num(raw.sensitivity,.3,2.5,1);if(['assisted','manual'].includes(raw.controlMode))o.controlMode=raw.controlMode;return o;}
export function readStored(storage,key,validate){try{const raw=storage.getItem(key);if(!raw)return {value:null,error:false};const value=validate(JSON.parse(raw));return {value,error:!value};}catch{return {value:null,error:true};}}
export function writeStored(storage,key,value){try{storage.setItem(key,JSON.stringify(value));return true;}catch{return false;}}
export function upgradeCost(rank){return (rank+1)*150;}
export function buyUpgrade(save,id){if(!save||!unlockedWeapon(save,id))return false;const rank=save.upgrades[id],cost=upgradeCost(rank);if(rank>=3||save.credits<cost)return false;save.credits-=cost;save.upgrades[id]++;return true;}
export function weaponStats(save){const id=save?.equipped||'arc';const w=WEAPONS[id];return {...w,damage:w.damage*(1+(save?.upgrades[id]||0)*.2)};}
export function awardMission(save,levelId,time,hull,runId){
 const level=LEVELS.find(l=>l.id===levelId);if(!save||!level||levelId>highestUnlocked(save)||save.paidRuns.includes(runId))return null;
 const seconds=num(time,.01,86400,86400),integrity=num(hull,0,1,0),pace=Math.min(1,level.parTime/seconds);
 const score=Math.round(10000*(pace*.6+integrity*.4));const rating=score>=9200?'S':score>=7800?'A':score>=6000?'B':'C';
 const old=save.completed[levelId];const reward=Math.round(level.rewards.scrap*(old?.35:1)+(rating==='S'?100:rating==='A'?60:30));
 save.credits+=reward;save.completed[levelId]={score:Math.max(old?.score||0,score),time:Math.min(old?.time||Infinity,seconds),rating:old&&'SABC'.indexOf(old.rating)<'SABC'.indexOf(rating)?old.rating:rating,clears:(old?.clears||0)+1};
 save.paidRuns.push(runId);save.paidRuns=save.paidRuns.slice(-30);return {score,rating,reward,time:seconds,firstClear:!old,unlock:old?null:level.rewards.unlock};
}
export function strikeOffsets(pattern,radius){if(pattern==='twin')return [[-radius*.9,0],[radius*.9,0]];if(pattern==='line')return [[-radius*1.8,0],[0,0],[radius*1.8,0]];if(pattern==='cross')return [[0,0],[-radius*1.8,0],[radius*1.8,0],[0,-radius*1.8],[0,radius*1.8]];return [[0,0]];}

