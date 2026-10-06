// Isolated browser contexts only; never opens an existing user profile.
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
require('tsx/cjs');
const {initialSave,parseSave}=require('../lib/game.ts');
const {byId,CARDS}=require('../lib/cards.ts');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const base=process.env.ALPHA_URL||'http://127.0.0.1:3116',out=path.resolve(process.env.UI_AUDIT_DIR||'test-results/phase12a');
const phase=process.env.UI_AUDIT_PHASE||'12A';
fs.mkdirSync(out,{recursive:true});
const shots=[],checks=[],errors=[];
function fixture(kind){
 const s=initialSave();s.ux={...s.ux,introSeen:kind!=='journey',skipTips:kind!=='journey',sound:false,motion:'reduce'};
 if(kind!=='journey'){
  s.packs=1;s.owned={'001':1,'002':1,'003':1};s.account.xp=500;
  if(kind==='upgrade')s.owned['001']=3;
  if(kind==='max')s.cardLevels['001']=5;
  if(kind==='equipped')s.deck=['001'];
  if(kind==='locked'){delete s.owned['001'];s.owned['006']=1;}
  if(kind==='advanced'){
   s.energy=150000;s.packs=50;s.freeBoosters=2;s.freeBoosterTimerStartedAt=null;
   s.owned=Object.fromEntries(CARDS.map(c=>[c.id,3]));s.deck=['001','006','002','003'];
   s.upgrades=Object.fromEntries(Object.keys(s.upgrades).map(id=>[id,1]));s.level=1;s.account.xp=13000;
  }
 }
 parseSave(JSON.stringify(s));return s;
}
async function session(browser,w,h,kind){
 const context=await browser.newContext({viewport:{width:w,height:h},hasTouch:w<=850,serviceWorkers:'block'});
 await context.addInitScript(s=>{
  if(!localStorage.getItem('tcg-faerie-v1'))localStorage.setItem('tcg-faerie-v1',JSON.stringify(s));
  let seed=712;Math.random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 },fixture(kind));
 const page=await context.newPage();page.setDefaultTimeout(15000);
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await page.goto(base);await page.locator('.machine-button').waitFor();await page.evaluate(()=>document.fonts.ready);return{context,page};
}
async function shot(page,file,name,state,group){
 await page.waitForTimeout(100);
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),file+' page overflow');
 for(const dialog of await page.locator('dialog[open]').all())assert.ok(await dialog.evaluate(e=>e.scrollWidth<=e.clientWidth+1),file+' dialog overflow');
 await page.screenshot({path:path.join(out,file+'.png')});
 shots.push({file:file+'.png',name,state,group,viewport:page.viewportSize()});
 console.log(file);
}
const saved=page=>page.evaluate(()=>JSON.parse(localStorage.getItem('tcg-faerie-v1')));
async function contrast(page){
 return page.evaluate(()=>{
  const rgb=s=>s.match(/[\d.]+/g).slice(0,3).map(Number);
  const luminance=c=>c.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((n,v,i)=>n+v*[.2126,.7152,.0722][i],0);
  const ratio=(a,b)=>{const l=[luminance(a),luminance(b)].sort((a,b)=>b-a);return (l[0]+.05)/(l[1]+.05);};
  return ['.inspection-identity h2','.inspection-identity dd','.inspection-metadata','.inspection-section h3','.inspection-value','.copy-meter strong','.copy-shortfall','.inspection-blocked','.effect-comparison > span','.inspection-deck-state','.inspection-help summary','.inspection-details button'].flatMap(selector=>[...document.querySelectorAll(selector)].map(e=>{
   const color=getComputedStyle(e).color;let parent=e,bg;
   while(parent){bg=getComputedStyle(parent).backgroundColor;if(!bg.includes('rgba')&&bg!=='transparent')break;parent=parent.parentElement;}
   return {selector,ratio:Number(ratio(rgb(color),rgb(bg)).toFixed(2)),foreground:color,background:bg};
  }));
 });
}
async function nav(page,name){await page.locator('nav').getByRole('button',{name}).click();await page.waitForTimeout(80);}
async function dismissNotices(page){for(const label of ['Fermer la découverte','Fermer le message']){const b=page.getByRole('button',{name:label,exact:true});if(await b.count())await b.click();}}
async function finishOpening(page){
 await page.getByRole('button',{name:'Choisir ce booster',exact:true}).click();
 await page.getByRole('button',{name:'Ouvrir sans glisser',exact:true}).click();
 for(let i=0;i<5;i++){
  await page.locator('.po-view,.po-summary').first().waitFor();
  if(await page.locator('.po-summary').count())break;
  await page.getByRole('button',{name:/^Carte suivante$|^Voir les cinq cartes$/}).click();await page.waitForTimeout(140);
 }
 await page.locator('.po-summary').waitFor();await page.getByRole('button',{name:'Retour à la machine',exact:true}).click();
}
async function journey(browser,w,h,capture=true){
 const mobile=w<=850,prefix=mobile?'mobile':'desktop',group='Nouvelle partie';
 const {context,page}=await session(browser,w,h,'journey');
 try{
  await page.getByRole('button',{name:'Éveiller le portail',exact:true}).click();
  assert.equal(await page.locator('nav button').count(),1);
  assert.equal(await page.locator('.upgrades-panel,.shop-panel,.mobile-booster,.deck-panel,.exploration-strip').count(),0);
  assert.equal(await page.locator('.combo-panel').count(),0);
  if(capture)await shot(page,prefix+'-journey-0','Nouvelle partie — minute 0','Machine, énergie et clic uniquement',group);
  for(let i=0;i<75;i++)await page.locator('.machine-button').click();
  assert.equal(await page.locator('nav button').count(),1);await dismissNotices(page);
  if(mobile)await page.getByRole('button',{name:/Améliorations/}).click();
  const upgrade=page.getByRole('button',{name:/Acheter Amplificateur sylvestre/});await upgrade.click();
  await page.waitForFunction(()=>JSON.parse(localStorage.getItem('tcg-faerie-v1')).upgrades.click===1);
  assert.equal((await saved(page)).energy,0);
  if(mobile)await page.locator('dialog[open]').getByRole('button',{name:'Fermer',exact:true}).click();
  await page.evaluate(()=>scrollTo(0,0));
  if(capture)await shot(page,prefix+'-journey-upgrade','Première amélioration','Amplificateur acheté · clic +2 · Deck et Collection masqués',group);
  for(let i=0;i<50;i++)await page.locator('.machine-button').click();
  assert.equal(await page.locator('nav button').count(),2);
  if(capture)await shot(page,prefix+'-journey-booster','Premier booster accessible','100 éclats · Boosters apparaît · notification de découverte',group);
  await dismissNotices(page);await nav(page,/Boosters/);
  await page.getByRole('button',{name:/Acheter et ouvrir/}).click();await finishOpening(page);
  const s=await saved(page);assert.equal(s.packs,1);assert.equal(s.paidBoostersPurchased,1);assert.equal(Object.values(s.owned).reduce((a,b)=>a+b,0),5);
  assert.ok(await page.locator('nav').getByRole('button',{name:/Collection/}).count());
  if(capture)await shot(page,prefix+'-journey-opened','Première ouverture terminée',`${Object.keys(s.owned).length} espèces · Collection accessible · notification`,group);
  assert.ok(Object.keys(s.owned).length>=3,'Deterministic playtest must obtain several creatures');
  await dismissNotices(page);await nav(page,mobile?/Deck/:/Mon deck/);
  if(capture)await shot(page,prefix+'-journey-team','Plusieurs cartes — former une équipe','5 cartes obtenues · Deck accessible · choix de compagnons',group);
  if(mobile)await page.getByRole('button',{name:'Choisir le compagnon 1',exact:true}).click();
  await page.locator('.build-candidate button:not(:disabled)').first().click();
  assert.equal((await saved(page)).deck.length,1);await nav(page,mobile?/Voyage/:/Progression/);
  assert.equal(await page.getByRole('tab',{name:'Statistiques',exact:true}).count(),0);
  await context.close();checks.push({browser:'Chrome',viewport:[w,h],journey:'pass',cards:5,energySpent:175});
 }catch(e){await page.screenshot({path:path.join(out,'failure-'+w+'.png')});await context.close();throw e;}
}
async function cards(browser,w,h,capture=true){
 const mobile=w<=850,prefix=mobile?'mobile':'desktop';
 const cases=[['common','Commune niveau 1','001'],['upgrade','Amélioration disponible','001'],['max','Niveau maximum','001'],['equipped','Carte équipée','001'],['locked','Évolution verrouillée','006']];
 for(const [kind,label,id] of cases){
  const {context,page}=await session(browser,w,h,kind);
  try{
   await nav(page,/Collection/);
   assert.equal(await page.locator('.collection-grid .card button,.collection-grid .card .card-progression').count(),0);
   const opener=page.getByRole('button',{name:`Examiner ${byId(id).name}`,exact:true});await opener.click();
   const dialog=page.locator('dialog[open]');await dialog.waitFor();
   assert.equal(await dialog.locator('.card button').count(),0);
   const secondary=dialog.locator('.inspection-secondary');
   if(await secondary.count())await secondary.locator('summary').first().click();
   const audit=await contrast(page);assert.ok(audit.every(e=>e.ratio>=4.5),JSON.stringify(audit.filter(e=>e.ratio<4.5)));
   if(await secondary.count())await secondary.locator('summary').first().click();
   checks.push({browser:'Chrome',viewport:[w,h],state:kind,contrastMin:Math.min(...audit.map(e=>e.ratio)),contrast:audit});
   assert.ok((await dialog.locator('.card').boundingBox()).height<600,'TCG object stays compact');
   if(kind==='locked')assert.equal(await dialog.getByRole('button',{name:'ÉQUIPER',exact:true}).isDisabled(),true);
   if(kind==='common')assert.equal(await dialog.locator('.card-upgrade-button').isDisabled(),true);
   if(kind==='max')assert.equal(await dialog.locator('.card-upgrade-button').count(),0);
   for(let i=0;i<8;i++){await page.keyboard.press('Tab');assert.ok(await page.evaluate(()=>!!document.activeElement?.closest('dialog')));}
   await dialog.evaluate(e=>e.scrollTop=0);
   if(mobile&&phase==='12B'){
    const metrics=await dialog.evaluate(e=>{const d=e.getBoundingClientRect(),button=e.querySelector('.inspection-deck button').getBoundingClientRect();return{height:e.clientHeight,total:e.scrollHeight,cardHeight:e.querySelector('.card').getBoundingClientRect().height,scrollToSeeDeck:Math.max(0,button.bottom-d.top-e.clientHeight)};});
    assert.ok(metrics.scrollToSeeDeck<=220,JSON.stringify(metrics));checks.push({browser:'Chrome',viewport:[w,h],state:kind,reading:metrics});
   }
   if(capture)await shot(page,prefix+'-card-'+kind,label,kind==='upgrade'?'3 / 3 copies · niveau 1 → 2':label,mobile?'Mobile — carte':'Desktop — carte');
   if(mobile&&capture){await dialog.locator('.inspection-details').scrollIntoViewIfNeeded();await shot(page,prefix+'-card-'+kind+'-details',label+' — commandes','Identité / Capacité / Progression / Deck','Mobile — commandes');}
   if(kind==='upgrade'){
    await dialog.locator('.card-upgrade-button').click();await page.waitForFunction(()=>JSON.parse(localStorage.getItem('tcg-faerie-v1')).cardLevels['001']===2);
    const next=await saved(page);assert.equal(next.owned['001'],1);assert.equal(next.energy,0);assert.ok(await dialog.locator('.inspection-capacity').innerText().then(t=>t.includes('1.2')));
    await dialog.getByRole('button',{name:'ÉQUIPER',exact:true}).click();await page.waitForFunction(()=>JSON.parse(localStorage.getItem('tcg-faerie-v1')).deck.includes('001'));
    await dialog.getByRole('button',{name:'RETIRER DU DECK',exact:true}).click();await page.waitForFunction(()=>!JSON.parse(localStorage.getItem('tcg-faerie-v1')).deck.includes('001'));
   }
   if(mobile){await dialog.locator('.inspection-deck').scrollIntoViewIfNeeded();assert.ok(await dialog.getByRole('button',{name:'Fermer',exact:true}).isVisible());await dialog.getByRole('button',{name:'Fermer',exact:true}).click();}else await page.keyboard.press('Escape');assert.equal(await page.locator('dialog').count(),0);assert.equal(await opener.evaluate(e=>e===document.activeElement),true);
   await context.close();
  }catch(e){await page.screenshot({path:path.join(out,'failure-'+w+'-'+kind+'.png')});await context.close();throw e;}
 }
 checks.push({browser:'Chrome',viewport:[w,h],cards:'5 states pass',actions:'upgrade/equip/remove, focus trap/restore'});
}
function gallery(){
 const groups=[...new Set(shots.map(s=>s.group))];
 fs.writeFileSync(path.join(out,'index.html'),`<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Phase ${phase} — Validation</title><style>body{background:#0b0e0f;color:#f1efe7;font:15px system-ui;margin:32px}h1{font-size:30px}h2{margin-top:48px}section{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:24px}figure{margin:0;border:1px solid #424947;padding:16px}a{display:block;height:440px;overflow:auto}img{width:100%;display:block}figcaption{margin-top:16px;line-height:1.6}small{color:#adb3b0}</style><h1>Phase ${phase} — Progressive Disclosure & Card UX</h1><p>Fixtures isolées et parcours joué au clic. Aucune sauvegarde utilisateur modifiée.</p>${groups.map(g=>`<h2>${g}</h2><section>${shots.filter(s=>s.group===g).map(s=>`<figure><a href="${s.file}"><img loading="lazy" src="${s.file}" alt="${s.name}"></a><figcaption><strong>${s.name}</strong><br><small>${s.viewport.width} × ${s.viewport.height} · ${s.state}</small></figcaption></figure>`).join('')}</section>`).join('')}</html>`);
}
async function run(){
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 try{for(const [w,h] of [[1440,1000],[390,844]]){await cards(browser,w,h);await journey(browser,w,h);}await cards(browser,360,800,false);await journey(browser,360,800,false);}finally{await browser.close();}
 const edge=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
 try{const offset=checks.length;await cards(edge,390,844,false);await journey(edge,390,844,false);for(const c of checks.slice(offset))c.browser='Edge';}finally{await edge.close();}
 assert.deepEqual(errors,[]);gallery();fs.writeFileSync(path.join(out,'report.json'),JSON.stringify({shots,checks,errors},null,2));console.log(`PASS — ${shots.length} captures`);
}
module.exports={run,session,nav,shot,contrast,saved,out,shots,checks,errors};
if(require.main===module)run().catch(e=>{console.error(e);process.exit(1)});
