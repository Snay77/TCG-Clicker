import {useState} from "react";
import {initialSave} from "../../lib/game";
import {SAVE_KEY,SAVE_BACKUP_KEYS} from "../../lib/save-storage";
export default function PlaytestReset(){
 const [confirm,setConfirm]=useState(false),[error,setError]=useState("");
 function reset(){try{const fresh=initialSave();localStorage.setItem(SAVE_KEY,JSON.stringify(fresh));for(const key of SAVE_BACKUP_KEYS)localStorage.removeItem(key);window.location.assign("/");}catch{setError("Réinitialisation impossible : le stockage du navigateur est inaccessible.");}}
 return <section id="playtest-reset" className="dev-reset" aria-label="Playtest — nouvelle partie"><h2>Playtest — nouvelle partie</h2><p>Contrôle réservé à l’atelier. Repartir de zéro efface la collection, le deck, l’énergie, les améliorations, les boosters et les copies de secours de ce navigateur.</p>
  {!confirm?<button onClick={()=>setConfirm(true)}>Réinitialiser complètement la sauvegarde</button>:<div className="dev-reset-confirm" role="alertdialog" aria-label="Confirmer la réinitialisation"><strong>Effacer toute la progression et commencer une nouvelle partie ?</strong><button onClick={reset}>Confirmer — tout réinitialiser</button><button onClick={()=>setConfirm(false)}>Annuler</button></div>}
  {error&&<p role="alert">{error}</p>}
 </section>;
}
