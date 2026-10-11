import {test} from 'node:test';
import assert from 'node:assert/strict';
import {initialSave,parseSave,changeDeck,stats,type Save} from '../lib/game';
import {runtimeId,byId} from '../lib/cards';
import {initialAdvancedRuntime} from '../lib/advanced-effects';
import {playClick,playTick} from '../lib/play-effects';
import {activateOverload,initialPortalRuntime,initialPortalProgress,portalClick,portalTick,stabilizeAnomaly,parsePortal,reconcilePortal,portalVisualState,overloadSupplement,portalUnlocked,portalDeck} from '../lib/living-portal';
import {renderToStaticMarkup} from 'react-dom/server';
import {createElement} from 'react';
import PortalControls from '../components/game/PortalControls';
import LivingPortal from '../components/game/LivingPortal';
const id=(n:number)=>runtimeId('F01-'+String(n).padStart(3,'0'));
const fixture=():Save=>({...initialSave(0),level:4,clicks:100,upgrades:{...initialSave().upgrades,click:4,critChance:1,combo:1},portal:initialPortalProgress()});
test('portal accords refer to the correct three existing cards',()=>{for(const n of [18,25,39]){const rows=portalDeck({...fixture(),deck:[id(n)]});assert.equal(rows.length,1);assert.equal(rows[0].name,byId(id(n)).name);}});
test('surcharge progressive, conserved at full capacity, activation voluntary and exactly eight seconds',()=>{
 let s=fixture(),r=initialPortalRuntime();assert.ok(portalUnlocked(s));assert.ok(!portalUnlocked(initialSave()));
 for(let i=0;i<150;i++){const next=portalClick(s,r,i*100,false,false);s={...s,portal:next.progress};r=next.runtime;}
 assert.equal(s.portal?.charge,100);assert.equal(r.until,0);
 const active=activateOverload(s,r,20000);assert.ok(active.activated);assert.equal(active.save.portal?.charge,0);assert.equal(active.runtime.until,28000);
 assert.equal(activateOverload(active.save,active.runtime,21000).activated,false);
 assert.equal(overloadSupplement(10,active.runtime,27999),3.5);assert.equal(overloadSupplement(10,active.runtime,28000),0);
 assert.equal(portalClick(active.save,active.runtime,22000,false,false).progress.charge,0);
});
test('new bonus is additive before crit and charge; combo and existing click magnitudes retained',()=>{
 const s={...fixture(),deck:[id(25)],owned:{[id(25)]:1},advancedClicks:{[id(25)]:25}},r={...initialPortalRuntime(),until:9000,bonus:.5};
 const normal=playClick(s,initialAdvancedRuntime(),100,1000,0),boosted=playClick(s,initialAdvancedRuntime(),100,1000,0,true,r);
 assert.ok(Math.abs(boosted.gain-normal.gain-overloadSupplement(playClick({...s,advancedClicks:{}},initialAdvancedRuntime(),100,1000,1).gain,r,1000))<1e-9);
 assert.equal(boosted.save.clicks,normal.save.clicks);assert.equal(boosted.save.account.xp,normal.save.account.xp);
 assert.equal(playTick(s,initialAdvancedRuntime(),1,1000,true).save.energy,playTick({...s,portal:{...initialPortalProgress(),charge:100}},initialAdvancedRuntime(),1,1000,true).save.energy);
});
test('three card accords retain original advanced effects, preparation ends on removal',()=>{
 let s={...fixture(),deck:[18,25,39].map(id),owned:Object.fromEntries([18,25,39].map(n=>[id(n),1]))};
 const result=portalClick(s,initialPortalRuntime(),1000,true,true);assert.equal(result.progress.charge,6);assert.equal(result.runtime.preparedUntil,5000);
 s={...s,portal:{...result.progress,charge:100}};
 const prepared=activateOverload(s,result.runtime,2000);assert.equal(prepared.runtime.bonus,.5);
 const removed=changeDeck(s,id(18));assert.equal(reconcilePortal(removed,result.runtime,2000).preparedUntil,0);
 assert.equal(activateOverload(removed,reconcilePortal(removed,result.runtime,2000),2000).runtime.bonus,.35);
});
test('fast synthetic inputs cannot farm charge; anomalies need eligible activity AND visible time',()=>{
 let s=fixture(),r=initialPortalRuntime();
 for(let i=0;i<80;i++){const result=portalClick(s,r,i*100,false,false);s={...s,portal:result.progress};r=result.runtime;}
 assert.equal(s.portal?.anomaly,false);assert.equal(portalClick(s,r,7901,true,true).progress.charge,80);
 let progress=portalTick(s,r,1000,10000,false).progress;assert.equal(progress.visibleSeconds,0);
 for(let i=0;i<12;i++){progress=portalTick({...s,portal:progress},r,5,20000+i*5000,true).progress;}
 assert.equal(progress.anomaly,true);assert.equal(progress.gestures,80);
});
test('one anomaly persists across navigation/booster/reload and cannot pay twice',()=>{
 const s={...fixture(),portal:{charge:20,gestures:80,visibleSeconds:60,anomaly:true}};
 const reload=parseSave(JSON.stringify(s),0);assert.deepEqual(reload.portal,s.portal);
 assert.equal(portalTick(s,initialPortalRuntime(),5,1000,false).progress.anomaly,true);
 assert.equal(stabilizeAnomaly({...s,pending:[id(1),id(1),id(1),id(1),id(1)]},initialPortalRuntime(),1000).portal?.anomaly,true);
 assert.equal(stabilizeAnomaly(s,{...initialPortalRuntime(),until:9000},1000),s);
 const rewarded=stabilizeAnomaly(s,initialPortalRuntime(),1000);assert.equal(rewarded.portal?.charge,35);assert.equal(rewarded.energy,s.energy);
 assert.equal(stabilizeAnomaly(rewarded,initialPortalRuntime(),1000),rewarded);
 assert.equal(rewarded.portal?.visibleSeconds,0);assert.equal(rewarded.portal?.gestures,0);
});
test('old v4 saves load, invalid new fields normalize, reload discards temporary powers',()=>{
 const old=initialSave(0);assert.equal(parseSave(JSON.stringify(old),0).portal,undefined);
 assert.deepEqual(parsePortal({charge:Infinity,gestures:-10,visibleSeconds:NaN,anomaly:'yes'}),initialPortalProgress());
 const active=activateOverload({...fixture(),portal:{...initialPortalProgress(),charge:100}},initialPortalRuntime(),1000);
 const loaded=parseSave(JSON.stringify(active.save),0);assert.equal(loaded.portal?.charge,0);assert.equal(portalVisualState(loaded,initialPortalRuntime(),2000),'stable');
});
test('stable, resonance and overload render distinct geometry, real controls outside click artwork',()=>{
 const s={...fixture(),portal:{...initialPortalProgress(),charge:100}};
 assert.equal(portalVisualState(s,initialPortalRuntime(),1000),'resonance');
 assert.equal(portalVisualState(s,{...initialPortalRuntime(),until:9000},1000),'overload');
 const art=renderToStaticMarkup(createElement(LivingPortal,{level:9,state:'overload'}));assert.ok(art.includes('portal-overload-spires'));assert.ok(art.includes('portal-world'));assert.ok(!art.includes('<button'));
 const controls=renderToStaticMarkup(createElement(PortalControls,{save:s,runtime:initialPortalRuntime(),now:1000,onActivate:()=>{},onStabilize:()=>{}}));assert.ok(controls.includes('DÉCLENCHER'));assert.ok(!controls.includes('machine-button'));
});
