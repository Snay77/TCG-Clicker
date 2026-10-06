import test from 'node:test';
import assert from 'node:assert/strict';
import { ADVANCED_CARDS } from '../lib/advanced-card-design';
import { CARDS, byId, runtimeId } from '../lib/cards';
import { initialSave, stats, price, openPack, reveal, finishPack, parseSave, type Save } from '../lib/game';
import { initialAdvancedRuntime, advancedBonuses, advancedEvent, advancedDuplicateBonus, reconcileAdvanced, consumeAdvancedClick, advancedRows } from '../lib/advanced-effects';
import { playClick, playTick } from '../lib/play-effects';
import { synergies } from '../lib/synergies';
const id=(n:number)=>runtimeId(`F01-${String(n).padStart(3,'0')}`);
function fixture(...numbers:number[]):Save {return {...initialSave(0),energy:10000,owned:Object.fromEntries(CARDS.map(c=>[c.id,3])),deck:numbers.map(id)};}
const close=(actual:number,expected:number)=>assert.ok(Math.abs(actual-expected)<1e-8,`${actual} != ${expected}`);

test('échantillon de 12 cartes, 7 types, 6 raretés et descriptions courtes',()=>{
 assert.equal(ADVANCED_CARDS.length,12);assert.equal(new Set(ADVANCED_CARDS.map(c=>c.designId)).size,12);
 const cards=ADVANCED_CARDS.map(c=>byId(runtimeId(c.designId)));
 assert.equal(new Set(cards.map(c=>c.type)).size,7);assert.equal(new Set(cards.map(c=>c.rarity)).size,6);
 assert.ok(ADVANCED_CARDS.every(c=>c.text.length<85));
});
test('conditions Sylve et combo : seuil strict, suppression immédiate au retrait',()=>{
 const s=fixture(1,4,5);close(advancedBonuses(s,{combo:75}).clickMultiplier!, .1);
 close(advancedBonuses(s,{combo:76}).clickMultiplier!, .15);
 close(advancedBonuses({...s,deck:[id(1),id(5)]},{combo:0}).clickMultiplier!,0);
 assert.ok(synergies(s.deck).find(x=>x.type==='Sylve')!.active);
});
test('diversité et collection : espèces, pas nombre de copies, valeurs plafonnées',()=>{
 const s=fixture(10,28,60);close(advancedBonuses(s).energyMultiplier!,.045);close(advancedBonuses(s).autoMultiplier!,.21);
 const ten={...s,owned:Object.fromEntries(CARDS.slice(0,10).map(c=>[c.id,9999])),deck:[id(10)]};
 close(advancedBonuses(ten).autoMultiplier!,.01);
});
test('lignée : seuls les bonus de base de la lignée, jamais un effet récursif ou une synergie',()=>{
 const s=fixture(19,20,10);close(advancedBonuses(s).autoFlat!,1.2*.15);
 close(advancedBonuses(s).autoMultiplier!, .1*.15+.06);
 close(advancedBonuses({...s,deck:[id(19),id(10)]}).autoFlat!,0);
});
test('25 clics arment le suivant, une seule consommation ; équipements indépendants des clics historiques',()=>{
 const s=fixture(25);s.clicks=99999;let runtime=initialAdvancedRuntime();
 for(let i=1;i<=25;i++){const result=playClick(s,runtime,0,i*100,1);close(result.gain,stats(s).click);runtime=result.runtime;}
 assert.equal(runtime.charged[id(25)],3);
 const burst=playClick(s,runtime,0,2600,1);close(burst.gain,stats(s).click*3);
 close(playClick(s,burst.runtime,0,2700,1).gain,stats(s).click);
 assert.equal(burst.runtime.counters[id(25)],1);
});
test('critique : bonus au clic suivant, durée 4 s et rafraîchissement sans cumul',()=>{
 const s=fixture(39);s.upgrades.critChance=1;
 const first=playClick(s,initialAdvancedRuntime(),0,100,0);close(first.gain,stats(s).click*3);
 const active=playClick(s,first.runtime,0,200,1);close(active.gain,stats(s).click*1.15);
 const refresh=advancedEvent(s,first.runtime,'onCritical',1000);
 close(stats(s,{runtime:refresh,now:4999}).click,stats(s).click*1.15);
 close(stats(s,{runtime:refresh,now:5000}).click,stats(s).click);
});
test('bonus passif : intégration exacte à expiration même avec intervalle retardé',()=>{
 const s=fixture(50),runtime=advancedEvent(s,initialAdvancedRuntime(),'onBoosterOpen',0);
 const tick=playTick(s,runtime,2,9000,true);
 close(tick.save.energy-s.energy,3*(1+.15+.2)+3*(1+.15));
 assert.equal(tick.runtime.expires[id(50)],undefined);
});
test('charges simultanées ×3 et ×2 : maximum ×3, aucune réutilisation',()=>{
 const s=fixture(25,59);let r=advancedEvent(s,initialAdvancedRuntime(),'onBoosterOpen',1);
 for(let i=0;i<25;i++)r=advancedEvent(s,r,'onClick',i+2);
 const consumed=consumeAdvancedClick(s,r,30);assert.equal(consumed.multiplier,3);
 assert.equal(consumeAdvancedClick(s,consumed.runtime,31).multiplier,1);
});
test('duplication Mycète : +2 uniquement avec Mycélisseur équipé, jamais sur découverte',()=>{
 const s=fixture(15);assert.equal(advancedDuplicateBonus(s,id(10)),2);assert.equal(advancedDuplicateBonus(s,id(1)),0);
 const pending=openPack(s,[id(10),id(1),id(10),id(1),id(10)],'paid',0);
 const gained=reveal(pending);close(gained.energy-pending.energy,stats(s).duplicateBonus+2);
 const unknown={...pending,owned:{...pending.owned}};delete unknown.owned[id(10)];
 close(reveal(unknown).energy-unknown.energy,0);
 assert.equal(advancedDuplicateBonus({...s,deck:[]},id(10)),0);
});
test('retrait et rechargement effacent les buffs ; le niveau préserve ceux du compagnon conservé',()=>{
 const s=fixture(39,25),r=advancedEvent(s,initialAdvancedRuntime(),'onCritical',100);
 assert.ok(stats(s,{runtime:r,now:200}).click>stats(s).click);
 assert.deepEqual(reconcileAdvanced({...s,deck:[id(25)]},r,200).expires,{});
 assert.equal(reconcileAdvanced({...s,cardLevels:{[id(39)]:2}},r,200).expires[id(39)],4100);
 close(stats(parseSave(JSON.stringify(s),0)).click,stats(s).click);
 assert.equal('advancedRuntime' in parseSave(JSON.stringify(s),0),false);
});
test('coûts, recharge, XP et probabilités conservés ; aucune carte hors échantillon affectée',()=>{
 for(const s of [fixture(28,60,59),fixture(19,20,50),fixture(1,4,5)]){
  const baseline=stats(s,{enabled:false}),actual=stats(s);
  assert.equal(actual.discount,baseline.discount);assert.equal(actual.rareChance,baseline.rareChance);
  const snapshot=JSON.stringify(s);advancedBonuses(s);assert.equal(JSON.stringify(s),snapshot);
  let p=openPack(s,[id(1),id(1),id(1),id(1),id(1)],'paid',0);assert.equal(s.energy-p.energy,price(s));
  for(let i=0;i<5;i++)p=reveal(p);assert.equal(finishPack(p).account.xp,p.account.xp);
 }
 const untouched=fixture(7,8,9,21,22,23);assert.deepEqual(stats(untouched),stats(untouched,{enabled:false}));
});
test('affichage : conditions inactives séparées et compteur explicite',()=>{
 const s=fixture(1,25);const rows=advancedRows(s);
 assert.equal(rows.find(r=>r.id===id(1))!.active,false);
 assert.equal(rows.find(r=>r.id===id(25))!.status,'0/25');
});
test('huit emplacements : les combinaisons critiques et passives respectent les plafonds',()=>{
 const click={...fixture(1,4,5,25,39,18,28,60),extraDeckSlots:2};
 const critical=advancedEvent(click,initialAdvancedRuntime(),'onCritical',100);
 close(advancedBonuses(click,{runtime:critical,now:200,combo:100}).clickMultiplier!,.35);
 const idle={...fixture(19,20,50,60,10,11,28,21),extraDeckSlots:2};
 const opened=advancedEvent(idle,initialAdvancedRuntime(),'onBoosterOpen',100);
 close(advancedBonuses(idle,{runtime:opened,now:200}).autoMultiplier!,.4);
});
