// Exercise a real waiting service worker using an isolated local proxy origin.
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const http = require('node:http'), assert = require('node:assert/strict'), fs = require('node:fs');
require('tsx/cjs'); const {initialSave}=require('../lib/game.ts');
const upstream=process.env.ALPHA_URL || 'http://127.0.0.1:3100';
let revision=1;
const server=http.createServer(async(req,res)=>{
  try {
    const response=await fetch(new URL(req.url,upstream));
    if(req.url.startsWith('/sw.js')) {
      let source=await response.text();source=source.replace(/const CACHE = .*?;/,`const CACHE = "tcg-shell-update-probe-${revision}";`);
      res.writeHead(200,{'Content-Type':'application/javascript','Cache-Control':'no-store','Service-Worker-Allowed':'/'});res.end(source);
    } else {
      const headers={};response.headers.forEach((value,key)=>{if(!['content-length','content-encoding','transfer-encoding','connection'].includes(key))headers[key]=value;});
      res.writeHead(response.status,headers);res.end(Buffer.from(await response.arrayBuffer()));
    }
  }catch{res.writeHead(502);res.end('Proxy unavailable');}
});
(async()=>{
  await new Promise(resolve=>server.listen(3102,'127.0.0.1',resolve));
  const browser=await chromium.launch({executablePath:process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
  try {
    const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true});const s=initialSave();s.energy=100000;s.ux={...s.ux,introSeen:true,skipTips:true,motion:'reduce'};
    await context.addInitScript(s=>{if(!localStorage.getItem('tcg-faerie-v1'))localStorage.setItem('tcg-faerie-v1',JSON.stringify(s));},s);
    const page=await context.newPage();let navigations=0;page.on('framenavigated',frame=>{if(frame===page.mainFrame())navigations++;});
    await page.goto('http://127.0.0.1:3102');await page.locator('.mobile-booster').waitFor();await page.evaluate(async()=>{await navigator.serviceWorker.ready;});await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
    const cdp=await context.newCDPSession(page);let installability;
    try { installability=await cdp.send('Page.getInstallabilityErrors'); }catch { installability={unavailable:true}; }
    await page.getByRole('button',{name:/^Acheter ·/}).click();await page.locator('.pocket-opening').waitFor();
    const openingNavigations=navigations;
    revision=2;await page.evaluate(async()=>{await (await navigator.serviceWorker.getRegistration()).update();});
    await page.waitForFunction(async()=>!!(await navigator.serviceWorker.getRegistration())?.waiting);
    await page.waitForTimeout(1200);assert.equal(navigations,openingNavigations);assert.equal(await page.locator('.pocket-opening').count(),1);
    if(await page.getByRole('button',{name:'Choisir ce booster',exact:true}).count())await page.getByRole('button',{name:'Choisir ce booster',exact:true}).click();
    if(await page.getByRole('button',{name:'Ouvrir sans glisser',exact:true}).count())await page.getByRole('button',{name:'Ouvrir sans glisser',exact:true}).click();
    for(let i=0;i<5;i++){await page.locator('.po-view,.po-summary').first().waitFor();if(await page.locator('.po-summary').count())break;await page.getByRole('button',{name:/^Carte suivante$|^Voir les cinq cartes$/}).click();await page.waitForTimeout(120);}
    await page.getByRole('button',{name:'Retour à la machine',exact:true}).click();await page.getByRole('button',{name:'Paramètres',exact:true}).click();await page.locator('.installation-details > summary').click();
    await page.getByRole('button',{name:'Mettre à jour',exact:true}).waitFor();
    const previous=await page.evaluate(()=>JSON.parse(localStorage.getItem('tcg-faerie-v1')));
    const reloading=page.waitForEvent('framenavigated');await page.getByRole('button',{name:'Mettre à jour',exact:true}).click();await reloading;await page.locator('.mobile-booster').waitFor();
    const current=await page.evaluate(()=>JSON.parse(localStorage.getItem('tcg-faerie-v1')));assert.equal(current.packs,previous.packs);assert.deepEqual(current.owned,previous.owned);
    // The settings install path must consume an available prompt and hide it afterwards.
    await page.evaluate(()=>{const event=new Event('beforeinstallprompt');event.prompt=async()=>{window.__installPromptCalled=true;};event.userChoice=Promise.resolve({outcome:'dismissed'});window.dispatchEvent(event);});
    await page.getByRole('button',{name:'Paramètres',exact:true}).click();await page.getByRole('button',{name:'Installer TCG Clicker',exact:true}).click();
    assert.equal(await page.evaluate(()=>window.__installPromptCalled),true);await page.getByText('Installation annulée.',{exact:true}).waitFor();assert.equal(await page.getByRole('button',{name:'Installer TCG Clicker',exact:true}).count(),0);
    const result={waitingUpdateDidNotInterruptBooster:true,explicitUpdatePreservedSave:true,installPromptHandler:true,installability};fs.writeFileSync('test-results/phase10/update-report.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
  }finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(error=>{console.error(error);server.close();process.exit(1);});
