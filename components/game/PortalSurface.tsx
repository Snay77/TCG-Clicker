import { useEffect, useRef, useState } from 'react';
import LivingPortal, {type PortalState} from './LivingPortal';
import {decimal} from '../../lib/game-ux';
export type PortalImpulse={gain:number;critical:boolean;charged:boolean};
export default function PortalSurface({level,state,attunement,onImpulse,reduced}:{level:number;state:PortalState;attunement:string;onImpulse:(e:React.MouseEvent<HTMLButtonElement>)=>PortalImpulse|undefined;reduced:boolean}) {
 const button=useRef<HTMLButtonElement>(null),serial=useRef(0),animations=useRef<Animation[]>([]),reset=useRef<ReturnType<typeof setTimeout>|null>(null);
 const [gains,setGains]=useState<(PortalImpulse&{id:number;x:number;y:number;born:number})[]>([]);
 useEffect(()=>{const timer=setInterval(()=>setGains(items=>items.length?items.filter(i=>performance.now()-i.born<850):items),400);const node=button.current,observer=new IntersectionObserver(entries=>{if(node)node.dataset.visible=entries[0].isIntersecting?'1':'0';});if(node)observer.observe(node);return()=>{clearInterval(timer);if(reset.current)clearTimeout(reset.current);observer.disconnect();animations.current.forEach(a=>a.cancel());};},[]);
 function react(kind:'normal'|'critical'|'charged'){
  const node=button.current;if(!node)return;animations.current.forEach(a=>a.cancel());node.dataset.impulse=kind;if(reset.current)clearTimeout(reset.current);reset.current=setTimeout(()=>{node.dataset.impulse='normal';},450);if(reduced)return;
  const rim=node.querySelector('.portal-aperture-rim'),world=node.querySelector('.portal-world');
  animations.current=[world?.animate([{opacity:1,transform:'scale(1)'},{opacity:kind==='normal'?.82:.65,transform:kind==='normal'?'scale(.985,1.015)':'scale(.97,1.03)'},{opacity:1,transform:'scale(1)'}],{duration:kind==='normal'?160:280}),rim?.animate([{strokeWidth:12},{strokeWidth:kind==='charged'?23:kind==='critical'?19:15},{strokeWidth:12}],{duration:kind==='normal'?220:420})].filter((a):a is Animation=>!!a);
 }
 return <button ref={button} className="machine-button living-click-surface" aria-label="Récolter des éclats" onPointerDown={()=>react('normal')} onClick={e=>{
  const result=onImpulse(e);if(!result)return;react(result.charged?'charged':result.critical?'critical':'normal');
  const box=e.currentTarget.getBoundingClientRect();setGains(items=>[...items.slice(-7),{...result,id:serial.current++,x:e.detail?e.clientX-box.left:box.width/2,y:e.detail?e.clientY-box.top:box.height*.48,born:performance.now()}]);
 }}>
  <LivingPortal level={level} state={state} attunement={attunement}/>
  {gains.slice(-1).map(g=><span key={g.id} className={`portal-hit hit-${g.charged?'charged':g.critical?'critical':'normal'} ${state==='overload'?'hit-overload':''}`} aria-hidden="true"><i/><i/><i/></span>)}
  {gains.map(g=><span className={`portal-gain ${g.critical?'critical':''} ${g.charged?'charged':''}`} key={g.id} style={{left:g.x,top:g.y}} aria-hidden="true">+{decimal(g.gain)} ✦{(g.charged||g.critical)&&<small>{g.charged?'IMPULSION CHARGÉE':'CRITIQUE'}</small>}</span>)}
 </button>;
}
