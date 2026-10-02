import { memo, useId } from "react";
import { habitatDetails } from "../../lib/content/habitats";
import type { HabitatId } from "../../lib/content/model";
function ContentHabitat({ habitat, seed, signature = false }: { habitat: HabitatId; seed: number; signature?: boolean }) {
  const uid=useId(), profile=habitatDetails(habitat,seed);
  const {motif,variant,sky,horizon,ground,glow,points}=profile;
  return <svg className={`content-habitat scenery-${habitat}`} viewBox="0 0 160 160" preserveAspectRatio="xMidYMid slice" shapeRendering="crispEdges" aria-hidden="true">
    <defs><linearGradient id={uid} x2="0" y2="1"><stop stopColor={sky}/><stop offset="1" stopColor={horizon}/></linearGradient></defs>
    <path d="M0 0h160v160H0z" fill={`url(#${uid})`} />
    <path d="M0 102 28 77 57 92 84 71 126 91 160 75v85H0z" fill={ground} opacity=".55" />
    {motif==="trees" && <g fill={ground}>
      {(variant===2?[0,132]:variant===1?[5,24,49,118,145]:[7,140]).map((x,i)=><g key={x}>
        <path d={`M${x} 0h${variant===2?28:8}v140h-${variant===2?28:8}z`} />
        <path d={`M${x} ${40+i*9}l-12-12v-8l21 12 18-19v9l-18 22z`} />
      </g>)}
      {variant===2 && <path d="M0 0h160v16h-22v14h-14V16H38v15H21V17H0zM0 142l29-21 16 17 14-9 9 18h-68zM160 140l-25-17-23 12-13-4-9 16h70z" />}
    </g>}
    {motif==="flowers" && <g>
      <circle cx="117" cy="38" r="23" fill={glow} opacity=".3" />
      {points.map((p,i)=><g key={i} transform={`translate(${p.x*1.6} ${109+i%3*12})`}>
        <path d="M0 0v17h2V0z" fill={ground}/><path d="M-5-2h12v5H-5zM-2-5h5v11h-5z" fill={i%2?glow:horizon}/><rect width="3" height="3" fill="#fff0c5"/>
      </g>)}
      {variant===1 && <g fill={ground}><path d="M9 15h8v122H9zM142 19h7v118h-7z"/><path d="M0 12h48v18H0zM119 6h41v29h-41z"/></g>}
    </g>}
    {motif==="water" && <g>
      {variant===2 && <><path d="M0 0h52v129H0zM113 0h47v129h-47z" fill={ground}/><path d="M61 0h39v124H61z" fill={glow} opacity=".4"/><path d="M66 0h5v118h-5zM83 0h8v127h-8z" fill={glow} opacity=".45"/></>}
      <path d={variant===0?"M131 66 99 88 118 103 74 126 79 160h48l-29-30 35-19-14-23 28-11z":"M0 128Q80 99 160 125v35H0z"} fill={horizon}/>
      {[128,137,146].map((y,i)=><path key={y} d={`M${24+i*9} ${y}h${97-i*13}`} stroke={glow} opacity=".6" />)}
      {variant===1 && <g fill={ground}><ellipse cx="31" cy="141" rx="17" ry="5"/><ellipse cx="136" cy="129" rx="13" ry="4"/></g>}
    </g>}
    {motif==="crystals" && <g>
      <path d="M0 0h160v16l-18 15-18-17-16 28-19-24-13 14-16-18-22 29-15-21-23 9z" fill={ground}/>
      {[9,33,126,150].map((x,i)=><path key={x} d={`M${x-8} 148v-33l8-19 8 18v34z`} fill={i%2?glow:horizon}/>)}
    </g>}
    {motif==="mushrooms" && <g>
      {[9,33,123,149].map((x,i)=><g key={x}><path d={`M${x} ${45+i%2*28}h7v100h-7z`} fill={horizon}/><ellipse cx={x+3} cy={45+i%2*28} rx={20-i%2*6} ry="12" fill={i%2?glow:ground}/><rect x={x-6} y={36+i%2*28} width="5" height="4" fill={glow}/></g>)}
    </g>}
    {motif==="canopy" && <g fill={ground}>
      <path d="M0 99h160v12H0zM0 0h160v15h-19v13h-27V15H38v17H17V15H0z"/>
      <path d="M7 0h5v64l10 13-4 7L7 72zM150 0h-5v56l-17 9 3 6 19-12z"/>
      {[20,43,119,142].map(x=><ellipse key={x} cx={x} cy="100" rx="15" ry="5" fill={horizon}/>)}
    </g>}
    {motif==="aurora" && <g>
      <circle cx="113" cy="46" r="27" fill={glow} opacity=".6"/>
      <path d="M0 29Q80 4 160 20v8Q80 12 0 38zM0 56Q79 31 160 36v7Q80 38 0 65z" fill={glow} opacity=".22"/>
      <path d="M0 146v-29h33v-9h34v20h48v-16h45v34z" fill={ground}/>
    </g>}
    {motif==="ruins" && <g fill={ground}>
      {[4,33,118,144].map((x,i)=><g key={x}><path d={`M${x} ${38+i%2*16}h13v99h-13zM${x-4} ${33+i%2*16}h21v8h-21z`}/><rect x={x+4} y={63+i%2*16} width="5" height="5" fill={glow} opacity=".5"/></g>)}
      {variant===1?<><path d="M0 131h160v29H0z" fill={horizon}/><path d="M19 138h115M31 146h87" stroke={glow}/></>:<g fill={horizon}><path d="M57 139h48v8H57zM62 147h35v8H62z"/><circle cx="26" cy="53" r="13" fill="none" stroke={glow}/></g>}
    </g>}
    {(motif==="stars" || motif==="portal") && <g>
      {points.map((p,i)=><rect key={i} x={p.x*1.6} y={p.y} width={p.size} height={p.size} fill={glow} opacity=".65"/>)}
      {motif==="stars"?<><circle cx="120" cy="34" r="18" fill={glow}/><circle cx="126" cy="29" r="16" fill={sky}/></>:<g fill="none" stroke={glow} opacity=".45">
        <path d="M6 17 149 47 117 119 13 78zM12 148 71 110 149 141"/>
        <ellipse cx="80" cy="89" rx="71" ry="25" transform="rotate(-24 80 89)"/>
        {signature && <path d="M0 52 46 19 87 55 160 17M0 108l38-35 64 51 58-26" strokeWidth="3" strokeDasharray="7 3"/>}
      </g>}
    </g>}
    <path d="M0 152h160v8H0z" fill={ground} opacity=".65" />
    {signature && habitat==="ancient-tree" && <g fill="none" stroke={glow} opacity=".6"><path d="M0 141 39 124 59 144M160 138l-42-14-16 19" strokeWidth="3"/><path d="M17 30h7v7h-7zM137 34h7v7h-7z" /></g>}
  </svg>;
}
export default memo(ContentHabitat);
