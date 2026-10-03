import { boundedTotal } from './numbers';
import { CARDS, byId, runtimeId } from './cards';
import data from '../design/set01-faerie.json';
import type { Save } from './game';
import { CARD_UPGRADE_COSTS } from './progression';

export type Totals = { generatedEnergy:number; criticalClicks:number; freeOpened:number; cardsObtained:number; duplicatesObtained:number; playSeconds:number; maxCombo:number };
export type Account = { format:1; xp:number; claimed:string[]; rewardBoosters:number; activeTitle:string; fastOpening:boolean; totals:Totals; historicalEstimate:boolean };
export const initialAccount = (): Account => ({format:1,xp:0,claimed:[],rewardBoosters:0,activeTitle:'explorer',fastOpening:false,historicalEstimate:false,totals:{generatedEnergy:0,criticalClicks:0,freeOpened:0,cardsObtained:0,duplicatesObtained:0,playSeconds:0,maxCombo:0}});
export const XP = { booster:20, discovery:25, rare:8, upgrade:5, cardLevel:15 } as const;
export const levelThreshold = (level:number) => 25*(level-1)*(level+2);
export const explorationLevel = (xp:number) => 1+Math.floor((Math.sqrt(5625+100*Math.max(0,xp))-75)/50);
export function explorationProgress(xp:number) {const level=explorationLevel(xp),start=levelThreshold(level),next=levelThreshold(level+1);return {level,current:xp-start,needed:next-start,next};}
export const UNLOCKS = [
 {level:1,name:'Explorateur de la Clairière',description:'Machine, six compagnons, objectifs et lignées.'},
 {level:3,name:'Synergies avancées',description:'Trois compagnons du même type : un bonus supplémentaire.'},
 {level:5,name:'Objectifs experts',description:'Défis de collection et de machine à plus long terme.'},
 {level:8,name:'7e emplacement de deck',description:'Achat disponible pour 5 000 éclats.'},
 {level:12,name:'Ouverture rapide',description:'Accélérez les cartes ordinaires ; les Mythiques gardent leur mise en scène.'},
 {level:15,name:'8e emplacement de deck',description:'Achat disponible pour 25 000 éclats.'},
 {level:20,name:'Maîtrise de Faerie',description:'Complétez le set, les 20 lignées et trois cartes au niveau 5.'},
] as const;
export const DECK_SLOT_UNLOCKS = [{level:8,cost:5000},{level:15,cost:25000}] as const;
export const freePackCount = (s:Save) => s.freeBoosters+s.account.rewardBoosters;
export const LINEAGES = data.lineages.map(l=>({...l,ids:l.cardIds.map(runtimeId)}));
export function lineageProgress(s:Save) {return LINEAGES.map(l=>({...l,count:l.ids.filter(id=>s.owned[id]).length,complete:l.ids.every(id=>s.owned[id])}));}
export const completedLineages = (s:Save) => lineageProgress(s).filter(l=>l.complete).length;
export function collectionProgress(s:Save) {return {species:CARDS.filter(c=>s.owned[c.id]).length,rarities:Array.from({length:6},(_,rarity)=>({rarity,owned:CARDS.filter(c=>c.rarity===rarity&&s.owned[c.id]).length,total:CARDS.filter(c=>c.rarity===rarity).length})),lineages:completedLineages(s)};}
export type Reward = {type:'energy'|'booster'|'xp';amount:number};
export type Metric = 'species'|'cards'|'level3'|'level5'|'energy'|'combo'|'criticals'|'machine'|'packs'|'legendary'|'mythic'|'lineage'|'mastery';
export type Achievement = {id:string;category:'Découverte'|'Collection'|'Clicker'|'Booster'|'Lignées';title:string;description:string;metric:Metric;target:number;rewards:Reward[];minLevel?:number;lineageId?:string};
const rewards = (energy:number,xp:number,boosters=0):Reward[] => [{type:'energy',amount:energy},{type:'xp',amount:xp},...(boosters?[{type:'booster' as const,amount:boosters}]:[])];
export const ACHIEVEMENTS:Achievement[] = [
 ...[10,25,40,50,60].map((target,i)=>({id:`discover-${target}`,category:'Découverte' as const,title:target===60?'Le cœur de Faerie':`${target} rencontres`,description:target===60?'Découvrez les 60 espèces du Set 01. Un titre vous attend.':`Découvrez ${target} espèces différentes.`,metric:'species' as const,target,rewards:rewards([200,500,1000,2000,10000][i],[100,250,400,600,2000][i],[1,1,2,2,5][i])})),
 {id:'cards-100',category:'Collection',title:'Un carnet bien rempli',description:'Obtenez 100 cartes, y compris les doublons consommés.',metric:'cards',target:100,rewards:rewards(200,100,1)},
 {id:'cards-500',category:'Collection',title:'Trésors accumulés',description:'Obtenez 500 cartes au total.',metric:'cards',target:500,minLevel:5,rewards:rewards(1000,350,2)},
 {id:'card-level-3',category:'Collection',title:'Un lien qui grandit',description:'Améliorez une carte au niveau 3.',metric:'level3',target:1,rewards:rewards(100,100)},
 {id:'card-level-5',category:'Collection',title:'Compagnon accompli',description:'Améliorez une carte au niveau 5.',metric:'level5',target:1,rewards:rewards(500,250,1)},
 {id:'mastery',category:'Collection',title:'Maîtrise de Faerie',description:'60 espèces, 20 lignées et trois cartes au niveau 5.',metric:'mastery',target:1,minLevel:20,rewards:rewards(15000,1500,3)},
 ...[10000,100000].map((target,i)=>({id:`energy-${target}`,category:'Clicker' as const,title:i?'La forêt rayonne':'Énergie de la clairière',description:`Générez ${target.toLocaleString('fr-FR')} éclats par clic ou production passive.`,metric:'energy' as const,target,rewards:rewards(i?500:100,i?200:75)})),
 {id:'combo-100',category:'Clicker',title:'Cadence parfaite',description:'Remplissez la jauge de combo à 100.',metric:'combo',target:100,rewards:rewards(50,50)},
 {id:'criticals-100',category:'Clicker',title:'Éclats de lune',description:'Effectuez 100 clics critiques.',metric:'criticals',target:100,rewards:rewards(200,150)},
 ...[5,20,50].map((target,i)=>({id:`machine-${target}`,category:'Clicker' as const,title:`Portail niveau ${target}`,description:`Atteignez le niveau de machine ${target}.`,metric:'machine' as const,target,minLevel:i?5:1,rewards:rewards([100,500,1500][i],[75,200,500][i])})),
 ...[5,25,100].map((target,i)=>({id:`packs-${target}`,category:'Booster' as const,title:`${target} passages`,description:`Ouvrez ${target} boosters, gratuits ou achetés.`,metric:'packs' as const,target,rewards:rewards([100,300,1000][i],[75,200,500][i],1)})),
 {id:'legendary',category:'Booster',title:'Rencontre légendaire',description:'Découvrez une Légendaire.',metric:'legendary',target:1,rewards:rewards(200,150)},
 {id:'mythic',category:'Booster',title:'Au-delà du conte',description:'Découvrez une Mythique.',metric:'mythic',target:1,rewards:rewards(500,300)},
 ...LINEAGES.map(l=>({id:`lineage-${l.id}`,category:'Lignées' as const,title:l.name,description:`Découvrez toutes les formes de « ${l.name} ».`,metric:'lineage' as const,target:l.ids.length,lineageId:l.id,rewards:rewards(100,75)})),
];
export function achievementProgress(s:Save,a:Achievement):number {
 switch(a.metric){
 case 'species':return Object.keys(s.owned).length;
 case 'cards':return s.account.totals.cardsObtained;
 case 'level3':case 'level5':return CARDS.filter(c=>s.owned[c.id]&&(s.cardLevels[c.id]||1)>=(a.metric==='level3'?3:5)).length;
 case 'energy':return s.account.totals.generatedEnergy;
 case 'combo':return s.account.totals.maxCombo;
 case 'criticals':return s.account.totals.criticalClicks;
 case 'machine':return s.level+1;
 case 'packs':return s.packs;
 case 'legendary':case 'mythic':return CARDS.filter(c=>c.rarity===(a.metric==='legendary'?4:5)&&s.owned[c.id]).length;
 case 'lineage':return lineageProgress(s).find(l=>l.id===a.lineageId)?.count||0;
 case 'mastery':return Object.keys(s.owned).length===60&&completedLineages(s)===20&&CARDS.filter(c=>(s.cardLevels[c.id]||1)===5).length>=3?1:0;
 }
}
export const achievementReady = (s:Save,a:Achievement) => explorationLevel(s.account.xp)>=(a.minLevel||1)&&achievementProgress(s,a)>=a.target&&!s.account.claimed.includes(a.id);
export function claimAchievement(s:Save,id:string):Save {
 const a=ACHIEVEMENTS.find(a=>a.id===id);
 if(!a||s.pending.length||!achievementReady(s,a))return s;
 let energy=s.energy,xp=s.account.xp,rewardBoosters=s.account.rewardBoosters;
 for(const reward of a.rewards){if(reward.type==='energy')energy=boundedTotal(energy+reward.amount);else if(reward.type==='xp')xp=boundedTotal(xp+reward.amount);else rewardBoosters=boundedTotal(rewardBoosters+reward.amount);}
 return {...s,energy,account:{...s.account,xp,rewardBoosters,claimed:[...s.account.claimed,id]}};
}
export const rewardDescription=(list:Reward[])=>list.map(r=>r.type==='energy'?`${r.amount.toLocaleString('fr-FR')} ✦`:r.type==='xp'?`${r.amount} XP`:`${r.amount} booster${r.amount>1?'s':''}`).join(' · ');
export const TITLES = [
 {id:'explorer',name:'Explorateur de la Clairière',description:'Dès le premier passage.',unlocked:(_s:Save)=>true},
 {id:'sylve',name:'Ami des Sylves',description:'Complétez une lignée de Sylve.',unlocked:(s:Save)=>lineageProgress(s).some(l=>l.complete&&l.type==='Sylve')},
 {id:'moon',name:'Veilleur Lunaire',description:'Complétez une lignée de Lune.',unlocked:(s:Save)=>lineageProgress(s).some(l=>l.complete&&l.type==='Lune')},
 {id:'collector',name:'Collectionneur Faerie',description:'Découvrez 40 espèces.',unlocked:(s:Save)=>Object.keys(s.owned).length>=40},
 {id:'guardian',name:'Gardien du Portail',description:'Réclamez la récompense des 60 espèces.',unlocked:(s:Save)=>s.account.claimed.includes('discover-60')},
];
export function selectTitle(s:Save,id:string):Save {return TITLES.find(t=>t.id===id)?.unlocked(s)?{...s,account:{...s.account,activeTitle:id}}:s;}
export function toggleFastOpening(s:Save):Save {return explorationLevel(s.account.xp)>=12?{...s,account:{...s.account,fastOpening:!s.account.fastOpening}}:s;}
export function buyDeckSlot(s:Save):Save {
 const offer=DECK_SLOT_UNLOCKS[s.extraDeckSlots];
 if(!offer||s.pending.length||explorationLevel(s.account.xp)<offer.level||s.energy<offer.cost)return s;
 return {...s,energy:s.energy-offer.cost,extraDeckSlots:s.extraDeckSlots+1};
}
export function recordClick(s:Save,gain:number,critical:boolean,combo:number):Save {
 if(!Number.isFinite(gain)||gain<0)return s;
 return {...s,energy:boundedTotal(s.energy+gain),clicks:boundedTotal(s.clicks+1),account:{...s.account,totals:{...s.account.totals,generatedEnergy:boundedTotal(s.account.totals.generatedEnergy+gain),criticalClicks:boundedTotal(s.account.totals.criticalClicks+(critical?1:0)),maxCombo:Math.max(s.account.totals.maxCombo,Math.min(100,Math.max(0,combo)))}}};
}
export function recordTick(s:Save,seconds:number,passive:number,visible:boolean):Save {
 if(!Number.isFinite(passive))return s;
 const elapsed=Math.min(5,Math.max(0,Number.isFinite(seconds)?seconds:0)),gain=Math.max(0,passive)*elapsed;
 if(!elapsed||(!gain&&!visible))return s;
 return {...s,energy:boundedTotal(s.energy+gain),account:{...s.account,totals:{...s.account.totals,generatedEnergy:boundedTotal(s.account.totals.generatedEnergy+gain),playSeconds:boundedTotal(s.account.totals.playSeconds+(visible?elapsed:0))}}};
}
export function migrateAccount(s:Save):Account {
 const a=initialAccount(),species=Object.keys(s.owned).length;
 const spent=Object.values(s.cardLevels).reduce((sum,level)=>sum+CARD_UPGRADE_COSTS.slice(0,level-1).reduce((a,b)=>a+b,0),0);
 const cards=boundedTotal(Math.max(Object.values(s.owned).reduce((a,b)=>a+b,0)+spent,Math.max(0,s.packs-(s.pending.length?1:0))*5+s.revealed));
 a.xp=boundedTotal(Math.floor(s.packs)*XP.booster+species*XP.discovery+Object.values(s.upgrades).reduce((a,b)=>a+b,0)*XP.upgrade+Object.values(s.cardLevels).reduce((sum,l)=>sum+(l-1)*XP.cardLevel,0));
 a.totals={...a.totals,generatedEnergy:s.energy,freeOpened:Math.max(0,s.packs-s.paidBoostersPurchased),cardsObtained:cards,duplicatesObtained:Math.max(0,cards-species)};
 a.historicalEstimate=!!(s.clicks||s.packs||species||s.energy);
 return a;
}
export function parseAccount(raw:unknown,s:Save):Account {
 if(raw===undefined)return migrateAccount(s);
 const a=raw as Account;
 const integer=(n:unknown)=>Number.isSafeInteger(n)&&Number(n)>=0;
 const finite=(n:unknown)=>typeof n==='number'&&Number.isFinite(n)&&n>=0;
 if(!a||a.format!==1||!integer(a.xp)||!integer(a.rewardBoosters)||!Array.isArray(a.claimed)||new Set(a.claimed).size!==a.claimed.length||a.claimed.some(id=>!ACHIEVEMENTS.some(x=>x.id===id))||typeof a.fastOpening!=='boolean'||typeof a.historicalEstimate!=='boolean'||!a.totals||!TITLES.some(t=>t.id===a.activeTitle))throw Error('Progression de compte invalide');
 const t=a.totals;
 if(!finite(t.generatedEnergy)||!finite(t.playSeconds)||!finite(t.maxCombo)||t.maxCombo>100||!integer(t.criticalClicks)||t.criticalClicks>s.clicks||!integer(t.freeOpened)||t.freeOpened>s.packs||!integer(t.cardsObtained)||!integer(t.duplicatesObtained)||t.duplicatesObtained>t.cardsObtained)throw Error('Statistiques invalides');
 const next:Account={format:1,xp:a.xp,rewardBoosters:a.rewardBoosters,activeTitle:a.activeTitle,fastOpening:a.fastOpening,historicalEstimate:a.historicalEstimate,claimed:[...a.claimed],totals:{generatedEnergy:t.generatedEnergy,playSeconds:t.playSeconds,maxCombo:t.maxCombo,criticalClicks:t.criticalClicks,freeOpened:t.freeOpened,cardsObtained:t.cardsObtained,duplicatesObtained:t.duplicatesObtained}};
 if(!TITLES.find(t=>t.id===next.activeTitle)!.unlocked({...s,account:next}))throw Error('Titre verrouillé');
 if(next.fastOpening&&explorationLevel(next.xp)<12)throw Error('Ouverture rapide verrouillée');
 return next;
}
export function openingDelay(rarity:number,fast:boolean,kind:'suspense'|'leave'|'tear',reduced=false):number {
 if(reduced)return kind==='leave'?40:50;
 if(kind==='tear')return fast&&rarity<5?180:620;
 if(kind==='leave')return fast&&rarity<2?80:260;
 const normal=[160,280,1000,1500,2100,2700][rarity]*.65;
 return Math.max(100,normal*(fast&&rarity<5?(rarity<2?.25:.7):1));
}
