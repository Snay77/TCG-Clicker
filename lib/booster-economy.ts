// The economic clock is independent of UI tick frequency.
export const FREE_PACK_INTERVAL = 10 * 60 * 1000;
export const INITIAL_FREE_CAPACITY = 2;
export const MAX_FREE_CAPACITY = 10;
export const STORAGE_COSTS = [500, 1200, 2800, 6500, 15000, 34000, 76000, 170000] as const;
export type FreePackState = { freeBoosters:number; freeBoosterCapacity:number; freeBoosterTimerStartedAt:number|null };
export function initialFreePacks(now:number):FreePackState {
 return {freeBoosters:0,freeBoosterCapacity:INITIAL_FREE_CAPACITY,freeBoosterTimerStartedAt:now};
}
export function rechargeFreePacks<T extends FreePackState>(s:T,now:number):T {
 if(s.freeBoosters===s.freeBoosterCapacity)return s.freeBoosterTimerStartedAt===null?s:{...s,freeBoosterTimerStartedAt:null};
 const start=s.freeBoosterTimerStartedAt;
 if(start===null||now<start)return {...s,freeBoosterTimerStartedAt:now};
 const cycles=Math.floor((now-start)/FREE_PACK_INTERVAL);
 if(cycles===0)return s;
 const freeBoosters=Math.min(s.freeBoosterCapacity,s.freeBoosters+cycles);
 return {...s,freeBoosters,freeBoosterTimerStartedAt:freeBoosters===s.freeBoosterCapacity?null:start+cycles*FREE_PACK_INTERVAL};
}
export function freePackRemaining(s:FreePackState,now:number):number|null {
 const next=rechargeFreePacks(s,now);
 return next.freeBoosters===next.freeBoosterCapacity?null:Math.max(0,FREE_PACK_INTERVAL-(now-next.freeBoosterTimerStartedAt!));
}
export const storageCost=(s:FreePackState)=>STORAGE_COSTS[s.freeBoosterCapacity-INITIAL_FREE_CAPACITY] ?? null;
export const PAID_PACK_GROWTH = 1.12;
// Chosen after comparing 1.08 / 1.10 / 1.12 / 1.15; retune after human playtests.
export function progressivePackPrice(purchased:number,discount=0,growth=PAID_PACK_GROWTH):number {
 const raw=100*growth**purchased;
 return Math.min(Number.MAX_SAFE_INTEGER,Math.ceil(Number((raw*(1-Math.min(.5,Math.max(0,discount)))).toPrecision(14))));
}
