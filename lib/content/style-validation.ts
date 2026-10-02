import baseline from "../../design/phase4-sprite-baseline.json";
import { SAMPLE, designById } from "./roster";
import { contentPixels } from "./directed-sprites";
import type { CardDesign } from "./model";

export const PHASE4_BASELINE = baseline;
export function baselineHeadRatio(b:typeof baseline[number]):string {
  const width=(parts:string[])=>{
    const xs=b.paths.filter(p=>parts.includes(p.part)).flatMap(p=>[...p.d.matchAll(/M(\d+) \d+h(\d+)v1h-\d+z/g)].flatMap(m=>[Number(m[1]),Number(m[1])+Number(m[2])-1]));
    return xs.length?Math.max(...xs)-Math.min(...xs)+1:0;
  };
  const head=width(["head","face"]),body=width(["body"]);
  return head?`${(head/body).toFixed(2)} · tête/corps`:"Sans tête classique";
}
export const STYLE_NOTES: Record<string,string> = {
  "F01-001":"Petit bourgeon replié, tête dominante, yeux ronds et rebond bref.",
  "F01-002":"Corps plus étroit, longues pattes, petite tête en amande et museau.",
  "F01-003":"Arche sans visage, canopée désaxée, cœur suspendu et feuilles satellites.",
  "F01-005":"Tête plus grande, yeux très espacés, clin d’œil et museau de lapin.",
  "F01-010":"Pied court penché, yeux étroits sans bouche et spores descendantes.",
  "F01-023":"Profil bas tourné, tête large, regard espacé, museau et queue sinueuse.",
  "F01-026":"Lanterne suspendue, petite tête masquée, regard lumineux rapproché.",
  "F01-028":"Petit oiseau campé, grosse tête, œil de profil, bec et regard bref.",
  "F01-037":"Papillon compact, grosse tête douce, croissants fermés, ailes respirantes.",
  "F01-038":"Quatre ailes verticales, abdomen long, petite tête masquée et lumière asymétrique.",
  "F01-059":"Œil unique, mains détachées à hauteurs différentes, portique flottant.",
  "F01-060":"Voile dissymétrique sans visage, deux pointes libres, graine et ruban orbital.",
};
const byNumber=(n:string)=>designById(`F01-${n}`)!;
// Temporary directed studies are kept outside the roster and never drawn by boosters.
const fine:CardDesign={...byNumber("002"),id:"STUDY-THREAD",name:"Étude — fil sylvestre",
  sprite:{...byNumber("002").sprite!,posture:"standing",ears:"none",horns:"none",crown:"none",
    proportions:{head:.6,width:.3,height:1},face:{eyes:"single",spacing:0,mouth:"none",mask:false,asymmetric:false}}};
const round:CardDesign={...byNumber("001"),id:"STUDY-ROUND",name:"Étude — boule de mousse",
  sprite:{...byNumber("001").sprite!,ears:"none",crown:"none",tail:"none",accessory:"none",
    proportions:{head:.55,width:1.2,height:.9},face:{eyes:"round",spacing:8,mouth:"smile",mask:false,asymmetric:false}}};
const wide:CardDesign={...byNumber("038"),id:"STUDY-WIDE",name:"Étude — aile étendue",
  sprite:{...byNumber("038").sprite!,proportions:{head:.8,width:1,height:.5}}};
const high:CardDesign={...byNumber("059"),id:"STUDY-TOWER",name:"Étude — veilleur vertical",
  sprite:{...byNumber("059").sprite!,posture:"standing",proportions:{head:1,width:.55,height:1}}};
const tiny:CardDesign={...byNumber("001"),id:"STUDY-TINY",name:"Étude — petite pousse",
  sprite:{...byNumber("001").sprite!,proportions:{head:1.2,width:.4,height:.4}}};
export const EXTREME_STUDIES = [
  {label:"Très ronde · prototype",card:round}, {label:"Très fine · prototype",card:fine},
  {label:"Très large · prototype",card:wide}, {label:"Très haute · prototype",card:high},
  {label:"Très petite · prototype",card:tiny}, {label:"Très asymétrique",card:byNumber("060")},
  {label:"Sans visage classique",card:byNumber("003")}, {label:"Structure flottante",card:byNumber("059")},
];
export function headRatio(c:CardDesign):string {
  const p=contentPixels(c),head=p.filter(p=>p.part==="head"||p.part==="face"),body=p.filter(p=>p.part==="body");
  if(!head.length)return "Sans tête classique";
  const width=(a:typeof p)=>Math.max(...a.map(p=>p.x))-Math.min(...a.map(p=>p.x))+1;
  return `${(width(head)/width(body)).toFixed(2)} · tête/corps`;
}
export const STYLE_SAMPLE=SAMPLE;
