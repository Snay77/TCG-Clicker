import type { PackSource, Save } from '../../lib/game';
import { price, rarityProbabilities } from '../../lib/game';
import { freePackCount } from '../../lib/exploration';
import { RARITIES } from '../../lib/cards';
import { countdown } from './BoosterShop';
import BottomSheet from './BottomSheet';
import { useState } from 'react';
import BoosterThumbnail from './BoosterThumbnail';
import { favoriteBooster } from '../../lib/boosters';
export default function MobileBooster({ save, remaining, onOpen, rareChance, onBrowse }: { save: Save; remaining: number | null; onOpen: (source: PackSource) => void; rareChance: number; onBrowse: () => void }) {
  const [details, setDetails] = useState(false), count = freePackCount(save);
  const favorite = favoriteBooster(save.ux.favoriteBooster);
  if (!favorite) return <div className="mobile-booster no-booster-favorite"><button className="choose-favorite" aria-label="Choisir un booster favori" onClick={onBrowse}><span aria-hidden="true">☆</span><span><strong>Choisir un booster favori</strong><small>Retrouvez son paquet ici, près du portail.</small></span><span aria-hidden="true">→</span></button></div>;
  return <div className="mobile-booster">
    <div className="mobile-booster-heading"><button className="favorite-booster-link" onClick={onBrowse} aria-label="Choisir un booster"><BoosterThumbnail/><span><strong>★ {favorite.name}</strong><small>{save.freeBoosters} / {save.freeBoosterCapacity} gratuits{save.account.rewardBoosters ? ` · +${save.account.rewardBoosters} récompense(s)` : ''} · {remaining === null ? 'Stockage plein' : `Prochain : ${countdown(remaining)}`}</small></span></button><button onClick={() => setDetails(true)}>Détails</button></div>
    <div className="mobile-booster-actions"><button className="ux-primary" disabled={!count} onClick={() => onOpen('free')}>Ouvrir · {count}</button><button disabled={save.energy < price(save)} onClick={() => onOpen('paid')}>Acheter · {price(save).toLocaleString('fr-FR')} ✦</button></div>
    {details && <BottomSheet title="Booster Faerie" onClose={() => setDetails(false)}><p>Cinq cartes, une Peu commune ou mieux garantie. Les doublons conservent leurs règles actuelles.</p>{[false, true].map(guaranteed => <p key={String(guaranteed)}>{guaranteed ? 'Carte 5' : 'Cartes 1–4'} : {rarityProbabilities(rareChance, guaranteed).map((p, i) => `${RARITIES[i]} ${(p * 100).toFixed(1)} %`).join(' · ')}</p>)}<p>Recharge gratuite toutes les dix minutes. Les boosters de récompense restent hors stockage.</p></BottomSheet>}
  </div>;
}
