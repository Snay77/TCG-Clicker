import type { Save } from '../../lib/game';
import { advancedRows, type AdvancedContext } from '../../lib/advanced-effects';

export default function AdvancedDeckEffects({save,context}:{save:Save;context:AdvancedContext}) {
 const rows=advancedRows(save,context),active=rows.filter(r=>r.active),inactive=rows.filter(r=>!r.active);
 if(!rows.length)return null;
 return <section className="advanced-deck-effects" aria-label="Effets avancés du Deck">
  <h3>EFFETS ACTIFS</h3>
  {active.length>0?<ul>{active.map(row=><li key={row.id}><strong>{row.name}</strong><span>{row.text}</span><small>{row.status}</small>{row.remaining>0&&<progress aria-label={`Durée de ${row.name}`} max={row.maximum} value={row.remaining}/>}</li>)}</ul>:<p>Aucune condition avancée active.</p>}
  {inactive.length>0&&<details><summary>{inactive.length} condition{inactive.length>1?'s':''} à remplir</summary><ul>{inactive.map(row=><li key={row.id}><strong>{row.name}</strong><span>{row.text}</span></li>)}</ul></details>}
  <details className="advanced-help"><summary aria-label="Règles des effets avancés">?</summary><p>Au rechargement, les bonus temporaires et les charges de booster disparaissent. La progression des charges périodiques est sauvegardée, y compris le prochain clic prêt. Retirer ou remplacer une carte efface ses effets et sa charge ; les compagnons conservés gardent les leurs. Remettre une carte la fait repartir de zéro. Une montée de niveau ne réinitialise pas ces effets.</p><p>Les effets avancés restent fixes quand la carte monte de niveau ; son bonus de base augmente. Les durées se rafraîchissent sans se cumuler. Les charges utilisent la plus forte et sont consommées ensemble. Plafonds : +35 % clic, +40 % passif, +12 % éclats ; charge maximale ×3. Les synergies existantes s’ajoutent normalement.</p></details>
 </section>;
}
