require('tsx/cjs');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const {initialSave,openPack}=require('../lib/game.ts');
const {CARDS,runtimeId}=require('../lib/cards.ts');
const fs=require('node:fs'),assert=require('node:assert/strict');
const base=process.env.ALPHA_URL||'http://127.0.0.1:3125',out='test-results/phase15';fs.mkdirSync(out,{recursive:true});
const id=n=>runtimeId('F01-'+String(n).padStart(3,'0')),shots=[],checks=[],errors=[];
function fixture(){const s=initialSave();s.energy=50000;s.packs=8;s.owned=Object.fromEntries(CARDS.map(c=>[c.id,3]));s.deck=[5,25,39,59,19,20].map(id);s.account.xp=1750;s.upgrades.combo=1;s.upgrades.critChance=1;s.freeBoosters=2;s.freeBoosterTimerStartedAt=null;s.ux={...s.ux,introSeen:true,skipTips:true,sound:false,motion:'reduce'};return s;}
async function session(browser,w,h,s){const ctx=await browser.newContext({viewport:{width:w,height:h},hasTouch:w<800,serviceWorkers:'block',reducedMotion:'no-preference'});await ctx.addInitScript(s=>{if(!localStorage.getItem('tcg-faerie-v1'))localStorage.setItem('tcg-faerie-v1',JSON.stringify(s));Math.random=()=>.99;},s);const page=await ctx.newPage();page.setDefaultTimeout(15000);page.on('pageerror',e=>errors.push(e.message));await page.goto(base);await page.locator('.machine-button,.pocket-opening').first().waitFor();return{ctx,page};}
async function shot(page,file,state){await page.evaluate(()=>document.fonts.ready);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),file+' overflow');await page.screenshot({path:`${out}/${file}.png`});shots.push({file:file+'.png',state,viewport:page.viewportSize()});console.log(file);}
async function nav(page,name){await page.locator('nav').getByRole('button',{name}).click();}
const saved=page=>page.evaluate(()=>JSON.parse(localStorage.getItem('tcg-faerie-v1')));
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 for(const [prefix,w,h]of [['desktop',1440,1000],['mobile',390,844]]){
  const {ctx,page}=await session(browser,w,h,fixture());const mobile=w<800;
  for(let i=0;i<20;i++)await page.locator('.machine-button').click();
  await page.locator('.machine-effects').getByText('Lièvrille',{exact:true}).waitFor();assert.ok(await page.locator('.machine-effects').innerText().then(t=>t.includes('+5 % clic')));await shot(page,prefix+'-conditional','Lièvrille active · combo >75 · compteur Luciolot');
  await nav(page,/Mon deck|Deck/);await page.locator('.advanced-deck-effects').scrollIntoViewIfNeeded();assert.ok(await page.locator('.advanced-deck-effects').innerText().then(t=>t.includes('EN ATTENTE D’UN BOOSTER')));await shot(page,prefix+'-effect-states','États du Deck : en charge, prêt, condition et attente booster');
  await page.getByRole('button',{name:'Remplacer Luciolot',exact:true}).click();
  const candidates=page.locator('.compact-candidate');await candidates.first().waitFor();await candidates.first().scrollIntoViewIfNeeded();
  if(mobile){const count=await candidates.evaluateAll(nodes=>nodes.filter(e=>{const r=e.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight;}).length);checks.push({viewport:[w,h],fullyVisibleCandidates:count});assert.ok(count>=3,'3 mobile candidates required, got '+count);}
  await shot(page,prefix+'-compact-picker','Candidats compacts, stats et différences ; comparaison détaillée repliée');if(mobile)await page.keyboard.press('Escape');
  await nav(page,/Collection/);await page.getByRole('button',{name:'Examiner Ramifleur',exact:true}).click();await page.locator('.card-upgrade-button').click();await page.locator('.upgrade-celebration').waitFor();assert.ok((await saved(page)).cardLevels[id(6)]===2);await shot(page,prefix+'-upgrade-confirmation','Carte améliorée · Niveau 1 → 2 · valeurs avant/après');
  await page.getByRole('button',{name:'ÉQUIPER · REMPLACER',exact:true}).click();await page.locator('.replacement-row').first().waitFor();await shot(page,prefix+'-compact-replacement','Remplacer depuis la fiche : six lignes compactes');await page.keyboard.press('Escape');await page.keyboard.press('Escape');
  await nav(page,/Mon deck|Deck/);await page.getByRole('button',{name:/Acheter le 7e emplacement/}).click();await page.locator('.notice').filter({hasText:'7e EMPLACEMENT ACQUIS'}).waitFor();assert.equal((await saved(page)).extraDeckSlots,1);assert.equal(await page.getByText('7e emplacement disponible',{exact:true}).count(),0);await shot(page,prefix+'-slot-acquired','7e emplacement acquis · offre 8e suivant seulement');await ctx.close();
  // A pending all-duplicate pack tests automatic reveal and crediting exactly once.
  const pack=CARDS.filter(c=>c.rarity<=1).slice(0,5).map(c=>c.id);let fast=fixture();fast.account.fastOpening=true;fast=openPack(fast,pack,'free');
  const start=fast.account.totals.cardsObtained,sessionFast=await session(browser,w,h,fast);const p=sessionFast.page;const began=Date.now();await p.locator('.po-summary').waitFor();
  assert.ok(Date.now()-began<3500,'ordinary quick pack too slow');assert.equal(await p.locator('.po-carousel').count(),0);const credited=await saved(p);assert.equal(credited.account.totals.cardsObtained-start,5);await p.getByText('5 DOUBLONS',{exact:true}).waitFor();await shot(p,prefix+'-fast-duplicates','Rapide sans geste · 5 doublons · éclats et améliorations');
  await p.getByRole('button',{name:'Retour à la machine',exact:true}).click();await p.locator('.machine-button').waitFor();await p.locator('.machine-effects').getByText('Prochain clic ×2',{exact:true}).waitFor();await p.locator('.machine-button').click();assert.ok(!(await p.locator('.machine-effects').allTextContents()).join(' ').includes('Prochain clic ×2'));checks.push({viewport:[w,h],quickPackCredits:5,horlogreveChargeConsumed:true});await sessionFast.ctx.close();
  // Recent duplicates must not be labelled new; an active search hides acquisitions.
  let recent=fixture();recent.account.fastOpening=true;recent=openPack(recent,pack,'free');const recentSession=await session(browser,w,h,recent),r=recentSession.page;await r.locator('.po-summary').waitFor();await r.getByRole('button',{name:'Voir ma collection',exact:true}).click();await r.getByRole('heading',{name:'ACQUISITIONS RÉCENTES'}).waitFor();assert.ok((await r.locator('.recent-acquisitions').innerText()).includes('RÉCENT'));assert.ok(!(await r.locator('.recent-acquisitions').innerText()).includes('NOUVEAU'));
  await r.getByRole('searchbox').fill('Luciolot');assert.equal(await r.locator('.recent-acquisitions').count(),0);assert.equal(await r.locator('.archive-entry').count(),1);if(mobile){await r.getByRole('button',{name:'FILTRES · 1',exact:true}).click();await r.getByLabel('Type',{exact:true}).selectOption('Étincelle');await r.getByRole('button',{name:'Voir 1 carte',exact:true}).click();await r.getByRole('button',{name:'FILTRES · 2',exact:true}).waitFor();}await shot(r,prefix+'-search-priority','Recherche prioritaire · acquisitions masquées · filtre actif');await recentSession.ctx.close();
 }
 // Normal mode retains a tear and five individual reveals. Quick discoveries and high rarities pause.
 for(const kind of ['normal','new','special']){
  const s=fixture();s.account.fastOpening=kind!=='normal';s.ux.motion='system';let cards=CARDS.filter(c=>c.rarity<2).slice(0,5).map(c=>c.id);
  if(kind==='new')delete s.owned[cards[0]];
  if(kind==='special'){cards[0]=CARDS.find(c=>c.rarity===4).id;cards[1]=CARDS.find(c=>c.rarity===5).id;}
  const opened=openPack(s,cards,'free'),{ctx,page}=await session(browser,390,844,opened);
  if(kind==='normal'){await page.getByRole('button',{name:'Choisir ce booster',exact:true}).click();await page.getByRole('button',{name:'Ouvrir sans glisser',exact:true}).click();}
  for(let i=0;i<5;i++){
   if(kind!=='normal'&&i>(kind==='special'?1:0))break;
   await page.locator('.po-view').waitFor();if(kind!=='normal'){await shot(page,'mobile-fast-'+kind+'-'+i,kind==='new'?'Nouvelle espèce : pause et badge NOUVEAU':'Légendaire / Mythique : mise en scène conservée');await page.waitForTimeout(800);assert.equal((await saved(page)).revealed,i+1);}
   await page.getByRole('button',{name:/^Carte suivante$|^Voir les cinq cartes$/}).click();
  }
  await page.locator('.po-summary').waitFor();assert.equal((await saved(page)).revealed,5);checks.push({opening:kind,pass:true});await ctx.close();
 }
 assert.deepEqual(errors,[]);
 fs.writeFileSync(`${out}/browser-report.json`,JSON.stringify({shots,checks,errors,humanPlaytest:'not-performed'},null,2));
 fs.writeFileSync(`${out}/index.html`,`<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Phase 15</title><style>body{background:#101516;color:#f1efe7;font:15px system-ui;margin:24px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:24px}figure{margin:0}img{width:100%;display:block}figcaption{padding:12px;color:#bcc4bf}</style><h1>Phase 15 — Vérification automatisée</h1><p>Sauvegardes contrôlées, aucun test humain.</p><div class="grid">${shots.map(s=>`<figure><a href="${s.file}"><img loading="lazy" src="${s.file}" alt="${s.state}"></a><figcaption>${s.state}<br>${s.viewport.width} × ${s.viewport.height}</figcaption></figure>`).join('')}</div></html>`);console.log('PASS '+shots.length+' captures');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
