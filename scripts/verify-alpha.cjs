// Run against a production server. PLAYWRIGHT_PATH can point to a bundled runtime.
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
require('tsx/cjs');
const { initialSave, openPack, reveal } = require('../lib/game.ts');
const { CARDS } = require('../lib/cards.ts');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const base = process.env.ALPHA_URL || 'http://127.0.0.1:3100';
const key = 'tcg-faerie-v1';
const report = { browsers: [], viewports: [], performance: {}, checks: [] };
fs.mkdirSync('test-results', { recursive: true });
const fixture = () => {const s=initialSave();return {...s,energy:100000,owned:Object.fromEntries(CARDS.map(c=>[c.id,6])),cardLevels:{'001':2},deck:['001','002','003','004','005','008'],ux:{...s.ux,introSeen:true,skipTips:true,sound:false,motion:'reduce'}};};
async function seed(context, save, leaseFallback=false) {
  await context.addInitScript(({save,key,leaseFallback})=>{
    if(!localStorage.getItem(key)) localStorage.setItem(key,JSON.stringify(save));
    if(leaseFallback)Object.defineProperty(navigator,'locks',{value:undefined,configurable:true});
  },{save,key,leaseFallback});
}
async function start(context) {
  const page=await context.newPage();const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  await page.goto(base);await page.locator('.machine-button').waitFor();
  return {page,errors};
}
const read = page=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);
const assertWidth = async page=>assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
async function finishOpening(page) {
  if(await page.getByRole('button',{name:'Choisir ce booster',exact:true}).count())await page.getByRole('button',{name:'Choisir ce booster',exact:true}).click();
  if(await page.getByRole('button',{name:'Ouvrir sans glisser',exact:true}).count())await page.getByRole('button',{name:'Ouvrir sans glisser',exact:true}).click();
  for(let i=0;i<5;i++){
    await Promise.race([page.locator('.po-view').waitFor(),page.locator('.po-summary').waitFor()]);
    if(await page.locator('.po-summary').count())break;
    const next=page.getByRole('button',{name:/^Carte suivante$|^Voir les cinq cartes$/});await next.click();
    await page.waitForTimeout(90);
  }
  await page.locator('.po-summary-grid').waitFor();
}
(async()=>{
  for(const [name,executablePath] of [['Chrome',process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe'],['Edge',process.env.EDGE_PATH||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe']]){
    const browser=await chromium.launch({executablePath,headless:true});
    try {
      const context=await browser.newContext({viewport:{width:1440,height:1000},acceptDownloads:true});
      const fresh=initialSave();await seed(context,fresh);
      const {page,errors}=await start(context);
      assert.equal(await page.title(),'TCG Clicker — Faerie');
      assert.equal((await page.request.get(base+'/dev')).status(),404);
      assert.equal(await page.locator('a[href^="/dev"]').count(),0);
      await page.getByRole('button',{name:'Éveiller le portail',exact:true}).press('Enter');
      await page.locator('.machine-button').click({clickCount:30});
      await page.getByRole('button',{name:'Paramètres',exact:true}).click();
      await page.getByText('Alpha 0.1.0',{exact:true}).waitFor();
      for(let i=0;i<24;i++){await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>!!document.activeElement?.closest('dialog')),true);}
      await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>document.activeElement?.getAttribute('aria-label')),'Paramètres');
      const fixtureJSON=JSON.stringify(fixture());
      await page.getByRole('button',{name:'Paramètres',exact:true}).click();
      await page.locator('input[type=file]').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from('{bad')});
      await page.getByText(/Import refusé/).waitFor();assert.equal(await page.getByRole('button',{name:'Confirmer le remplacement'}).count(),0);
      await page.locator('input[type=file]').setInputFiles({name:'save.json',mimeType:'application/json',buffer:Buffer.from(fixtureJSON)});
      await page.getByRole('group',{name:'Confirmer l’import'}).waitFor();
      const before=await read(page);assert.equal(before.owned['001'],undefined);
      await page.getByRole('button',{name:'Confirmer le remplacement',exact:true}).click();
      assert.equal((await read(page)).owned['001'],6);
      assert.equal(await page.evaluate(key=>JSON.parse(localStorage.getItem(key+'-before-replacement')).owned['001']===undefined,key),true);
      await page.getByRole('button',{name:'Paramètres',exact:true}).click();
      const downloadEvent=page.waitForEvent('download');await page.getByRole('button',{name:'Exporter la sauvegarde',exact:true}).click();
      const download=await downloadEvent;const file=await download.path();assert.equal(JSON.parse(fs.readFileSync(file,'utf8')).version,4);
      await page.getByRole('button',{name:'Copier les diagnostics',exact:true}).click();
      await page.keyboard.press('Escape');
      await page.locator('nav').getByRole('button',{name:/Collection/}).click();await page.locator('.collection-grid > .card').first().waitFor();
      assert.equal(await page.locator('.collection-grid > .card').count(),60);
      await page.waitForTimeout(200);assert.ok(await page.locator('.card[data-offscreen=true]').count()>20);
      for(let i=0;i<4;i++){await page.getByRole('combobox',{name:'Type',exact:true}).selectOption('Lune');await page.getByRole('button',{name:'Effacer les filtres'}).click();}
      await page.getByRole('button',{name:'Examiner Moussillon',exact:true}).click();await page.locator('.card-inspection').waitFor();await page.keyboard.press('Escape');
      await page.locator('nav').getByRole('button',{name:/Mon deck/}).click();await page.locator('.synergy-grid').first().waitFor();
      await page.locator('nav').getByRole('button',{name:/Progression/}).first().click();await page.getByRole('heading',{name:/Chaque rencontre/}).waitFor();
      await page.locator('nav').getByRole('button',{name:/La machine/}).click();
      // Fast click burst stays within the existing 19-particle cap.
      await page.evaluate(()=>{const b=document.querySelector('.machine-button');for(let i=0;i<200;i++)b.click();});
      assert.ok(await page.locator('.click-spark').count()<=19);await page.waitForTimeout(1300);assert.equal(await page.locator('.click-spark').count(),0);
      const writes=await page.evaluate(()=>{window.__writes=0;const original=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='tcg-faerie-v1')window.__writes++;return original.call(this,k,v);};return window.__writes;});
      await page.waitForTimeout(2200);assert.ok(await page.evaluate(()=>window.__writes)<=3);
      // Another tab must neither mount the game nor overwrite the first tab's save.
      const other=await context.newPage();await other.goto(base);await other.getByRole('heading',{name:/déjà actif/}).waitFor();assert.equal(await other.locator('.machine-button').count(),0);await other.close();
      // Load an interrupted paid pack and verify no duplicate grants across reload.
      let pending=reveal(openPack({...fixture(),energy:100000},['001','005','007','008','009'],'paid'));
      await page.getByRole('button',{name:'Paramètres',exact:true}).click();await page.locator('input[type=file]').setInputFiles({name:'partial.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(pending))});await page.getByRole('button',{name:'Confirmer le remplacement',exact:true}).click();await page.locator('.po-view').waitFor();await page.reload();
      await finishOpening(page);assert.equal((await read(page)).revealed,5);assert.equal((await read(page)).account.totals.cardsObtained,pending.account.totals.cardsObtained+4);
      await page.getByRole('button',{name:'Retour à la machine',exact:true}).click();
      // Offline gameplay works once assets have loaded.
      await context.setOffline(true);await page.locator('.machine-button').click();await page.locator('nav').getByRole('button',{name:/Collection/}).click();await page.locator('.collection-grid').waitFor();await context.setOffline(false);
      await page.screenshot({path:`test-results/alpha-${name.toLowerCase()}.png`});
      assert.deepEqual(errors,[]);report.browsers.push({name,version:browser.version(),checks:'onboarding, import/export, diagnostics, focus, collection, deck, progression, burst, writes, concurrent tab, partial booster, offline, /dev 404'});
      await context.close();
      if(name==='Chrome') {
        // Recovery in a separate clean browser profile.
        const rc=await browser.newContext();await rc.addInitScript(({key,fixtureJSON})=>{if(!sessionStorage.getItem('corruption-seeded')){localStorage.setItem(key+'-last-valid',fixtureJSON);localStorage.setItem(key,'{broken');sessionStorage.setItem('corruption-seeded','yes');}},{key,fixtureJSON});const rp=await rc.newPage();await rp.goto(base);
        await rp.getByRole('heading',{name:'Sauvegarde principale illisible.'}).waitFor();assert.equal(await rp.evaluate(k=>localStorage.getItem(k),key),'{broken');
        await rp.getByRole('button',{name:'Restaurer la dernière sauvegarde valide'}).click();await rp.locator('.machine-button').waitFor();assert.equal((await read(rp)).owned['001'],6);
        assert.equal(await rp.evaluate(k=>localStorage.getItem(k+'-unreadable'),key),'{broken');
        await rp.getByRole('button',{name:'Paramètres',exact:true}).click();await rp.getByRole('button',{name:'Réinitialiser la progression',exact:true}).click();await rp.getByLabel('Confirmation',{exact:true}).fill('RESET');await rp.getByRole('button',{name:'Confirmer la réinitialisation'}).click();
        assert.equal((await read(rp)).energy,0);assert.equal((await read(rp)).packs,0);assert.equal(await rp.evaluate(k=>JSON.parse(localStorage.getItem(k+'-before-replacement')).owned['001'],key),6);await rc.close();
        for(const width of [360,390,430,768]){
          const mc=await browser.newContext({viewport:{width,height:844},isMobile:width<700,hasTouch:true,reducedMotion:'reduce'});await seed(mc,fixture());const {page:mp,errors:me}=await start(mc);
          await assertWidth(mp);await mp.getByRole('button',{name:'Paramètres',exact:true}).click();await assertWidth(mp);await mp.keyboard.press('Escape');
          for(const nav of [/Collection/,/Mon deck/,/Progression/,/La machine/]){await mp.locator('nav').getByRole('button',{name:nav}).first().click();await assertWidth(mp);}
          await mp.getByRole('button',{name:/Acheter.*ouvrir/}).click();await finishOpening(mp);await assertWidth(mp);
          const continueButton=mp.getByRole('button',{name:'Retour à la machine',exact:true});await continueButton.scrollIntoViewIfNeeded();assert.ok(await continueButton.isVisible());await continueButton.tap();
          await mp.screenshot({path:`test-results/alpha-${width}.png`});assert.deepEqual(me,[]);report.viewports.push(width);await mc.close();
        }
        // Lease fallback and an owner suspended beyond its lease.
        const fc=await browser.newContext();await seed(fc,fixture(),true);const {page:fp}=await start(fc);const second=await fc.newPage();await second.goto(base);await second.getByRole('heading',{name:/déjà actif/}).waitFor();
        await fp.evaluate(()=>{const raw=JSON.parse(localStorage.getItem('tcg-faerie-v1-active-tab'));raw.until=Date.now()-1;localStorage.setItem('tcg-faerie-v1-active-tab',JSON.stringify(raw));});
        await fp.getByRole('heading',{name:/déjà actif/}).waitFor();await fc.close();
        const ec=await browser.newContext();await seed(ec,fixture());await ec.addInitScript(()=>{const original=Number.prototype.toLocaleString;Number.prototype.toLocaleString=function(...args){if(document.querySelector('.app-shell'))throw Error('Injected render failure');return original.apply(this,args);};});const ep=await ec.newPage();await ep.goto(base);await ep.getByRole('heading',{name:'La clairière a rencontré un problème.'}).waitFor();const exportEvent=ep.waitForEvent('download');await ep.getByRole('button',{name:'Exporter la sauvegarde accessible'}).click();assert.equal(JSON.parse(fs.readFileSync(await (await exportEvent).path(),'utf8')).version,4);await ep.screenshot({path:'test-results/alpha-recovery.png'});await ec.close();
        const sc=await browser.newContext();await sc.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Blocked','SecurityError');}}));const sp=await sc.newPage();await sp.goto(base);await sp.getByRole('heading',{name:'Sauvegarde inaccessible.'}).waitFor();assert.equal(await sp.locator('.machine-button').count(),0);await sc.close();
        const race=await browser.newContext();await seed(race,fixture(),true);const ra=await race.newPage(),rb=await race.newPage();await Promise.all([ra.goto(base),rb.goto(base)]);await ra.waitForTimeout(500);assert.equal(await ra.locator('.machine-button').count()+await rb.locator('.machine-button').count(),1);await race.close();
        const tc=await browser.newContext({viewport:{width:430,height:844},isMobile:true,hasTouch:true});let tactile=openPack({...fixture(),ux:{...fixture().ux,motion:'system',sound:true}},['001','005','007','008','009'],'paid');await seed(tc,tactile);const tp=await tc.newPage();const te=[];tp.on('pageerror',e=>te.push(e.message));await tp.goto(base);await tp.getByRole('button',{name:'Choisir ce booster',exact:true}).click();const touch=await tc.newCDPSession(tp);
        async function swipe(locator,vertical=false,small=false){const r=await locator.boundingBox();const x=r.x+r.width-12,y=r.y+r.height*.5;await touch.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y,id:1}]});for(let i=1;i<=10;i++)await touch.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-(vertical?20:r.width-24)*i/10*(small?.15:1),y:y-(vertical?160:0)*i/10*(small?.15:1),id:1}]});await touch.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}
        await swipe(tp.locator('.po-cut-track'),false,true);assert.equal(await tp.locator('.po-sealed').count(),1);await swipe(tp.locator('.po-cut-track'));await tp.locator('.po-view').waitFor();await tp.waitForTimeout(300);const copiesBefore=Object.values(tactile.owned).reduce((a,b)=>a+b,0);await swipe(tp.locator('.po-front-visible'),true,true);assert.equal(await tp.locator('.po-view').count(),1);
        for(let i=0;i<5;i++){await tp.locator('.po-view').waitFor();await swipe(tp.locator('.po-front-visible'),true);await tp.waitForTimeout(300);}
        await tp.locator('.po-summary-grid').waitFor();assert.equal(Object.values((await read(tp)).owned).reduce((a,b)=>a+b,0),copiesBefore+5);await tp.waitForFunction(()=>[...document.querySelectorAll('.po-summary-item')].every(item=>getComputedStyle(item).opacity==='1'));await tp.screenshot({path:'test-results/alpha-tactile-summary.png'});await tp.getByRole('button',{name:'Retour à la machine',exact:true}).tap();assert.equal(await tp.evaluate(()=>document.body.style.overflow),'');await tp.setViewportSize({width:844,height:390});await assertWidth(tp);await tp.getByRole('button',{name:'Paramètres',exact:true}).click();await assertWidth(tp);assert.deepEqual(te,[]);await tc.close();
        report.checks.push('recovery, reset, lease fallback, suspended owner, simultaneous lease race, error recovery/export, storage denied, native touch normal motion, landscape');
      }
    }finally{await browser.close();}
  }
  fs.writeFileSync('test-results/alpha-browser-report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
})().catch(e=>{console.error(e);process.exitCode=1;});
