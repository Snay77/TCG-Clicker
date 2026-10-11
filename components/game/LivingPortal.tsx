import { memo, useId } from 'react';
export type PortalState='stable'|'resonance'|'overload';
const angles=Array.from({length:12},(_,i)=>i*30);
function LivingPortal({level,state='stable',attunement='none'}:{level:number;state?:PortalState;attunement?:string}) {
 const uid=useId().replaceAll(':',''),paint=(name:string)=>`url(#${uid}-${name})`;
 const tier=level+1;
 return <svg className="living-portal-art" data-state={state} data-tier={tier>=50?6:tier>=35?5:tier>=20?4:tier>=10?3:tier>=5?2:1} data-attunement={attunement} viewBox="0 0 600 550" aria-hidden="true">
  <defs>
   <linearGradient id={`${uid}-stone`} x2=".9" y2="1"><stop stopColor="#71867c"/><stop offset=".23" stopColor="#304845"/><stop offset=".55" stopColor="#142b30"/><stop offset="1" stopColor="#071418"/></linearGradient>
   <linearGradient id={`${uid}-bronze`} x2="1" y2=".8"><stop stopColor="#ecddb0"/><stop offset=".28" stopColor="#ad9d70"/><stop offset=".5" stopColor="#3d594e"/><stop offset=".72" stopColor="#829885"/><stop offset="1" stopColor="#242f2c"/></linearGradient>
   <linearGradient id={`${uid}-rim`} x2="1" y2="1"><stop stopColor="#e2e8bf"/><stop offset=".2" stopColor="#90c4a0"/><stop offset=".52" stopColor="#2c5851"/><stop offset=".8" stopColor="#67ac98"/><stop offset="1" stopColor="#d9d49f"/></linearGradient>
   <radialGradient id={`${uid}-world`} cx=".54" cy=".3" r=".8"><stop stopColor="#fff0b0"/><stop offset=".16" stopColor="#9cd7b6"/><stop offset=".47" stopColor="#286d79"/><stop offset=".78" stopColor="#153655"/><stop offset="1" stopColor="#060e22"/></radialGradient>
   <radialGradient id={`${uid}-light`}><stop stopColor="#b4ffd7" stopOpacity=".2"/><stop offset="1" stopColor="#81dbbd" stopOpacity="0"/></radialGradient>
   <linearGradient id={`${uid}-water`} x2=".3" y2="1"><stop stopColor="#ddedb0"/><stop offset=".45" stopColor="#70bfb2"/><stop offset="1" stopColor="#123647"/></linearGradient>
   <clipPath id={`${uid}-aperture`}><path d="M300 119C359 119 393 172 393 254V354Q300 396 207 354V254C207 172 241 119 300 119Z"/></clipPath>
  </defs>
  <ellipse cx="300" cy="490" rx="205" ry="29" fill="#03080b"/>
  <ellipse cx="300" cy="282" rx="244" ry="241" fill={paint('light')}/>
  <g fill="none" stroke="#42665c" strokeWidth="1" opacity=".4"><path d="M35 267H565M300 15V516M111 79 489 457M99 455 498 71"/><ellipse cx="300" cy="481" rx="191" ry="21" strokeDasharray="3 14"/></g>
  <g className="portal-chassis" fill={paint('stone')} stroke="#61776b" strokeWidth="1.5">
   <path d="M143 441 133 211 150 130 188 73 229 54 234 81 188 146 183 216 194 434Z"/>
   <path d="M457 441 468 204 448 128 411 72 370 52 365 82 411 143 418 218 405 434Z"/>
   <path d="M156 435 196 413 207 448 249 463 249 482H126L117 464Z"/>
   <path d="M443 435 405 413 393 448 349 463 349 482H474L483 464Z"/>
   <path d="M242 48 273 24H327L358 48 343 70H256Z"/>
  </g>
  <g fill="#c2c49a" opacity=".26"><path d="M143 441 150 217 168 144 229 54 188 73 150 130 133 211Z M368 63 416 145 436 214 446 428 457 441 468 204 448 128 411 72Z"/></g>
  <g fill="none" stroke="#152422" strokeWidth="2"><path d="M146 289 178 300M143 354 185 350M144 396 188 389M423 290 456 298M417 354 459 347M412 395 458 386"/></g>
  <g fill="#182a2b" stroke="#96a78b" strokeWidth="1"><path d="M149 241H181L181 291H145Z M419 241H453L455 291H419Z"/><path d="M263 48 278 36H323L338 48 325 61H276Z"/></g>
  <g fill="none" stroke="#9baf91" strokeWidth="2" opacity=".7"><path d="M162 422 155 216 171 146 205 90M440 421 445 216 428 146 396 90"/><path d="M132 467H209M391 467H467"/></g>
  <g className="portal-lens lens-back" fill="none" stroke={paint('bronze')} strokeWidth="7"><ellipse cx="300" cy="256" rx="173" ry="206"/><ellipse cx="300" cy="256" rx="181" ry="215" strokeWidth="1" strokeDasharray="24 8 2 8"/></g>
  <g className="portal-world" clipPath={paint('aperture')}>
   <rect x="198" y="109" width="204" height="289" fill={paint('world')}/>
   <g className="portal-distant"><circle cx="323" cy="176" r="29" fill="#ecf6c8" opacity=".7"/><circle cx="330" cy="171" r="27" fill="#9bcbb0"/>
    <path d="M197 291 238 225 261 248 299 207 347 268 365 242 412 302Z" fill="#326b68"/><path d="M203 313 248 258 282 282 306 249 343 300 376 265 406 322Z" fill="#17464d"/>
    <path d="M211 336Q290 277 400 320V401H201Z" fill="#0d2837"/>
   </g>
   <path d="M307 270Q338 292 298 310T278 339L317 394H237L253 333Q319 301 298 287Z" fill={paint('water')} opacity=".85"/>
   <g fill="#081b28"><path d="M213 380V194L225 194 231 319 250 365 260 388Z M376 380 370 206H387L393 386Z"/><path d="M216 248 241 210 247 204 231 247 224 296M379 263 357 236 353 219 379 247Z"/></g>
   <g fill="#214d48"><path d="M195 217 215 180 252 184 265 211 244 229 211 242Z M349 221 352 189 379 175 402 191 407 222 374 240Z"/></g>
   <g className="portal-filaments" fill="none" stroke="#c3f2d1" strokeWidth="1" opacity=".65"><path d="M222 366Q348 277 297 153M380 332Q229 231 312 136M238 355Q232 184 303 143"/></g>
   <g className="portal-depth" fill="none" stroke="#9fe2ce" strokeWidth="1.5"><path d="M300 145Q371 145 371 255V341Q300 375 230 341V255Q230 145 300 145Z" opacity=".5"/><path d="M300 168Q350 168 350 257V323Q300 348 251 323V257Q251 168 300 168Z" opacity=".3"/></g>
   <g className="portal-river-lines" stroke="#ccf3d5" opacity=".65"><path d="M287 312h20M263 336h23M264 347h33M279 365h31M275 374h28"/></g>
   <g className="portal-directed-motes" fill="#e9f8c3">{[0,1,2,3,4,5].map(i=><circle key={i} cx={266+i*14} cy={318-i*23} r={i%2?1.5:2} style={{animationDelay:`${-i*1.4}s`}}/>)}</g>
   <path className="portal-refraction" d="M229 121 251 121 360 384 342 385Z" fill="#c3fff3" opacity=".12"/>
   <g className="portal-faerie-heart" fill="none" stroke="#fff0b5" strokeWidth="1.5"><path d="M300 217 291 233 300 254 309 233Z M300 254V284M279 235Q262 217 274 211Q291 211 300 234M321 235Q338 217 326 211Q309 211 300 234M289 264 300 280 311 264"/><circle cx="300" cy="235" r="32" strokeDasharray="2 9"/></g>
  </g>
  <path className="portal-aperture-rim" d="M300 119C359 119 393 172 393 254V354Q300 396 207 354V254C207 172 241 119 300 119Z" fill="none" stroke={paint('rim')} strokeWidth="12"/>
  <path d="M300 111C363 111 402 168 402 254V361Q300 411 198 361V254C198 168 237 111 300 111Z" fill="none" stroke="#b3cfa6" strokeWidth="1"/>
  <g className="portal-lens lens-front" fill="none" stroke={paint('bronze')} strokeWidth="4"><ellipse cx="300" cy="257" rx="192" ry="135"/><ellipse cx="300" cy="257" rx="199" ry="140" strokeWidth="1" stroke="#8fc1b0" strokeDasharray="32 9"/></g>
  <g className="portal-glyph-wheel" fill="none" stroke="#c5d5a6" strokeWidth="1.5">{angles.map((a,i)=><g key={a} transform={`rotate(${a} 300 257)`}><path d={`M294 80V68L300 ${i%2?59:64} 306 68V80M296 74H304`}/><circle cx="300" cy="89" r="1.5" fill="#dfedbf"/></g>)}</g>
  <g className="portal-clamps" fill={paint('bronze')} stroke="#6d8878" strokeWidth="1"><path d="M178 254 193 237 211 245 213 272 190 280 177 268Z M422 254 408 238 388 245 387 272 410 280 423 268Z"/><path d="M282 104 290 90H310L318 104 310 122H290Z M278 392 290 376H311L323 392 311 407H291Z"/></g>
  <g className="portal-gems" fill="#ceefb0"><path d="M297 96 306 104 300 115 294 104Z M185 253 198 248 204 260 196 273 187 265Z M414 253 401 248 396 260 403 273 413 265Z"/></g>
  <g className="portal-resonance-circuit" fill="none" stroke="#f4d8a2" strokeWidth="1.5"><path d="M106 164 75 255 107 343M494 164 525 255 493 343M269 50 300 68 331 50"/><path d="M86 256 105 244 118 257 105 270Z M482 257 495 244 514 256 495 270Z"/><path d="M213 435Q300 464 387 435" strokeDasharray="5 8"/></g>
  <g className="portal-fragments" fill={paint('stone')} stroke="#93b695"><path d="M94 188 113 162 124 179 110 205Z M485 174 505 201 491 217 477 190Z M211 36 216 14 233 24 229 42Z M377 18 391 30 387 51 370 37Z"/></g>
  <g className="portal-vines" fill="none" stroke="#77a876" strokeWidth="3"><path d="M167 446Q134 345 162 320T172 238M434 451Q466 350 439 309T440 237"/><path d="M162 324Q143 297 130 300M171 377Q188 358 194 338M440 309Q463 289 470 298"/></g>
  <g className="portal-leaves" fill="#a3c184"><path d="M129 300Q126 277 142 289Q155 303 129 300Z M192 340Q191 313 204 320Q214 338 192 340Z M468 298Q470 276 481 287Q485 304 468 298Z"/></g>
  <g className="portal-crown" fill="#dfd19c" stroke="#687c62"><path d="M286 25 300 1 314 25 300 40Z"/><path d="M297 12H303V29H297Z" fill="#f1ffcf"/></g>
  <g className="portal-high-runes" fill="none" stroke="#d2e6b6" strokeWidth="2"><path d="M155 164 162 147 169 164 162 173Z M432 164 439 147 446 164 439 173Z M162 188V211M438 188V211"/></g>
  <g className="portal-extra-orbit" fill="none" stroke="#a5c9ed" strokeWidth="1.5"><ellipse cx="300" cy="257" rx="235" ry="172" strokeDasharray="60 14 3 14"/></g>
  <g className="portal-overload-spires" fill="none" stroke="#f9df9e" strokeWidth="2"><path d="M299 75 280 107 300 146 320 107ZM194 249 165 256 193 277M406 249 435 256 407 277M300 370V444M273 404 300 443 327 404"/><path d="M119 300 161 282M481 300 439 282"/></g>
  <path d="M231 474H369L386 487H215Z" fill={paint('stone')} stroke="#718978"/>
  <g fill="#9cb4a0" opacity=".6"><path d="M242 481H266M284 481H316M334 481H358"/></g>
 </svg>;
}
export default memo(LivingPortal);
