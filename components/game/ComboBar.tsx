import { Combo, comboFactor } from "../../lib/progression";
export default function ComboBar({ combo, bonus }: { combo: Combo; bonus: number }) {
  const tier = Math.floor(combo.charge / 25);
  return <div className={`combo-panel combo-tier-${tier}`}>
    <div><strong>COMBO · {tier === 4 ? "PORTAIL EN RÉSONANCE" : `PALIER ${tier}/4`}</strong><span>×{comboFactor(combo.charge, bonus).toFixed(2)} clic</span></div>
    <div className="combo-track" role="progressbar" aria-label="Combo de clic" aria-valuenow={Math.round(combo.charge)} aria-valuemin={0} aria-valuemax={100}><i style={{ width: `${combo.charge}%` }} /></div>
    <small>{bonus > 0 ? "Gardez le rythme · décroît après 1 seconde de pause · le passif reste constant." : "Débloquez le bonus avec Cadence du portail ou une carte de combo."}</small>
  </div>;
}
