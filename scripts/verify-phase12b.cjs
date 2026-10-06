process.env.UI_AUDIT_DIR='test-results/phase12b/after';
process.env.UI_AUDIT_PHASE='12B';
const audit=require('./verify-phase12.cjs');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve('test-results/phase12b'),globalChecks=[];
async function globalContrast(page){
 return page.evaluate(()=>{
  const rgb=s=>s.match(/[\d.]+/g).slice(0,3).map(Number);
  const lum=c=>c.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((n,v,i)=>n+v*[.2126,.7152,.0722][i],0);
  const results=[];
  for(const e of document.querySelectorAll('.nav-label,.stats-row small,.archive-label small,.archive-actions span,.section-title h2,.build-panel p,.build-stats small,.build-stats strong,.synergy strong,.synergy small,.synergy span,.boosters-heading p,.booster-page-recharge,.journal-view .eyebrow,.journal-view h2,.journal-view button,.settings-modal p,.settings-modal label,.settings-modal button,.mobile-booster button,.upgrade-item button')){
   if(!e.checkVisibility({checkOpacity:true,checkVisibilityCSS:true}))continue;
   const style=getComputedStyle(e);let parent=e,bg;
   while(parent){bg=getComputedStyle(parent).backgroundColor;if(!bg.includes('rgba')&&bg!=='transparent')break;parent=parent.parentElement;}
   const values=[lum(rgb(style.color)),lum(rgb(bg))].sort((a,b)=>b-a),ratio=(values[0]+.05)/(values[1]+.05);
   const large=parseFloat(style.fontSize)>=24||parseFloat(style.fontSize)>=18.66&&Number(style.fontWeight)>=700;
   results.push({text:e.textContent.trim().slice(0,85),ratio:Number(ratio.toFixed(2)),needed:large?3:4.5,opacity:style.opacity});
  }
  return results;
 });
}
async function screens(){
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 try{for(const [w,h] of [[1440,1000],[390,844]]){
  const {context,page}=await audit.session(browser,w,h,'advanced');
  const mobile=w<=850,prefix=mobile?'mobile':'desktop';
  const tabs=[['machine',mobile?/Machine/:/La machine/],['boosters',/Boosters/],['collection',/Collection/],['deck',mobile?/Deck/:/Mon deck/],['progression',mobile?/Voyage/:/Progression/]];
  for(const [id,label]of tabs){
   await audit.nav(page,label);
   const result=await globalContrast(page);const bad=result.filter(e=>e.ratio<e.needed||Number(e.opacity)<1);
   assert.deepEqual(bad,[],`${prefix}/${id}`);globalChecks.push({viewport:[w,h],screen:id,contrast:result});
   await audit.shot(page,prefix+'-global-'+id,id,'Contraste primaire / secondaire / metadata / actions','Écrans');
  }
  await page.getByRole('button',{name:'Paramètres',exact:true}).click();
  const result=await globalContrast(page);assert.deepEqual(result.filter(e=>e.ratio<e.needed||Number(e.opacity)<1),[],prefix+'/settings');
  globalChecks.push({viewport:[w,h],screen:'settings',contrast:result});await audit.shot(page,prefix+'-global-settings','Paramètres','Contrôles et actions secondaires','Écrans');
  await context.close();
 }}finally{await browser.close();}
}
function gallery(){
 const shots=audit.shots,cases=['common','upgrade','max','equipped','locked'];
 const names={common:'Commune — niveau 1',upgrade:'Amélioration disponible',max:'Niveau maximum',equipped:'Carte équipée',locked:'Évolution verrouillée'};
 const pair=(file,title,viewport)=>`<article><h3>${title}</h3><p>${viewport}</p><div class="pair">${['before','after'].map(side=>`<figure><figcaption>${side==='before'?'Avant — Phase 12A':'Après — Phase 12B'}</figcaption><a href="${side}/${file}.png"><img loading="lazy" src="${side}/${file}.png" alt="${title} ${side}"></a></figure>`).join('')}</div></article>`;
 const comparisons=[...cases.map(c=>pair('desktop-card-'+c,names[c],'1440 × 1000')),...cases.flatMap(c=>[pair('mobile-card-'+c,names[c],'390 × 844 — première vue'),pair('mobile-card-'+c+'-details',names[c]+' — commandes','390 × 844 — actions')])].join('');
 const extra=shots.filter(s=>!s.file.includes('-card-')).map(s=>`<figure><a href="after/${s.file}"><img loading="lazy" src="after/${s.file}" alt="${s.name}"></a><figcaption>${s.name}<br><small>${s.viewport.width} × ${s.viewport.height} · ${s.state}</small></figcaption></figure>`).join('');
 fs.writeFileSync(path.join(root,'index.html'),`<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Phase 12B — Avant / Après</title><style>body{background:#0b0e0f;color:#f1efe7;font:15px system-ui;margin:32px}h2{margin-top:48px}h3{margin:0}p,small{color:#bcc4bf}article{padding:24px;border:1px solid #424947;margin:24px 0}.pair,.extra{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px}figure{margin:0}figcaption{margin:12px 0;line-height:1.5}a{display:block;max-height:720px;overflow:auto}img{display:block;width:100%}@media(max-width:700px){body{margin:16px}.pair,.extra{grid-template-columns:1fr}}</style><h1>Phase 12B — Avant / Après</h1><p>15 comparaisons de fiches · cinq états · captures de nouvelle partie et audit global. Sauvegardes de test isolées.</p><h2>Fiches de carte</h2>${comparisons}<h2>Parcours et écrans après correction</h2><section class="extra">${extra}</section></html>`);
 fs.writeFileSync(path.join(root,'report.json'),JSON.stringify({phase:'12B',shots,checks:audit.checks,globalChecks,humanPlaytest:{status:'pending',reason:'Un testeur humain doit encore fournir ses réponses.'},errors:audit.errors},null,2));
}
(async()=>{await audit.run();await screens();gallery();console.log('Phase 12B : 15 comparaisons avant/après, 37 captures après, contrastes vérifiés. Playtest humain à compléter.');})().catch(e=>{console.error(e);process.exit(1)});
