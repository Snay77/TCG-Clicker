import fs from 'node:fs';
import {initialSave,stats,price,buyUpgrade,drawPackForSave,openPack,reveal,finishPack,upgradeCard,changeDeck,deckCapacity,equipBlockedReason,buyStorage,type Save} from '../lib/game';
import {ACHIEVEMENTS,achievementReady,claimAchievement,freePackCount,buyDeckSlot,explorationLevel,DECK_SLOT_UNLOCKS} from '../lib/exploration';
import {rechargeFreePacks,storageCost} from '../lib/booster-economy';
import {UPGRADES,upgradeCost,initialCombo,advanceCombo,decayCombo} from '../lib/progression';
import {initialAdvancedRuntime,advancedEvent} from '../lib/advanced-effects';
import {playClick,playTick} from '../lib/play-effects';
import {byId} from '../lib/cards';
import {activateOverload,initialPortalRuntime,portalTick,portalUnlocked,stabilizeAnomaly,parsePortal} from '../lib/living-portal';
const rng=(seed:number)=>()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
type Policy='lecture'|'actif'|'idle';
export function simulate(seed:number,policy:Policy,withPortal=false,optimize=false){
 let s=initialSave(0),runtime=initialAdvancedRuntime(),combo=initialCombo(),openingUntil=0,nextPack=90,clickBudget=0;
 let portal=initialPortalRuntime(),overloads=0,stabilizations=0,unlockedAt=0;
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
  if(withPortal){const tick=portalTick(s,portal,1,now,!busy);s={...s,portal:tick.progress};portal=tick.runtime;
   if(portalUnlocked(s)&&!unlockedAt)unlockedAt=sec;
   if(!busy){const stabilized=stabilizeAnomaly(s,portal,now);if(stabilized!==s){s=stabilized;stabilizations++;}
    const sync=!optimize||portal.preparedUntil>now||Object.values(s.advancedClicks||{}).some(n=>n>=25)||sec%30===0;
    if(sync){const activated=activateOverload(s,portal,now);if(activated.activated){s=activated.save;portal=activated.runtime;overloads++;}}
   }
  }
  const rate=sec<=45?2:policy==='actif'?(sec%60<35?2:0):policy==='lecture'?(sec%90<12?1.5:0):0;
  if(!busy){clickBudget+=rate;while(clickBudget>=1){const at=now-(clickBudget>=2?500:0);combo=advanceCombo(combo,at);const click=playClick(s,runtime,combo.charge,at,random(),true,withPortal?portal:undefined);if(withPortal)portal=click.portalRuntime;income.click+=click.gain;s=click.save;runtime=click.runtime;clickBudget--;}}
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
  if([300,600,1200,1800].includes(sec))snapshots.push({minute:sec/60,balance:s.energy,income:{...income},spending:{...spending},paid:s.paidBoostersPurchased,packs:s.packs,price:price(s),species:Object.keys(s.owned).length,passive:stats(s).auto,slots:deckCapacity(s),firstPack,slotAvailable,slotBought,slotPayableAtUnlock,blockedSeconds,overloads,stabilizations,unlockedAt});
 }
 return {seed,policy,snapshots};
}
if(process.argv[1]?.endsWith('simulate-phase16.ts')){
 fs.mkdirSync('test-results/phase16',{recursive:true});
 const profiles=[{name:'Idle',policy:'idle' as Policy,optimize:false},{name:'Occasionnel',policy:'lecture' as Policy,optimize:false},{name:'Régulier',policy:'actif' as Policy,optimize:false},{name:'Synchronisé',policy:'actif' as Policy,optimize:true}];
 const runs=profiles.flatMap(profile=>Array.from({length:16},(_,i)=>({profile:profile.name,seed:712+i,before:simulate(712+i,profile.policy,false,profile.optimize).snapshots,after:simulate(712+i,profile.policy,true,profile.optimize).snapshots})));
 fs.writeFileSync('test-results/phase16/economy.json',JSON.stringify({seeds:16,runs},null,2));console.log('64 paires · test-results/phase16/economy.json');
}