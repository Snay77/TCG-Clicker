import { CARDS, byId } from './cards';
import { price, savedCardLevel, type Save } from './game';
import { cardUpgradeCost, leveledEffect } from './progression';
import { describeEffect } from './effects';
import { ACHIEVEMENTS, achievementProgress, achievementReady, explorationLevel, freePackCount } from './exploration';
export const FIRST_STEPS = ['Générer de l’énergie','Acheter une amélioration','Ouvrir un booster','Découvrir 5 créatures','Équiper un compagnon'] as const;
export const TIP_IDS = ['click','upgrade','booster','collection','deck','progression'] as const;
export type TipId = typeof TIP_IDS[number];
export type UX = {format:1;introSeen:boolean;skipTips:boolean;dismissed:TipId[];completed:number[];sound:boolean;volume:number;motion:'system'|'reduce'};
export const initialUX = ():UX => ({format:1,introSeen:false,skipTips:false,dismissed:[],completed:[],sound:true,volume:0.35,motion:'system'});
export function completedSteps(s:Save):number[] {
 const done=[s.clicks>0,Object.values(s.upgrades).some(n=>n>0),s.packs>0&&(!s.pending.length||s.revealed===5),Object.keys(s.owned).length>=5,s.deck.length>0];
 return [...new Set([...s.ux.completed,...done.flatMap((v,i)=>v?[i]:[])])].sort();
}
export function parseUX(value:unknown,s:Save):UX {
 if(value===undefined){const ux={...initialUX(),introSeen:true};return {...ux,completed:completedSteps({...s,ux})};}
 const v=value as UX;
 if(!v||v.format!==1||typeof v.introSeen!=='boolean'||typeof v.skipTips!=='boolean'||typeof v.sound!=='boolean'||!Number.isFinite(v.volume)||v.volume<0||v.volume>1||!['system','reduce'].includes(v.motion)||!Array.isArray(v.dismissed)||v.dismissed.some(id=>!TIP_IDS.includes(id))||!Array.isArray(v.completed)||v.completed.some(i=>!Number.isInteger(i)||i<0||i>4))throw Error('Préférences invalides');
 return {...v,dismissed:[...new Set(v.dismissed)],completed:[...new Set(v.completed)]};
}
export function markIntroSeen(s:Save):Save{return s.ux.introSeen?s:{...s,ux:{...s.ux,introSeen:true}};}
export function dismissTip(s:Save,id:TipId):Save{return s.ux.dismissed.includes(id)?s:{...s,ux:{...s.ux,dismissed:[...s.ux.dismissed,id]}};}
export function contextualTip(s:Save):TipId|null {
 if(s.ux.skipTips||!s.ux.introSeen||s.pending.length)return null;
 const eligible={click:s.clicks<5,upgrade:!Object.values(s.upgrades).some(n=>n>0)&&s.energy>=60,booster:!s.packs&&(s.energy>=price(s)*0.8||freePackCount(s)>0),collection:s.packs>0,deck:Object.keys(s.owned).length>=3,progression:s.deck.length>0||s.account.xp>=100};
 return TIP_IDS.find(id=>eligible[id]&&!s.ux.dismissed.includes(id))||null;
}
export function cardInspection(s:Save,id:string){
 const card=byId(id),copies=s.owned[id]||0,level=savedCardLevel(s,id),cost=cardUpgradeCost(level);
 return {card,copies,level,cost,duplicates:Math.max(0,copies-1),upgradeable:copies>0&&cost!==null&&copies-1>=cost,current:copies?describeEffect(leveledEffect(card.effect,level)):'À découvrir',next:copies&&cost!==null?describeEffect(leveledEffect(card.effect,level+1)):null};
}
export type CollectionFilters={search:string;type:string;rarity:string;discovery:string;upgradeable:boolean;sort:'number'|'rarity'};
export function filterCollection(s:Save,f:CollectionFilters){
 return CARDS.filter(c=>(!f.search||(s.owned[c.id]?c.name:'À découvrir').toLocaleLowerCase('fr').includes(f.search.toLocaleLowerCase('fr')))&&(!f.type||c.type===f.type)&&(!f.rarity||c.rarity===Number(f.rarity))&&(!f.discovery||(f.discovery==='owned'?!!s.owned[c.id]:!s.owned[c.id]))&&(!f.upgradeable||cardInspection(s,c.id).upgradeable)).sort((a,b)=>f.sort==='rarity'?b.rarity-a.rarity||(a.number||0)-(b.number||0):(a.number||0)-(b.number||0));
}
export function duplicateFeedback(before:number,level:number){const after=before+1,cost=cardUpgradeCost(level);return {before,after,newlyUpgradeable:before>0&&cost!==null&&before-1<cost&&after-1>=cost};}
export function sortedAchievements(s:Save){
 const rank=(a:typeof ACHIEVEMENTS[number])=>s.account.claimed.includes(a.id)?3:achievementReady(s,a)?0:explorationLevel(s.account.xp)<(a.minLevel||1)?2:1;
 return [...ACHIEVEMENTS].sort((a,b)=>rank(a)-rank(b)||achievementProgress(s,b)/b.target-achievementProgress(s,a)/a.target);
}
export const TYPE_SIGNS:Record<string,string>={Sylve:'❧',Mycète:'♧',Lune:'☾',Rosée:'◒',Étincelle:'ϟ',Aurore:'☀',Astral:'✧'};
