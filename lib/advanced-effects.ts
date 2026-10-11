import { byId } from './cards';
import type { Save } from './game';
import { advancedDesign, type AdvancedCondition } from './advanced-card-design';
import { resolveEffects, type Effect } from './effects';
import { leveledEffect,upgradeEffects } from './progression';
import {synergies} from './synergies';

export type AdvancedRuntime = {
 deckKey:string;
 counters:Record<string,number>;
 charged:Record<string,number>;
 expires:Record<string,number>;
 feedback:{text:string; until:number}|null;
};
export type AdvancedContext = { combo?:number; now?:number; runtime?:AdvancedRuntime; enabled?:boolean };
export const initialAdvancedRuntime=():AdvancedRuntime=>({deckKey:'',counters:{},charged:{},expires:{},feedback:null});
const equipped=(s:Save)=>[...new Set(s.deck)].filter(id=>s.owned[id]>0&&byId(id));
const deckKey=(s:Save)=>equipped(s).sort().join('|');
export function reconcileAdvanced(s:Save,runtime:AdvancedRuntime,now:number):AdvancedRuntime {
 const key=deckKey(s);
 if(runtime.deckKey!==key){
  const retained=new Set(runtime.deckKey.split('|').filter(id=>equipped(s).includes(id)));
  const keep=(values:Record<string,number>)=>Object.fromEntries(Object.entries(values).filter(([id])=>retained.has(id)));
  const next={...runtime,deckKey:key,counters:keep(runtime.counters),charged:keep(runtime.charged),expires:keep(runtime.expires),feedback:null};
  if(!runtime.deckKey)for(const {id,rule} of designs(s))if(rule.kind==='nextClick'&&rule.trigger==='onClick'){
   const count=s.advancedClicks?.[id]||0;next.counters[id]=count===rule.every?0:count;
   if(count===rule.every)next.charged[id]=rule.multiplier;
  }
  return reconcileAdvanced(s,next,now);
 }
 const expired=Object.values(runtime.expires).some(t=>t<=now),feedback=runtime.feedback&&runtime.feedback.until>now?runtime.feedback:null;
 if(!expired&&feedback===runtime.feedback)return runtime;
 return {...runtime,expires:Object.fromEntries(Object.entries(runtime.expires).filter(([,t])=>t>now)),feedback};
}
const designs=(s:Save)=>equipped(s).flatMap(id=>{const design=advancedDesign(byId(id).design?.id);return design?[{id,card:byId(id),...design}]:[];});
function conditionMet(s:Save,id:string,c:AdvancedCondition,combo:number) {
 const deck=equipped(s);
 switch(c.kind){
  case 'deckTypeCount':return deck.filter(cid=>byId(cid).type===c.type).length>=c.minimum;
  case 'comboAbove':return combo>c.threshold;
  case 'uniqueTypes':return new Set(deck.map(cid=>byId(cid).type)).size>=c.minimum;
  case 'lineageCount':{const lineage=byId(id).design?.lineage;return !!lineage&&deck.filter(cid=>byId(cid).design?.lineage===lineage).length>=c.minimum;}
 }
}
export function advancedBonuses(s:Save,context:AdvancedContext={}):Effect {
 if(context.enabled===false)return {};
 const runtime=context.runtime?reconcileAdvanced(s,context.runtime,context.now??0):initialAdvancedRuntime();
 const bonuses:Effect[]=[];
 for(const entry of designs(s)){
  const {rule,id,card}=entry;
  switch(rule.kind){
   case 'conditional':if(conditionMet(s,id,rule.condition,context.combo??0))bonuses.push(rule.bonus);break;
   case 'scaled':{
    const value=rule.metric==='uniqueTypes'?new Set(equipped(s).map(cid=>byId(cid).type)).size:Object.values(s.owned).filter(n=>n>0).length;
    bonuses.push(leveledBonus(rule.bonus,Math.min(rule.maximum,Math.floor(value/rule.per))));break;
   }
   case 'lineage':if(conditionMet(s,id,{kind:'lineageCount',minimum:rule.minimum},0)){
    for(const cid of equipped(s).filter(cid=>byId(cid).design?.lineage===card.design?.lineage))bonuses.push(leveledBonus(leveledEffect(byId(cid).effect,s.cardLevels[cid]||1),rule.multiplier));
   }break;
   case 'temporary':if((runtime.expires[id]??0)>(context.now??0))bonuses.push(rule.bonus);break;
  }
 }
 const resolved=resolveEffects(bonuses);
 // Prototype ceilings apply only to the added layer, never to old card/synergy bonuses.
 resolved.clickMultiplier=Math.min(.35,resolved.clickMultiplier);
 resolved.autoMultiplier=Math.min(.4,resolved.autoMultiplier);
 resolved.energyMultiplier=Math.min(.12,resolved.energyMultiplier);
 return resolved;
}
const leveledBonus=(effect:Effect,scale:number):Effect=>Object.fromEntries(Object.entries(effect).map(([key,value])=>[key,value*scale]));

