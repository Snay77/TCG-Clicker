import test from 'node:test';
import assert from 'node:assert/strict';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {CARDS,runtimeId} from '../lib/cards';
import {initialSave,upgradeCard,stats,changeDeck,parseSave} from '../lib/game';
import {advancedRows,advancedEvent,initialAdvancedRuntime} from '../lib/advanced-effects';
import {fastRevealPolicy,boosterSummary,upgradeFeedback,filterCount,acquisitionLabel,timer,decimal,percent,compactFeedback} from '../lib/game-ux';
import {openingDelay,ACHIEVEMENTS,achievementReady,recordClick,buyDeckSlot} from '../lib/exploration';
import {upgradeCost,upgradeEffects,initialUpgrades} from '../lib/progression';
import {progressivePackPrice} from '../lib/booster-economy';
import {machineEffectRows} from '../components/game/MachineEffects';
import DeckReplacement from '../components/game/DeckReplacement';
import DeckView from '../components/game/DeckView';
import {simulate} from '../scripts/simulate-phase15';
const id=(n:number)=>runtimeId('F01-'+String(n).padStart(3,'0'));
const fixture=(...deck:number[])=>({...initialSave(0),owned:Object.fromEntries(CARDS.map(c=>[c.id,3])),deck:deck.map(id)});
test('conditions : état manquant chiffré, jamais ACTIF si la condition échoue',()=>{
 const s=fixture(1,5,60,19);const rows=advancedRows(s,{combo:75});
 assert.equal(rows.find(r=>r.id===id(1))!.state,'CONDITION MANQUANTE');assert.match(rows.find(r=>r.id===id(1))!.detail,/2\/3/);
 assert.equal(rows.find(r=>r.id===id(5))!.active,false);
 assert.equal(advancedRows(s,{combo:76}).find(r=>r.id===id(5))!.state,'ACTIF');
 assert.equal(advancedRows(fixture(60)).find(r=>r.id===id(60))!.state,'CONDITION MANQUANTE');
});
test('Horlogrève : attend un booster, charge réelle, retrait et reload sans charge',()=>{
 const s=fixture(59);assert.equal(advancedRows(s)[0].state,'EN ATTENTE D’UN BOOSTER');
 const runtime=advancedEvent(s,initialAdvancedRuntime(),'onBoosterOpen',100);
 const row=advancedRows(s,{runtime,now:100})[0];assert.equal(row.state,'CHARGÉ');assert.equal(row.detail,'Prochain clic ×2');
 assert.equal(advancedRows(parseSave(JSON.stringify(s),0))[0].state,'EN ATTENTE D’UN BOOSTER');
 const removed=changeDeck(s,id(59));assert.equal(advancedRows(removed,{runtime}).length,0);
});
test('buff : PRÊT seulement si un critique est possible, ACTIF seulement pendant sa durée',()=>{
 const s=fixture(39);assert.equal(advancedRows(s)[0].state,'CONDITION MANQUANTE');s.upgrades.critChance=1;
 assert.equal(advancedRows(s)[0].state,'PRÊT');const runtime=advancedEvent(s,initialAdvancedRuntime(),'onCritical',0);
 const row=advancedRows(s,{runtime,now:100})[0];assert.equal(row.state,'ACTIF');assert.match(row.status,/3,9 s/);
 assert.equal(advancedRows(s,{runtime,now:4000})[0].state,'PRÊT');
});
test('Luciolot : charge persistée correctement étiquetée',()=>{
 const s=fixture(25);s.advancedClicks={[id(25)]:18};assert.equal(advancedRows(s)[0].state,'EN CHARGE');assert.equal(advancedRows(s)[0].detail,'18/25 clics');
 s.advancedClicks[id(25)]=25;assert.equal(advancedRows(s)[0].state,'CHARGÉ');
});
test('Machine : Lièvrille apparaît et disparaît avec le combo, maximum trois lignes',()=>{
 const s=fixture(5,25,39,18,50);assert.ok(!machineEffectRows(s,{combo:75}).some(r=>r.id===id(5)));
 assert.ok(machineEffectRows(s,{combo:76}).some(r=>r.id===id(5)));
 const runtime=advancedEvent(s,advancedEvent(s,initialAdvancedRuntime(),'onCritical',0),'onBoosterOpen',0);
 assert.equal(machineEffectRows(s,{runtime,now:100,combo:100}).length,3);
});
test('rapide : ordinaires automatiques, nouveautés en pause, deux raretés hautes préservées',()=>{
 for(const r of [0,1,2,3])assert.ok(fastRevealPolicy(r,false,true).automatic);
 for(const r of [4,5]){assert.ok(!fastRevealPolicy(r,false,true).automatic);assert.equal(openingDelay(r,true,'suspense'),openingDelay(r,false,'suspense'));}
 assert.ok(!fastRevealPolicy(0,true,true).automatic);assert.ok(!fastRevealPolicy(0,false,false).automatic);
});
test('résumé : doublons répétés, gain, améliorable et carte proche sans faux nouveau',()=>{
 const s=fixture(15);s.pending=[1,1,10,19,25].map(id);s.revealed=5;s.owned[id(1)]=3;s.owned[id(10)]=2;
 const original={[id(1)]:1,[id(10)]:1,[id(19)]:2,[id(25)]:2};const summary=boosterSummary(s,original);
 assert.equal(summary.duplicates,5);assert.equal(summary.upgrades,3);assert.equal(summary.close,1);assert.ok(summary.shards>=5);
 const fresh=boosterSummary({...s,pending:[id(1),id(1),id(1),id(1),id(1)]},{});assert.equal(fresh.duplicates,4);
});
test('amélioration : confirmation réelle du niveau précédent et gain avant/après',()=>{
 const s=fixture(1),next=upgradeCard(s,id(1)),f=upgradeFeedback(s,next,id(1))!;
 assert.equal(f.from,1);assert.equal(f.to,2);assert.match(f.before,/\+1 /);assert.match(f.after,/1,2/);
 assert.equal(upgradeFeedback(s,s,id(1)),null);
});
test('filtres : compteur des critères et tri, recherche active',()=>{
 const f={search:'',type:'',rarity:'',discovery:'',upgradeable:false,sort:'number' as const};assert.equal(filterCount(f),0);
 assert.equal(filterCount({...f,search:'Luciolot',type:'Étincelle'}),2);assert.equal(filterCount({...f,rarity:'0'}),1);
});
test('badges : première espèce distincte du doublon récent',()=>{
 assert.equal(acquisitionLabel(id(1),[id(1)],[]),'RÉCENT');assert.equal(acquisitionLabel(id(1),[id(1)],[id(1)]),'NOUVEAU');assert.equal(acquisitionLabel(id(1),[],[]),null);
});
test('slot : débit unique, offer suivant et résumé avant les compagnons',()=>{
 const s=fixture(25);s.energy=15000;s.account.xp=1750;const next=buyDeckSlot(s);assert.equal(next.extraDeckSlots,1);assert.equal(next.energy,0);assert.equal(buyDeckSlot(next),next);
 const html=renderToStaticMarkup(createElement(DeckView,{save:next,onEquip(){}}));assert.ok(!html.includes('7e emplacement disponible'));
 assert.ok(html.indexOf('deck-slot-offer')<html.indexOf('deck-slots'));
});
test('remplacement : sprites réduits, comparaison progressive, aucune carte TCG',()=>{
 const html=renderToStaticMarkup(createElement(DeckReplacement,{save:fixture(1,10,19,25,28,50),id:id(18),onClose(){},onReplace(){}}));
 assert.equal((html.match(/replacement-row/g)||[]).length,6);assert.ok(!html.includes('class="card '));assert.ok(html.includes('Comparaison complète'));
});
test('formatage et notifications : français et détail groupé',()=>{
 assert.equal(timer(3.9),'3,9 s');assert.equal(decimal(1.2),'1,2');assert.equal(percent(.015),'1,5 %');assert.equal(compactFeedback(['a','b','c']),'3 RÉCOMPENSES / DÉCOUVERTES');
});
test('combo : pas de récompense invisible au début, nécessite un clic après acquisition',()=>{
 const goal=ACHIEVEMENTS.find(a=>a.id==='combo-100')!;let s=recordClick(initialSave(0),1,false,100);
 assert.equal(s.account.totals.maxCombo,0);assert.ok(!achievementReady(s,goal));s.upgrades.combo=1;assert.ok(!achievementReady(s,goal));
 s=recordClick(s,1,false,100);assert.ok(achievementReady(s,goal));
});
test('économie : début inchangé, passif ajusté progressivement, coûts ciblés',()=>{
 const u=initialUpgrades();assert.equal(upgradeCost('auto',u),60);u.auto=1;assert.equal(upgradeCost('auto',u),72);u.auto=2;assert.equal(upgradeEffects(u)[1].autoFlat,3);u.auto=6;assert.equal(upgradeEffects(u)[1].autoFlat,8);
 for(let n=0;n<=5;n++)assert.equal(progressivePackPrice(n),progressivePackPrice(n,0,1.12));assert.ok(progressivePackPrice(10)>progressivePackPrice(10,0,1.12));
});
test('ajustement borné : ne fait pas exploser les prix en fin de partie',()=>{
 for(const n of [20,30,50,100])assert.ok(progressivePackPrice(n)<=Math.ceil(progressivePackPrice(n,0,1.12)*2.5));
 const a=initialUpgrades();a.global=30;assert.ok(upgradeCost('global',a)<=Math.ceil(350*1.4**30*1.12**4));
 assert.equal(advancedRows(fixture(50))[0].state,'EN ATTENTE D’UN BOOSTER');
});
test('simulation économique : recettes moins dépenses = solde à chaque échéance',()=>{
 const r=simulate(712,'lecture');for(const raw of r.snapshots){const s=raw as unknown as {income:Record<string,number>;spending:Record<string,number>;balance:number;firstPack:number};
 assert.ok(Math.abs(Object.values(s.income).reduce((a,b)=>a+b,0)-Object.values(s.spending).reduce((a,b)=>a+b,0)-s.balance)<1e-6);assert.ok(s.firstPack<150);}
});
