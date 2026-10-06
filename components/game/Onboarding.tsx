import type { Save } from '../../lib/game';
import { completedSteps, contextualTip, FIRST_STEPS, type TipId } from '../../lib/ux';
import Machine from '../Machine';
import Modal from './Modal';
import ArcaneMark from './ArcaneMark';
import UIAction from './UIAction';
import { visibleSystems } from '../../lib/disclosure';
export function PortalIntro({onDone}:{onDone:()=>void}){
 return <Modal title="Bienvenue dans la clairière" onClose={onDone} className="portal-intro"><ArcaneMark label="TCG / PREMIER CONTACT" index="SECTEUR 01"/><span className="intro-brand">TCG CLICKER / 01</span><span className="eyebrow">UNE PREMIÈRE RENCONTRE</span><Machine level={0}/><h2>Une fréquence inconnue<br/>traverse la clairière.</h2><p>Le portail répond à votre présence.</p><UIAction autoFocus variant="primary" className="ux-primary" onClick={onDone}>Éveiller le portail</UIAction><UIAction className="text-button" onClick={onDone}>Passer l’introduction</UIAction></Modal>;
}
const TIPS:Record<TipId,{text:string;action:string;target:string}>={
 click:{text:'Cliquez au cœur du portail pour récolter votre premier éclat.',action:'Voir le portail',target:'machine'},
 upgrade:{text:'Luciole : énergie automatique. Amplificateur : clics plus puissants.',action:'Voir les améliorations',target:'upgrades'},
 booster:{text:'Cinq cartes par booster. Achetez-en un ou profitez de la recharge gratuite toutes les dix minutes.',action:'Voir le booster',target:'booster'},
 collection:{text:'Examinez vos cartes, leurs copies et leurs lignées dans la Collection.',action:'Ouvrir la Collection',target:'collection'},
 deck:{text:'Équipez un compagnon dans le Deck pour renforcer la machine.',action:'Composer le Deck',target:'deck'},
 progression:{text:'Vos rencontres rapportent de l’XP : suivez les déblocages et réclamez vos récompenses.',action:'Voir la Progression',target:'progression'}
};
export default function Onboarding({save,onDismiss,onSkip,onNavigate}:{save:Save;onDismiss:(id:TipId)=>void;onSkip:()=>void;onNavigate:(target:string)=>void}){
 const systems=visibleSystems(save),candidate=contextualTip(save),done=completedSteps(save);
 const allowed={click:true,upgrade:systems.upgrades,booster:systems.boosters,collection:systems.collection,deck:systems.deck,progression:systems.progression};
 const tip=candidate&&allowed[candidate]?candidate:null;
 const visibleSteps=[true,systems.upgrades,systems.boosters,systems.collection,systems.deck];
 if(save.ux.skipTips||!save.ux.introSeen||(done.length===5&&!tip))return null;
 return <section className={`first-steps ${!systems.upgrades&&!systems.boosters?'first-impulse':''}`} aria-label="Premiers pas">{done.length<5&&<><div className="first-steps-heading"><strong>PREMIERS PAS / {done.length}/5</strong><UIAction onClick={onSkip}>Passer les conseils</UIAction></div>
  <ul>{FIRST_STEPS.map((text,i)=>(visibleSteps[i]||done.includes(i))&&<li className={done.includes(i)?'done':''} key={text}><span aria-hidden="true">{done.includes(i)?'✓':'○'}</span>{text}</li>)}</ul></>}
  {tip&&<div className="context-tip" role="status"><p>{TIPS[tip].text}</p><UIAction onClick={()=>{onNavigate(TIPS[tip].target);if(tip!=='click')onDismiss(tip);}}>{TIPS[tip].action} →</UIAction><UIAction aria-label="Fermer ce conseil" onClick={()=>onDismiss(tip)}>×</UIAction></div>}
 </section>;
}
