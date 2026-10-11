import {deckComparison} from '../../lib/game-ux';
import type {Save} from '../../lib/game';
import type {AdvancedContext} from '../../lib/advanced-effects';
export default function DeckComparison({save,id,replaceId,context={},compact=false}:{save:Save;id:string;replaceId?:string;context?:AdvancedContext;compact?:boolean}){
 const v=deckComparison(save,id,replaceId,context);
 const changes=[...v.synergiesGained.map(x=>'Synergie gagnée · '+x),...v.synergiesLost.map(x=>'Synergie perdue · '+x),...v.gained.map(x=>'Effet gagné · '+x),...v.lost.map(x=>'Effet perdu · '+x),...v.conditions];
 const lines=v.lines.map(line=><div key={line.label}><span>{line.label}</span><b>{line.before} → {line.after}</b></div>),details=changes.map((text,i)=><p key={i}>{text}</p>);
 return <div className={`deck-comparison ${compact?'comparison-compact':''}`} aria-label="Comparaison du Deck">{compact?<><div className="comparison-main">{lines.slice(0,2)}{!lines.length&&details.slice(0,1)}</div>{(lines.length>2||changes.length>0)&&<details><summary>Comparaison complète</summary>{lines.slice(2)}{details}</details>}</>:<>{lines}{details}</>}{!v.lines.length&&!changes.length&&<small>Aucun changement immédiat.</small>}</div>;
}
