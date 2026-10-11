import { stats, type Save } from './game';
import { recordClick, recordTick } from './exploration';
import { comboFactor, advanceCombo, type Combo } from './progression';
import { advancedEvent, consumeAdvancedClick, periodicProgress, reconcileAdvanced, type AdvancedContext, type AdvancedRuntime } from './advanced-effects';
import {initialPortalRuntime,overloadSupplement,portalClick,type PortalRuntime} from './living-portal';

// Pure transitions shared by the actual Machine and deterministic simulations.
export function activeClickPower(power:ReturnType<typeof stats>,combo:number){
 // Small, bounded active contribution from the machine; idle output is untouched.
 return power.click+(power.comboBonus>0?Math.min(power.auto*.12,power.click)*Math.floor(Math.max(0,Math.min(100,combo))/25)/4:0);
}
export function previewClickGain(s:Save,runtime:AdvancedRuntime,combo:Combo,now:number,portalRuntime?:PortalRuntime){
 const charge=advanceCombo(combo,now).charge,consumed=consumeAdvancedClick(s,runtime,now);
 const power=stats(s,{runtime:consumed.runtime,combo:charge,now});
 const ordinary=activeClickPower(power,charge)*comboFactor(charge,power.comboBonus);
 return ordinary*consumed.multiplier+(portalRuntime?overloadSupplement(ordinary,portalRuntime,now):0);
}
export function playClick(s:Save,runtime:AdvancedRuntime,combo:number,now:number,random:number,enabled=true,portalRuntime?:PortalRuntime) {
 const consumed=consumeAdvancedClick(s,runtime,now);
 const context:AdvancedContext={combo,now,runtime:consumed.runtime,enabled};
 const power=stats(s,context),critical=random<power.crit;
 const ordinary=activeClickPower(power,combo)*comboFactor(combo,power.comboBonus);
 const gain=ordinary*(critical?power.critMultiplier:1)*(enabled?consumed.multiplier:1)+(portalRuntime?overloadSupplement(ordinary,portalRuntime,now):0);
 let next=enabled?advancedEvent(s,consumed.runtime,'onClick',now):consumed.runtime;
 if(enabled&&critical)next=advancedEvent(s,next,'onCritical',now);
 const recorded=recordClick(s,gain,critical,combo),portal=portalRuntime?portalClick(recorded,portalRuntime,now,critical,consumed.multiplier>1):null;
 const result=enabled?{...recorded,advancedClicks:periodicProgress(s,next)}:recorded;
 return {save:portal?{...result,portal:portal.progress}:result,runtime:next,gain,critical,charged:enabled&&consumed.multiplier>1,portalRuntime:portal?.runtime||portalRuntime||initialPortalRuntime()};
}
export function playTick(s:Save,runtime:AdvancedRuntime,seconds:number,now:number,visible:boolean,enabled=true) {
 const next=reconcileAdvanced(s,runtime,now);
 // Integrate at expiry boundaries, so a throttled interval cannot extend a buff.
 const elapsed=Math.min(5,Math.max(0,Number.isFinite(seconds)?seconds:0)),start=now-elapsed*1000;
 const boundaries=[start,...new Set(Object.values(runtime.expires).filter(t=>t>start&&t<now)),now].sort((a,b)=>a-b);
 let result=s;
 for(let i=1;i<boundaries.length;i++){
  const midpoint=(boundaries[i-1]+boundaries[i])/2;
  result=recordTick(result,(boundaries[i]-boundaries[i-1])/1000,stats(s,{runtime,now:midpoint,enabled}).auto,visible);
 }
 return {save:result,runtime:next};
}
