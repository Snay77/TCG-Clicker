import test from 'node:test';import assert from 'node:assert/strict';
import {FREE_PACK_INTERVAL as I,initialFreePacks,rechargeFreePacks,freePackRemaining,progressivePackPrice,STORAGE_COSTS,storageCost} from '../lib/booster-economy';
import {type Save,initialSave,parseSave,openPack,buyPack,finishPack,chainPack,buyStorage,reveal,price,stats} from '../lib/game';
import {CARDS} from '../lib/cards';
const pack=['001','001','003','008','009'];const start=100000;
test('recharge exacte, seuil de dix minutes, reliquat et indépendance des ticks',()=>{
 const s=initialSave(start);assert.equal(s.freeBoosterCapacity,2);assert.equal(s.freeBoosters,0);assert.equal(freePackRemaining(s,start),I);
 assert.equal(rechargeFreePacks(s,start+I-1),s);const one=rechargeFreePacks(s,start+I);assert.equal(one.freeBoosters,1);assert.equal(one.freeBoosterTimerStartedAt,start+I);
 assert.deepEqual(rechargeFreePacks(one,start+I*1.5),rechargeFreePacks(s,start+I*1.5));assert.equal(freePackRemaining(one,start+I*1.5),I/2);
 let ticked=s;for(let t=start;t<=start+I*2;t+=1000)ticked=rechargeFreePacks(ticked,t);assert.deepEqual(ticked,rechargeFreePacks(s,start+I*2));
});
test('retours 10/30/60/180 minutes plafonnés, stockage plein sans temps caché',()=>{
 for(const minutes of [10,30,60,180])assert.equal(rechargeFreePacks(initialSave(start),start+minutes*60000).freeBoosters,minutes===10?1:2);
 const full=rechargeFreePacks(initialSave(start),start+35*60000);assert.equal(full.freeBoosterTimerStartedAt,null);
 assert.equal(rechargeFreePacks(full,start+100*I),full);const opened=openPack(full,pack,'free',start+100*I);assert.equal(opened.freeBoosters,1);assert.equal(opened.freeBoosterTimerStartedAt,start+100*I);
 assert.equal(rechargeFreePacks(opened,start+101*I-1).freeBoosters,1);assert.equal(rechargeFreePacks(opened,start+101*I).freeBoosters,2);
 const partial={...initialSave(start),freeBoosters:1};assert.equal(rechargeFreePacks(partial,start+12*60000).freeBoosters,2);
});
test('consommation gratuite conserve reliquat, énergie et compteur payant',()=>{
 const s={...initialSave(start),energy:1000};const loaded=rechargeFreePacks(s,start+15*60000),opened=openPack(loaded,pack,'free',start+15*60000);
 assert.equal(opened.energy,1000);assert.equal(opened.freeBoosters,0);assert.equal(opened.paidBoostersPurchased,0);assert.equal(price(opened),100);assert.equal(opened.pendingSource,'free');assert.equal(opened.freeBoosterTimerStartedAt,start+I);
 assert.equal(openPack(opened,pack,'free',start+20*60000),opened);assert.equal(openPack(s,pack,'free',start),s);
});
test('débit payant unique, prix progressif stable et discount limité à cinquante pour cent',()=>{
 assert.deepEqual([1,2,5,10,20,30,50].map(n=>progressivePackPrice(n-1)),[100,112,158,278,862,2675,25804]);
 for(const rate of [1.08,1.10,1.12,1.15]){let last=0;for(let i=0;i<70;i++){const cost=progressivePackPrice(i,0,rate);assert.ok(cost>=last);last=cost;}}
 assert.equal(progressivePackPrice(1,1),56);assert.equal(progressivePackPrice(0,-1),100);assert.equal(progressivePackPrice(10000),Number.MAX_SAFE_INTEGER);
 const s={...initialSave(start),energy:1000};const p=buyPack(s,pack,start);assert.equal(p.energy,900);assert.equal(p.paidBoostersPurchased,1);assert.equal(price(p),112);assert.equal(p.pendingSource,'paid');assert.equal(buyPack(p,pack,start),p);
 const discount={...s,owned:Object.fromEntries(CARDS.map(c=>[c.id,15])),deck:['F01-060'],paidBoostersPurchased:10,packs:10};assert.equal(price(discount),progressivePackPrice(10,stats(discount).discount));assert.ok(price(discount)<progressivePackPrice(10));
});
test('sources partagent le contenu, cinq attributions exactes et chaîne atomique',()=>{
 let s:Save={...initialSave(start),freeBoosters:2,freeBoosterTimerStartedAt:null,energy:1000};s=openPack(s,pack,'free',start);
 assert.equal(finishPack(s),s);assert.equal(chainPack(s,pack,'free',start),s);
 for(let i=0;i<8;i++)s=reveal(s);assert.equal(Object.values(s.owned).reduce((a,b)=>a+b,0),5);
 const second=chainPack(s,pack,'free',start+100);assert.equal(second.freeBoosters,0);assert.equal(second.packs,2);assert.equal(second.paidBoostersPurchased,0);assert.equal(second.revealed,0);assert.equal(chainPack(second,pack,'free',start+100),second);
 const finished=finishPack(s);assert.deepEqual(finished.pending,[]);assert.equal(finished.pendingSource,null);
 const poor={...s,freeBoosters:0,energy:0};assert.equal(chainPack(poor,pack,'paid',start),poor);
});
test('Sac dimensionnel : huit coûts croissants, plafond dix et redémarrage du timer',()=>{
 let s:Save={...initialSave(start),energy:1e8,freeBoosters:2,freeBoosterTimerStartedAt:null};
 for(const cost of STORAGE_COSTS){const before=s;assert.equal(storageCost(s),cost);s=buyStorage(s,start);assert.equal(s.freeBoosterCapacity,before.freeBoosterCapacity+1);assert.equal(s.energy,before.energy-cost);assert.equal(s.freeBoosters,2);assert.equal(s.freeBoosterTimerStartedAt,start);}
 assert.equal(s.freeBoosterCapacity,10);assert.equal(storageCost(s),null);assert.equal(buyStorage(s,start),s);assert.equal(buyStorage(initialSave(start),start).freeBoosterCapacity,2);
 const running={...initialSave(start),energy:500};assert.equal(buyStorage(running,start+1000).freeBoosterTimerStartedAt,start);
});
test('migration v1/v2 → v4 préserve toute progression et booster historique payé',()=>{
 const v2={version:2,energy:424,owned:{'001':6,'009':2},deck:['001','009'],level:9,clicks:230,packs:17,pending:pack,revealed:3,upgrades:initialSave(start).upgrades,extraDeckSlots:0};
 for(const old of [v2,{...v2,version:1}]){const migrated=parseSave(JSON.stringify(old),start);for(const key of ['energy','owned','deck','level','clicks','packs','pending','revealed'] as const)assert.deepEqual(migrated[key],old[key]);assert.equal(migrated.version,4);assert.equal(migrated.paidBoostersPurchased,17);assert.equal(migrated.freeBoosters,0);assert.equal(migrated.freeBoosterTimerStartedAt,start);assert.equal(migrated.pendingSource,'paid');}
});
test('v3 recharge au chargement et conserve booster gratuit partiel',()=>{
 const s=openPack({...initialSave(start),freeBoosters:2,freeBoosterTimerStartedAt:null},pack,'free',start);const partial=reveal(s);const loaded=parseSave(JSON.stringify(partial),start+35*60000);
 assert.equal(loaded.freeBoosters,2);assert.equal(loaded.freeBoosterTimerStartedAt,null);assert.equal(loaded.pendingSource,'free');assert.deepEqual(loaded.pending,partial.pending);assert.deepEqual(loaded.owned,partial.owned);assert.equal(loaded.revealed,1);assert.deepEqual(parseSave(JSON.stringify(loaded),start+35*60000),loaded);
});
test('économie invalide/future refusée et horloge reculée sans cadeau',()=>{
 const s=initialSave(start);for(const patch of [{version:5},{freeBoosters:3},{freeBoosters:-1},{freeBoosterCapacity:11},{freeBoosterTimerStartedAt:null},{paidBoostersPurchased:-1},{paidBoostersPurchased:1},{pendingSource:'free'},{freeBoosterTimerStartedAt:Infinity},{freeBoosters:2,freeBoosterTimerStartedAt:start}])assert.throws(()=>parseSave(JSON.stringify({...s,...patch}),start));
 const shifted=rechargeFreePacks(s,start-1000);assert.equal(shifted.freeBoosters,0);assert.equal(shifted.freeBoosterTimerStartedAt,start-1000);assert.equal(freePackRemaining(shifted,start-1000),I);
});

test('simulation préparatoire : quatre courbes, 72 trajectoires et quatre retours cohérents',async()=>{
 const {default:report}=await import('../design/phase6-economy-simulation.json');
 assert.deepEqual(report.curves.map(r=>r.growth),[1.08,1.10,1.12,1.15]);assert.equal(report.runs.length,72);assert.equal(report.averaged.length,24);
 for(const row of report.curves)assert.deepEqual(row.prices,[1,2,5,10,20,30,50].map(n=>progressivePackPrice(n-1,0,row.growth)));
 for(const row of report.runs){assert.ok(row.total===row.paid+row.freeGenerated-row.freeStored);assert.ok(row.collection<=60);assert.ok(row.energy>=0);assert.ok(row.firstPaidSeconds>0&&row.firstPaidSeconds<600);}
 assert.deepEqual(report.returns.map(r=>r.freeGenerated),[1,2,2,2]);assert.deepEqual(report.returns.map(r=>r.lostOpportunities),[0,1,4,16]);assert.ok(report.returns.every(r=>r.collectionExpectedAfterOpening<=r.total*5));
});
