import type { Save } from '../../lib/game';
import { completedSteps, contextualTip, FIRST_STEPS, type TipId } from '../../lib/ux';
import Machine from '../Machine';
import Modal from './Modal';
export function PortalIntro({onDone}:{onDone:()=>void}){
 return <Modal title="Bienvenue dans la clairière" onClose={onDone} className="portal-intro"><span className="eyebrow">UNE PREMIÈRE RENCONTRE</span><Machine level={0}/><h2>Une fréquence inconnue<br/>traverse la clairière.</h2><p>Le portail répond à votre présence.</p><button autoFocus className="ux-primary" onClick={onDone}>Éveiller le portail</button><button className="text-button" onClick={onDone}>Passer l’introduction</button></Modal>;
}
const TIPS:Record<TipId,{text:string;action:string;target:string}>={
 click:{text:'Le portail attend une première impulsion. Cliquez sur son cœur pour récolter votre premier éclat.',action:'Voir le portail',target:'machine'},
 upgrade:{text:'Votre première amélioration est accessible. La Luciole produit de l’énergie toute seule ; l’Amplificateur renforce chaque clic.',action:'Voir les améliorations',target:'upgrades'},
 booster:{text:'Une rencontre approche ! Un booster contient cinq cartes. Vous pouvez l’acheter, ou attendre la recharge gratuite de dix minutes.',action:'Voir le booster',target:'booster'},
 collection:{text:'Vos rencontres sont rangées dans la Collection. Examinez une carte en grand et retrouvez ses copies et sa lignée.',action:'Ouvrir la Collection',target:'collection'},
 deck:{text:'Vos créatures ont des pouvoirs. Équipez un premier compagnon dans le Deck pour renforcer la machine.',action:'Composer le Deck',target:'deck'},
 progression:{text:'Les rencontres rapportent de l’XP. Progression présente les prochains déblocages et les récompenses à réclamer.',action:'Voir la Progression',target:'progression'}
};
export default function Onboarding({save,onDismiss,onSkip,onNavigate}:{save:Save;onDismiss:(id:TipId)=>void;onSkip:()=>void;onNavigate:(target:string)=>void}){
 const tip=contextualTip(save),done=completedSteps(save);
 if(save.ux.skipTips||!save.ux.introSeen||(done.length===5&&!tip))return null;
 return <section className="first-steps" aria-label="Premiers pas">{done.length<5&&<><div className="first-steps-heading"><strong>✧ PREMIERS PAS · {done.length}/5</strong><button onClick={onSkip}>Passer les conseils</button></div>
  <ul>{FIRST_STEPS.map((text,i)=><li className={done.includes(i)?'done':''} key={text}><span aria-hidden="true">{done.includes(i)?'✓':'○'}</span>{text}</li>)}</ul></>}
  {tip&&<div className="context-tip" role="status"><p>{TIPS[tip].text}</p><button onClick={()=>{onNavigate(TIPS[tip].target);if(tip!=='click')onDismiss(tip);}}>{TIPS[tip].action} →</button><button aria-label="Fermer ce conseil" onClick={()=>onDismiss(tip)}>×</button></div>}
 </section>;
}
