import type {Save} from './game';
import {byId} from './cards';
export type PortalProgress={charge:number;gestures:number;visibleSeconds:number;anomaly:boolean};
export type PortalRuntime={until:number;bonus:number;preparedUntil:number;lastGesture:number};
export const PORTAL_RULES={capacity:100,durationMs:8000,bonus:.35,preparedBonus:.5,anomalyClicks:80,anomalySeconds:60,anomalyCharge:15} as const;
export const initialPortalProgress=():PortalProgress=>({charge:0,gestures:0,visibleSeconds:0,anomaly:false});
export const initialPortalRuntime=():PortalRuntime=>({until:0,bonus:0,preparedUntil:0,lastGesture:-Infinity});
export function parsePortal(raw:unknown):PortalProgress{
 const source=raw&&typeof raw==='object'?raw as Partial<PortalProgress>:{};
 const clamp=(v:unknown,max:number)=>typeof v==='number'&&Number.isFinite(v)?Math.min(max,Math.max(0,v)):0;
 return{charge:clamp(source.charge,100),gestures:Math.floor(clamp(source.gestures,80)),visibleSeconds:clamp(source.visibleSeconds,60),anomaly:source.anomaly===true};
}
export const portalUnlocked=(s:Save)=>s.level>=4&&s.clicks>=75;
export const anomalyUnlocked=(s:Save)=>s.level>=4&&s.clicks>=75;
export const PORTAL_CARDS=[
 {designId:'F01-025',name:'Luciolot',text:'Impulsion chargée → +4 charge.',kind:'charged'},
 {designId:'F01-039',name:'Flamèche',text:'Critique → +1 charge.',kind:'critical'},
 {designId:'F01-018',name:'Songegarde',text:'Critique → fenêtre de 4 s : surcharge renforcée.',kind:'preparation'},
] as const;
export function portalDeck(s:Save){return PORTAL_CARDS.filter(rule=>s.deck.some(id=>byId(id).design?.id===rule.designId));}
export function reconcilePortal(s:Save,r:PortalRuntime,now:number):PortalRuntime{
 return{...r,until:r.until>now?r.until:0,bonus:r.until>now?r.bonus:0,preparedUntil:portalDeck(s).some(c=>c.kind==='preparation')&&r.preparedUntil>now?r.preparedUntil:0};
}
export function portalVisualState(s:Save,r:PortalRuntime,now:number):'stable'|'resonance'|'overload'{
 if(r.until>now)return'overload';const p=parsePortal(s.portal);
 return p.anomaly||portalUnlocked(s)&&p.charge>=100||r.preparedUntil>now?'resonance':'stable';
}
export function portalClick(s:Save,runtime:PortalRuntime,now:number,critical:boolean,charged:boolean){
 let r=reconcilePortal(s,runtime,now);const p=parsePortal(s.portal),cards=portalDeck(s);
 // Fast synthetic input never creates extra charge; ordinary click production is unchanged.
 if(now-r.lastGesture<60)return{progress:p,runtime:r};
 const active=r.until>now,enabled=portalUnlocked(s);
 let charge=p.charge;
 if(enabled&&!active)charge=Math.min(100,charge+1+(critical&&cards.some(c=>c.kind==='critical')?1:0)+(charged&&cards.some(c=>c.kind==='charged')?4:0));
 if(critical&&enabled&&cards.some(c=>c.kind==='preparation'))r={...r,preparedUntil:now+4000};
 const gestures=anomalyUnlocked(s)&&!p.anomaly?Math.min(80,p.gestures+1):p.gestures;
 return{progress:{...p,charge,gestures,anomaly:p.anomaly||gestures>=80&&p.visibleSeconds>=60},runtime:{...r,lastGesture:now}};
}
export function portalTick(s:Save,r:PortalRuntime,seconds:number,now:number,available:boolean){
 const p=parsePortal(s.portal),runtime=reconcilePortal(s,r,now);
 if(!available||!anomalyUnlocked(s)||p.anomaly)return{progress:p,runtime};
 const visibleSeconds=Math.min(60,p.visibleSeconds+Math.min(5,Math.max(0,seconds)));
 return{progress:{...p,visibleSeconds,anomaly:p.gestures>=80&&visibleSeconds>=60},runtime};
}
export function activateOverload(s:Save,r:PortalRuntime,now:number){
 if(!portalUnlocked(s)||parsePortal(s.portal).charge<100||r.until>now||s.pending.length)return{save:s,runtime:r,activated:false};
 const prepared=reconcilePortal(s,r,now).preparedUntil>now;
 return{save:{...s,portal:{...parsePortal(s.portal),charge:0}},runtime:{...r,until:now+8000,bonus:prepared?.5:.35,preparedUntil:0},activated:true};
}
export function stabilizeAnomaly(s:Save,r:PortalRuntime,now:number):Save{
 const p=parsePortal(s.portal);if(!p.anomaly||!anomalyUnlocked(s)||s.pending.length||r.until>now)return s;
 return{...s,portal:{charge:Math.min(100,p.charge+(portalUnlocked(s)?15:0)),gestures:0,visibleSeconds:0,anomaly:false}};
}
export function overloadSupplement(baseClick:number,r:PortalRuntime,now:number){
 return r.until>now?Math.max(0,baseClick)*Math.min(.5,Math.max(0,r.bonus)):0;
}
