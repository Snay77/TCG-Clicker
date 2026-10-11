import { byId } from './cards';
import { changeDeck, rarityProbabilities, stats, type Save } from './game';
import { advancedRows, type AdvancedContext } from './advanced-effects';
import { advancedDesign } from './advanced-card-design';
import { advancedSynergies, synergies } from './synergies';
import { achievementProgress, explorationLevel, DECK_SLOT_UNLOCKS, type Achievement } from './exploration';
import { describeUIEffect as describeEffect } from './effects';
import { comboFactor } from './progression';
import {cardInspection,type CollectionFilters} from './ux';
import {cardUpgradeCost} from './progression';

const numberFormat=new Intl.NumberFormat('fr-FR',{maximumFractionDigits:2});
const integerFormat=new Intl.NumberFormat('fr-FR',{maximumFractionDigits:0});
const percentageFormat=new Intl.NumberFormat('fr-FR',{maximumFractionDigits:1});
export const amount=(n:number)=>integerFormat.format(Math.floor(n));
export const decimal=(n:number)=>numberFormat.format(n);
export const percent=(n:number)=>percentageFormat.format(n*100)+' %';
export const timer=(seconds:number)=>Math.max(0,seconds).toLocaleString('fr-FR',{minimumFractionDigits:1,maximumFractionDigits:1})+' s';
export const filterCount=(f:CollectionFilters)=>Number(!!f.search.trim())+Number(!!f.type)+Number(!!f.rarity)+Number(!!f.discovery)+Number(f.upgradeable)+Number(f.sort!=='number');
export const acquisitionLabel=(id:string,recent:string[],discovered:string[])=>discovered.includes(id)?'NOUVEAU':recent.includes(id)?'RÉCENT':null;
export function boosterSummary(s:Save,originalOwned:Record<string,number>){
 const seen={...originalOwned};let duplicates=0,shards=0;
 for(const id of s.pending){if(seen[id]){duplicates++;shards+=duplicateGain(s,id);}seen[id]=(seen[id]||0)+1;}
 const obtained=[...new Set(s.pending)];
 const upgrades=obtained.filter(id=>cardInspection(s,id).upgradeable).length;
 const close=obtained.filter(id=>{const cost=cardUpgradeCost(s.cardLevels[id]||1);return cost!==null&&s.owned[id]===cost;}).length;
 return {duplicates,shards,upgrades,close};
}
export function upgradeFeedback(before:Save,after:Save,id:string){
 if(before===after)return null;
 const a=cardInspection(before,id),b=cardInspection(after,id);
 return {name:a.card.name,from:a.level,to:b.level,before:a.current,after:b.current,text:`CARTE AMÉLIORÉE · ${a.card.name} · Niveau ${a.level} → ${b.level} · ${a.current} → ${b.current}`};
}
export const compactFeedback=(messages:string[])=>messages.length<=1?messages.join(''):`${messages.length} RÉCOMPENSES / DÉCOUVERTES`;
export function fastRevealPolicy(rarity:number,discovery:boolean,fast:boolean){return {automatic:fast&&!discovery&&rarity<4,holdMs:rarity<2?0:rarity===2?500:750,special:rarity>=4};}
export const rarePlusChance=(bonus:number,guaranteed=false)=>rarityProbabilities(bonus,guaranteed).slice(2).reduce((a,b)=>a+b,0);
export const missingParent=(s:Save,id:string)=>{
 const c=byId(id);return s.owned[id]&&c?.evolvesFrom&&!s.owned[c.evolvesFrom]&&!s.deck.includes(id)?byId(c.evolvesFrom):null;
};
export function duplicateGain(s:Save,id:string){
 // Same bonus as reveal, without crediting a second card.
 const sources=advancedRows(s).filter(r=>r.kind==='duplicate');
 return stats(s).duplicateBonus+sources.reduce((sum,r)=>{
  const rule=advancedDesign(byId(r.id).design?.id)?.rule;
  return sum+(rule?.kind==='duplicate'&&byId(id).type===rule.type?rule.bonus:0);
 },0);
}
export function deckComparison(s:Save,id:string,replaceId?:string,context:AdvancedContext={}){
 const next=changeDeck(s,id,replaceId),before=stats(s,context),after=stats(next,context);
 const fields:[string,number,number,(n:number)=>string][]=[
  ['Clic',before.click,after.click,decimal],['Passif / s',before.auto,after.auto,decimal],
  ['Chance critique',before.crit,after.crit,percent],['Multiplicateur critique',before.critMultiplier,after.critMultiplier,n=>'×'+decimal(n)],
  ['Réduction booster',before.discount,after.discount,percent],['Rare+ · cartes 1–4',rarePlusChance(before.rareChance),rarePlusChance(after.rareChance),percent],
  ['Rare+ · carte 5',rarePlusChance(before.rareChance,true),rarePlusChance(after.rareChance,true),percent],
  ['Doublon',before.duplicateBonus,after.duplicateBonus,n=>decimal(n)+' ✦'],['Combo maximum',comboFactor(100,before.comboBonus),comboFactor(100,after.comboBonus),n=>'×'+decimal(n)],
 ];
 const lines=fields.filter(([,a,b,fmt])=>Math.abs(a-b)>1e-8&&fmt(a)!==fmt(b)).map(([label,a,b,fmt])=>({label,before:fmt(a),after:fmt(b)}));
 const active=(save:Save)=>[...synergies(save.deck),...advancedSynergies(save.deck,explorationLevel(save.account.xp))].filter(x=>x.active).map(x=>`${x.type} ×${x.required} · ${describeEffect(x.effect)}`);
 const a=active(s),b=active(next);
 const rowsBefore=advancedRows(s,context),rowsAfter=advancedRows(next,context);
 const gained=rowsAfter.filter(r=>!rowsBefore.some(x=>x.id===r.id)).map(r=>`${r.name} : ${r.text}`);
 const lost=rowsBefore.filter(r=>!rowsAfter.some(x=>x.id===r.id)).map(r=>`${r.name} : ${r.text}`);
 const conditions=rowsAfter.filter(r=>rowsBefore.some(x=>x.id===r.id&&x.active!==r.active)).map(r=>`${r.name} · ${r.active?'condition activée':'condition perdue'}`);
 // Conditional duplicate supplements are shown separately from universal bonuses.
 return {lines,synergiesGained:b.filter(x=>!a.includes(x)),synergiesLost:a.filter(x=>!b.includes(x)),gained,lost,conditions};
}
export function sortDeckChoices(s:Save,ids:string[],recent:string[]=[]){
 const rank=(id:string)=>missingParent(s,id)?4:s.deck.includes(id)?3:recent.includes(id)||advancedDesign(byId(id).design?.id)?.rule.kind==='nextClick'?0:advancedDesign(byId(id).design?.id)?1:2;
 return [...ids].sort((a,b)=>rank(a)-rank(b)||(byId(a).number||0)-(byId(b).number||0));
}
export function slotOffer(s:Save){const offer=DECK_SLOT_UNLOCKS[s.extraDeckSlots];return offer?{...offer,slot:7+s.extraDeckSlots,available:explorationLevel(s.account.xp)>=offer.level}:null;}
export function goalDestination(a:Achievement){return a.metric==='packs'||a.metric==='cards'||a.metric==='species'||a.metric==='legendary'||a.metric==='mythic'||a.metric==='lineage'?'boosters':a.metric==='level3'||a.metric==='level5'?'collection':'machine';}
export function goalCount(s:Save,a:Achievement){return amount(Math.min(achievementProgress(s,a),a.target));}
export function mergeLevelFeedback(previous:{from:number;to:number;at:number}|null,from:number,to:number,at:number){
 return {from:previous&&at-previous.at<2000&&previous.to===from?previous.from:from,to,at};
}
