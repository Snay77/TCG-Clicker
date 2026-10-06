import test from 'node:test';
import assert from 'node:assert/strict';
import { CARDS, runtimeId } from '../lib/cards';
import { initialSave, parseSave, changeDeck, type Save } from '../lib/game';
import { initialAdvancedRuntime, advancedEvent, reconcileAdvanced, advancedRows } from '../lib/advanced-effects';
import { playClick } from '../lib/play-effects';
import { machineEffectRows } from '../components/game/MachineEffects';
const id=(n:number)=>runtimeId('F01-'+String(n).padStart(3,'0'));
const fixture=(...deck:number[]):Save=>({...initialSave(0),owned:Object.fromEntries(CARDS.map(c=>[c.id,3])),deck:deck.map(id)});
test('Luciolot : 18/25 persiste ; les bonus temporaires ne sont jamais sérialisés',()=>{
 let save=fixture(25,39),runtime=initialAdvancedRuntime();
 for(let i=0;i<18;i++){const click=playClick(save,runtime,0,i,1);save=click.save;runtime=click.runtime;}
 runtime=advancedEvent(save,runtime,'onCritical',100);
 const loaded=parseSave(JSON.stringify(save),0),restored=reconcileAdvanced(loaded,initialAdvancedRuntime(),200);
 assert.equal(restored.counters[id(25)],18);assert.deepEqual(restored.expires,{});
 assert.equal(loaded.advancedClicks![id(25)],18);
});
test('charge périodique prête : reload puis consommation unique et compteur à 1',()=>{
 let save=fixture(25),runtime=initialAdvancedRuntime();
 for(let i=0;i<25;i++){const click=playClick(save,runtime,0,i,1);save=click.save;runtime=click.runtime;}
 assert.equal(save.advancedClicks![id(25)],25);
 const loaded=parseSave(JSON.stringify(save),0),burst=playClick(loaded,initialAdvancedRuntime(),0,100,1);
 const ordinary=playClick(parseSave(JSON.stringify(burst.save),0),initialAdvancedRuntime(),0,200,1);
 assert.equal(burst.gain,ordinary.gain*3);assert.equal(burst.save.advancedClicks![id(25)],1);
});
test('seule la carte retirée perd sa charge ; remise à zéro sans ancien buff',()=>{
 const save=fixture(25,39,18);save.advancedClicks={[id(25)]:18};
 let runtime=reconcileAdvanced(save,initialAdvancedRuntime(),0);runtime=advancedEvent(save,runtime,'onCritical',100);
 const removed=changeDeck(save,id(39)),kept=reconcileAdvanced(removed,runtime,200);
 assert.equal(kept.counters[id(25)],18);assert.equal(kept.expires[id(18)],4100);assert.equal(kept.expires[id(39)],undefined);
 const readded=changeDeck(removed,id(39));assert.equal(reconcileAdvanced(readded,kept,300).expires[id(39)],undefined);
 const without=changeDeck(save,id(25));assert.deepEqual(without.advancedClicks,{});
 assert.equal(reconcileAdvanced(changeDeck(without,id(25)),initialAdvancedRuntime(),0).counters[id(25)],0);
});
test('ancienne sauvegarde migrée sans charge ; imports invalides refusés',()=>{
 const s=fixture(25);assert.equal(parseSave(JSON.stringify(s),0).advancedClicks,undefined);
 for(const advancedClicks of [[],{[id(25)]:26},{[id(25)]:-1},{[id(25)]:1.5},{[id(39)]:2},{bad:2}])assert.throws(()=>parseSave(JSON.stringify({...s,advancedClicks}),0));
});
test('Machine : compteur utile à partir de la moitié ; trois lignes et secondes décimales',()=>{
 const s=fixture(25,39,18,50),runtime=initialAdvancedRuntime();
 assert.equal(machineEffectRows(s,{runtime,now:0}).length,0);
 let current=reconcileAdvanced(s,runtime,0);current={...current,counters:{[id(25)]:12}};
 assert.equal(machineEffectRows(s,{runtime:current,now:0}).length,0);
 current={...current,counters:{[id(25)]:18}};
 assert.equal(machineEffectRows(s,{runtime:current,now:0})[0].status,'18/25');
 current=advancedEvent(s,current,'onCritical',100);current=advancedEvent(s,current,'onBoosterOpen',100);
 assert.equal(machineEffectRows(s,{runtime:current,now:900}).length,3);
 assert.equal(advancedRows(s,{runtime:current,now:900}).find(r=>r.id===id(39))!.status,'3.2 s');
});
