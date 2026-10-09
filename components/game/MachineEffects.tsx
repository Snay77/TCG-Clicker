import { advancedRows, type AdvancedContext } from '../../lib/advanced-effects';
import type { Save } from '../../lib/game';
import { describeUIEffect as describeEffect } from '../../lib/effects';

export function machineEffectRows(save:Save,context:AdvancedContext) {
 return advancedRows(save,context).filter(row=>row.remaining>0||row.ready||row.kind==='nextClick'&&row.maximum>0&&row.progress>=Math.ceil(row.maximum/2))
  .sort((a,b)=>Number(b.remaining>0)-Number(a.remaining>0)||Number(b.ready)-Number(a.ready)).slice(0,3);
}
export default function MachineEffects({save,context}:{save:Save;context:AdvancedContext}) {
 const rows=machineEffectRows(save,context);
 if(!rows.length)return null;
 return <section className="machine-effects" aria-label="Effets de la Machine"><h3>EFFETS</h3>
  {rows.map(row=><div className="machine-effect-row" key={row.id}>
   <strong>{row.name}</strong><span>{row.remaining>0?describeEffect(row.bonus!):row.ready?row.status:`${row.progress} / ${row.maximum}`}</span>
   {row.remaining>0&&<><small aria-label={`Effet actif, ${row.status} restantes`}>ACTIF · {row.status}</small><progress aria-label={`Durée de ${row.name}`} max={row.maximum} value={row.remaining}/></>}
  </div>)}
 </section>;
}
