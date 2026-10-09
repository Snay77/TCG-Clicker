import test from 'node:test';
import assert from 'node:assert/strict';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {CARDS,runtimeId,byId} from '../lib/cards';
import {initialSave,drawPack,drawPackForSave,changeDeck,parseSave,reveal,openPack,stats,type Save} from '../lib/game';
import {visibleSystems} from '../lib/disclosure';
import {amount,decimal,percent,rarePlusChance,missingParent,duplicateGain,deckComparison,sortDeckChoices,slotOffer,mergeLevelFeedback} from '../lib/game-ux';
import {describeUIEffect} from '../lib/effects';
import {fastOpeningAvailable,toggleFastOpening,buyDeckSlot,openingDelay} from '../lib/exploration';
import {initialAdvancedRuntime,advancedEvent} from '../lib/advanced-effects';
import {activeClickPower,playClick,previewClickGain} from '../lib/play-effects';
import {advanceCombo,decayCombo,initialCombo,comboFactor} from '../lib/progression';
import EvolutionRequirement from '../components/game/EvolutionRequirement';
import DeckReplacement from '../components/game/DeckReplacement';
import DeckView from '../components/game/DeckView';
import CollectionView from '../components/game/CollectionView';
import CardInspection from '../components/game/CardInspection';
import ProgressionView from '../components/game/ProgressionView';
const id=(n:number)=>runtimeId('F01-'+String(n).padStart(3,'0'));
const fixture=(...deck:number[]):Save=>({...initialSave(0),owned:Object.fromEntries(CARDS.map(c=>[c.id,3])),deck:deck.map(id)});
test('onglets découverts : restent accessibles après dépense, retrait et reload v4',()=>{
 const s={...initialSave(0),ux:{...initialSave(0).ux,discoveredSystems:['boosters','deck','progression']}};
 const loaded=parseSave(JSON.stringify(s),0);assert.equal(visibleSystems(loaded).boosters,true);assert.equal(visibleSystems(loaded).deck,true);assert.equal(visibleSystems(loaded).progression,true);
 assert.throws(()=>parseSave(JSON.stringify({...s,ux:{...s.ux,discoveredSystems:['unknown']}}),0));
});
test('premier booster : trois Bases distinctes équipables, une intéressante et garantie carte 5',()=>{
 for(const random of [()=>0,()=>.5,()=>.999999]){
 const cards=drawPackForSave(initialSave(0),random);const bases=cards.slice(0,3);
 assert.equal(new Set(bases).size,3);assert.ok(bases.every(cid=>!byId(cid).evolvesFrom));assert.ok(byId(bases[2]).rarity>=1);assert.ok(byId(cards[4]).rarity>=1);
 }
});
test('probabilités normales : tirages inchangés après la première ouverture',()=>{
 for(const roll of [0,.2,.6,.9,.9999])assert.deepEqual(drawPackForSave({...initialSave(),packs:1},()=>roll),drawPack(()=>roll,0));
});
test('évolution obtenue sans parent : nom, numéro et silhouette immédiats',()=>{
 const s={...initialSave(),owned:{[id(2)]:1}};assert.equal(missingParent(s,id(2))?.id,id(1));
 const html=renderToStaticMarkup(createElement(EvolutionRequirement,{save:s,id:id(2)}));assert.match(html,/FORME PRÉCÉDENTE REQUISE/);assert.match(html,/Moussillon/);assert.match(html,/FÆ-001/);
 assert.equal(missingParent({...s,owned:{...s.owned,[id(1)]:1}},id(2)),null);
});
test('remplacement : conserve le slot et tous les voisins, aucun doublon',()=>{
 const s=fixture(1,10,19,25,28,50);const next=changeDeck(s,id(18),id(19));
 assert.deepEqual(next.deck,[id(1),id(10),id(18),id(25),id(28),id(50)]);
 assert.deepEqual(changeDeck(next,id(39),id(50)).deck,next.deck.slice(0,5).concat(id(39)));
});
test('comparateur : effets et synergies gagnés/perdus, aucun changement nul',()=>{
 const s=fixture(1,2,10,25);const v=deckComparison(s,id(28),id(25));
 assert.ok(v.gained.some(t=>t.includes('type équipé')));assert.ok(v.lost.some(t=>t.includes('25 clics')));
 const synergy=deckComparison(s,id(19),id(2));assert.ok(synergy.synergiesLost.some(t=>t.includes('Sylve')));
 const same=deckComparison(s,id(60),id(60));assert.ok(same.lines.every(l=>l.before!==l.after));
});
test('comparateur : garde le buff du compagnon conservé et affiche le vrai passif',()=>{
 const s=fixture(50,25),runtime=advancedEvent(s,initialAdvancedRuntime(),'onBoosterOpen',0),context={runtime,now:1000};
 const next=changeDeck(s,id(28)),row=deckComparison(s,id(28),undefined,context).lines.find(l=>l.label==='Passif / s')!;
 assert.equal(row.after,decimal(stats(next,context).auto));assert.ok(stats(next,context).auto>stats(s,context).auto);
});
test('fiche plein Deck : bouton de remplacement et comparaison de chaque slot',()=>{
 const s=fixture(1,10,19,25,28,50);
 const html=renderToStaticMarkup(createElement(CardInspection,{save:s,id:id(18),onClose(){},onEquip(){},onUpgrade(){}}));assert.match(html,/ÉQUIPER · REMPLACER/);
 const dialog=renderToStaticMarkup(createElement(DeckReplacement,{save:s,id:id(18),onClose(){},onReplace(){}}));assert.equal((dialog.match(/Comparaison du Deck/g)||[]).length,6);
});
test('slot : disponible au niveau 8, coût et achat accessibles depuis Deck',()=>{
 const s=fixture(25);s.account.xp=1750;s.energy=5000;assert.equal(slotOffer(s)?.available,true);
 const html=renderToStaticMarkup(createElement(DeckView,{save:s,onEquip(){},onSlot(){}}));assert.match(html,/Acheter le 7e emplacement/);assert.match(html,/Vos éclats/);
 assert.equal(buyDeckSlot(s).extraDeckSlots,1);assert.equal(buyDeckSlot(s).energy,0);
});
test('acquisitions : cinq cartes examinables même avec des doublons',()=>{
 const s=fixture(1),pack=[1,1,10,19,25].map(id),html=renderToStaticMarkup(createElement(CollectionView,{save:s,recentPack:pack,recentIds:pack,onEquip(){},onUpgrade(){},onClaim(){}}));
 assert.match(html,/NOUVELLES ACQUISITIONS/);assert.equal((html.match(/Examiner ↗/g)||[]).length,5);
});
test('Rare+ : probabilité réelle normalisée, carte garantie calculée séparément',()=>{
 assert.equal(rarePlusChance(0),.23);assert.ok(rarePlusChance(.12)>.23);assert.ok(rarePlusChance(.12,true)>rarePlusChance(.12));assert.ok(rarePlusChance(.75)<1);
});
test('doublon : montant affichable identique au gain réel, supplément Mycète inclus',()=>{
 const s=fixture(15);const duplicate=id(10);const pending=openPack({...s,freeBoosters:1},[duplicate,id(1),id(2),id(3),id(4)],'free');
 assert.equal(reveal(pending).energy-pending.energy,duplicateGain(pending,duplicate));assert.equal(duplicateGain(s,duplicate),stats(s).duplicateBonus+2);
});
test('ouverture simplifiée : huit boosters terminés ; reprise, rareté et Mythique préservées',()=>{
 const s={...initialSave(),packs:8};assert.equal(fastOpeningAvailable(s),true);assert.equal(toggleFastOpening(s).account.fastOpening,true);
 assert.equal(fastOpeningAvailable({...s,pending:[id(1)]}),false);assert.equal(parseSave(JSON.stringify(toggleFastOpening(s))).account.fastOpening,true);
 assert.equal(openingDelay(5,true,'suspense'),openingDelay(5,false,'suspense'));assert.ok(openingDelay(2,true,'suspense')>openingDelay(0,true,'suspense'));
});
test('formatage : nombres bornés visuellement, décimales courtes et fractions XP explicites',()=>{
 assert.equal(decimal(8831.876882336815).replace(/\s/g,''),'8831,88');assert.equal(amount(8831.876).replace(/\s/g,''),'8831');assert.equal(percent(.184567),'18,5 %');
 const s=fixture(1);s.account.xp=1758;const html=renderToStaticMarkup(createElement(ProgressionView,{save:s,onClaim(){},onSlot(){},onTitle(){},onFast(){}}));assert.match(html,/8 \/ 450 XP dans ce niveau/);assert.match(html,/XP totale/);assert.match(html,/PROCHAIN OBJECTIF/);
});
test('tri : cartes équipables avancées/récentes avant évolutions bloquées',()=>{
 const s={...initialSave(),owned:{[id(1)]:1,[id(25)]:1,[id(6)]:1}};
 const order=sortDeckChoices(s,[id(6),id(1),id(25)]);assert.equal(order[0],id(25));assert.equal(order.at(-1),id(6));
});
test('combo facultatif : deux secondes de grâce, décroissance lente, gain actif plafonné',()=>{
 const combo=advanceCombo(initialCombo(),1000);assert.equal(decayCombo(combo,2999).charge,combo.charge);assert.equal(decayCombo({...combo,charge:100},4000).charge,90);
 const power=stats(initialSave());assert.equal(comboFactor(100,0),1);assert.equal(playClick(initialSave(),initialAdvancedRuntime(),4,0,1).gain,1);
 const earned={...power,auto:1000,comboBonus:.05};assert.equal(activeClickPower(earned,100),2);assert.equal(comboFactor(100,.05),1.2);assert.equal(activeClickPower(earned,0),1);
});
test('feedbacks : niveaux successifs regroupés, nouvelle séquence après expiration',()=>{
 const first=mergeLevelFeedback(null,5,6,1000),second=mergeLevelFeedback(first,6,8,1900);
 assert.deepEqual(second,{from:5,to:8,at:1900});assert.equal(mergeLevelFeedback(second,8,9,4000).from,8);
});
test('capacités UI : aucune contribution arrondie à zéro, décimales françaises',()=>{
 assert.equal(describeUIEffect({clickFlat:.001,energyMultiplier:.0001}),'');assert.equal(describeUIEffect({clickFlat:1.2}),'+1,2 / clic');
});
test('gain annoncé : prochain palier combo et charge avancée inclus, hors critique',()=>{
 const s=fixture(25,18);s.upgrades.auto=5;
 const runtime=advancedEvent(s,initialAdvancedRuntime(),'onClick',1000);runtime.charged[id(25)]=3;
 for(const charge of [0,24,48,74,98]){
  const combo={charge,lastClick:1000,updatedAt:1000},now=1200,next=advanceCombo(combo,now);
  assert.equal(previewClickGain(s,runtime,combo,now),playClick(s,runtime,next.charge,now,1).gain);
 }
});
