require('tsx/cjs');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const {initialSave,parseSave,changeDeck,stats}=require('../lib/game.ts');
const {CARDS,runtimeId}=require('../lib/cards.ts');
const {advancedEvent,initialAdvancedRuntime}=require('../lib/advanced-effects.ts');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const out=path.resolve('test-results/phase13b'),url=process.env.ALPHA_URL||'http://127.0.0.1:3116';
const id=n=>runtimeId('F01-'+String(n).padStart(3,'0')),shots=[],checks=[],errors=[];
fs.mkdirSync(out,{recursive:true});
async function shot(page,name,state){assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),name+' overflow');await page.screenshot({path:path.join(out,name+'.png')});shots.push({file:name+'.png',state,viewport:page.viewportSize()});console.log(name);}
async function nav(page,mobile,tab){await page.locator('nav').getByRole('button',{name:tab==='deck'?(mobile?/Deck/:/Mon deck/):mobile?/Machine/:/La machine/}).click();}
async function run(browser,w,h){
 const save=initialSave();save.energy=10000;save.owned=Object.fromEntries(CARDS.map(c=>[c.id,3]));save.deck=[25,39,18,50,19,20].map(id);save.packs=5;save.account.xp=13000;save.upgrades.critChance=10;save.ux={...save.ux,introSeen:true,skipTips:true,sound:false,motion:'reduce'};
 parseSave(JSON.stringify(save));
 const ctx=await browser.newContext({viewport:{width:w,height:h},hasTouch:w<800,serviceWorkers:'block'});
 await ctx.addInitScript(s=>{if(!localStorage.getItem('tcg-faerie-v1'))localStorage.setItem('tcg-faerie-v1',JSON.stringify(s));window.effectRoll=.99;Math.random=()=>window.effectRoll;},save);
 const page=await ctx.newPage();page.setDefaultTimeout(15000);page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 const mobile=w<800,prefix=mobile?'mobile':'desktop';
 await page.goto(url);await page.locator('.machine-button').waitFor();await page.evaluate(()=>document.fonts.ready);
 assert.equal(await page.locator('.machine-effects').count(),0);await shot(page,prefix+'-machine-idle','Aucun compteur à 0/25 ; aucun bandeau d’effet');
 for(let i=0;i<18;i++)await page.locator('.machine-button').click();
 await page.locator('.machine-effects').filter({hasText:'18 / 25'}).waitFor();await shot(page,prefix+'-machine-charge','Luciolot 18/25, progression utile');
 await page.waitForFunction(()=>JSON.parse(localStorage.getItem('tcg-faerie-v1')).advancedClicks?.['F01-025']===18);
 await page.reload();await page.locator('.machine-effects').filter({hasText:'18 / 25'}).waitFor();checks.push({viewport:[w,h],reload18:'preserved'});
 await page.evaluate(()=>window.effectRoll=0);await page.locator('.machine-button').click();await page.evaluate(()=>window.effectRoll=.99);
 const effects=page.locator('.machine-effects');await effects.filter({hasText:'Flamèche'}).waitFor();assert.ok((await effects.innerText()).includes('Songegarde'));
 assert.equal(await effects.locator('.machine-effect-row').count(),3);assert.equal(await effects.locator('progress').count(),2);assert.match(await effects.innerText(),/[0-4]\.[0-9] s/);
 await shot(page,prefix+'-machine-temporary','Deux effets actifs, durées décimales, jauges et une charge — trois lignes');
 await nav(page,mobile,'deck');await page.locator('.advanced-deck-effects').scrollIntoViewIfNeeded();await shot(page,prefix+'-deck-active','Nom, condition, état ; durées de Flamèche et Songegarde');
 // Removing Flamèche preserves Songegarde and Luciolot. The new timer is refreshed
 // immediately before navigation to avoid asserting against an already expired buff.
 await nav(page,mobile,'machine');await page.evaluate(()=>window.effectRoll=0);await page.locator('.machine-button').click();await page.evaluate(()=>window.effectRoll=.99);
 await nav(page,mobile,'deck');await page.locator('.equipped-slot').filter({has:page.getByRole('button',{name:'Remplacer Flamèche',exact:true})}).getByRole('button',{name:'Retirer −',exact:true}).click();
 await nav(page,mobile,'machine');assert.ok(!(await effects.innerText()).includes('Flamèche'));assert.ok((await effects.innerText()).includes('Songegarde'));
 await page.reload();await page.locator('.machine-button').waitFor();assert.ok(!(await effects.innerText()).includes('Songegarde'));assert.ok((await effects.innerText()).includes('20 / 25'));checks.push({viewport:[w,h],removedSourceOnly:'pass',reloadBuffs:'lost'});
 for(let i=0;i<5;i++)await page.locator('.machine-button').click();await effects.filter({hasText:'×3'}).waitFor();
 await page.waitForFunction(()=>JSON.parse(localStorage.getItem('tcg-faerie-v1')).advancedClicks?.['F01-025']===25);await page.reload();await effects.filter({hasText:'×3'}).waitFor();
 const expected=Number((await page.locator('.machine-prompt strong b').innerText()).match(/[\d.]+/)[0]);await page.locator('.machine-button').click();const gain=Number((await page.locator('.click-spark').last().innerText()).match(/[\d.]+/)[0]);assert.equal(gain,expected);
 await page.waitForFunction(()=>JSON.parse(localStorage.getItem('tcg-faerie-v1')).advancedClicks?.['F01-025']===1);await page.reload();await page.locator('.machine-button').waitFor();assert.equal(await page.locator('.machine-effects').count(),0);
 await nav(page,mobile,'deck');await page.locator('.advanced-deck-effects').scrollIntoViewIfNeeded();await shot(page,prefix+'-deck-ready','Charge consommée une fois ; compteur 1/25, autres déclencheurs PRÊT');
 checks.push({viewport:[w,h],reloadReady:'preserved',singleConsumption:'pass',gainMatchesPrompt:gain});await ctx.close();
}
(async()=>{const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});try{await run(browser,1440,1000);await run(browser,390,844);assert.deepEqual(errors,[]);
fs.writeFileSync(path.join(out,'browser-report.json'),JSON.stringify({shots,checks,errors,humanPlaytest:'not-performed'},null,2));
fs.writeFileSync(path.join(out,'index.html'),`<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Phase 13B</title><style>body{background:#101516;color:#f1efe7;font:15px system-ui;margin:24px}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px}figure{margin:0}img{width:100%;display:block}figcaption{padding:12px;color:#bcc4bf}@media(max-width:700px){.grid{grid-template-columns:1fr}}</style><h1>Phase 13B — Feedback et persistance</h1><p>Playtest humain non réalisé : aucune généralisation validée.</p><div class="grid">${shots.map(s=>`<figure><a href="${s.file}"><img src="${s.file}" alt="${s.state}"></a><figcaption>${s.state}<br>${s.viewport.width} × ${s.viewport.height}</figcaption></figure>`).join('')}</div></html>`);console.log('PASS '+shots.length+' captures');}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
