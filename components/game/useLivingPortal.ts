import {useEffect,useRef,useState,type Dispatch,type SetStateAction} from 'react';
import type {Save} from '../../lib/game';
import {initialPortalRuntime,portalTick,reconcilePortal} from '../../lib/living-portal';
export function useLivingPortal(save:Save,setSave:Dispatch<SetStateAction<Save>>,enabled:boolean){
 const latest=useRef(save);latest.current=save;
 const runtime=useRef(initialPortalRuntime());
 const [view,setView]=useState(()=>({runtime:initialPortalRuntime(),now:0}));
 const [visible,setVisible]=useState(true),[reducedOS,setReducedOS]=useState(false);
 function publish(next:typeof runtime.current,now:number){runtime.current=next;setView({runtime:next,now});}
 useEffect(()=>{const visibility=()=>setVisible(document.visibilityState==='visible'),media=matchMedia('(prefers-reduced-motion: reduce)'),motion=()=>setReducedOS(media.matches);visibility();motion();document.addEventListener('visibilitychange',visibility);media.addEventListener('change',motion);return()=>{document.removeEventListener('visibilitychange',visibility);media.removeEventListener('change',motion);};},[]);
 useEffect(()=>{let last=performance.now();const timer=setInterval(()=>{const now=performance.now(),elapsed=(now-last)/1000;last=now;const s=latest.current,result=portalTick(s,runtime.current,elapsed,now,enabled&&document.visibilityState==='visible');publish(result.runtime,now);if(result.progress.visibleSeconds!==(s.portal?.visibleSeconds||0)||result.progress.anomaly!==!!s.portal?.anomaly)setSave(current=>({...current,portal:portalTick(current,runtime.current,elapsed,now,enabled&&document.visibilityState==='visible').progress}));},200);return()=>clearInterval(timer);},[enabled,setSave]);
 // Removing Songegarde invalidates its preparation immediately, including a remove/re-equip.
 useEffect(()=>{const now=performance.now();publish(reconcilePortal(latest.current,runtime.current,now),now);},[save.deck]);
 return{runtime,view,publish,visible,reduced:save.ux.motion==='reduce'||reducedOS};
}
