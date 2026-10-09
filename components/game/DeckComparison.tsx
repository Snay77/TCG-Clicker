import {deckComparison} from '../../lib/game-ux';
import type {Save} from '../../lib/game';
import type {AdvancedContext} from '../../lib/advanced-effects';
export default function DeckComparison({save,id,replaceId,context={}}:{save:Save;id:string;replaceId?:string;context?:AdvancedContext}){
 const v=deckComparison(save,id,replaceId,context);
 const changes=[...v.synergiesGained.map(x=>'Synergie gagnée · '+x),...v.synergiesLost.map(x=>'Synergie perdue · '+x),...v.gained.map(x=>'Effet gagné · '+x),...v.lost.map(x=>'Effet perdu · '+x),...v.conditions];
 return <div className="deck-comparison" aria-label="Comparaison du Deck">{v.lines.map(line=><div key={line.label}><span>{line.label}</span><b>{line.before} → {line.after}</b></div>)}{changes.map((text,i)=><p key={i}>{text}</p>)}{!v.lines.length&&!changes.length&&<small>Aucun changement immédiat de statistiques.</small>}</div>;
}
