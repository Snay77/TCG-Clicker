// Regression: legacy locks must not prevent loading or saving a game.
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
require('tsx/cjs');
const { initialSave } = require('../lib/game.ts');
const assert = require('node:assert/strict');
const base = process.env.ALPHA_URL || 'http://127.0.0.1:3100';
const key = 'tcg-faerie-v1', lock = key + '-active-tab';
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const context = await browser.newContext({ serviceWorkers: 'block' });
    const owner = await context.newPage();
    await owner.goto(base);
    await owner.evaluate(({key,lock}) => {
      localStorage.setItem(lock, JSON.stringify({ id: 'stale-owner', until: Date.now() + 86400000 }));
      navigator.locks.request(lock, async () => {
        window.testLockHeld = true;
        await new Promise(resolve => { window.releaseTestLock = resolve; });
      });
    }, {key,lock});
    await owner.waitForFunction(() => window.testLockHeld);
    const save = initialSave(); save.energy = 123; save.ux.introSeen = true;
    await owner.evaluate(({key,save}) => localStorage.setItem(key,JSON.stringify(save)), {key,save});
    const page = await context.newPage();
    await page.goto(base);
    await page.locator('.machine-button').waitFor();
    await owner.close();
    await page.locator('.machine-button').click();
    await page.waitForFunction(key => JSON.parse(localStorage.getItem(key)).energy === 124, key);
    await page.reload(); await page.locator('.machine-button').waitFor();
    assert.equal(await page.evaluate(key => JSON.parse(localStorage.getItem(key)).energy,key),124);
    const other = await context.newPage(); await other.goto(base);
    await other.locator('.machine-button').waitFor();
    assert.equal(await other.getByText('TCG Clicker est déjà actif dans un autre onglet.',{exact:true}).count(),0);
    assert.equal(await other.evaluate(lock => JSON.parse(localStorage.getItem(lock)).id,lock),'stale-owner');
    await context.close();
    const recovery = await browser.newContext({serviceWorkers:'block'});
    await recovery.addInitScript(key => localStorage.setItem(key,'{broken'),key);
    const damaged = await recovery.newPage(); await damaged.goto(base);
    await damaged.getByRole('heading',{name:'Sauvegarde principale illisible.'}).waitFor();
    assert.equal(await damaged.evaluate(key => localStorage.getItem(key),key),'{broken');
    await recovery.close();
    console.log('PASS: held Web Lock and stale lease ignored; click/save/reload and two tabs work; corrupt save preserved.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
