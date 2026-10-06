// Browser tests use isolated contexts and the real UI; never a user's profile.
require('tsx/cjs');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const {initialSave,parseSave}=require('../lib/game.ts');
const {CARDS,runtimeId}=require('../lib/cards.ts');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const out=path.resolve('test-results/phase13a'),url=process.env.ALPHA_URL||'http://127.0.0.1:3116';
const builds={Clic:[1,4,5,6,25,39],Idle:[10,11,19,20,50,60],Critique:[16,17,18,25,39,46],Collection:[13,15,31,32,59,60],Mixte:[1,10,19,25,28,39]};
const id=n=>runtimeId('F01-'+String(n).padStart(3,'0')),shots=[],checks=[],errors=[];
fs.mkdirSync(out,{recursive:true});
async function context(browser,w,h,build){
 const save=initialSave();save.owned=Object.fromEntries(CARDS.map(c=>[c.id,3]));save.deck=builds[build].map(id);save.energy=150000;save.account.xp=13000;save.packs=5;
 save.upgrades={click:5,auto:5,critChance:10,critMultiplier:5,combo:5,global:2,faerie:2};save.level=5;save.ux={...save.ux,introSeen:true,skipTips:true,sound:false,motion:'reduce'};
 parseSave(JSON.stringify(save));
 const ctx=await browser.newContext({viewport:{width:w,height:h},hasTouch:w<800,serviceWorkers:'block'});
 await ctx.addInitScript(s=>{if(!localStorage.getItem('tcg-faerie-v1'))localStorage.setItem('tcg-faerie-v1',JSON.stringify(s));window.effectTestRoll=.99;Math.random=()=>window.effectTestRoll;},save);
 const page=await ctx.newPage();page.setDefaultTimeout(15000);page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await page.goto(url);await page.locator('.machine-button').waitFor();await page.evaluate(()=>document.fonts.ready);return{ctx,page};
}
async function nav(page,name){await page.locator('nav').getByRole('button',{name}).click();await page.evaluate(()=>scrollTo(0,0));}
async function shot(page,file,state,fullPage=false){
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),file+' overflow');
 await page.screenshot({path:path.join(out,file+'.png'),fullPage});shots.push({file:file+'.png',viewport:page.viewportSize(),state});console.log(file);
}
async function inspect(page,w){
 await nav(page,/Collection/);await page.locator('.archive-entry').first().getByRole('button',{name:/Examiner/}).click();
 const dialog=page.locator('dialog[open]');await dialog.waitFor();assert.ok((await dialog.innerText()).includes('Sylve ×3 : +15 % clic.'));
 assert.ok(await dialog.evaluate(e=>e.scrollWidth<=e.clientWidth+1));await shot(page,(w<800?'mobile':'desktop')+'-card-moussillon','Capacité avancée lisible ; niveau 1');await dialog.getByRole('button',{name:'Fermer',exact:true}).click();
}
async function booster(page){
 await nav(page,/Boosters/);await page.getByRole('button',{name:/Acheter et ouvrir/}).click();
 await page.getByRole('button',{name:'Choisir ce booster',exact:true}).click();await page.getByRole('button',{name:'Ouvrir sans glisser',exact:true}).click();
 for(let i=0;i<5;i++){await page.locator('.po-view,.po-summary').first().waitFor();if(await page.locator('.po-summary').count())break;await page.getByRole('button',{name:/^Carte suivante$|^Voir les cinq cartes$/}).click();await page.waitForTimeout(140);}
 await page.locator('.po-summary').waitFor();await page.getByRole('button',{name:'Retour à la machine',exact:true}).click();
}
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 try{for(const [w,h]of [[1440,1000],[390,844]]){
  const prefix=w<800?'mobile':'desktop';
  for(const build of Object.keys(builds)){
   const {ctx,page}=await context(browser,w,h,build);
   await nav(page,w<800?/Deck/:/Mon deck/);const panel=page.locator('.advanced-deck-effects');await panel.waitFor();assert.ok(await panel.locator('li').count());
   await shot(page,prefix+'-deck-'+build.toLowerCase()+'-complete',build+' — Deck complet',true);
   await panel.scrollIntoViewIfNeeded();await shot(page,prefix+'-deck-'+build.toLowerCase(),build+' — effets actifs, conditions secondaires repliées');
   if(build==='Mixte'){
    assert.equal(await panel.locator('details').first().getAttribute('open'),null);await inspect(page,w);
   }
   if(build==='Clic'){
    await nav(page,w<800?/Machine/:/La machine/);
    for(let i=0;i<25;i++)await page.locator('.machine-button').click();
    await page.locator('.advanced-effect-feedback').filter({hasText:'prochain clic ×3'}).waitFor();await shot(page,prefix+'-machine-charge','25 clics effectués : prochain clic ×3');
    await page.locator('.machine-button').click();await page.waitForTimeout(2100);
    assert.ok(!(await page.locator('.advanced-effect-feedback').innerText()).includes('Prochain clic ×3'));
    await page.evaluate(()=>window.effectTestRoll=0);await page.locator('.machine-button').click();await page.evaluate(()=>window.effectTestRoll=.99);
    await page.locator('.advanced-effect-feedback').filter({hasText:'+15 % clic pendant 4 s'}).waitFor();await shot(page,prefix+'-machine-critical','Critique : bonus de Flamèche et durée visible');
    await page.waitForTimeout(4200);assert.ok(!(await page.locator('.advanced-effect-feedback').innerText()).includes('s restantes'));
    await page.reload();await page.locator('.machine-button').waitFor();assert.ok((await page.locator('.advanced-effect-feedback').innerText()).includes('0 / 25'));
   }
   if(build==='Collection'){
    await booster(page);await page.locator('.advanced-effect-feedback').filter({hasText:'prochain clic ×2'}).waitFor();await shot(page,prefix+'-machine-booster','Retour du booster : charge Horlogrève ×2');
    await page.locator('.machine-button').click();await page.waitForTimeout(2100);assert.equal(await page.locator('.advanced-effect-feedback').count(),0);
   }
   checks.push({viewport:[w,h],build,errors:'none'});await ctx.close();
  }
 }
 assert.deepEqual(errors,[]);
 fs.writeFileSync(path.join(out,'browser-report.json'),JSON.stringify({shots,checks,errors},null,2));
 fs.writeFileSync(path.join(out,'index.html'),`<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Phase 13A</title><style>body{background:#101516;color:#f1efe7;font:15px system-ui;margin:24px}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px}figure{margin:0}img{width:100%;display:block}a{display:block;max-height:820px;overflow:auto}figcaption{padding:12px;color:#bcc4bf}@media(max-width:700px){.grid{grid-template-columns:1fr}}</style><h1>Phase 13A — Deck / Machine</h1><p>Sessions isolées · effets réels · captures desktop et mobile</p><div class="grid">${shots.map(s=>`<figure><a href="${s.file}"><img loading="lazy" src="${s.file}" alt="${s.state}"></a><figcaption>${s.state}<br>${s.viewport.width} × ${s.viewport.height}</figcaption></figure>`).join('')}</div></html>`);
 console.log('PASS : '+shots.length+' captures, cinq decks et transitions réelles.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
