import type { PackSource,Save } from "../../lib/game";
import { freePackCount } from "../../lib/exploration";
import {price} from "../../lib/game";
export function countdown(ms:number):string {const seconds=Math.ceil(ms/1000);return `${String(Math.floor(seconds/60)).padStart(2,"0")}:${String(seconds%60).padStart(2,"0")}`;}
export default function BoosterShop({save,ready,opening,remaining,onOpen}:{save:Save;ready:boolean;opening:boolean;remaining:number|null;onOpen:(source:PackSource)=>void}) {
 return <div className="booster-economy" aria-label="Boosters disponibles">
  <strong className="purchase-balance">Vos éclats : {Math.floor(save.energy).toLocaleString('fr-FR')} ✦</strong>
  <div className="free-pack-counter"><span>BOOSTERS DISPONIBLES</span><strong>{save.freeBoosters} / {save.freeBoosterCapacity}</strong>
   <div className="free-pack-dots" aria-hidden="true">{Array.from({length:save.freeBoosterCapacity},(_,i)=><i key={i} className={i<save.freeBoosters?"filled":""}/>)}</div>
   <small>{!ready?"Chargement…":remaining===null?"Stockage plein":`Prochain booster gratuit dans ${countdown(remaining)}`}</small>
   {save.account.rewardBoosters>0&&<p className="reward-reserve">+{save.account.rewardBoosters} booster(s) de récompense · hors stockage</p>}
  </div>
  <button className={`buy-button ${freePackCount(save)>0?"primary":"secondary"}`} disabled={!ready||opening||freePackCount(save)===0} onClick={()=>onOpen("free")}>Ouvrir un booster disponible<span>1 booster gratuit{save.account.rewardBoosters>0?" · récompense":""}</span></button>
  <div className="paid-pack-option"><small>OU ACHETER AVEC DES ÉCLATS</small>
   <p>Prochain booster : <strong>{price(save).toLocaleString("fr-FR")} ✦</strong></p>
   <button className={`buy-button ${freePackCount(save)===0?"primary":"secondary"}`} disabled={!ready||opening||save.energy<price(save)} onClick={()=>onOpen("paid")}>Acheter et ouvrir<span>{price(save).toLocaleString("fr-FR")} ✦</span></button>
   <div className="progress-track"><i style={{width:`${Math.min(100,save.energy/price(save)*100)}%`}}/></div>
   <small className="shop-hint">{save.energy<price(save)?`Encore ${Math.ceil(price(save)-save.energy).toLocaleString("fr-FR")} éclats`:`Rencontre disponible · ${save.paidBoostersPurchased} achats avec des éclats`}</small>
  </div>
 </div>;
}