export function advancedEvent(s:Save,previous:AdvancedRuntime,event:'onClick'|'onCritical'|'onBoosterOpen',now:number):AdvancedRuntime {
 const current=reconcileAdvanced(s,previous,now);
 const next={...current,counters:{...current.counters},charged:{...current.charged},expires:{...current.expires}};
 const feedback:string[]=[];
 for(const {rule,id,card,text} of designs(s)){
  if(rule.kind==='temporary'&&rule.trigger===event){next.expires[id]=now+rule.durationMs;feedback.push(`${card.name} · ${text}`);}
  if(rule.kind==='nextClick'&&rule.trigger===event){
   if(rule.trigger==='onClick'){
    const count=(next.counters[id]||0)+1;next.counters[id]=count%rule.every;
    if(count<rule.every)continue;
   }
   next.charged[id]=rule.multiplier;feedback.push(`${card.name} · prochain clic ×${rule.multiplier}`);
  }
 }
 return {...next,feedback:feedback.length?{text:feedback.slice(0,2).join(' · '),until:now+2000}:current.feedback};
}
export function consumeAdvancedClick(s:Save,previous:AdvancedRuntime,now:number) {
 const current=reconcileAdvanced(s,previous,now);
 // Charges overlap by taking the strongest, rather than multiplying into a burst ×6.
 const multiplier=Math.min(3,Math.max(1,...Object.values(current.charged)));
 return {multiplier,runtime:{...current,charged:{}}};
}
export function advancedDuplicateBonus(s:Save,duplicateId:string):number {
 return advancedDuplicateSources(s,duplicateId).reduce((sum,source)=>sum+source.bonus,0);
}
export function advancedDuplicateSources(s:Save,duplicateId:string) {
 return designs(s).flatMap(({rule,card})=>rule.kind==='duplicate'&&byId(duplicateId)?.type===rule.type?[{name:card.name,bonus:rule.bonus}]:[]);
}
export function advancedRows(s:Save,context:AdvancedContext={}) {
 const now=context.now??0,runtime=reconcileAdvanced(s,context.runtime||initialAdvancedRuntime(),now);
 return designs(s).map(({id,card,text,rule})=>{
  let active=true,state='ACTIF',detail='',remaining=0,progress=0,maximum=0,ready=false;
  if(rule.kind==='conditional'){
   const c=rule.condition,deck=equipped(s);
   active=conditionMet(s,id,c,context.combo??0);
   detail=c.kind==='deckTypeCount'?`${c.minimum} ${c.type} requis · ${deck.filter(cid=>byId(cid).type===c.type).length}/${c.minimum}`:c.kind==='comboAbove'?`Combo >${c.threshold}`:c.kind==='uniqueTypes'?`${c.minimum} types requis · ${new Set(deck.map(cid=>byId(cid).type)).size}/${c.minimum}`:`${c.minimum} membres de lignée requis`;
  }
  if(rule.kind==='lineage'){active=conditionMet(s,id,{kind:'lineageCount',minimum:rule.minimum},0);detail=`${rule.minimum} membres requis · ${equipped(s).filter(cid=>byId(cid).design?.lineage===card.design?.lineage).length}/${rule.minimum}`;}
  if(rule.kind==='scaled'&&rule.metric==='speciesDiscovered'){const count=Object.values(s.owned).filter(n=>n>0).length;active=count>=rule.per;detail=`${count} espèces · palier de ${rule.per}`;}
  if(!active)state='CONDITION MANQUANTE';
  if(rule.kind==='temporary'){
   remaining=Math.max(0,((runtime.expires[id]??0)-now)/1000);maximum=rule.durationMs/1000;active=remaining>0;
   state=active?'ACTIF':rule.trigger==='onCritical'?'PRÊT':'EN ATTENTE D’UN BOOSTER';detail=active?`${remaining.toLocaleString('fr-FR',{minimumFractionDigits:1,maximumFractionDigits:1})} s`:rule.trigger==='onCritical'?'Au prochain critique':'';
   if(!active&&rule.trigger==='onCritical'&&statsCriticalChance(s)===0){state='CONDITION MANQUANTE';detail='Une chance critique est requise';}
  }
  if(rule.kind==='nextClick'){
   ready=!!runtime.charged[id];active=false;progress=runtime.counters[id]||0;maximum=rule.trigger==='onClick'?rule.every:0;
   state=ready?'CHARGÉ':maximum?'EN CHARGE':'EN ATTENTE D’UN BOOSTER';detail=ready?`Prochain clic ×${runtime.charged[id]}`:maximum?`${progress}/${maximum} clics`:'';
  }
  if(rule.kind==='duplicate'){active=false;state='PRÊT';detail=`Au prochain doublon ${rule.type}`;}
  const bonus=rule.kind==='temporary'||rule.kind==='conditional'?rule.bonus:undefined;
  return {id,name:card.name,text,active,state,detail,status:[state,detail].filter(Boolean).join(' · '),remaining,progress,maximum,ready,kind:rule.kind,bonus};
 });
}
// Avoid a game.ts dependency/cycle: critical probability uses the same additive base layer.
function statsCriticalChance(s:Save){return resolveEffects([...equipped(s).map(id=>leveledEffect(byId(id).effect,s.cardLevels[id]||1)),...synergies(s.deck).filter(x=>x.active).map(x=>x.effect),...upgradeEffects(s.upgrades),advancedBonuses(s)]).critChance;}
export function periodicProgress(s:Save,runtime:AdvancedRuntime):Record<string,number> {
 return Object.fromEntries(designs(s).flatMap(({id,rule})=>rule.kind==='nextClick'&&rule.trigger==='onClick'?[[id,runtime.charged[id]?rule.every:runtime.counters[id]||0]]:[]));
}
export function parseAdvancedProgress(value:unknown,s:Save):Record<string,number> {
 if(value===undefined)return {};
 if(!value||typeof value!=='object'||Array.isArray(value))throw Error('Charges avancées invalides');
 const allowed=new Map(designs(s).flatMap(({id,rule})=>rule.kind==='nextClick'&&rule.trigger==='onClick'?[[id,rule.every] as const]:[]));
 for(const [id,n]of Object.entries(value))if(!allowed.has(id)||!Number.isInteger(n)||n<0||n>allowed.get(id)!)throw Error('Charge avancée invalide');
 return {...value} as Record<string,number>;
}
