import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { initialSave, parseSave, upgradeCard, equip, buyUpgrade, reveal, openPack, type Save } from '../lib/game';
import { markIntroSeen, completedSteps, contextualTip, dismissTip, cardInspection, filterCollection, duplicateFeedback, sortedAchievements, type CollectionFilters } from '../lib/ux';
import { toggleFastOpening, levelThreshold, achievementReady } from '../lib/exploration';
import { CARDS } from '../lib/cards';
import CardInspection from '../components/game/CardInspection';
import { SOUND_NOTES } from '../lib/game-audio';
import UpgradesView from '../components/game/UpgradesView';
const filters:CollectionFilters={search:'',type:'',rarity:'',discovery:'',upgradeable:false,sort:'number'};
test('sept améliorations exposent le bonus nul puis les contributions cumulées',()=>{
 const s=initialSave();s.upgrades.click=12;
 const html=renderToStaticMarkup(createElement(UpgradesView,{save:s,ready:true,onBuy(){},onBuyStorage(){}}));
 assert.match(html,/Actuel : \+12 \/ clic/);assert.match(html,/Prochain : \+13 \/ clic/);assert.match(html,/Actuel : \+0 \/ sec/);assert.equal((html.match(/Actuel :/g)||[]).length,7);
});
test('première arrivée non rejouée, fermeture et conseils ignorables persistants',()=>{
 let s=initialSave(1000);assert.equal(s.ux.introSeen,false);assert.equal(contextualTip(s),null);
 s=markIntroSeen(s);assert.equal(contextualTip(s),'click');s=dismissTip(s,'click');
 const loaded=parseSave(JSON.stringify(s),1000);assert.equal(loaded.ux.introSeen,true);assert.equal(contextualTip(loaded),null);assert.equal(markIntroSeen(loaded),loaded);
 assert.equal(contextualTip({...loaded,energy:100,ux:{...loaded.ux,skipTips:true}}),null);
});
test('conseils contextuels suivent ressources et rencontres sans verrouiller le jeu',()=>{
 const s=markIntroSeen({...initialSave(1000),clicks:5,energy:60});assert.equal(contextualTip(s),'upgrade');
 const up=buyUpgrade({...s,energy:100},'click');assert.equal(contextualTip({...up,energy:80}),'booster');
 const found={...up,packs:1,owned:{'001':1,'002':1,'003':1}};assert.equal(contextualTip(found),'collection');assert.equal(contextualTip(dismissTip(found,'collection')),'deck');
 assert.equal(equip(found,'001').deck.length,1);
});
test('checklist petite et permanente, booster fini seulement, aucun cadeau',()=>{
 let s=initialSave(1000);assert.deepEqual(completedSteps(s),[]);
 s={...s,clicks:1,upgrades:{...s.upgrades,click:1},packs:1,owned:Object.fromEntries(CARDS.slice(0,5).map(c=>[c.id,1])),deck:['001']};
 assert.deepEqual(completedSteps(s),[0,1,2,3,4]);s.ux.completed=completedSteps(s);assert.deepEqual(completedSteps({...s,deck:[]}),[0,1,2,3,4]);assert.equal(s.energy,0);assert.equal(s.account.xp,0);
 assert.ok(!completedSteps({...initialSave(),packs:1,pending:['001','001','001','001','001'],revealed:2}).includes(2));
});
test('collection combine recherche, type, rareté, découverte, améliorable et tris',()=>{
 const s={...initialSave(),owned:{'001':3,'009':1,'002':8},cardLevels:{'002':5}};
 assert.deepEqual(filterCollection(s,{...filters,upgradeable:true}).map(c=>c.id),['001']);
 assert.deepEqual(filterCollection(s,{...filters,search:'MOUSS',type:'Sylve',rarity:'0',discovery:'owned'}).map(c=>c.id),['001']);
 assert.equal(filterCollection(s,{...filters,discovery:'unknown'}).length,57);
 assert.equal(filterCollection(s,{...filters,search:'Velours'}).length,0);
 assert.equal(filterCollection(s,{...filters,discovery:'owned',sort:'rarity'})[0].id,'009');
 assert.deepEqual(filterCollection(s,filters).map(c=>c.number),Array.from({length:60},(_,i)=>i+1));
});
test('inspection sépare niveau et copies, affiche coût et effets réels après consommation',()=>{
 const s={...initialSave(),owned:{'001':6},cardLevels:{'001':2}};
 const v=cardInspection(s,'001');assert.equal(v.level,2);assert.equal(v.copies,6);assert.equal(v.cost,3);assert.equal(v.upgradeable,true);assert.equal(v.current,'+1.2 / clic');assert.equal(v.next,'+1.5 / clic');
 const after=cardInspection(upgradeCard(s,'001'),'001');assert.equal(after.copies,3);assert.equal(after.level,3);assert.equal(after.upgradeable,false);
 const html=renderToStaticMarkup(createElement(CardInspection,{save:s,id:'001',onClose(){},onEquip(){},onUpgrade(){}}));assert.match(html,/Niveau 2/);assert.match(html,/Copies disponibles : 6/);assert.match(html,/3 doublons/);assert.match(html,/Mémoire des graines/);
});
test('doublon ne promet une amélioration que lorsque son coût est atteint',()=>{
 assert.deepEqual(duplicateFeedback(2,1),{before:2,after:3,newlyUpgradeable:true});assert.equal(duplicateFeedback(3,1).newlyUpgradeable,false);assert.equal(duplicateFeedback(3,2).newlyUpgradeable,true);assert.equal(duplicateFeedback(20,5).newlyUpgradeable,false);
 let s:Save={...initialSave(),energy:100,owned:{'001':2}};s=openPack(s,['001','001','001','001','003'],'paid');s=reveal(s);assert.equal(s.owned['001'],3);assert.equal(cardInspection(s,'001').level,1);
});
test('réglages persistants, volume borné, format inconnu préservé par rejet',()=>{
 const s=initialSave(1000);s.ux={...s.ux,introSeen:true,sound:false,volume:0.18,motion:'reduce'};
 assert.deepEqual(parseSave(JSON.stringify(s),1000).ux,s.ux);
 for(const change of [{volume:2},{volume:-1},{format:2},{motion:'invalid'},{sound:1},{completed:[9]},{dismissed:['wrong']}])assert.throws(()=>parseSave(JSON.stringify({...s,ux:{...s.ux,...change}}),1000));
});
test('migration v4 ancienne préserve progression et ouverture sans introduction forcée',()=>{
 const old={...initialSave(1000),energy:42,owned:{'001':4},cardLevels:{'001':3},deck:['001'],pending:['001','002','003','004','005'],revealed:2,packs:1,paidBoostersPurchased:1,pendingSource:'paid'} as Record<string,unknown>;delete old.ux;
 const migrated=parseSave(JSON.stringify(old),1000);for(const field of ['energy','owned','cardLevels','deck','pending','revealed','account'])assert.deepEqual(migrated[field as keyof typeof migrated],old[field]);assert.equal(migrated.ux.introSeen,true);assert.ok(migrated.ux.completed.includes(4));assert.equal(parseSave(JSON.stringify(migrated),1000).ux.introSeen,true);
});
test('ouverture rapide réglable reste soumise au niveau 12 et sauvegardée',()=>{
 let s=initialSave(1000);assert.equal(toggleFastOpening(s),s);s.account.xp=levelThreshold(12);s=toggleFastOpening(s);assert.equal(parseSave(JSON.stringify(s),1000).account.fastOpening,true);assert.equal(toggleFastOpening(s).account.fastOpening,false);
});
test('récompenses prêtes prioritaires et sons distincts pour les quatre raretés hautes',()=>{
 const s=initialSave();s.account.totals.maxCombo=100;s.account.totals.generatedEnergy=9000;
 const ordered=sortedAchievements(s);assert.equal(ordered[0].id,'combo-100');assert.ok(achievementReady(s,ordered[0]));assert.equal(ordered[1].id,'energy-10000');
 assert.equal(new Set(['rare','epic','legendary','mythic'].map(k=>SOUND_NOTES[k as keyof typeof SOUND_NOTES].join())).size,4);
});
