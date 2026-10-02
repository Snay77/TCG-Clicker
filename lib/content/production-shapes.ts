import type { Anatomy, CardDesign } from "./model";
import type { ContentPart } from "./directed-sprites";

export const PRODUCTION_VARIANTS: Partial<Record<Anatomy,string[]>> = {
  seed:["kernel"], rabbit:["runner"], flower:["bud","dancer","ceremony"],
  mushroom:["trumpets","orchestra"], beetle:["brooch","satchel","gardens","pollenShield","glassGuard","crumbCarrier"],
  cat:["kitten","prowler","dreamCushion"], frog:["dropFrog","waterWalker","lotusBasin"],
  salamander:["streamlet","riverSails"], firefly:["sparkPear","procession"], bird:["swallow","stainedFan"],
  serpent:["looseKnot","doubleRing","starBridge"], golem:["soilCube","planter","gardenWall"],
  canine:["foxling","emberWolf"], slug:["leafSlug","tripleDrop"], snail:["barkHouse"],
  fish:["bubbleFish","reedFish","pearlFish","cascadeDress"], bat:["echoBall","geodeWings"],
  whale:["mistWhale"], round:["mossBall"], spirit:["mistDrop","mistScarves","leafBell"], dragon:["auroraDragon"],
};
export type ShapePainter = {
  part:(p:ContentPart)=>void;
  box:(x:number,y:number,w:number,h:number,color:string)=>void;
  oval:(x:number,y:number,rx:number,ry:number,color:string)=>void;
  poly:(points:number[][],color:string)=>void;
  line:(x:number,y:number,u:number,v:number,color:string,w?:number)=>void;
  volume:(x:number,y:number,rx:number,ry:number,color?:string)=>void;
  head:(x:number,y:number,rx:number,ry:number,color?:string)=>void;
  leaf:(x:number,y:number,u:number,v:number)=>void;
  cut:(x:number,y:number,rx:number,ry:number)=>void;
  colors:string[];
};
type Anchor = {headX:number;headY:number;faceX:number;faceY:number};
// Each named recipe has its own composition. Stage never merely scales a sprite.
export function drawProduction(c:CardDesign,p:ShapePainter):Anchor {
  const {box,oval,poly,line,volume:v,head,leaf,cut,part}=p;
  const [ink,shade,mid,base,lit,light,white,blush]=p.colors;
  const b=c.sprite!.bodyVariant;
  let hx=30,hy=28,fy=26,fx=24;
  const legs=(xs:number[],top:number,end=56)=>xs.forEach(x=>{line(x,top,x-2,end,shade,3);box(x-4,end,7,2,lit);});
  const star=(x:number,y:number)=>{line(x-2,y,x+2,y,light);line(x,y-2,x,y+2,light);};
  const cap=(x:number,y:number,rx:number,ry:number)=>{
    part("head");v(x,y,rx,ry);oval(x,y+ry-2,rx-1,2,shade);
    for(const [dx,dy] of [[-6,-2],[0,-5],[7,0]])oval(x+dx,y+dy,2,2,light);
  };
  const petals=(x:number,y:number,large=false)=>{
    part("crown");for(const [dx,dy,rx,ry] of [[-12,0,8,6],[12,-2,8,7],[-7,-11,6,9],[5,-14,6,9],[0,9,8,5]])v(x+dx,y+dy,large?rx+2:rx,large?ry+1:ry);
    part("head");head(x,y,8,7,light);
  };
  switch(c.anatomy){
    case "seed":
      part("body");v(31,43,10,13);oval(31,47,6,7,light);oval(24,56,4,2,shade);oval(38,56,4,2,shade);
      part("head");head(31,35,8,7);hx=31;hy=35;fy=33;
      part("ears");leaf(24,29,15,9);leaf(36,27,42,5);
      part("crown");for(const x of [24,31,38])oval(x,28,2,2,blush);break;
    case "rabbit":
      part("body");poly([[15,39],[22,27],[38,32],[43,47],[30,52],[18,49]],shade);v(30,39,12,10);
      legs([21,37],46);line(18,43,7,51,shade,3);line(41,43,52,51,shade,3);
      part("tail");v(44,44,6,7,light);
      part("head");head(25,26,10,8);hx=25;hy=26;fy=24;
      part("ears");poly([[18,20],[11,5],[5,11],[13,25]],shade);poly([[29,19],[39,4],[45,10],[34,24]],base);line(11,9,19,21,blush,2);line(41,8,30,22,light,2);
      part("accessory");poly([[18,29],[46,40],[43,53],[30,47],[16,37]],mid);for(const x of [22,30,38])oval(x,37,2,2,blush);break;
    case "flower":
      part("body");
      if(b==="bud"){
        line(31,42,31,55,shade,3);leaf(29,51,14,47);leaf(34,52,47,47);
        part("head");v(31,32,12,15);line(31,18,31,39,shade);poly([[24,20],[27,13],[31,19],[35,13],[40,22]],light);hx=31;hy=32;fy=32;
      }else if(b==="dancer"){
        line(29,34,35,46,shade,4);line(35,46,29,56,shade,3);leaf(34,43,47,35);leaf(30,46,13,39);petals(29,25);hx=29;hy=25;fy=23;
      }else{
        line(31,25,36,44,shade,4);line(36,44,30,57,mid,4);leaf(32,50,7,45);leaf(35,48,58,39);
        petals(30,24,true);part("crown");v(9,31,5,8,light);v(54,18,5,9,light);line(32,43,53,29,lit,2);hx=30;hy=24;fy=23;
        part("aura");for(const [x,y] of [[7,15],[56,40],[20,56]])star(x,y);
      }break;
    case "mushroom":
      part("body");
      if(b==="trumpets"){
        line(26,29,30,54,light,7);line(41,31,32,52,light,5);legs([27,35],52);cap(20,22,14,9);cap(43,29,12,7);hx=30;hy=42;fy=42;
      }else{
        poly([[15,54],[23,29],[35,26],[46,54]],shade);v(31,45,12,12,light);cap(28,15,21,9);cap(45,31,13,7);cap(14,38,10,6);
        part("tail");line(25,52,10,59,mid,3);line(38,51,54,59,mid,3);hx=31;hy=45;fy=43;
      }
      part("accessory");poly([[21,35],[27,39],[32,35],[38,40],[43,36],[38,43],[24,41]],white);break;
    case "beetle":{
      const open=["gardens","glassGuard"].includes(b),square=b==="crumbCarrier";
      part("body");for(const side of [-1,1])for(const y of [35,43,50])line(32+side*8,y,32+side*(open?21:16),y+6,shade,2);
      if(square){box(17,29,29,24,shade);box(19,30,24,18,base);box(22,32,5,3,lit);}
      else if(b==="satchel"){poly([[32,19],[47,36],[42,52],[22,52],[16,36]],shade);poly([[32,22],[43,36],[39,47],[24,47],[21,36]],base);}
      else v(32,39,open?10:15,open?17:15);
      part("head");head(32,26,9,7);hx=32;hy=26;fy=24;
      part("ears");line(26,21,21,11,shade,2);line(38,21,44,11,shade,2);oval(22,11,3,2,light);oval(43,11,3,2,light);
      part("accessory");line(25,36,39,47,light);line(38,36,26,47,light);
      if(b==="satchel"){v(41,37,7,10,light);box(39,29,6,2,shade);}
      if(square){v(31,49,7,6,light);star(30,47);}
      if(open){
        part("wings");poly([[24,34],[10,11],[3,23],[6,46],[23,45]],shade);poly([[39,33],[53,9],[61,24],[56,46],[40,46]],shade);
        poly([[23,34],[10,17],[7,25],[10,40],[22,40]],base);poly([[40,34],[53,15],[57,25],[53,40],[41,40]],base);
        for(const x of [10,51]){line(x,20,x+3,36,light,2);if(b==="gardens"){part("crown");v(x+1,26,5,4,light);line(x+1,29,x+1,38,mid,2);}else{part("wings");poly([[x,24],[x+6,29],[x+1,34],[x-4,29]],light);}}
      }
      if(b==="pollenShield"){part("crown");poly([[23,17],[32,8],[42,18],[37,23],[28,23]],light);}
      break;
    }
    case "cat":
    case "canine":{
      const cat=c.anatomy==="cat",small=b==="kitten"||b==="foxling",cushion=b==="dreamCushion";
      part("tail");
      if(cat){oval(43,34,15,18,shade);oval(44,32,12,15,base);cut(46,27,10,11);line(43,50,52,43,light,3);}
      else {poly([[38,47],[50,38],[48,19],[57,12],[60,30],[56,47],[43,53]],shade);poly([[44,45],[54,33],[51,24],[56,20],[57,34],[51,45]],light);}
      part("body");
      if(cushion){oval(30,53,26,5,mid);oval(28,51,24,4,light);v(31,40,16,8);legs([20,40],43,49);hx=17;hy=34;fy=32;}
      else if(small){v(29,43,13,13);oval(28,47,8,7,light);oval(22,55,5,3,shade);oval(36,55,5,3,shade);hx=27;hy=29;fy=27;}
      else{v(33,37,16,8);legs([24,29,40,44],42);line(21,36,20,27,base,5);hx=18;hy=25;fy=23;}
      part("head");head(hx,hy,cat?11:10,9);part("ears");
      if(cat){oval(hx-7,hy-9,4,5,shade);oval(hx+8,hy-9,4,5,shade);oval(hx-7,hy-10,2,2,light);}
      else{poly([[hx-9,hy-5],[hx-11,hy-19],[hx-2,hy-9]],shade);poly([[hx+4,hy-9],[hx+12,hy-18],[hx+10,hy-3]],base);}
      part("accessory");poly([[hx-7,hy+7],[hx,hy+12],[hx+8,hy+6],[hx+3,hy+15]],light);
      if(b==="emberWolf"){part("crown");for(const x of [26,33,41])poly([[x,35],[x-3,22],[x+3,29],[x+5,23],[x+8,35]],lit);}
      break;
    }
    case "frog":{
      const walk=b==="waterWalker",basin=b==="lotusBasin";
      part("body");
      if(walk){v(31,35,8,13);legs([27,36],43);poly([[23,28],[10,43],[28,40]],mid);poly([[39,28],[53,43],[34,40]],mid);}
      else{v(31,42,basin?18:13,12);v(15,47,7,8);v(47,47,7,8);oval(30,46,10,7,light);}
      part("head");head(31,28,walk?10:15,8);hx=31;hy=28;fy=22;
      for(const x of walk?[25,37]:[20,43]){v(x,23,4,5,light);}
      part("crown");for(const [x,y] of [[24,15],[31,10],[39,14]]){oval(x,y,2,3,light);line(x,y+2,x,21,mid);}
      if(basin){part("tail");for(const [x,y] of [[9,53],[21,56],[40,56],[53,52]])poly([[31,57],[x,y-9],[x+5,y],[31,61]],mid);line(13,56,49,56,lit,2);}
      break;
    }
    case "salamander":
      part("body");
      if(b==="streamlet"){v(30,44,16,5);legs([20,40],46,53);part("tail");line(40,44,54,39,shade,5);line(54,39,57,29,mid,3);hx=15;hy=41;fy=39;}
      else{poly([[12,28],[25,24],[42,39],[47,47],[36,55],[23,50],[35,44],[23,33]],shade);poly([[14,28],[25,28],[38,41],[38,47],[30,50],[28,48],[35,43],[22,31]],base);hx=17;hy=27;fy=25;
        part("wings");poly([[28,33],[8,38],[6,53],[29,45]],mid);poly([[35,38],[55,27],[61,46],[43,47]],light);line(14,41,29,39,lit,2);}
      part("head");head(hx,hy,10,6);part("ears");for(const side of [-1,1])for(let i=0;i<3;i++){line(hx+side*7,hy,hx+side*(11+i),hy-8+i*6,blush,2);}break;
    case "firefly":
      part("wings");oval(21,28,6,11,light);oval(43,28,6,11,light);part("body");v(32,42,b==="procession"?7:10,13);line(32,32,32,53,shade);
      part("head");head(32,24,6,6);hx=32;hy=24;fy=22;part("ears");line(28,20,22,10,shade,2);line(36,20,42,10,shade,2);oval(22,10,2,2,light);oval(42,10,2,2,light);
      part("accessory");v(32,44,5,8,white);
      if(b==="procession"){for(const [x,y] of [[8,36],[52,32],[49,50]]){line(32,35,x,y,mid);v(x,y,4,6,light);}part("aura");star(10,20);star(54,12);}break;
    case "bird":
      part("tail");poly([[31,37],[42,53],[57,59],[47,59],[24,41]],shade);poly([[29,41],[30,60],[22,55],[20,39]],mid);
      part("body");v(29,34,8,12);hx=22;hy=23;fy=21;fx=18;part("head");head(hx,hy,8,6);
      part("wings");
      if(b==="swallow"){poly([[24,31],[10,15],[3,25],[21,40]],shade);poly([[32,31],[50,8],[60,15],[38,39]],base);line(40,25,54,14,light,2);}
      else{for(const side of [-1,1]){poly([[30,34],[32+side*24,8],[32+side*28,24],[32+side*21,43]],shade);for(let i=0;i<3;i++)poly([[32+side*6,32],[32+side*(15+i*4),13+i*4],[32+side*(20+i*3),24+i*5]],i%2?light:base);}}
      part("crown");poly([[20,17],[23,9],[27,17],[23,20]],light);part("accessory");line(18,31,34,36,light,3);break;
    case "serpent":{
      part("body");
      if(b==="looseKnot"){oval(32,43,17,12,shade);oval(32,41,14,10,base);cut(33,40,9,5);hx=19;hy=31;fy=29;}
      else if(b==="doubleRing"){line(23,52,39,43,shade,8);line(39,43,24,28,base,7);line(24,28,34,16,mid,6);hx=35;hy=18;fy=16;}
      else{for(let x=9;x<=53;x++)oval(x,30+Math.round((x-31)**2/80),4,4,base);hx=10;hy=35;fy=33;}
      part("head");head(hx,hy,8,6);part("accessory");oval(hx+8,hy+4,4,3,light);line(hx+7,hy+3,hx+12,hy+7,shade);
      if(b!=="looseKnot"){part("tail");for(const [x,y] of b==="doubleRing"?[[25,28],[34,47]]:[[16,41],[32,32],[49,41]]){oval(x,y,7,9,light);cut(x,y,4,6);}}
      break;
    }
    case "golem":{
      const wall=b==="gardenWall",soil=b==="soilCube";
      part("body");const x=wall?7:soil?20:21,y=wall?33:soil?31:19,w=wall?49:soil?25:23,h=wall?21:soil?22:34;
      box(x,y,w,h,shade);box(x+2,y+1,w-4,h-5,mid);box(x+3,y+2,w-9,h-9,base);box(x+4,y+3,w-13,3,lit);
      legs(wall?[14,46]:[25,39],y+h-2);for(const side of [-1,1]){line(32+side*(w/2),y+10,32+side*25,y+6,shade,3);line(32+side*25,y+6,32+side*28,y+1,mid,2);}
      part("head");hx=31;hy=y+8;fy=hy;box(27,y-2,9,7,light);
      part("crown");if(!soil){for(const cx of wall?[14,47]:[31]){box(cx-6,y-4,13,6,shade);leaf(cx,y-3,cx-7,y-13);leaf(cx,y-4,cx+8,y-12);}}
      part("accessory");if(!soil){box(25,y+20,16,6,light);line(27,y+21,38,y+21,shade);}break;
    }
    case "slug":
    case "snail":{
      part("body");v(33,48,21,6);oval(33,52,23,3,mid);hx=15;hy=41;fy=39;part("head");head(hx,hy,8,8);
      part("ears");line(11,35,7,25,shade,2);line(19,34,23,24,shade,2);oval(7,24,3,2,light);oval(24,23,3,2,light);
      if(c.anatomy==="snail"){
        part("crown");v(38,31,17,18);oval(38,31,11,12,light);oval(38,31,8,9,shade);oval(38,31,5,6,base);line(38,25,42,33,light,2);
        part("accessory");box(38,40,9,9,shade);box(40,41,5,6,light);poly([[26,14],[37,5],[52,18]],mid);box(30,9,4,6,light);
      }else if(b==="leafSlug"){part("crown");poly([[19,42],[35,25],[52,34],[46,45]],mid);line(25,41,45,33,light);}
      else{part("crown");for(const [x,y] of [[27,36],[39,30],[50,36]])v(x,y,6,9,light);}
      break;
    }
    case "fish":{
      const dress=b==="cascadeDress",pearl=b==="pearlFish",reed=b==="reedFish";
      part("body");if(dress){v(31,23,9,11);hx=28;hy=22;fy=20;fx=25;}
      else{v(28,35,reed?19:14,pearl?14:10);hx=18;hy=34;fy=32;fx=14;}
      part("head");head(hx,hy,dress?8:7,7,light);
      part("tail");
      if(dress){for(const [x,y,w] of [[30,35,17],[32,45,23],[29,54,27]]){poly([[31,y-8],[x-w,y+4],[x,y+1],[x+w,y+5],[31,y-3]],mid);line(x-w+3,y+3,x+w-3,y+3,light);}oval(47,52,5,5,light);cut(47,52,3,3);}
      else{poly([[40,33],[57,24],[51,35],[59,46],[40,39]],shade);poly([[43,34],[54,29],[48,35],[54,42],[43,38]],base);}
      if(reed){part("crown");for(const [x,y,u,vv] of [[23,26,19,8],[35,27,42,7]]){line(x,y,u,vv,mid,2);leaf(u,vv+6,u+7,vv);}}
      part("accessory");oval(dress?29:21,dress?11:23,4,4,light);oval(dress?28:20,dress?10:22,2,2,white);
      if(pearl){part("tail");v(23,46,6,5,light);v(40,28,5,5,light);}break;
    }
    case "bat":{
      const big=b==="geodeWings";part("wings");
      for(const side of [-1,1]){poly([[31+side*5,30],[32+side*(big?28:20),big?9:24],[32+side*24,43],[32+side*15,38],[31+side*5,47]],shade);poly([[31+side*7,31],[32+side*(big?24:15),big?15:29],[32+side*18,37],[32+side*9,39]],base);if(big){poly([[32+side*12,27],[32+side*21,21],[32+side*18,34]],light);}}
      part("body");v(32,39,10,13);part("head");head(32,29,9,8);hx=32;hy=29;fy=27;
      part("ears");v(22,15,big?5:4,big?13:9,light);v(42,15,big?5:4,big?13:9,light);oval(22,14,2,5,shade);oval(42,14,2,5,shade);
      part("accessory");poly([[25,43],[32,38],[39,43],[32,49]],light);star(32,43);break;
    }
    case "whale":
      part("body");v(28,32,24,12);oval(28,38,21,7,light);line(9,34,31,41,mid,2);hx=13;hy=29;fy=28;
      part("tail");poly([[46,32],[52,26],[55,18],[61,16],[59,29],[55,35],[49,38]],mid);poly([[52,31],[61,37],[60,45],[51,38]],base);
      v(19,49,9,4,light);v(44,46,8,4,light);
      part("crown");oval(20,19,4,4,light);part("aura");for(const [x,y] of [[7,50],[27,54],[54,53]])line(x,y,x+5,y,light);
      part("accessory");oval(34,21,8,4,light);oval(37,15,5,3,white);break;
    case "round":
      part("body");v(32,41,23,17);oval(31,49,16,8,light);part("head");hx=32;hy=33;fy=31;
      part("accessory");line(8,22,55,27,shade,3);leaf(22,23,18,11);leaf(43,25,52,15);break;
    case "spirit":
      part("body");
      if(b==="mistScarves"){
        for(const side of [-1,1])poly([[32+side*3,26],[32+side*20,38],[32+side*8,49],[32+side*19,56],[32+side*6,54],[32+side*1,44],[32+side*11,36]],side<0?base:mid);
        part("head");head(32,22,9,8,light);hx=32;hy=22;fy=20;
      }else if(b==="leafBell"){
        poly([[20,15],[40,15],[41,35],[50,45],[13,45],[21,33]],shade);poly([[23,17],[37,17],[38,34],[43,40],[19,40],[24,31]],base);
        part("accessory");leaf(32,43,30,56);part("head");hx=31;hy=26;fy=24;
      }else{poly([[32,13],[45,29],[43,44],[34,51],[27,42],[18,37],[21,24]],shade);v(31,29,12,14,light);hx=31;hy=28;fy=26;}
      part("accessory");oval(hx,hy+10,3,3,blush);poly([[hx-2,hy+10],[hx-12,hy+7],[hx-11,hy+16]],blush);poly([[hx+2,hy+10],[hx+13,hy+13],[hx+8,hy+18]],blush);break;
    case "dragon":
      part("tail");oval(41,46,16,11,shade);oval(41,45,13,9,base);cut(42,43,8,5);oval(55,37,4,5,light);cut(55,37,2,3);
      part("wings");poly([[30,33],[39,9],[50,3],[59,17],[46,25]],shade);poly([[32,33],[41,14],[50,8],[54,16],[45,20]],light);
      poly([[24,34],[9,12],[3,23],[14,37]],mid);poly([[22,33],[10,18],[8,24],[16,32]],light);
      part("body");v(30,39,9,14);oval(28,41,5,9,light);line(27,31,21,23,base,5);legs([25,35],48,55);
      part("head");head(18,20,9,6);hx=18;hy=20;fy=18;part("crown");line(13,15,12,7,light,2);line(22,15,26,8,light,2);
      part("aura");star(39,6);star(57,51);break;
    default:throw Error(`${c.id} : composition de production absente`);
  }
  return {headX:hx,headY:hy,faceX:fx,faceY:fy};
}
