import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { CARDS, runtimeId, byId } from '../lib/cards';
import { initialSave, stats, drawPack, openPack, reveal, finishPack, price } from '../lib/game';
import { initialAdvancedRuntime, advancedEvent } from '../lib/advanced-effects';
import { playClick, playTick } from '../lib/play-effects';
import { advanceCombo, decayCombo, initialCombo } from '../lib/progression';

const id=(n:number)=>runtimeId(`F01-${String(n).padStart(3,'0')}`);
export const BUILDS={Clic:[1,4,5,6,25,39],Idle:[10,11,19,20,50,60],Critique:[16,17,18,25,39,46],Collection:[13,15,31,32,59,60],Mixte:[1,10,19,25,28,39]} as const;
const rng=(seed:number)=>()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
const out=path.resolve('test-results/phase13a');
function run(numbers:readonly number[],mode:'actif'|'idle'|'rafales',level:number,seed:number,enabled:boolean){
 let save=initialSave(0);save.energy=1e9;save.owned=Object.fromEntries(CARDS.map(c=>[c.id,3]));save.deck=numbers.map(id);save.cardLevels=Object.fromEntries(CARDS.map(c=>[c.id,level]));save.account.xp=13000;
 save.upgrades={click:5,auto:5,critChance:10,critMultiplier:5,combo:5,global:2,faerie:2};save.level=5;
 let runtime=initialAdvancedRuntime(),combo=initialCombo(),clickEnergy=0,passiveEnergy=0,duplicateEnergy=0,clicks=0;
 const random=rng(seed),packRandom=rng(seed+100000);
 const tick=200,duration=300000;
 for(let now=tick;now<=duration;now+=tick){
  combo=decayCombo(combo,now);
  const step=playTick(save,runtime,tick/1000,now,true,enabled);passiveEnergy+=step.save.energy-save.energy;save=step.save;runtime=step.runtime;
  const clicking=mode==='actif'?now%1000===0||now%1000===400:mode==='rafales'&&now%30000<10000;
  if(clicking){combo=advanceCombo(combo,now);const click=playClick(save,runtime,combo.charge,now,random(),enabled);save=click.save;runtime=click.runtime;clickEnergy+=click.gain;clicks++;}
  if(now%60000===0){
   const cards=drawPack(packRandom,stats(save).rareChance),cost=price(save),before=save.energy;
   save=openPack(save,cards,'paid',now);assert.equal(before-save.energy,cost);
   for(let i=0;i<5;i++){
    const baseDuplicate=stats(save,{enabled:false}).duplicateBonus;
    const before=save.energy;save=reveal(save);
    if(!enabled)save={...save,energy:before+baseDuplicate};
    duplicateEnergy+=save.energy-before;
   }
   save=finishPack(save);if(enabled)runtime=advancedEvent(save,runtime,'onBoosterOpen',now);
  }
 }
 const total=clickEnergy+passiveEnergy+duplicateEnergy;
 return {total,clickEnergy,passiveEnergy,duplicateEnergy,clicks,xp:save.account.xp,price:price(save),packs:save.packs};
}
type SimulationRow={build:string;level:number;mode:'actif'|'idle'|'rafales';base:number;prototype:number;uplift:number;click:number;passive:number;duplicates:number;maximumUplift:number};
const rows:SimulationRow[]=[];
for(const level of [1,5])for(const mode of ['actif','idle','rafales'] as const)for(const [name,deck] of Object.entries(BUILDS)){
 const pairs=Array.from({length:12},(_,i)=>({before:run(deck,mode,level,712+i,false),after:run(deck,mode,level,712+i,true)}));
 for(const p of pairs){assert.equal(p.before.xp,p.after.xp);assert.equal(p.before.price,p.after.price);assert.equal(p.before.packs,p.after.packs);assert.ok(Number.isFinite(p.after.total));}
 const mean=(side:'before'|'after',field:keyof ReturnType<typeof run>)=>pairs.reduce((sum,p)=>sum+p[side][field],0)/pairs.length;
 const before=mean('before','total'),after=mean('after','total');
 const row={build:name,level,mode,base:Number(before.toFixed(2)),prototype:Number(after.toFixed(2)),uplift:Number((100*(after/before-1)).toFixed(2)),click:Number(mean('after','clickEnergy').toFixed(2)),passive:Number(mean('after','passiveEnergy').toFixed(2)),duplicates:Number(mean('after','duplicateEnergy').toFixed(2)),maximumUplift:Number(Math.max(...pairs.map(p=>100*(p.after.total/p.before.total-1))).toFixed(2))};
 assert.ok(row.maximumUplift<45,JSON.stringify(row));rows.push(row);
}
for(const level of [1,5]){
 const active=rows.filter(r=>r.level===level&&r.mode==='actif'),idle=rows.filter(r=>r.level===level&&r.mode==='idle');
 assert.equal(active.toSorted((a,b)=>b.prototype-a.prototype)[0].build,'Clic');
 assert.equal(idle.toSorted((a,b)=>b.prototype-a.prototype)[0].build,'Idle');
 assert.ok(active.find(r=>r.build==='Clic')!.prototype/active.find(r=>r.build==='Critique')!.prototype<1.5);
}
fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'simulation.json'),JSON.stringify({durationSeconds:300,seeds:12,levels:[1,5],clickRates:{actif:2,idle:0,rafales:'5/s pendant 10 s sur 30'},upgrades:'5 clic / 5 passif / 10 critique / 5 multiplicateur critique / 5 combo / 2 global / 2 Faerie',collection:'60 espèces, cartes niveau uniforme ; 5 boosters payants par essai',metric:'énergie brute clic + passif + doublons ; coût des boosters inchangé, hors total',builds:Object.fromEntries(Object.entries(BUILDS).map(([name,deck])=>[name,deck.map(n=>byId(id(n)).name)])),rows},null,2));
console.table(rows);
