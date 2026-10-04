// Isolated player fixtures; never reads a real browser profile.
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
require('tsx/cjs');
const { initialSave, price } = require('../lib/game.ts');
const assert = require('node:assert/strict'), fs = require('node:fs');
const base = process.env.ALPHA_URL || 'http://127.0.0.1:3100';
const output = 'test-results/boosters'; fs.mkdirSync(output, { recursive: true });
const report = [];
const saved = page => page.evaluate(() => JSON.parse(localStorage.getItem('tcg-faerie-v1')));
async function finishOpening(page) {
  await page.getByRole('button', {name:'Choisir ce booster',exact:true}).click();
  await page.getByRole('button', {name:'Ouvrir sans glisser',exact:true}).click();
  for(let i=0;i<5;i++) {
    await page.locator('.po-view, .po-summary').first().waitFor();
    if(await page.locator('.po-summary').count()) break;
    await page.getByRole('button',{name:/^Carte suivante$|^Voir les cinq cartes$/}).click();
    await page.waitForTimeout(120);
  }
  await page.locator('.po-summary').waitFor();
  await page.getByRole('button',{name:'Retour à la machine',exact:true}).click();
}
(async()=>{
  for(const [name,executablePath] of [['Chrome','C:/Program Files/Google/Chrome/Application/chrome.exe'],['Edge','C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe']]) {
    const browser=await chromium.launch({executablePath,headless:true});
    try {
      for(const [w,h] of name==='Chrome'?[[360,800],[390,844],[430,932],[768,1024],[1440,1000]]:[[390,844],[1440,1000]]) {
        const mobile=w<=850;
        const context=await browser.newContext({viewport:{width:w,height:h},hasTouch:mobile});
        const fixture=initialSave(); fixture.energy=10000; fixture.freeBoosters=2; fixture.freeBoosterTimerStartedAt=null;
        fixture.ux={...fixture.ux,introSeen:true,skipTips:true,sound:false,motion:'reduce'};
        // A pre-feature save exercises the legacy default in the actual app.
        delete fixture.ux.favoriteBooster;
        await context.addInitScript(s=>{if(!localStorage.getItem('tcg-faerie-v1'))localStorage.setItem('tcg-faerie-v1',JSON.stringify(s));},fixture);
        const page=await context.newPage(), errors=[];
        page.on('pageerror',e=>errors.push(e.message));
        page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
        await page.goto(base); await page.locator('.machine-button').waitFor();
        if(mobile) {
          await page.locator('.favorite-booster-link .pack').waitFor();
          assert.equal(await page.locator('nav button').count(),5);
          assert.ok(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight+1));
          await page.screenshot({path:`${output}/${name}-${w}-machine.png`,fullPage:true});
          await page.getByRole('button',{name:'Choisir un booster',exact:true}).click();
        } else await page.getByRole('button',{name:'Choisir un booster →',exact:true}).click();
        await page.locator('.booster-choice .pack').waitFor();
        assert.equal(await page.locator('.booster-choice').count(),1);
        assert.equal(await page.getByRole('button',{name:'Retirer Faerie des favoris'}).getAttribute('aria-pressed'),'true');
        assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
        await page.screenshot({path:`${output}/${name}-${w}-catalogue.png`,fullPage:true});
        await page.getByRole('button',{name:'Retirer Faerie des favoris'}).click();
        await page.waitForFunction(()=>JSON.parse(localStorage.getItem('tcg-faerie-v1')).ux.favoriteBooster===null);
        await page.locator('nav').getByRole('button',{name:/Machine|La machine/}).click();
        if(mobile)await page.getByRole('button',{name:'Choisir un booster favori',exact:true}).waitFor();
        await page.reload(); await page.locator('.machine-button').waitFor();
        assert.equal((await saved(page)).ux.favoriteBooster,null);
        if(mobile)await page.getByRole('button',{name:'Choisir un booster favori',exact:true}).click();
        else await page.getByRole('button',{name:'Choisir un booster →',exact:true}).click();
        await page.getByRole('button',{name:'Mettre Faerie en favori'}).click();
        await page.waitForFunction(()=>JSON.parse(localStorage.getItem('tcg-faerie-v1')).ux.favoriteBooster==='faerie');
        await page.locator('nav').getByRole('button',{name:/Machine|La machine/}).click();
        await page.reload(); await page.locator('.machine-button').waitFor();
        if(mobile)await page.locator('.favorite-booster-link .pack').waitFor();
        assert.equal((await saved(page)).ux.favoriteBooster,'faerie');
        await page.locator('nav').getByRole('button',{name:/Boosters/}).click();
        const before=await saved(page);
        await page.getByRole('button',{name:/Ouvrir un booster disponible/}).click();
        await page.waitForFunction(()=>JSON.parse(localStorage.getItem('tcg-faerie-v1')).pending.length===5);
        assert.equal((await saved(page)).energy,before.energy);
        await finishOpening(page);
        await page.waitForFunction(n=>JSON.parse(localStorage.getItem('tcg-faerie-v1')).packs===n+1,before.packs);
        const after=await saved(page);
        assert.equal(after.freeBoosters,before.freeBoosters-1);
        assert.ok(after.energy>=before.energy); // Existing duplicate rewards may add energy.
        assert.equal(Object.values(after.owned).reduce((a,b)=>a+b,0),5);
        await page.locator('nav').getByRole('button',{name:/Boosters/}).click();
        const beforePaid=await saved(page), cost=price(beforePaid);
        await page.getByRole('button',{name:/Acheter et ouvrir/}).click();
        await page.waitForFunction(()=>JSON.parse(localStorage.getItem('tcg-faerie-v1')).pending.length===5);
        assert.equal((await saved(page)).energy,beforePaid.energy-cost);
        await finishOpening(page);
        await page.waitForFunction(n=>JSON.parse(localStorage.getItem('tcg-faerie-v1')).packs===n+1,beforePaid.packs);
        const afterPaid=await saved(page);
        assert.ok(afterPaid.energy>=beforePaid.energy-cost);
        assert.equal(afterPaid.freeBoosters,beforePaid.freeBoosters);
        assert.equal(Object.values(afterPaid.owned).reduce((a,b)=>a+b,0),10);
        assert.equal((await page.request.get(base+'/dev')).status(),404);
        assert.deepEqual(errors,[]);
        report.push({browser:name,width:w,height:h,favoritePersistence:true,freeAndPaidOpening:true,noOverflow:true,errors});
        await context.close();
      }
    } finally {await browser.close();}
  }
  fs.writeFileSync(`${output}/report.json`,JSON.stringify(report,null,2)); console.log(JSON.stringify(report,null,2));
})().catch(e=>{console.error(e);process.exit(1);});
