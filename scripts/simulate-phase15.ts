import fs from 'node:fs';
import {initialSave,stats,price,buyUpgrade,drawPackForSave,openPack,reveal,finishPack,upgradeCard,changeDeck,deckCapacity,equipBlockedReason,buyStorage,type Save} from '../lib/game';
import {ACHIEVEMENTS,achievementReady,claimAchievement,freePackCount,buyDeckSlot,explorationLevel,DECK_SLOT_UNLOCKS} from '../lib/exploration';
import {rechargeFreePacks,storageCost} from '../lib/booster-economy';
import {UPGRADES,upgradeCost,initialCombo,advanceCombo,decayCombo} from '../lib/progression';
import {initialAdvancedRuntime,advancedEvent} from '../lib/advanced-effects';
import {playClick,playTick} from '../lib/play-effects';
import {byId} from '../lib/cards';
const rng=(seed:number)=>()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
type Policy='lecture'|'actif'|'idle';
export function simulate(seed:number,policy:Policy){
 let s=initialSave(0),runtime=initialAdvancedRuntime(),combo=initialCombo(),openingUntil=0,nextPack=90,clickBudget=0;
 const random=rng(seed),packs=rng(seed+997),income={click:0,passive:0,objectives:0,lineages:0,duplicates:0},spending={boosters:0,upgrades:0,slots:0,storage:0};
 const snapshots:Record<string,unknown>[]=[];let firstPack=0,slotAvailable=0,slotBought=0,slotPayableAtUnlock=false,blockedSeconds=0;
 function deck(){
  const eligible=Object.keys(s.owned).filter(id=>!equipBlockedReason({...s,deck:[]},id));
  // Periodic player decision: useful companions first, without future draws.
  const score=(id:string)=>{const c=byId(id),e=c.effect;return (e.autoFlat||0)*1.4+(e.clickFlat||0)*(policy==='actif'?2:.6)+(e.energyMultiplier||0)*30+(e.autoMultiplier||0)*15+(e.clickMultiplier||0)*8+(e.critChance||0)*25+c.rarity*.2;};
  s={...s,deck:eligible.sort((a,b)=>score(b)-score(a)).slice(0,deckCapacity(s))};
 }
 for(let sec=1;sec<=1800;sec++){
  const now=sec*1000;s=rechargeFreePacks(s,now);combo=decayCombo(combo,now);
  const tick=playTick(s,runtime,1,now,true);income.passive+=tick.save.energy-s.energy;s=tick.save;runtime=tick.runtime;
  const busy=sec<openingUntil;
  const rate=sec<=45?2:policy==='actif'?(sec%60<35?2:0):policy==='lecture'?(sec%90<12?1.5:0):0;
  if(!busy){clickBudget+=rate;while(clickBudget>=1){combo=advanceCombo(combo,now);const click=playClick(s,runtime,combo.charge,now,random());income.click+=click.gain;s=click.save;runtime=click.runtime;clickBudget--;}}
  if(!busy&&sec%20===0){
   for(const a of ACHIEVEMENTS)if(achievementReady(s,a)){const next=claimAchievement(s,a.id);income[a.category==='Lignées'?'lineages':'objectives']+=next.energy-s.energy;s=next;}
   for(const id of Object.keys(s.owned))while(true){const next=upgradeCard(s,id);if(next===s)break;s=next;}
   deck();
   if(explorationLevel(s.account.xp)>=8&&!slotAvailable){slotAvailable=sec;slotPayableAtUnlock=s.energy>=DECK_SLOT_UNLOCKS[0].cost;}
   const slotted=buyDeckSlot(s);if(slotted!==s){spending.slots+=s.energy-slotted.energy;if(!slotBought)slotBought=sec;s=slotted;deck();}
   // One affordable upgrade per decision, capped during the first half hour.
   const candidates=UPGRADES.filter(u=>s.upgrades[u.id]<(u.id==='auto'?6:u.id==='click'?10:4));
   const best=candidates.map(u=>{const after=buyUpgrade({...s,energy:1e9},u.id),a=stats(s),b=stats(after);const rate=policy==='actif'?1.2:policy==='lecture'?.2:0;return{u,value:((b.auto-a.auto)+rate*(b.click*(1+b.crit*(b.critMultiplier-1))-a.click*(1+a.crit*(a.critMultiplier-1))))/upgradeCost(u.id,s.upgrades)};}).sort((a,b)=>b.value-a.value)[0];
   if(best&&s.energy>=upgradeCost(best.u.id,s.upgrades)&&sec%40===0){const next=buyUpgrade(s,best.u.id);spending.upgrades+=s.energy-next.energy;s=next;}
   if(sec>=900&&s.freeBoosterCapacity===2&&s.energy>=Math.max(1500,(storageCost(s)||0)*2)){const next=buyStorage(s,now);spending.storage+=s.energy-next.energy;s=next;}
  }
  if(!busy&&sec>=nextPack){
   const source=freePackCount(s)>0?'free':'paid';
   if(source==='free'||s.energy>=price(s)){
    const before=s.energy;s=openPack(s,drawPackForSave(s,packs),source,now);spending.boosters+=before-s.energy;
    for(let i=0;i<5;i++){const before=s.energy;s=reveal(s);income.duplicates+=s.energy-before;}
    s=finishPack(s);runtime=advancedEvent(s,runtime,'onBoosterOpen',now);if(!firstPack)firstPack=sec;
    openingUntil=sec+(s.packs>=8?5:20);nextPack=sec+(policy==='actif'?40:policy==='lecture'?150:180);
   }else blockedSeconds++;
  }
  if([300,600,1200,1800].includes(sec))snapshots.push({minute:sec/60,balance:s.energy,income:{...income},spending:{...spending},paid:s.paidBoostersPurchased,packs:s.packs,price:price(s),species:Object.keys(s.owned).length,passive:stats(s).auto,slots:deckCapacity(s),firstPack,slotAvailable,slotBought,slotPayableAtUnlock,blockedSeconds});
 }
 return {seed,policy,snapshots};
}
if(process.argv[1]?.endsWith('simulate-phase15.ts')){
const output=process.argv[2]||'test-results/phase15/economy-after.json';
fs.mkdirSync('test-results/phase15',{recursive:true});
const runs=(['lecture','actif','idle'] as Policy[]).flatMap(policy=>Array.from({length:16},(_,i)=>simulate(712+i,policy)));
fs.writeFileSync(output,JSON.stringify({seeds:16,minutes:[5,10,20,30],runs,limits:['Simulation, aucun playtest humain.','Parcours lecture : environ 330 clics, booster toutes les 150 s ; actif : deux clics/s pendant 35 s/min ; idle : clics initiaux seulement.','Choix de Deck basés sur les cartes connues, une décision upgrade toutes les 40 s, objectifs réclamés toutes les 20 s.','Ouvertures occupent 20 s puis 5 s après huit packs ; passif continue ; aucune production hors ligne.','Revenus avancés sont inclus dans leur source réelle (clic, passif ou doublon), jamais comptés deux fois.']},null,2));
console.log(output);
}
