require('tsx/cjs');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const {initialSave}=require('../lib/game.ts');
const {CARDS,runtimeId}=require('../lib/cards.ts');
const fs=require('fs'),assert=require('node:assert/strict');
const base=process.env.ALPHA_URL||'http://127.0.0.1:3121',phase=process.env.CAPTURE_PHASE||'after';
const output='test-results/phase14';fs.mkdirSync(output,{recursive:true});
const id=n=>runtimeId('F01-'+String(n).padStart(3,'0'));
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
 for(const [name,width,height]of [['desktop',1440,1000],['mobile',390,844]]){
 const context=await browser.newContext({viewport:{width,height},hasTouch:width<800,serviceWorkers:'block'});
 const save={...initialSave(),energy:30000,packs:8,owned:Object.fromEntries(CARDS.map(c=>[c.id,3])),deck:[25,18,19,20,28,50].map(id)};
 save.account.xp=1758;save.ux={...save.ux,introSeen:true,skipTips:true,sound:false,motion:'reduce'};
 await context.addInitScript(s=>{if(!localStorage.getItem('tcg-faerie-v1'))localStorage.setItem('tcg-faerie-v1',JSON.stringify(s));Math.random=()=>.1;},save);
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(15000);
 await page.goto(base);await page.locator('.machine-button').waitFor();
 async function shot(zone){await page.waitForTimeout(550);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await page.screenshot({path:`${output}/${phase}-${name}-${zone}.png`});}
 await shot('machine');
 for(const [zone,label]of [['deck',/Mon deck|Deck/],['boosters',/Boosters/],['progression',/Progression|Voyage/]]){
 await page.locator('nav').getByRole('button',{name:label}).click();await shot(zone);
 }
 await page.locator('nav').getByRole('button',{name:/Collection/}).click();
 await page.getByRole('button',{name:'Examiner Luciolot',exact:true}).click();await shot('inspection');await page.keyboard.press('Escape');
 if(phase==='after'){
 await page.getByRole('button',{name:'Examiner Moussillon',exact:true}).click();
 await page.getByRole('button',{name:'ÉQUIPER · REMPLACER',exact:true}).click();
 await page.locator('.deck-replacement').getByRole('button',{name:'Remplacer Luciolot',exact:true}).click();
 await page.waitForFunction(()=>JSON.parse(localStorage.getItem('tcg-faerie-v1')).deck[0]==='001');
 assert.ok(await page.locator('.card-inspection').isVisible());await page.keyboard.press('Escape');
 await page.locator('nav').getByRole('button',{name:/Mon deck|Deck/}).click();
 await page.getByRole('button',{name:/Acheter le 7e emplacement/}).click();
 await page.waitForFunction(()=>JSON.parse(localStorage.getItem('tcg-faerie-v1')).extraDeckSlots===1);
 await page.getByRole('button',{name:'Paramètres',exact:true}).click();
 await page.getByLabel('Ouverture rapide',{exact:false}).check();await page.keyboard.press('Escape');
 await page.locator('nav').getByRole('button',{name:/Boosters/}).click();
 await page.getByRole('button',{name:/Acheter et ouvrir/}).click();
 assert.equal(await page.locator('.po-carousel').count(),0);
 await page.getByRole('button',{name:'Ouvrir sans glisser',exact:true}).click();
 for(let i=0;i<5;i++){await page.locator('.po-view').waitFor();await page.getByRole('button',{name:/^Carte suivante$|^Voir les cinq cartes$/}).click();}
 await page.locator('.po-summary-grid').waitFor();await shot('summary');
 await page.locator('.po-summary-item').first().getByRole('button',{name:/Examiner/}).click();await page.locator('.card-inspection').waitFor();await page.keyboard.press('Escape');assert.ok(await page.locator('.po-summary-grid').isVisible());
 await page.getByRole('button',{name:'Voir ma collection',exact:true}).click();
 await page.getByRole('heading',{name:'NOUVELLES ACQUISITIONS'}).waitFor();
 assert.equal(await page.locator('.recent-acquisitions button').count(),5);assert.equal(await page.evaluate(()=>scrollY),0);await shot('acquisitions');
 await page.locator('nav').getByRole('button',{name:/La machine|Machine/}).click();
 await page.waitForTimeout(8500);assert.equal(await page.locator('.notice').count(),0);
 await page.locator('nav').getByRole('button',{name:/Collection/}).click();
 }
 assert.deepEqual(errors,[]);await context.close();
 }
 if(phase==='after'){
  const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,serviceWorkers:'block'});
  const save={...initialSave(),energy:100,ux:{...initialSave().ux,introSeen:true,skipTips:true,sound:false,motion:'reduce'}};
  await context.addInitScript(s=>{if(!localStorage.getItem('tcg-faerie-v1'))localStorage.setItem('tcg-faerie-v1',JSON.stringify(s));Math.random=()=>.1;},save);
  const page=await context.newPage();page.setDefaultTimeout(15000);await page.goto(base);await page.locator('.machine-button').waitFor();
  assert.equal(await page.locator('nav').getByRole('button',{name:/Progression|Voyage/}).count(),0);
  await page.getByRole('button',{name:/Améliorations/}).click();
  await page.locator('dialog').getByRole('button',{name:/Acheter Luciole/}).click();await page.keyboard.press('Escape');
  await page.waitForFunction(()=>JSON.parse(localStorage.getItem('tcg-faerie-v1')).upgrades.auto===1);await page.reload();await page.locator('.machine-button').waitFor();
  await page.locator('nav').getByRole('button',{name:/Boosters/}).click();assert.equal(await page.getByRole('button',{name:/Acheter et ouvrir/}).isDisabled(),true);
  // Exported save through the real import UI; no edits to a player's browser.
  await page.getByRole('button',{name:'Paramètres',exact:true}).click();
  await page.getByLabel('Importer une sauvegarde').setInputFiles({name:'fresh.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(save))});
  await page.getByRole('button',{name:'Confirmer le remplacement',exact:true}).click();await page.locator('.machine-button').waitFor();
  await page.waitForFunction(()=>JSON.parse(localStorage.getItem('tcg-faerie-v1')).ux.discoveredSystems?.includes('boosters'));
  await page.locator('nav').getByRole('button',{name:/Boosters/}).click();await page.getByRole('button',{name:/Acheter et ouvrir/}).click();
  await page.getByText('Le contenu est déjà déterminé.',{exact:false}).waitFor();await page.getByRole('button',{name:'Choisir ce booster',exact:true}).click();await page.getByRole('button',{name:'Ouvrir sans glisser',exact:true}).click();
  for(let i=0;i<5;i++){await page.locator('.po-view').waitFor();await page.getByRole('button',{name:/^Carte suivante$|^Voir les cinq cartes$/}).click();}
  await page.locator('.po-summary-grid').waitFor();await page.getByRole('button',{name:'Voir ma collection',exact:true}).click();
  await page.getByRole('heading',{name:'NOUVELLES ACQUISITIONS'}).waitFor();
  const acquired=await page.evaluate(()=>JSON.parse(localStorage.getItem('tcg-faerie-v1')));assert.ok(Object.keys(acquired.owned).filter(cid=>!CARDS.find(c=>c.id===cid).evolvesFrom).length>=3);
  await page.locator('nav').getByRole('button',{name:/Mon deck|Deck/}).click();
  assert.ok(await page.locator('.deck-compact-summary').isVisible());await context.close();
 }
 console.log('PASS '+phase+' desktop/mobile captures');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
