import { explorationProgress, levelThreshold, UNLOCKS } from '../../lib/exploration';
export default function ExplorationPath({xp}:{xp:number}) {
  const progress=explorationProgress(xp);
  const nextUnlock=UNLOCKS.find(unlock=>unlock.level>progress.level);
  const levels=[progress.level,progress.level+1,progress.level+2];
  if(nextUnlock && !levels.includes(nextUnlock.level))levels.push(nextUnlock.level);
  return <section className="journey-path" aria-label="Chemin d’exploration"><div className="journey-caption"><span>Votre chemin</span><small>Les rencontres ouvrent de nouveaux horizons.</small></div><ol>{levels.map((level,index)=>{
    const unlock=UNLOCKS.find(unlock=>unlock.level===level);
    return <li key={level} className={index===0?'journey-current':''} aria-current={index===0?'step':undefined}><span className="journey-node" aria-hidden="true">{index===0?'◆':'◇'}</span><div><strong>Niveau {level}</strong><p>{index===0?'Vous êtes ici':unlock?.name||'Poursuivre l’exploration'}</p><small>{index===0?`${progress.current.toLocaleString('fr-FR')} / ${progress.needed.toLocaleString('fr-FR')} XP dans ce niveau`:`${levelThreshold(level).toLocaleString('fr-FR')} XP au total`}</small>{unlock&&index>0&&<p className="journey-unlock">{unlock.description}</p>}</div></li>;
  })}</ol></section>;
}
