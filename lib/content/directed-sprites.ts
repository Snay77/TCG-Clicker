import { mix } from "../sprites";
import { ANATOMIES, POSTURES, type Anatomy, type CardDesign, type FaceRecipe } from "./model";
import { PRODUCTION_VARIANTS, drawProduction } from "./production-shapes";

export const CONTENT_SPRITE_SIZE = 64;
export const IMPLEMENTED_ANATOMIES = Object.keys(ANATOMIES) as Anatomy[];
const BODY_VARIANTS: Partial<Record<Anatomy, string[]>> = {
  seed: ["bulb"], deer: ["slender"], treeGuardian: ["portalTree"], rabbit: ["seated"],
  mushroom: ["shortStem"], salamander: ["ribbon"], firefly: ["lantern"], bird: ["perched"],
  moth: ["moonWings", "oracle"], golem: ["gateFrame"], manta: ["openMantle"],
};
const HEAD_VARIANTS = ["round", "long", "wide", "small", "beaked", "orb", "cap", "portal", "seed"];
for (const [anatomy, variants] of Object.entries(PRODUCTION_VARIANTS)) BODY_VARIANTS[anatomy as Anatomy] = [...(BODY_VARIANTS[anatomy as Anatomy] || []), ...variants];
export const ANATOMY_FACE_RULES: Partial<Record<Anatomy,{eyes:FaceRecipe["eyes"][];mouths:FaceRecipe["mouth"][]}>> = {
  seed:{eyes:["round","almond","narrow"],mouths:["smile","none"]},
  deer:{eyes:["almond","narrow","single"],mouths:["muzzle","none"]},
  treeGuardian:{eyes:["none"],mouths:["none"]},
  rabbit:{eyes:["round","almond","narrow","crescent"],mouths:["muzzle","smile","none"]},
  mushroom:{eyes:["narrow","crescent","round"],mouths:["none","smile"]},
  salamander:{eyes:["almond","round","narrow"],mouths:["muzzle","none"]},
  firefly:{eyes:["round","luminous","narrow","single"],mouths:["none"]},
  bird:{eyes:["profile"],mouths:["beak"]},
  moth:{eyes:["round","crescent","luminous","almond"],mouths:["none"]},
  golem:{eyes:["round","single","luminous","none"],mouths:["none"]},
  manta:{eyes:["none"],mouths:["none"]},
  flower:{eyes:["round","luminous"],mouths:["smile","none"]},
  beetle:{eyes:["round","almond","narrow","luminous"],mouths:["none"]},
  cat:{eyes:["crescent","almond"],mouths:["muzzle"]},
  frog:{eyes:["round","almond","luminous"],mouths:["smile","none"]},
  serpent:{eyes:["round","almond","luminous"],mouths:["smile","none"]},
  canine:{eyes:["round","narrow"],mouths:["muzzle"]},
  slug:{eyes:["round","almond"],mouths:["smile","none"]},
  snail:{eyes:["round"],mouths:["smile"]},
  fish:{eyes:["profile","crescent"],mouths:["none","smile"]},
  bat:{eyes:["round","luminous"],mouths:["none"]},
  whale:{eyes:["crescent"],mouths:["none"]},
  round:{eyes:["round"],mouths:["smile"]},
  spirit:{eyes:["crescent"],mouths:["none"]},
  dragon:{eyes:["almond"],mouths:["muzzle"]},
};
export const CONTENT_PARTS = ["tail", "wings", "body", "head", "ears", "crown", "face", "accessory", "aura"] as const;
export type ContentPart = typeof CONTENT_PARTS[number];
export type ContentPixel = { x: number; y: number; color: string; part: ContentPart };
export function contentPalette(c: CardDesign): string[] {
  return [mix(c.palette.secondary, "#17233e", 0.6), c.palette.secondary,
    mix(c.palette.primary, c.palette.secondary, 0.45), c.palette.primary,
    mix(c.palette.primary, c.palette.light, 0.5), c.palette.light, "#fff8e8", "#ef9da9"];
}
// Integer raster primitives are shared between directed components, never randomized anatomy.
export function contentPixels(c: CardDesign, seed = c.seed): ContentPixel[] {
  const r = c.sprite;
  if (!r || !IMPLEMENTED_ANATOMIES.includes(c.anatomy)) throw Error(`${c.id} : anatomie non produite`);
  if (!BODY_VARIANTS[c.anatomy]?.includes(r.bodyVariant) || !HEAD_VARIANTS.includes(r.headVariant))
    throw Error(`${c.id} : variante non produite`);
  const rules=ANATOMY_FACE_RULES[c.anatomy];
  if(!r.face||!rules?.eyes.includes(r.face.eyes)||!rules.mouths.includes(r.face.mouth))
    throw Error(`${c.id} : visage incompatible avec l'anatomie`);
  if(!POSTURES[r.posture]||!r.proportions||Object.values(r.proportions).some(v=>!Number.isFinite(v)||v<=0||v>1.6))
    throw Error(`${c.id} : posture ou proportions invalides`);
  const [ink, shade, mid, base, lit, light, white, blush] = contentPalette(c);
  const grid = new Map<string, ContentPixel>();
  let part: ContentPart = "body";
  const put = (x: number, y: number, color: string) => {
    x = Math.round(x); y = Math.round(y);
    if (x >= 2 && x <= 61 && y >= 2 && y <= 61) grid.set(`${x},${y}`, { x, y, color, part });
  };
  const box = (x: number, y: number, w: number, h: number, color: string) => {
    for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) put(i, j, color);
  };
  const oval = (cx: number, cy: number, rx: number, ry: number, color: string) => {
    for (let y = Math.floor(cy - ry); y <= cy + ry; y++) for (let x = Math.floor(cx - rx); x <= cx + rx; x++)
      if (((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1) put(x, y, color);
  };
  const poly = (points: number[][], color: string) => {
    const xs = points.map(p => p[0]), ys = points.map(p => p[1]);
    for (let y = Math.min(...ys); y <= Math.max(...ys); y++) for (let x = Math.min(...xs); x <= Math.max(...xs); x++) {
      let inside = false;
      for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
        const [a, b] = points[i], [u, v] = points[j];
        if ((b > y) !== (v > y) && x < (u - a) * (y - b) / (v - b) + a) inside = !inside;
      }
      if (inside) put(x, y, color);
    }
  };
  const line = (x: number, y: number, u: number, v: number, color: string, w = 1) => {
    const steps = Math.max(Math.abs(u - x), Math.abs(v - y));
    for (let i = 0; i <= steps; i++) box(Math.round(x + (u - x) * i / (steps || 1)), Math.round(y + (v - y) * i / (steps || 1)), w, w, color);
  };
  const cutOval = (cx: number, cy: number, rx: number, ry: number) => {
    for (const [key, p] of grid) if (((p.x - cx) / rx) ** 2 + ((p.y - cy) / ry) ** 2 < 1) grid.delete(key);
  };
  const volume = (x: number, y: number, rx: number, ry: number, color = base) => {
    oval(x, y, rx, ry, shade); oval(x - 1, y - 1, rx - 1, ry - 1, mid);
    oval(x - 2, y - 2, Math.max(1, rx - 2), Math.max(1, ry - 2), color);
    // A lower-right shadow pocket opposes the upper-left highlight.
    oval(x + rx*.35, y + ry*.25, Math.max(1,rx*.4), Math.max(1,ry*.35), mid);
    oval(x - 3, y - ry + 3, Math.max(2, rx / 2), 2, lit);
  };
  const headVolume = (x: number, y: number, rx: number, ry: number, color = base) => {
    // Recipe controls head proportions independently of the body's anatomy.
    const [dx, dy] = r.headVariant === "long" ? [-1, 2] : r.headVariant === "wide" ? [1, -1]
      : r.headVariant === "small" ? [-1, -1] : [0, 0];
    volume(x, y, (rx + dx) * r.proportions.head, (ry + dy) * r.proportions.head, color);
  };
  const leaf = (x: number, y: number, u: number, v: number) => {
    poly([[x,y],[x-5,y-5],[u,v],[x+6,y-2]], shade);
    poly([[x,y-1],[x-3,y-5],[u,v],[x+4,y-2]], base); line(x,y,u,v,lit);
  };
  let faceX = 24, faceY = 29, gap = 11;
  let headX = 30, headY = 29;
  if (PRODUCTION_VARIANTS[c.anatomy]?.includes(r.bodyVariant)) {
    ({headX,headY,faceX,faceY}=drawProduction(c,{part:p=>{part=p;},box,oval,poly,line,volume,head:headVolume,leaf,cut:cutOval,colors:[ink,shade,mid,base,lit,light,white,blush]}));
  } else switch (c.anatomy) {
    case "seed":
      part = "body";
      oval(22,55,5,3,shade); oval(40,55,5,3,shade);
      poly([[17,45],[18,29],[29,22],[41,28],[46,44],[39,53],[25,55]],shade);
      volume(31,41,14,13); oval(30,45,9,7,light);
      part = "head"; headVolume(29,32,12,10);
      faceX=21; faceY=30; gap=11; headX=29; headY=29;
      break;
    case "deer":
      part="body";
      for (const [x,y,end] of [[23,44,19],[29,45,28],[41,44,45],[36,46,37]]) line(x,y,end,57,shade,3);
      volume(34,40,14,8); line(23,40,22,25,mid,6); oval(22,33,4,10,light);
      part="head"; headVolume(21,23,10,8); oval(16,26,5,4,light);
      faceX=14; faceY=22; gap=10; headX=22; headY=22;
      break;
    case "treeGuardian":
      part="body";
      poly([[18,55],[22,40],[19,23],[25,20],[32,29],[40,20],[46,25],[42,41],[48,55]],shade);
      poly([[23,53],[27,37],[23,25],[27,24],[33,34],[41,25],[42,27],[38,42],[43,53]],base);
      line(24,43,23,55,lit,2); line(39,39,40,53,mid,2);
      cutOval(33,36,7,11);
      line(20,37,9,28,shade,3);line(21,37,11,28,lit);
      line(43,32,54,25,shade,2);
      part="head"; faceX=28;faceY=31;gap=7;headX=32;headY=24;
      break;
    case "rabbit":
      part="body";
      oval(20,55,7,4,shade); oval(41,55,7,4,shade); volume(31,43,13,13);
      oval(30,46,8,8,light); oval(19,44,4,7,base); oval(44,44,4,7,base);
      part="head"; headVolume(30,29,13,10);
      faceX=22;faceY=27;gap=11;headX=30;headY=27;
      break;
    case "mushroom":
      part="body";
      oval(24,56,5,3,shade);oval(39,56,5,3,shade);volume(31,43,10,12,light);
      poly([[23,38],[15,43],[17,46],[26,42]],mid);poly([[39,37],[49,42],[47,45],[36,42]],mid);
      part="head";
      poly([[6,28],[10,18],[22,9],[34,7],[49,16],[57,28],[51,33],[12,33]],shade);
      oval(31,23,23,10,mid);oval(29,20,21,10,base);oval(23,14,10,3,lit);
      for(const [x,y,w] of [[17,21,4],[33,13,3],[45,24,4]]) oval(x,y,w,3,light);
      for(let i=0;i<7;i++)line(14+i*5,29,19+i*4,33,light);
      faceX=24;faceY=40;gap=10;headX=30;headY=22;
      break;
    case "salamander":
      part="body";
      volume(30,44,19,7);oval(28,45,15,4,light);
      for(const [x,u] of [[15,10],[24,20],[40,45],[48,53]]){line(x,45,u,54,mid,3);box(u-2,54,6,2,lit);}
      part="head";headVolume(15,38,11,8);oval(13,43,8,3,light);
      faceX=7;faceY=36;gap=11;headX=15;headY=36;
      break;
    case "firefly":
      part="wings";
      oval(17,29,10,17,shade);oval(47,30,10,16,shade);
      oval(17,27,8,14,light);oval(46,28,8,13,light);
      line(15,16,28,38,lit,2);line(49,19,37,37,lit,2);
      part="body";
      volume(32,42,12,16);oval(32,45,8,10,light);
      for(const y of [34,40,47,53])line(25,y,39,y,shade);
      line(21,38,16,43,shade,2);line(43,38,48,43,shade,2);
      part="head";headVolume(32,24,7,7,mid);
      faceX=27;faceY=22;gap=7;headX=32;headY=22;
      break;
    case "bird":
      part="wings";
      poly([[33,37],[40,15],[51,11],[49,29],[43,39]],shade);
      poly([[35,33],[42,18],[48,15],[46,27],[40,36]],base);
      line(42,21,38,34,light,2);
      part="body";volume(29,39,12,12);oval(25,40,7,8,light);
      line(24,49,23,55,shade,2);line(34,49,37,55,shade,2);
      line(19,56,26,56,light);line(34,56,42,56,light);
      part="head";headVolume(22,24,11,10);poly([[13,24],[6,27],[14,30]],light);
      faceX=17;faceY=22;gap=0;headX=22;headY=23;
      break;
    case "moth": {
      const oracle = r.bodyVariant === "oracle";
      part="wings";
      if(oracle){
        poly([[28,25],[16,5],[6,12],[9,38],[16,52],[26,42]],shade);
        poly([[36,24],[48,4],[58,12],[56,37],[48,53],[38,44]],shade);
        poly([[27,27],[15,10],[10,14],[13,35],[18,44],[25,36]],base);
        poly([[37,26],[49,9],[54,14],[52,34],[47,45],[39,36]],base);
        poly([[27,37],[17,41],[11,56],[22,58],[30,46]],mid);
        poly([[38,37],[48,41],[55,56],[44,58],[34,46]],mid);
        for(const [x,y] of [[17,25],[47,25],[21,50],[45,50]]){oval(x,y,5,6,light);oval(x,y,3,4,shade);oval(x-1,y-1,1,2,white);}
      }else{
        oval(17,28,13,15,shade);oval(48,27,12,15,shade);
        oval(17,26,11,13,base);oval(48,25,10,13,base);
        oval(20,44,9,10,mid);oval(44,44,9,10,mid);
        oval(15,24,5,7,light);oval(18,22,4,6,base);
        oval(49,23,5,7,light);oval(52,21,4,6,base);
      }
      part="body";volume(32,39,oracle?4:6,oracle?17:11);for(const y of [36,41,46])box(29,y,6,1,light);
      part="head";headVolume(32,27,8,8);faceX=26;faceY=25;gap=8;headX=32;headY=26;
      break;
    }
    case "golem":
      if(r.bodyVariant!=="gateFrame")throw Error("La forme jardinière reste à produire");
      part="body";
      box(18,16,28,37,shade);box(20,17,24,34,mid);box(21,18,20,32,base);
      for(let y=24;y<45;y++)for(let x=26;x<39;x++)grid.delete(`${x},${y}`);
      box(13,52,12,6,shade);box(40,52,12,6,shade);box(14,52,8,2,lit);box(41,52,8,2,lit);
      box(4,35,8,12,shade);box(5,36,5,8,base);box(52,20,8,16,shade);box(53,21,5,11,base);
      for(const y of [20,47])box(21,y,19,2,light);
      part="head";headVolume(32,32,6,6,light);faceX=30;faceY=29;gap=0;headX=32;headY=32;
      break;
    case "manta":
      part="wings";
      poly([[31,22],[9,3],[3,18],[9,35],[25,48],[34,40],[50,45],[61,28],[59,13],[44,23]],shade);
      poly([[29,26],[11,7],[7,18],[14,32],[29,41],[34,34],[49,39],[57,28],[56,18],[39,29]],base);
      line(11,10,22,32,light,2);line(56,21,45,32,light,2);
      poly([[43,23],[50,9],[54,3],[57,5],[51,19]],lit);
      poly([[10,32],[5,40],[3,48],[7,47],[17,36]],light);
      poly([[7,24],[18,34],[26,39],[17,42],[10,36]],mid);
      poly([[45,34],[56,24],[54,37],[49,44],[39,43]],lit);
      part="body";
      oval(32,33,10,11,shade);oval(32,32,8,9,base);cutOval(32,31,4,6);
      part="head";faceX=29;faceY=30;gap=5;headX=32;headY=31;
      break;
    default: throw Error(`${c.anatomy} : anatomie planifiée, pas de sprite de substitution`);
  }

  part="tail";
  switch(r.tail){
    case "sprig": leaf(44,46,55,31);break;
    case "leaf": leaf(45,42,57,29);break;
    case "roots":
      for(const [x,u,y] of [[24,8,56],[28,19,60],[36,47,60],[42,57,55]]){line(x,49,u,y,shade,3);line(x,50,u,y,lit);}
      break;
    case "pom":volume(47,48,6,6,light);break;
    case "ribbon":
      poly([[43,44],[51,43],[57,33],[55,24],[49,19],[54,20],[60,27],[61,38],[54,47],[43,49]],shade);
      line(48,44,56,37,lit,2);line(56,37,58,29,lit,2);break;
    case "forked":
      poly([[33,43],[47,49],[58,57],[49,57],[28,47]],shade);
      poly([[30,45],[42,54],[44,61],[36,58],[25,47]],mid);line(35,46,51,55,light,2);break;
    case "mobius":
      oval(40,49,15,9,shade);oval(40,48,13,7,base);cutOval(40,47,8,4);
      line(32,43,47,55,light,2);line(49,52,54,44,lit,2);break;
    case "none":break;
  }
  part="ears";
  switch(r.ears){
    case "leaf":leaf(headX-8,headY-2,headX-18,headY-12);leaf(headX+8,headY-2,headX+20,headY-12);break;
    case "long":
      poly([[19,24],[16,5],[20,3],[28,21]],shade);poly([[22,21],[19,8],[21,7],[25,20]],blush);
      poly([[33,21],[39,5],[44,9],[41,24]],shade);poly([[36,21],[40,10],[42,11],[39,21]],light);break;
    case "gills":
      for(const [x,y,u,v] of [[8,34,3,24],[14,31,11,20],[20,33,24,24],[10,43,4,46],[16,45,13,52],[22,44,27,50]]){line(x,y,u,v,shade,2);line(x,y,u,v,blush);oval(u,v,2,2,blush);}
      break;
    case "antennae":
      line(headX-4,headY-5,headX-10,headY-15,mid,2);line(headX+4,headY-5,headX+10,headY-16,mid,2);
      oval(headX-10,headY-15,2,2,light);oval(headX+10,headY-16,2,2,light);break;
    case "none":break;
  }
  part="crown";
  if(r.horns==="branch"){
    for(const sign of [-1,1]){line(headX+sign*5,headY-6,headX+sign*12,6,shade,2);line(headX+sign*10,11,headX+sign*20,8,shade,2);leaf(headX+sign*12,9,headX+sign*16,3);}
  }
  switch(r.crown){
    case "splitLeaf":line(29,24,29,14,shade,2);leaf(29,16,17,4);leaf(30,16,43,3);break;
    case "buds":for(const [x,y] of [[headX-12,8],[headX+12,7],[headX,headY-10]])oval(x,y,3,2,blush);break;
    case "canopy":
      for(const [x,y,rx,ry] of [[15,12,12,7],[29,7,12,5],[48,20,12,9],[10,21,7,5],[55,28,5,4]])volume(x,y,rx,ry);
      oval(29,10,3,3,light);break;
    case "crest":poly([[20,16],[26,7],[28,13],[30,8],[32,19]],light);break;
    case "clockHands":line(29,15,23,7,light,2);line(31,14,33,3,light,2);line(34,15,43,6,light,2);box(27,13,11,3,shade);break;
    case "scallopCap": // Scallops belong to the directed cap's fixed outline.
      for(const x of [10,19,29,39,50])oval(x,30,3,2,mid);break;
    case "none":break;
  }
  part="accessory";
  switch(r.accessory){
    case "leafScarf":poly([[headX-10,headY+8],[headX,headY+12],[headX+11,headY+7],[headX+5,headY+16]],light);break;
    case "ruff":poly([[20,34],[25,36],[29,33],[33,37],[39,34],[42,36],[33,40],[23,39]],white);break;
    case "lantern":oval(32,47,6,7,white);line(32,40,32,54,light);break;
    case "scarf":poly([[13,31],[27,34],[29,38],[17,35],[12,40],[9,36]],light);break;
    case "medallion":oval(32,37,3,3,light);oval(32,36,1,1,white);break;
    case "pendulum":line(32,39,32,45,light);box(29,45,7,4,light);break;
    case "seedCore":
      if(c.anatomy==="manta"){oval(32,31,2,4,light);box(31,27,2,2,white);}
      else {oval(33,36,3,4,light);box(32,33,2,2,white);}break;
    case "none":break;
  }
  part="face";
  const f=r.face;
  gap=f.spacing;
  // Anatomy sets the facial anchor; the authored recipe sets every expression.
  if(f.eyes!=="profile" && f.eyes!=="single")faceX=Math.round(headX-gap/2-2);
  if(f.mask){oval(headX,faceY+2,Math.max(6,gap/2+5),5,shade);line(headX-5,faceY-2,headX+5,faceY-2,light);}
  const eye = (x:number,y:number,second=false) => {
    if(f.eyes==="none")return;
    if(f.asymmetric&&second){line(x,y+2,x+3,y+1,ink,1);return;}
    switch(f.eyes){
      case "crescent":line(x,y+1,x+1,y+2,ink);line(x+1,y+2,x+3,y,ink);break;
      case "narrow":box(x,y+2,4,1,ink);box(x+1,y+1,2,1,ink);break;
      case "almond":poly([[x-1,y+2],[x+2,y],[x+4,y+2],[x+2,y+4]],ink);box(x+1,y+1,1,1,white);break;
      case "round":oval(x+2,y+2,3,3,ink);box(x,y,2,2,white);break;
      case "luminous":oval(x+1,y+2,3,3,light);box(x+1,y,1,4,white);break;
      case "single":oval(headX,faceY+2,4,5,ink);oval(headX,faceY+2,2,3,light);box(headX-1,faceY,1,2,white);break;
      case "profile":oval(x+1,y+2,2,3,ink);box(x,y,1,1,white);break;
    }
  };
  eye(faceX,faceY);if(!["single","profile","none"].includes(f.eyes))eye(faceX+gap,faceY,true);
  if(f.mouth==="smile"){line(headX-3,faceY+8,headX,faceY+9,ink);line(headX,faceY+9,headX+3,faceY+8,ink);}
  if(f.mouth==="muzzle"){oval(headX,faceY+7,5,3,light);box(headX-1,faceY+5,3,2,ink);line(headX,faceY+7,headX,faceY+9,shade);}
  if(f.mouth==="beak"){poly([[headX-8,faceY+3],[headX-17,faceY+5],[headX-8,faceY+7]],light);line(headX-15,faceY+5,headX-9,faceY+5,shade);}
  part="aura";
  if(r.aura==="foldOrbit"){
    for(const [x,y] of [[6,45],[53,5],[19,55]]){line(x-2,y,x+2,y,light);line(x,y-2,x,y+2,light);}
  }else if(r.aura==="moonHalo"){box(9,7,2,2,light);box(55,47,2,2,light);}
  else if(r.aura==="rootPulse"){
    line(12,58,19,58,light);line(46,58,53,58,light);
    leaf(8,35,4,29);leaf(53,8,58,3);box(56,39,2,2,light);
  }
  else if(r.aura==="firelight"){box(12,49,2,2,light);box(51,47,2,2,light);}
  else if(r.aura==="clockHalo"){
    for(const [x,y] of [[5,17],[11,12],[16,9],[48,51],[55,47],[59,40]])box(x,y,2,2,light);
  }
  if(r.idle==="sporeFall")for(const [x,y] of [[10,38],[48,43],[16,51]]){oval(x,y,1,1,light);}

  // Directed proportions and posture are rasterized before marks and outline.
  // This keeps a crisp pixel grid and makes seed incapable of changing shape.
  const posed=new Map<string,ContentPixel>();
  for(const p of grid.values()){
    const lean=r.posture==="leaning"?.11:r.posture==="turned"?-.08:0;
    const lift=r.posture==="floating"?3:r.posture==="suspended"?6:0;
    const x=Math.round(32+(p.x-32)*r.proportions.width+lean*(57-p.y));
    const y=Math.round(58+(p.y-58)*r.proportions.height-lift);
    if(x>=1&&x<=62&&y>=1&&y<=62)posed.set(`${x},${y}`,{...p,x,y});
  }
  grid.clear();for(const [key,p] of posed)grid.set(key,p);

  // Optional wings are a real component slot. No hidden anatomy substitution.
  if(r.wings==="none") for(const [key,p] of grid) if(p.part==="wings")grid.delete(key);

  // Only recolor existing body/wing pixels. Seed cannot move ears, limbs, eyes or outline.
  const candidates=[...grid.values()].filter(p=>(p.color===base||p.color===light) && ["body","wings","tail"].includes(p.part));
  let n=seed>>>0;
  for(let i=0;i<18 && candidates.length;i++){
    n=(Math.imul(n,1664525)+1013904223)>>>0;
    const p=candidates[n%candidates.length];part=p.part;put(p.x,p.y,r.markings==="runes"||r.markings==="constellations"?light:lit);
  }
  const outline=new Map<string,ContentPixel>();
  for(const p of grid.values())for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
    const x=p.x+dx,y=p.y+dy,key=`${x},${y}`;
    if(!grid.has(key)&&x>=0&&x<64&&y>=0&&y<64)outline.set(key,{x,y,color:ink,part:p.part});
  }
  return [...outline.values(),...grid.values()];
}
export function contentPaths(c: CardDesign, seed=c.seed) {
  const groups=new Map<string,{part:ContentPart;color:string;d:string}>();
  for(const p of contentPixels(c,seed)){
    const key=p.part+p.color,g=groups.get(key)||{part:p.part,color:p.color,d:""};
    g.d+=`M${p.x} ${p.y}h1v1h-1z`;groups.set(key,g);
  }
  return [...groups.values()];
}
export const usedContentPalette=(c:CardDesign,seed=c.seed)=>[...new Set(contentPixels(c,seed).map(p=>p.color))];
