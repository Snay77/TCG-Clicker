import fs from 'node:fs';
import path from 'node:path';
import { CARDS, byId, runtimeId } from '../lib/cards';
import { initialSave, stats, drawPack, openPack, reveal, finishPack, upgradeCard, price, type Save } from '../lib/game';
import { initialAdvancedRuntime, advancedEvent, advancedBonuses, advancedDuplicateBonus } from '../lib/advanced-effects';
import { playClick, playTick } from '../lib/play-effects';
import { initialCombo, advanceCombo, decayCombo } from '../lib/progression';
import { rechargeFreePacks } from '../lib/booster-economy';

const ids=(n:number)=>runtimeId('F01-'+String(n).padStart(3,'0'));
const builds={Clic:[1,4,5,6,25,39],Idle:[10,11,19,20,50,60],Critique:[16,17,18,25,39,46],Collection:[13,15,31,32,59,60],Mixte:[1,10,19,25,28,39]} as const;
type Build=keyof typeof builds;
const rng=(seed:number)=>()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
const counts=[10,20,30,45,60],seeds=8,out=path.resolve('test-results/phase13b');
fs.mkdirSync(out,{recursive:true});
function initial(name:Build,count:number,seed:number,natural=false):Save {
 const random=rng(seed);const known=new Set<string>();
 if(!natural)for(const id of builds[name].map(ids)){known.add(id);let parent=byId(id).evolvesFrom;while(parent){known.add(parent);parent=byId(parent).evolvesFrom;}}
 while(known.size<count)for(const id of drawPack(random)){if(known.size<count)known.add(id);}
 let s=initialSave(0);s.owned=Object.fromEntries([...known].map(id=>[id,1]));s.account.xp=13000;s.deck=builds[name].map(ids).filter(id=>s.owned[id]&&(!byId(id).evolvesFrom||s.owned[byId(id).evolvesFrom!]));
 if(natural){
  const scores=(id:string)=>{const e=byId(id).effect;return name==='Idle'?(e.autoFlat||0)+(e.autoMultiplier||0)*10:name==='Collection'?(e.rareChance||0)*30+(e.boosterDiscount||0)*20+(e.duplicateBonus||0):name==='Critique'?(e.critChance||0)*30+(e.critMultiplier||0)*2:(e.clickFlat||0)+(e.clickMultiplier||0)*10+(e.comboMultiplier||0)*3;};
  const eligible=Object.keys(s.owned).filter(id=>!s.deck.includes(id)&&(!byId(id).evolvesFrom||s.owned[byId(id).evolvesFrom!]));
  s.deck=[...s.deck,...eligible.sort((a,b)=>scores(b)-scores(a)).slice(0,6-s.deck.length)];
 }
 s.upgrades={click:5,auto:5,critChance:10,critMultiplier:5,combo:5,global:2,faerie:2};s.level=5;
 return s;
}
function pack(s:Save,random:()=>number,now:number,enabled=true){
 const before=s.energy,owned=Object.keys(s.owned).length,xp=s.account.xp;
 const cards=drawPack(random,stats(s).rareChance);s=openPack(s,cards,'paid',now);
 const paid=before-s.energy;const started=s.energy;
 if(!s.pending.length)return {save:s,paid:0,duplicates:0,discovered:0,xp:0,levels:0,rare:0};
 for(let i=0;i<5;i++){const id=s.pending[s.revealed],extra=!enabled&&s.owned[id]?advancedDuplicateBonus(s,id):0;s=reveal(s);if(extra)s={...s,energy:s.energy-extra};}const duplicates=s.energy-started;s=finishPack(s);
 let levels=0;
 for(const id of Object.keys(s.owned))while(true){const next=upgradeCard(s,id);if(next===s)break;s=next;levels++;}
 return {save:s,paid,duplicates,discovered:Object.keys(s.owned).length-owned,xp:s.account.xp-xp,levels,rare:cards.filter(id=>byId(id).rarity>=2).length};
}
function perBooster(name:Build,count:number,seed:number,natural:boolean){
 let s=initial(name,count,seed,natural);s.energy=1e9;
 const random=rng(seed+997);
 let duplicates=0,discoveries=0,levels=0,rare=0,spent=0,completion:number|null=count===60?0:null;
 let fixed={duplicates:0,discoveries:0,levels:0,rare:0,spent:0};
 for(let n=1;n<=600;n++){
  // This protocol compares equal booster counts, independent of affordability.
  // Refill before each purchase so the exponential price cannot censor openings.
  s={...s,energy:Math.min(Number.MAX_SAFE_INTEGER,price(s)+10000)};
  const result=pack(s,random,n*1000);s=result.save;duplicates+=result.duplicates;discoveries+=result.discovered;levels+=result.levels;rare+=result.rare;spent+=result.paid;
  if(completion===null&&Object.keys(s.owned).length===60)completion=n;
  if(n===100)fixed={duplicates,discoveries,levels,rare,spent};
 }
 return {...fixed,completion,restrictedCompletion:completion??600,complete:completion!==null};
}
function budget(name:Build,count:number,seed:number,natural:boolean,clicking:boolean,enabled=true){
 let s=initial(name,count,seed,natural),runtime=initialAdvancedRuntime(),combo=initialCombo();
 const random=rng(seed+17),packRandom=rng(seed+71);let spent=0,duplicates=0,levels=0,rare=0,paid=0,free=0;
 const initialXp=s.account.xp;
 for(let now=1000;now<=900000;now+=1000){
  combo=decayCombo(combo,now);s=rechargeFreePacks(s,now);
  const tick=playTick(s,runtime,1,now,true,enabled);s=tick.save;runtime=tick.runtime;
  if(clicking)for(const offset of [-500,0]){combo=advanceCombo(combo,now+offset);const click=playClick(s,runtime,combo.charge,now+offset,random(),enabled);s=click.save;runtime=click.runtime;}
  if(s.freeBoosters>0){
   const cards=drawPack(packRandom,stats(s).rareChance);s=openPack(s,cards,'free',now);const before=s.energy;for(let i=0;i<5;i++){const id=s.pending[s.revealed],extra=!enabled&&s.owned[id]?advancedDuplicateBonus(s,id):0;s=reveal(s);if(extra)s={...s,energy:s.energy-extra};}duplicates+=s.energy-before;s=finishPack(s);rare+=cards.filter(id=>byId(id).rarity>=2).length;
   for(const id of Object.keys(s.owned))while(true){const next=upgradeCard(s,id);if(next===s)break;s=next;levels++;}
   free++;if(enabled)runtime=advancedEvent(s,runtime,'onBoosterOpen',now);
  }
  // Instant opening models economic throughput, not the animation's real time.
  if(s.energy>=price(s)){
   const result=pack(s,packRandom,now,enabled);s=result.save;spent+=result.paid;duplicates+=result.duplicates;levels+=result.levels;rare+=result.rare;paid++;if(enabled)runtime=advancedEvent(s,runtime,'onBoosterOpen',now);
  }
 }
 return {paid,free,species:Object.keys(s.owned).length,newSpecies:Object.keys(s.owned).length-count,xp:s.account.xp-initialXp,levels,rare,duplicates,spent,energy:s.energy};
}
const rows:Record<string,unknown>[]=[];
for(const natural of [false,true])for(const count of counts)for(const name of Object.keys(builds) as Build[]){
 const trials=Array.from({length:seeds},(_,i)=>{const seed=712+i;return{booster:perBooster(name,count,seed,natural),active:budget(name,count,seed,natural,true),idle:budget(name,count,seed,natural,false),start:initial(name,count,seed,natural)};});
 const average=(values:number[])=>Number((values.reduce((a,b)=>a+b,0)/values.length).toFixed(2));
 const b=trials.map(t=>t.booster),a=trials.map(t=>t.active),idle=trials.map(t=>t.idle);
 const metrics=(v:typeof a)=>Object.fromEntries(Object.keys(v[0]).map(key=>[key,average(v.map(t=>t[key as keyof typeof t]))]));
 const clicStatic=name==='Clic'?Array.from({length:seeds},(_,i)=>budget(name,count,712+i,natural,true,false)):null;
 rows.push({protocol:natural?'natural':'archetype-owned',species:count,build:name,startingCore:average(trials.map(t=>builds[name].map(ids).filter(id=>t.start.deck.includes(id)).length)),startingTypes:average(trials.map(t=>new Set(t.start.deck.map(id=>byId(id).type)).size)),startingCollectionBonus:average(trials.map(t=>advancedBonuses(t.start).autoMultiplier||0)),per100Boosters:{duplicateEnergy:average(b.map(t=>t.duplicates)),discovered:average(b.map(t=>t.discoveries)),cardLevels:average(b.map(t=>t.levels)),rareCards:average(b.map(t=>t.rare)),spent:average(b.map(t=>t.spent)),completionWithin600:average(b.map(t=>Number(t.complete))),restrictedMeanBoostersToComplete:count===60?0:average(b.map(t=>t.restrictedCompletion))},active15min:metrics(a),idle15min:metrics(idle),clicWithoutAdvanced:clicStatic?metrics(clicStatic):null});
 console.log((natural?'natural':'owned')+' '+count+' '+name);
}
fs.writeFileSync(path.join(out,'simulation.json'),JSON.stringify({seeds,durationSeconds:900,counts,boosterTrials:600,fixedBoosterMetrics:100,protocols:{'archetype-owned':'Six cartes du build et leurs parents connus ; remplissage aléatoire pondéré. Isole les effets une fois le build accessible.','natural':'Même collection initiale tirée sans Deck imposé ; cartes du build connues puis remplacement par candidats équipables selon le rôle.'},limits:['Ouvertures instantanées : mesure économique, pas durée des animations.','Achats automatiques de boosters et améliorations de cartes, sans objectifs réclamés ni nouvelles améliorations de Machine.','Collections partielles variables : statistiques appariées sur huit graines.','Complétion censurée à 600 boosters ; moyenne restreinte incluant les non-complétions.'],rows,humanPlaytest:'not-performed'},null,2));
