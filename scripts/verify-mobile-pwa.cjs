// Production verification in isolated browser contexts, with no player data.
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
require('tsx/cjs');
const { initialSave } = require('../lib/game.ts');
const { CARDS } = require('../lib/cards.ts');
const { GAME_VERSION } = require('../lib/release.ts');
const assert = require('node:assert/strict'), fs = require('node:fs');
const base = process.env.ALPHA_URL || 'http://127.0.0.1:3100';
const output = 'test-results/phase10'; fs.mkdirSync(output, { recursive: true });
const report = { version: GAME_VERSION, browsers: [], screens: [], checks: [] };
const fixture = () => {
  const s = initialSave();
  return { ...s, energy: 100000, owned: Object.fromEntries(CARDS.map(c => [c.id, 6])), deck: ['001','002','003','004','005','008'], ux: { ...s.ux, introSeen: true, skipTips: true, sound: false, motion: 'reduce' } };
};
async function seed(context) { await context.addInitScript(save => { if (!localStorage.getItem('tcg-faerie-v1')) localStorage.setItem('tcg-faerie-v1', JSON.stringify(save)); }, fixture()); }
async function screen(page, name) { await page.screenshot({ path: `${output}/${name}.png`, fullPage: true }); }
const width = page => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1);
async function close(page) { await page.locator('dialog').getByRole('button', { name: 'Fermer', exact: true }).click(); }
async function finishOpening(page) {
  if (await page.getByRole('button', {name:'Choisir ce booster',exact:true}).count()) await page.getByRole('button', {name:'Choisir ce booster',exact:true}).click();
  if (await page.getByRole('button', {name:'Ouvrir sans glisser',exact:true}).count()) await page.getByRole('button', {name:'Ouvrir sans glisser',exact:true}).click();
  for (let i = 0; i < 5; i++) {
    await page.locator('.po-view, .po-summary').first().waitFor();
    if (await page.locator('.po-summary').count()) break;
    await page.getByRole('button', {name:/^Carte suivante$|^Voir les cinq cartes$/}).click();
    await page.waitForTimeout(120);
  }
  await page.locator('.po-summary').waitFor();
}
(async () => {
  for (const [name, executablePath] of [['Chrome', process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe'], ['Edge', process.env.EDGE_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe']]) {
    const browser = await chromium.launch({ executablePath, headless: true });
    try {
      for (const [w, h] of (name === 'Chrome' ? [[360,800],[390,844],[393,852],[430,932],[768,1024],[1440,1000]] : [[390,844],[1440,1000]])) {
        const mobile = w <= 850;
        const context = await browser.newContext({ viewport: { width:w,height:h }, hasTouch:mobile, acceptDownloads:true }); await seed(context);
        const page = await context.newPage(); const errors = []; page.on('pageerror', e => errors.push(e.message));
        await page.goto(base); await page.locator('.machine-button').waitFor();
        if (mobile) await page.locator('.mobile-booster').waitFor();
        assert.equal(await width(page), true);
        if (mobile) {
          const metrics = await page.evaluate(() => ({height:document.documentElement.scrollHeight,viewport:innerHeight,nav:document.querySelector('nav').getBoundingClientRect().bottom,booster:document.querySelector('.mobile-booster-actions').getBoundingClientRect().bottom}));
          assert.ok(metrics.height <= metrics.viewport + 1, JSON.stringify(metrics));
          assert.ok(metrics.booster <= metrics.nav - 60, JSON.stringify(metrics));
          report.screens.push({browser:name,width:w,height:h,...metrics});
        }
        await screen(page, `after-${name}-${w}-machine`);
        const before = await page.evaluate(() => JSON.parse(localStorage.getItem('tcg-faerie-v1')).clicks);
        for (let i=0;i<12;i++) { if (mobile) await page.locator('.machine-button').tap(); else await page.locator('.machine-button').click(); }
        await page.waitForTimeout(1100);
        assert.ok(await page.evaluate(n => JSON.parse(localStorage.getItem('tcg-faerie-v1')).clicks >= n + 12, before));
        if (mobile) {
          await page.getByRole('button',{name:'Améliorations',exact:false}).click(); await screen(page,`after-${name}-${w}-upgrades`);
          assert.equal(await page.locator('dialog .upgrade-grid .upgrade-item').count(),7);
          for(let i=0;i<12;i++) { await page.keyboard.press('Tab'); assert.equal(await page.evaluate(()=>!!document.activeElement?.closest('dialog')),true); }
          await page.locator('dialog .upgrade-grid button').first().click(); await close(page);
          assert.equal(await page.getByRole('button',{name:'Améliorations',exact:false}).evaluate(n=>n===document.activeElement),true);
          assert.equal(await page.evaluate(()=>scrollY),0);
          await page.getByRole('button',{name:'Détails',exact:true}).click(); await close(page);
          await page.getByRole('button',{name:/^Acheter ·/}).click();
        } else await page.getByRole('button',{name:'Acheter et ouvrir',exact:false}).click();
        await finishOpening(page); await screen(page,`after-${name}-${w}-booster`);
        await page.getByRole('button',{name:'Retour à la machine',exact:true}).click();
        const nav = page.locator('nav'); await nav.getByRole('button',{name:/Collection/}).click();
        await page.locator('.collection-grid .card').first().waitFor(); await screen(page,`after-${name}-${w}-collection`);
        if (mobile) { await page.getByRole('button',{name:'Filtres',exact:true}).click(); await page.getByRole('combobox',{name:'Type',exact:true}).selectOption('Lune'); await page.getByRole('button',{name:'Effacer les filtres',exact:true}).click(); await close(page); }
        await page.getByRole('button',{name:'Examiner Moussillon',exact:true}).click(); await screen(page,`after-${name}-${w}-card`); await close(page);
        await nav.getByRole('button',{name:mobile?/^▤ Deck$|Deck/:/Mon deck/}).click(); await screen(page,`after-${name}-${w}-deck`);
        if(mobile) { await page.getByRole('button',{name:'Remplacer Moussillon',exact:true}).click(); await screen(page,`after-${name}-${w}-deck-picker`); await page.getByRole('searchbox').fill('Nacrée'); const action=page.locator('dialog .build-candidate button:not(:disabled)').first(); if(await action.count()) { await action.click(); assert.equal(await page.locator('dialog').count(),0); } else await close(page); }
        await nav.getByRole('button',{name:mobile?/Voyage/:/Progression/}).click(); await screen(page,`after-${name}-${w}-progression`);
        await page.getByRole('button',{name:'Paramètres',exact:true}).click(); await page.getByText(`Alpha ${GAME_VERSION}`,{exact:true}).waitFor();
        await page.getByRole('heading',{name:'Installer TCG Clicker',exact:true}).waitFor();
        const downloaded = page.waitForEvent('download'); await page.getByRole('button',{name:'Exporter la sauvegarde',exact:true}).click(); const file=await downloaded; assert.ok(file.suggestedFilename().endsWith('.json'));
        await close(page); assert.equal(await width(page),true); assert.deepEqual(errors,[]); await context.close();
      }
      report.browsers.push(name); await browser.close();
    } finally { if(browser.isConnected()) await browser.close(); }
  }
  const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
  try {
    const context=await browser.newContext({viewport:{width:390,height:844}}); await seed(context); const page=await context.newPage();
    await page.goto(base); await page.locator('.mobile-booster').waitFor();
    await page.evaluate(async()=>{await navigator.serviceWorker.ready;});
    await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
    const manifest=await (await page.request.get(base+'/manifest.webmanifest')).json();
    assert.equal(manifest.display,'standalone'); assert.equal(manifest.start_url,'/'); assert.deepEqual(manifest.icons.map(i=>i.sizes),['192x192','512x512','512x512']);
    for(const icon of manifest.icons)assert.equal((await page.request.get(base+icon.src)).status(),200);
    assert.equal((await page.request.get(base+'/dev')).status(),404);
    const cacheURLs=await page.evaluate(async()=>{const result=[];for(const key of await caches.keys()){for(const request of await (await caches.open(key)).keys())result.push(new URL(request.url).pathname);}return result;});
    assert.ok(cacheURLs.includes('/')); assert.ok(cacheURLs.some(url=>url.startsWith('/_next/static/'))); assert.ok(!cacheURLs.some(url=>/save|\/dev/.test(url)));
    await page.waitForTimeout(1100); const raw=await page.evaluate(()=>localStorage.getItem('tcg-faerie-v1'));
    await context.setOffline(true); await page.reload(); await page.locator('.mobile-booster').waitFor();
    assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('tcg-faerie-v1')).owned['001']),JSON.parse(raw).owned['001']);
    await page.locator('.machine-button').click(); await screen(page,'offline-machine');
    for (const label of [/Collection/,/Deck/,/Voyage/,/Machine/]) { await page.locator('nav').getByRole('button',{name:label}).click(); assert.equal(await width(page),true); }
    await context.setOffline(false); await context.close(); report.checks.push('Manifest/icons/production dev 404/offline relaunch/save preservation/export verified');
  }finally{await browser.close();}
  fs.writeFileSync(`${output}/report.json`,JSON.stringify(report,null,2)); console.log(JSON.stringify(report,null,2));
})().catch(error=>{console.error(error);process.exit(1);});
