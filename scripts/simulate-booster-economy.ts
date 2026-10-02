import {writeFileSync} from 'node:fs';
import {CARDS} from '../lib/cards';
import {initialSave,rarityProbabilities,stats,drawPack,buyPack,openPack,finishPack,price,reveal,buyUpgrade,equip,changeDeck} from '../lib/game';
import {UPGRADES,upgradeCost,advanceCombo,initialCombo,decayCombo,comboFactor} from '../lib/progression';
import {FREE_PACK_INTERVAL,initialFreePacks,rechargeFreePacks,progressivePackPrice} from '../lib/booster-economy';
const rates=[1.08,1.10,1.12,1.15],positions=[1,2,5,10,20,30,50];
function scenario(growth:number,profile:'Actif'|'Mixte',minutes:number,seedValue:number){
 let s=initialSave(0),free=initialFreePacks(0),paid=0,generated=0,lost=0,busyUntil=0,firstPaid=0,combo=initialCombo();
 let seed=seedValue;const random=()=>(seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296;
 const yieldScore=(state:typeof s,clicks:number)=>{const p=stats(state);return p.auto+clicks*p.click*comboFactor(100,p.comboBonus)*(1+p.crit*(p.critMultiplier-1));};
 for(let second=1;second<=minutes*60;second++){
  const now=second*1000,full=free.freeBoosters===free.freeBoosterCapacity;const before=free.freeBoosters;free=rechargeFreePacks(free,now);generated+=free.freeBoosters-before;if(second%600===0&&full)lost++;
  const clicking=second>=busyUntil&&(profile==='Actif'||second%300<120);
  const p=stats(s);combo=decayCombo(combo,now);let gain=p.auto;
  if(clicking)for(let click=0;click<2;click++){combo=advanceCombo(combo,now+click*500);gain+=p.click*comboFactor(combo.charge,p.comboBonus)*(1+p.crit*(p.critMultiplier-1));}
  s={...s,energy:s.energy+gain};
  if(second<busyUntil)continue;
  if(second%20===0&&(free.freeBoosters>0||s.energy>=progressivePackPrice(paid,p.discount,growth))){
   const isFree=free.freeBoosters>0;const cost=isFree?0:progressivePackPrice(paid,p.discount,growth);
   if(isFree)free={...free,freeBoosters:free.freeBoosters-1,freeBoosterTimerStartedAt:free.freeBoosters===free.freeBoosterCapacity?now:free.freeBoosterTimerStartedAt};
   else{paid++;firstPaid ||= second;}
   // Actual draw/reveal/open rules; only the paid cost is replaced for curve comparison.
   const cards=drawPack(random,p.rareChance);
   s=isFree?openPack({...s,...free,freeBoosters:free.freeBoosters+1,freeBoosterTimerStartedAt:free.freeBoosters+1===free.freeBoosterCapacity?null:free.freeBoosterTimerStartedAt},cards,"free",now):buyPack({...s,energy:s.energy-cost+price(s)},cards,now);
   for(let i=0;i<5;i++)s=reveal(s);s=finishPack(s);busyUntil=second+12;
   const clicks=profile==='Actif'?2:.8;
   for(const card of CARDS.filter(c=>s.owned[c.id])){
    if(s.deck.includes(card.id))continue;const direct=equip(s,card.id);if(direct!==s&&yieldScore(direct,clicks)>yieldScore(s,clicks))s=direct;
    else if(s.deck.length===6){let best=s;for(const old of s.deck){const candidate=changeDeck(s,card.id,old);if(yieldScore(candidate,clicks)>yieldScore(best,clicks))best=candidate;}s=best;}
   }
  }else if(second%10===0){
   const choices=UPGRADES.filter(u=>s.upgrades[u.id]<u.max&&s.energy>=upgradeCost(u.id,s.upgrades)).map(u=>({id:u.id,score:(yieldScore(buyUpgrade(s,u.id),profile==='Actif'?2:.8)-yieldScore(s,profile==='Actif'?2:.8))/upgradeCost(u.id,s.upgrades)})).sort((a,b)=>b.score-a.score);
   if(choices[0]?.score>0)s=buyUpgrade(s,choices[0].id);
  }
 }
 return {growth,profile,minutes,firstPaidSeconds:firstPaid,freeGenerated:generated,freeLostOpportunities:lost,freeStored:free.freeBoosters,paid,total:s.packs,nextPrice:progressivePackPrice(paid,stats(s).discount,growth),machine:s.level+1,energy:Math.floor(s.energy),collection:Object.keys(s.owned).length};
}
const curves=rates.map(growth=>({growth,prices:positions.map(n=>progressivePackPrice(n-1,0,growth))}));
const runs=rates.flatMap(growth=>(['Actif','Mixte'] as const).flatMap(profile=>[30,60,120].flatMap(minutes=>[41,128,902].map(seed=>scenario(growth,profile,minutes,seed)))));
const averaged=rates.flatMap(growth=>(['Actif','Mixte'] as const).flatMap(profile=>[30,60,120].map(minutes=>{
 const group=runs.filter(r=>r.growth===growth&&r.profile===profile&&r.minutes===minutes);const sample=group[0];return Object.fromEntries(Object.entries(sample).map(([k,v])=>[k,typeof v==='number'&&!['growth','minutes'].includes(k)?Math.round(group.reduce((sum,r)=>sum+Number(r[k as keyof typeof r]),0)/group.length*10)/10:v]));
})));
function estimateCollection(packs:number){
 const normal=rarityProbabilities(),guaranteed=rarityProbabilities(0,true);
 const sum=CARDS.reduce((total,c)=>{const count=CARDS.filter(x=>x.rarity===c.rarity).length;return total+1-(1-normal[c.rarity]/count)**(4*packs)*(1-guaranteed[c.rarity]/count)**packs;},0);
 return Math.round(sum*10)/10;
}
const returns=[10,30,60,180].map(minutes=>{const f=rechargeFreePacks(initialFreePacks(0),minutes*60000);return {minutes,freeGenerated:f.freeBoosters,lostOpportunities:Math.max(0,Math.floor(minutes/10)-2),paid:0,total:f.freeBoosters,energy:0,machine:1,nextPrice:100,collectionBeforeOpening:0,collectionExpectedAfterOpening:estimateCollection(f.freeBoosters)};});
const report={assumptions:{clicksPerSecond:2,mixed:'2 minutes actives sur 5',openingSeconds:12,decisionEverySeconds:10,seeds:[41,128,902],upgradeStrategy:'Meilleur rendement marginal par coût, un achat toutes les 10 secondes hors ouverture',storage:'Capacité 2 conservée pour comparer les courbes, coûts traités séparément',offline:'Seuls les boosters se rechargent, aucune énergie hors ligne',warning:'Scénarios automatisés optimistes, moyenne de trois seeds, aucune mesure humaine'},curves,averaged,runs,returns};
writeFileSync('design/phase6-economy-simulation.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({curves,averaged,returns},null,2));
