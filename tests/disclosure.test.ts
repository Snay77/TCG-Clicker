import test from 'node:test';
import assert from 'node:assert/strict';
import { initialSave, buyUpgrade, openPack, reveal, finishPack, equip, parseSave, upgradeCard } from '../lib/game';
import { visibleSystems } from '../lib/disclosure';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import Card from '../components/Card';
import CardInspection from '../components/game/CardInspection';
import { byId } from '../lib/cards';
import { VISUALS } from '../lib/visuals';

test('nouvelle partie : seul Machine, puis achats utiles sans mutation économique',()=>{
 const start=initialSave(1000),before=JSON.stringify(start),v=visibleSystems(start);
 assert.deepEqual(Object.entries(v).filter(([,shown])=>shown).map(([key])=>key),['machine']);
 assert.equal(JSON.stringify(start),before);
 assert.equal(visibleSystems({...start,energy:59}).upgrades,false);
 assert.equal(visibleSystems({...start,energy:60}).upgrades,true);
 const upgraded=buyUpgrade({...start,energy:60},'auto');
 assert.equal(upgraded.energy,0);assert.equal(visibleSystems(upgraded).upgrades,true);
 assert.equal(visibleSystems(upgraded).boosters,false);
 assert.equal(visibleSystems({...start,energy:100}).boosters,true);
 assert.equal(visibleSystems({...start,freeBoosters:1}).boosters,true);
});
test('première carte avant Collection, plusieurs espèces équipables avant Deck',()=>{
 let s=openPack({...initialSave(1000),freeBoosters:1},['001','002','004','005','007'],'free',1000);
 assert.equal(visibleSystems(s).collection,false);
 s=reveal(s);assert.equal(visibleSystems(s).collection,true);assert.equal(visibleSystems(s).deck,false);
 for(let i=0;i<4;i++)s=reveal(s);
 s=finishPack(s);assert.equal(visibleSystems(s).collection,true);assert.equal(visibleSystems(s).deck,true);
 assert.equal(visibleSystems({...s,owned:{'001':5}}).deck,false);
 assert.equal(visibleSystems(equip({...s,owned:{'001':5}},'001')).deck,true);
});
test('synergies uniquement si une paire équipable existe, triples au niveau requis',()=>{
 const s={...initialSave(1000),packs:1,owned:{'001':1,'002':1,'003':1}};
 assert.equal(visibleSystems(s).synergies,false);
 const pair={...s,owned:{...s.owned,'006':1}};
 assert.equal(visibleSystems(pair).synergies,true);
 assert.equal(visibleSystems(pair).advancedSynergies,false);
 // An evolution without its predecessor must not count as a usable pair.
 assert.equal(visibleSystems({...s,owned:{'006':1,'009':1,'002':1}}).synergies,false);
 assert.equal(visibleSystems({...pair,owned:{...pair.owned,'009':1},account:{...pair.account,xp:500}}).advancedSynergies,true);
});
test('présentation conservée après recharge et consommation, sauvegarde inchangée',()=>{
 const s={...initialSave(1000),energy:0,account:{...initialSave(1000).account,totals:{...initialSave(1000).account.totals,generatedEnergy:100}}};
 assert.equal(visibleSystems(parseSave(JSON.stringify(s),1000)).boosters,false);
 assert.equal(visibleSystems(parseSave(JSON.stringify(s),1000)).upgrades,true);
});
test('objet TCG sans actions ni compteur de copies',()=>{
 const html=renderToStaticMarkup(createElement(Card,{card:byId('001'),owned:8,level:2}));
 assert.doesNotMatch(html,/<button|card-progression|×8|Améliorer|Équiper/);
 assert.ok(html.includes(VISUALS['001'].title));assert.match(html,/card-flavor/);
});
test('inspection : coût conservé, état max et évolution verrouillée explicites',()=>{
 const s={...initialSave(1000),owned:{'001':3}};
 const props={onClose(){},onEquip(){},onUpgrade(){}};
 let html=renderToStaticMarkup(createElement(CardInspection,{...props,save:s,id:'001'}));
 assert.match(html,/3 copies sur 3 nécessaires/);assert.match(html,/>AMÉLIORER</);
 const upgraded=upgradeCard(s,'001');assert.equal(upgraded.owned['001'],1);assert.equal(upgraded.cardLevels['001'],2);
 html=renderToStaticMarkup(createElement(CardInspection,{...props,save:{...s,cardLevels:{'001':5}},id:'001'}));
 assert.match(html,/Niveau 5 · MAX/);assert.doesNotMatch(html,/card-upgrade-button/);
 html=renderToStaticMarkup(createElement(CardInspection,{...props,save:{...s,owned:{'006':1}},id:'006'}));
 assert.match(html,/Évolution verrouillée/);assert.match(html,/Forme requise : Moussillon/);
});

test('boosters : total généré dépensé ne remplace pas un achat réellement possible',()=>{
 const s=buyUpgrade({...initialSave(1000),energy:100,account:{...initialSave(1000).account,totals:{...initialSave(1000).account.totals,generatedEnergy:100}}},'auto');
 assert.equal(s.energy,40);assert.equal(visibleSystems(s).boosters,false);
 assert.equal(visibleSystems({...s,energy:100}).boosters,true);
 assert.equal(visibleSystems({...s,account:{...s.account,rewardBoosters:1}}).boosters,true);
 assert.equal(visibleSystems({...s,packs:1}).boosters,true);
});
test('trois évolutions inéquipables ne font pas apparaître un Deck inutilisable',()=>{
 const s={...initialSave(1000),owned:{'006':1,'009':1,'F01-005':1}};
 assert.equal(visibleSystems(s).collection,true);assert.equal(visibleSystems(s).deck,false);
});
test('copies manquantes informatives, règles et identité repliables',()=>{
 const s={...initialSave(1000),owned:{'001':1}};
 const html=renderToStaticMarkup(createElement(CardInspection,{save:s,id:'001',onClose(){},onUpgrade(){},onEquip(){}}));
 assert.match(html,/2 manquantes/);assert.match(html,/1 copies sur 3 nécessaires/);assert.doesNotMatch(html,/COPIES INSUFFISANTES/);
 assert.match(html,/inspection-secondary inspection-help/);assert.doesNotMatch(html,/<details[^>]* open/);
 assert.ok(html.indexOf('inspection-capacity')<html.indexOf('card-progression'));
 assert.ok(html.indexOf('inspection-deck')<html.indexOf('inspection-identity'));
});
