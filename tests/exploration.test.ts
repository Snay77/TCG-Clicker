import test from 'node:test';
import assert from 'node:assert/strict';
import { CARDS, byId } from '../lib/cards';
import { initialSave, openPack, reveal, finishPack, parseSave, upgradeCard, buyUpgrade, deckCapacity, stats, type Save } from '../lib/game';
import { ACHIEVEMENTS, XP, levelThreshold, explorationLevel, explorationProgress, achievementProgress, achievementReady, claimAchievement, LINEAGES, lineageProgress, collectionProgress, buyDeckSlot, openingDelay, toggleFastOpening, recordClick, recordTick, selectTitle, freePackCount } from '../lib/exploration';
const pack=['001','001','003','008','009'];
const atLevel=(level:number):Save=>({...initialSave(100000),account:{...initialSave().account,xp:levelThreshold(level)}});
const allSpecies=():Save=>({...initialSave(100000),owned:Object.fromEntries(CARDS.map(c=>[c.id,1]))});

test('courbe XP : seuils exacts, niveau distinct, progression et absence XP du clic',()=>{
 for(let level=1;level<=50;level++){assert.equal(explorationLevel(levelThreshold(level)),level);if(level>1)assert.equal(explorationLevel(levelThreshold(level)-1),level-1);const p=explorationProgress(levelThreshold(level));assert.equal(p.current,0);assert.equal(p.needed,100+50*(level-1));}
 let s=initialSave();for(let i=0;i<100;i++)s=recordClick(s,1,false,100);assert.equal(s.account.xp,0);assert.equal(s.energy,100);assert.equal(s.account.totals.generatedEnergy,100);
 assert.equal(buyUpgrade(s,'click').account.xp,XP.upgrade);
 assert.equal(upgradeCard({...s,owned:{'001':3}},'001').account.xp,XP.cardLevel*2);
});
test('XP des boosters et cartes : découvertes uniques, rareté, sauvegarde partielle idempotente',()=>{
 let s=openPack({...initialSave(100000),energy:1000},pack,'paid',100000);assert.equal(s.account.xp,XP.booster);
 s=reveal(s);s=parseSave(JSON.stringify(s),100000);for(let i=0;i<8;i++)s=reveal(s);
 assert.equal(s.account.xp,XP.booster+4*XP.discovery+pack.filter(id=>byId(id).rarity>=2).length*XP.rare);
 assert.equal(s.account.totals.cardsObtained,5);assert.equal(s.account.totals.duplicatesObtained,1);
 assert.equal(reveal(s),s);const loaded=parseSave(JSON.stringify(s),100000);assert.deepEqual(loaded,s);
});
test('objectifs déclaratifs : 20 lignées, identifiants uniques et récompenses valides',()=>{
 assert.equal(new Set(ACHIEVEMENTS.map(a=>a.id)).size,ACHIEVEMENTS.length);
 assert.equal(LINEAGES.length,20);assert.equal(ACHIEVEMENTS.filter(a=>a.category==='Lignées').length,20);
 for(const a of ACHIEVEMENTS){assert.ok(a.target>0);assert.ok(a.rewards.every(r=>r.amount>0&&Number.isSafeInteger(r.amount)));}
});
test('milestones : récompense unique, réserve hors capacité, aucun gain de production artificiel',()=>{
 let s:Save={...allSpecies(),freeBoosters:2,freeBoosterTimerStartedAt:null};
 for(const n of [10,25,40,50,60]){const before=s;assert.equal(achievementReady(s,ACHIEVEMENTS.find(a=>a.id===`discover-${n}`)!),true);s=claimAchievement(s,`discover-${n}`);assert.ok(s.energy>before.energy);assert.ok(s.account.xp>before.account.xp);assert.equal(claimAchievement(s,`discover-${n}`),s);}
 assert.equal(s.account.rewardBoosters,11);assert.equal(s.freeBoosters,2);assert.equal(s.freeBoosterCapacity,2);assert.equal(s.freeBoosterTimerStartedAt,null);assert.equal(s.account.totals.generatedEnergy,0);
 assert.equal(selectTitle(s,'guardian').account.activeTitle,'guardian');assert.equal(selectTitle(initialSave(),'guardian').account.activeTitle,'explorer');assert.deepEqual(parseSave(JSON.stringify(s),100000),s);
 const opened=openPack(s,pack,'free',100000);assert.equal(opened.account.rewardBoosters,10);assert.equal(opened.freeBoosters,2);assert.equal(opened.freeBoosterTimerStartedAt,null);assert.equal(opened.account.totals.freeOpened,1);assert.equal(opened.paidBoostersPurchased,0);
 assert.equal(claimAchievement(opened,'packs-5'),opened);
});
test('lignées et raretés : 60/60, badge, titre cosmétique, limites et maître niveau 20',()=>{
 let s=allSpecies();assert.equal(collectionProgress(s).species,60);assert.equal(lineageProgress(s).filter(l=>l.complete).length,20);assert.deepEqual(collectionProgress(s).rarities.map(r=>r.owned),[24,14,10,6,4,2]);
 for(const l of LINEAGES){const a=ACHIEVEMENTS.find(a=>a.lineageId===l.id)!;assert.equal(achievementProgress(s,a),l.ids.length);s=claimAchievement(s,a.id);assert.equal(claimAchievement(s,a.id),s);}
 assert.equal(s.account.claimed.length,20);assert.equal(s.account.xp,1500);assert.equal(selectTitle(s,'sylve').account.activeTitle,'sylve');assert.equal(selectTitle(s,'moon').account.activeTitle,'moon');
 const mastery=ACHIEVEMENTS.find(a=>a.id==='mastery')!;
 s={...s,cardLevels:{'001':5,'002':5,'003':5}};assert.equal(achievementReady(s,mastery),false);s={...s,account:{...s.account,xp:levelThreshold(20)}};assert.equal(achievementReady(s,mastery),true);assert.equal(achievementReady(claimAchievement(s,'mastery'),mastery),false);
});
test('slots 7/8 : niveau minimum, débit unique, persistance et maximum',()=>{
 const low={...atLevel(7),energy:1e6};assert.equal(buyDeckSlot(low),low);
 let s={...atLevel(8),energy:50000};s=buyDeckSlot(s);assert.equal(deckCapacity(s),7);assert.equal(s.energy,45000);assert.equal(buyDeckSlot(s),s);
 s={...s,account:{...s.account,xp:levelThreshold(15)}};s=buyDeckSlot(s);assert.equal(deckCapacity(s),8);assert.equal(s.energy,20000);assert.equal(buyDeckSlot(s),s);assert.deepEqual(parseSave(JSON.stringify(s),100000),s);
 const poor={...atLevel(15),energy:4999};assert.equal(buyDeckSlot(poor),poor);
});
test('synergies avancées : trois espèces et niveau 3, paires inchangées',()=>{
 const ids=CARDS.filter(c=>c.type==='Sylve').slice(0,3).map(c=>c.id),s={...initialSave(),owned:Object.fromEntries(ids.map(id=>[id,1])),deck:ids};
 assert.ok(stats({...s,account:{...s.account,xp:levelThreshold(3)}}).click>stats(s).click);
 const pair={...s,deck:ids.slice(0,2)};assert.deepEqual(stats({...pair,account:{...pair.account,xp:levelThreshold(3)}}),stats(pair));
});
test('totaux cumulatifs : dépenses, doublons consommés, clics critiques et temps visible',()=>{
 let s=recordClick(initialSave(),100,true,100);assert.equal(s.account.totals.criticalClicks,1);assert.equal(s.account.totals.maxCombo,100);
 s=buyUpgrade(s,'click');assert.equal(s.account.totals.generatedEnergy,100);
 s=recordTick(s,2,3,true);assert.equal(s.account.totals.playSeconds,2);assert.equal(s.account.totals.generatedEnergy,106);
 s=recordTick(s,20,3,false);assert.equal(s.account.totals.playSeconds,2);assert.equal(s.account.totals.generatedEnergy,121);
 const withCards={...s,owned:{'001':3},account:{...s.account,totals:{...s.account.totals,cardsObtained:3,duplicatesObtained:2}}};const upgraded=upgradeCard(withCards,'001');assert.equal(upgraded.owned['001'],1);assert.equal(upgraded.account.totals.cardsObtained,3);assert.equal(upgraded.account.totals.duplicatesObtained,2);
});
test('migration v1-v4 : données, niveaux, ouverture, stock et timers conservés',()=>{
 const current={...initialSave(100000),energy:300,owned:{'001':6,'009':1},cardLevels:{'001':3,'009':1},deck:['001','009'],clicks:123,packs:7,paidBoostersPurchased:5,freeBoosters:1,pending:pack,revealed:2,pendingSource:'free' as const};
 const {account,...oldV4}=current;
 for(const version of [1,2,3,4]){const legacy={...oldV4,version,pendingSource:version<3?'paid':oldV4.pendingSource};const migrated=parseSave(JSON.stringify(legacy),100000);for(const key of ['energy','owned','deck','clicks','packs','pending','revealed'] as const)assert.deepEqual(migrated[key],legacy[key]);assert.equal(migrated.version,4);assert.ok(migrated.account.xp>0);if(version>=3){assert.equal(migrated.freeBoosters,1);assert.equal(migrated.freeBoosterTimerStartedAt,100000);}if(version===4)assert.deepEqual(migrated.cardLevels,oldV4.cardLevels);assert.deepEqual(parseSave(JSON.stringify(migrated),100000),migrated);}
});
test('v4 comptes invalides refusés sans migration silencieuse et récompenses persistées',()=>{
 const s=allSpecies();const claimed=claimAchievement(s,'discover-60');assert.equal(claimAchievement(parseSave(JSON.stringify(claimed),100000),'discover-60').account.rewardBoosters,5);
 for(const patch of [{format:2},{xp:-1},{xp:1.5},{claimed:['inconnu']},{claimed:['discover-10','discover-10']},{rewardBoosters:-1},{activeTitle:'inconnu'},{fastOpening:true},{totals:{}}])assert.throws(()=>parseSave(JSON.stringify({...s,account:{...s.account,...patch}}),100000));
});
test('ouverture rapide : verrou niveau 12, préférence persistante, Mythique complète',()=>{
 const low=atLevel(11);assert.equal(toggleFastOpening(low),low);
 const fast=toggleFastOpening(atLevel(12));assert.equal(fast.account.fastOpening,true);assert.equal(parseSave(JSON.stringify(fast),100000).account.fastOpening,true);
 assert.ok(openingDelay(1,true,'suspense')<openingDelay(1,false,'suspense'));assert.ok(openingDelay(3,true,'suspense')>=400);assert.equal(openingDelay(5,true,'suspense'),openingDelay(5,false,'suspense'));assert.equal(openingDelay(5,true,'leave'),openingDelay(5,false,'leave'));assert.equal(openingDelay(5,true,'tear'),openingDelay(5,false,'tear'));assert.equal(openingDelay(5,true,'suspense',true),50);
});
