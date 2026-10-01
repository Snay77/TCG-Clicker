import Sprite from "./Sprite";
import { CARDS } from "../lib/cards";
export default function BoosterPack() {
  return (
    <div className="pack">
      <div className="pack-ridge" />
      <small>TCG CLICKER</small>
      <strong>FAERIE</strong>
      <span className="pack-subtitle">LES MURMURES DE LA FORÊT</span>
      <div className="pack-ornament" aria-hidden="true">
        ✧
      </div>
      <div className="pack-sprite">
        <Sprite creature={CARDS[0]} />
      </div>
      <span className="pack-seal">✦</span>
      <footer>
        SET 01 <span>5 CARTES</span>
      </footer>
      <div className="pack-ridge bottom" />
    </div>
  );
}
