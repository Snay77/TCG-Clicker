// Keep imported extreme values exportable after rewards and subsequent ticks.
// This ceiling is far above reachable alpha progression.
export const boundedTotal = (value: number) => Math.min(Number.MAX_SAFE_INTEGER, value);
