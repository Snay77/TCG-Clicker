import type {Save} from '../../lib/game';
import {missingParent} from '../../lib/game-ux';
import Sprite from '../Sprite';
export default function EvolutionRequirement({save,id}:{save:Save;id:string}){
 const parent=missingParent(save,id);if(!parent)return null;
 return <div className="evolution-requirement"><Sprite creature={parent} silhouette/><div><strong>FORME PRÉCÉDENTE REQUISE</strong><span>{parent.name}</span><small>FÆ-{String(parent.number).padStart(3,'0')} · Non découverte</small></div></div>;
}
