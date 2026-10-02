import test from 'node:test';
import assert from 'node:assert/strict';
import { initialSave, upgradeCard, savedCardLevel, stats, parseSave, reveal, buyPack, type Save } from '../lib/game';
import { cardUpgradeCost } from '../lib/progression';

test('améliorations manuelles : coûts croissants, copie gardée et effets permanents',()=>{
 let s: Save={...initialSave(),owned:{'001':15,'006':1},deck:['001']};
 for(const [index,cost] of [2,3,4,5].entries()){
  const before=s,energy=s.energy;
  assert.equal(cardUpgradeCost(savedCardLevel(s,'001')),cost);
  s=upgradeCard(s,'001');
  assert.equal(s.owned['001'],before.owned['001']-cost);
  assert.equal(s.owned['006'],1);
  assert.equal(savedCardLevel(s,'001'),index+2);
  assert.ok(stats(s).click>stats(before).click);
  assert.deepEqual(s.deck,['001']);assert.equal(s.energy,energy);
 }
 assert.equal(s.owned['001'],1);assert.equal(stats(s).click,3);
 assert.equal(upgradeCard(s,'001'),s);
 assert.deepEqual(parseSave(JSON.stringify(s)),s);
 assert.equal(upgradeCard(s,'inconnue'),s);
});
test('stock insuffisant et ouverture en cours interdisent la consommation',()=>{
 const s={...initialSave(),owned:{'001':2}};
 assert.equal(upgradeCard(s,'001'),s);
 const opening=buyPack({...s,energy:100,owned:{'001':8}},Array(5).fill('001'));
 assert.equal(upgradeCard(opening,'001'),opening);
 const revealed=reveal(opening);
 assert.equal(savedCardLevel(revealed,'001'),1);
 assert.equal(revealed.owned['001'],9);
});
test('migration v3 garde anciens niveaux et copies, validation v4',()=>{
 const old={...initialSave(),version:3,owned:{'001':6,'006':15},deck:['001','006']};
 const s=parseSave(JSON.stringify(old));assert.equal(s.version,4);
 assert.deepEqual(s.owned,old.owned);assert.equal(savedCardLevel(s,'001'),3);assert.equal(savedCardLevel(s,'006'),5);
 assert.deepEqual(parseSave(JSON.stringify(s)),s);
 for(const cardLevels of [null,[],{'001':0},{'001':6},{'001':1.5},{'unknown':2}])assert.throws(()=>parseSave(JSON.stringify({...s,cardLevels})));
});
