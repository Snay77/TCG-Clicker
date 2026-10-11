import type { UX } from './ux';
export type SoundKind='click'|'critical'|'charged'|'overload'|'stabilize'|'upgrade'|'ready'|'cut'|'swipe'|'rare'|'epic'|'legendary'|'mythic'|'goal'|'level';
export const SOUND_NOTES:Record<SoundKind,number[]>={click:[164.8,246.9],critical:[440,660,880],charged:[146.8,293.7,587.3],overload:[130.8,196,261.6,523.3],stabilize:[293.7,440,587.3],upgrade:[392,494,587],ready:[523,784],cut:[180,100],swipe:[330,220],rare:[660,880],epic:[440,660,880],legendary:[392,494,587,784],mythic:[262,392,523,659,784],goal:[523,659,784],level:[392,494,587,784,988]};
export function synthSound(context:AudioContext,kind:SoundKind,volume:number){
 const notes=SOUND_NOTES[kind],short=['click','critical','charged','cut','swipe'].includes(kind),duration=kind==='click'?.14:short?0.09:kind==='mythic'?0.65:0.26;
 notes.forEach((frequency,i)=>{
  const start=context.currentTime+i*(short?0.018:0.065),osc=context.createOscillator(),gain=context.createGain();
  const tuning=kind==='click'?1+Math.sin(start*7)*.015:1;
  osc.type=kind==='cut'||kind==='click'&&i===0?'triangle':'sine';osc.frequency.setValueAtTime(frequency*tuning,start);if(short)osc.frequency.exponentialRampToValueAtTime(frequency*tuning*0.7,start+duration);
  gain.gain.setValueAtTime(0.0001,start);gain.gain.exponentialRampToValueAtTime(Math.max(0.0001,volume*0.055/Math.sqrt(notes.length)),start+0.008);gain.gain.exponentialRampToValueAtTime(0.0001,start+duration);
  osc.connect(gain);gain.connect(context.destination);osc.start(start);osc.stop(start+duration+0.02);osc.onended=()=>{osc.disconnect();gain.disconnect();};
 });
}
export class GameAudio {
 private context:AudioContext|null=null;
 private lastClick=-Infinity;
 play(kind:SoundKind,settings:Pick<UX,'sound'|'volume'>,gesture=false){
  if(!settings.sound||settings.volume===0)return;
  if((kind==='click'||kind==='critical'||kind==='charged')&&performance.now()-this.lastClick<45)return;
  if(kind==='click'||kind==='critical'||kind==='charged')this.lastClick=performance.now();
  try{
   if(gesture)this.context??=new AudioContext();
   const context=this.context;if(!context)return;
   if(context.state==='running')synthSound(context,kind,settings.volume);
   else if(gesture)void context.resume().then(()=>{if(context.state==='running')synthSound(context,kind,settings.volume);}).catch(()=>{});
  }catch{/* Audio unavailable: gameplay stays usable. */}
 }
 close(){void this.context?.close().catch(()=>{});this.context=null;}
}
export const raritySound=(rarity:number):SoundKind=>['click','click','rare','epic','legendary','mythic'][rarity] as SoundKind;
