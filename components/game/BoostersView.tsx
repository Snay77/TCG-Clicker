import UIAction from './UIAction';
import { useState } from 'react';
import BoosterPack from '../BoosterPack';
import { BOOSTERS, favoriteBooster, type BoosterId } from '../../lib/boosters';
import { RARITIES } from '../../lib/cards';
import { price, rarityProbabilities, type PackSource, type Save } from '../../lib/game';
import { freePackCount } from '../../lib/exploration';
import { countdown } from './BoosterShop';
export default function BoostersView({ save, remaining, rareChance, onFavorite, onOpen }: {
  save: Save; remaining: number | null; rareChance: number;
  onFavorite: (id: BoosterId | null) => void; onOpen: (id: BoosterId, source: PackSource) => void;
}) {
  const [selected, setSelected] = useState<BoosterId>(save.ux.favoriteBooster ?? BOOSTERS[0].id);
  const booster = BOOSTERS.find(pack => pack.id === selected) ?? BOOSTERS[0];
  const favorite = favoriteBooster(save.ux.favoriteBooster)?.id === booster.id;
  const available = freePackCount(save);
  return <section className="boosters-view" aria-label="Choisir un booster">
    <header className="boosters-heading"><div><span className="eyebrow">UNE NOUVELLE RENCONTRE</span><h2>Choisissez votre booster</h2><p>Un monde à découvrir, un paquet à ouvrir.</p></div><span className="boosters-stock">▣ {available} disponible{available > 1 ? 's' : ''}</span></header>
    <div className="booster-gallery" aria-label="Catalogue des boosters">
      {BOOSTERS.map(pack => <UIAction key={pack.id} className={`booster-choice ${selected === pack.id ? 'selected' : ''}`} aria-pressed={selected === pack.id} aria-label={`Sélectionner le booster ${pack.name}`} onClick={() => setSelected(pack.id)}>
        <span className="booster-spotlight" aria-hidden="true"><span className="booster-stage-ring"/><BoosterPack/></span>
        <span className="booster-choice-name">{pack.name}</span><small>{pack.set} · {pack.species} créatures</small>
      </UIAction>)}
    </div>
    <div className="booster-selection">
      <div className="booster-selection-heading"><div><span className="eyebrow">{booster.set}</span><h3>{booster.subtitle}</h3></div><UIAction className="booster-favorite-button" aria-pressed={favorite} onClick={() => onFavorite(favorite ? null : booster.id)} aria-label={favorite ? `Retirer ${booster.name} des favoris` : `Mettre ${booster.name} en favori`}><span aria-hidden="true">{favorite ? '★' : '☆'}</span>Favori</UIAction></div>
      <p>{booster.description}</p>
      <p className="booster-favorite-hint">{favorite ? 'Ce paquet est accessible en bas de la Machine.' : 'Choisissez votre favori pour le retrouver en bas de la Machine.'}</p>
      <div className="booster-page-actions"><UIAction variant="primary" className="ux-primary" disabled={!available || !!save.pending.length} onClick={() => onOpen(booster.id, 'free')}>Ouvrir un booster disponible <span>▣ {available}</span></UIAction><UIAction disabled={save.energy < price(save) || !!save.pending.length} onClick={() => onOpen(booster.id, 'paid')}>Acheter et ouvrir <span>{price(save).toLocaleString('fr-FR')} ✦</span></UIAction></div>
      <div className="booster-page-recharge"><span>{save.freeBoosters} / {save.freeBoosterCapacity} gratuits{save.account.rewardBoosters ? ` · +${save.account.rewardBoosters} de récompense` : ''}</span><span>{remaining === null ? 'Stockage plein' : `Prochain gratuit : ${countdown(remaining)}`}</span></div>
      <details className="booster-page-details"><summary>Contenu et probabilités</summary><p>Les doublons renforcent vos compagnons. Chaque booster contient cinq cartes ; sa cinquième carte est Peu commune ou mieux.</p>{[false, true].map(guaranteed => <p key={String(guaranteed)}>{guaranteed ? 'Carte 5' : 'Cartes 1–4'} : {rarityProbabilities(rareChance, guaranteed).map((chance, index) => `${RARITIES[index]} ${(chance * 100).toFixed(2)} %`).join(' · ')}</p>)}</details>
    </div>
  </section>;
}
