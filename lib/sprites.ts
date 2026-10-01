import type { Creature } from "./cards";
export const SPRITE_SIZE = 64;
export type Part = "tail" | "wings" | "body" | "crown" | "face";
export type Pixel = { x: number; y: number; color: string; part: Part };
export const PART_NAMES: Record<Part, string> = {
  tail: "Queue / appendices",
  wings: "Ailes / feuillage",
  body: "Corps et pattes",
  crown: "Coiffe / antennes",
  face: "Visage",
};
export function mix(a: string, b: string, t: number) {
  const ch = (s: string, i: number) => parseInt(s.slice(i, i + 2), 16);
  return (
    "#" +
    [1, 3, 5]
      .map((i) =>
        Math.round(ch(a, i) * (1 - t) + ch(b, i) * t)
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
  );
}
export function spritePalette(c: Creature) {
  return [
    mix(c.palette[1], "#17233e", 0.6),
    c.palette[1],
    mix(c.palette[0], c.palette[1], 0.45),
    c.palette[0],
    mix(c.palette[0], c.palette[2], 0.5),
    c.palette[2],
    "#fff8e8",
    "#ef9da9",
  ];
}
// Rasterizer: integer pixels only. Each species has its own anatomy; seeds only affect markings.
export function spritePixels(c: Creature, seed = c.seed): Pixel[] {
  const grid = new Map<string, Pixel>();
  let part: Part = "body";
  const [ink, shade, mid, base, lit, light, white, blush] = spritePalette(c);
  const put = (x: number, y: number, color: string) => {
    x = Math.round(x);
    y = Math.round(y);
    if (x > 0 && x < 63 && y > 0 && y < 62)
      grid.set(`${x},${y}`, { x, y, color, part });
  };
  const box = (x: number, y: number, w: number, h: number, col: string) => {
    for (let j = y; j < y + h; j++)
      for (let i = x; i < x + w; i++) put(i, j, col);
  };
  const oval = (
    cx: number,
    cy: number,
    rx: number,
    ry: number,
    col: string,
  ) => {
    for (let y = Math.floor(cy - ry); y <= cy + ry; y++)
      for (let x = Math.floor(cx - rx); x <= cx + rx; x++)
        if (((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1) put(x, y, col);
  };
  const poly = (points: number[][], col: string) => {
    const ys = points.map((p) => p[1]),
      xs = points.map((p) => p[0]);
    for (let y = Math.min(...ys); y <= Math.max(...ys); y++)
      for (let x = Math.min(...xs); x <= Math.max(...xs); x++) {
        let inside = false;
        for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
          const [a, b] = points[i],
            [u, v] = points[j];
          if (b > y !== v > y && x < ((u - a) * (y - b)) / (v - b) + a)
            inside = !inside;
        }
        if (inside) put(x, y, col);
      }
  };
  const line = (
    x: number,
    y: number,
    u: number,
    v: number,
    col: string,
    w = 1,
  ) => {
    const steps = Math.max(Math.abs(u - x), Math.abs(v - y));
    for (let i = 0; i <= steps; i++)
      box(
        Math.round(x + ((u - x) * i) / (steps || 1)),
        Math.round(y + ((v - y) * i) / (steps || 1)),
        w,
        w,
        col,
      );
  };
  const volume = (x: number, y: number, rx: number, ry: number) => {
    oval(x, y, rx, ry, shade);
    oval(x - 1, y - 2, rx - 1, ry - 2, mid);
    oval(x - 2, y - 3, rx - 2, ry - 3, base);
    oval(x - 4, y - ry + 4, Math.max(2, rx / 2), 2, lit);
  };
  const leaf = (x: number, y: number, u: number, v: number) => {
    poly(
      [
        [x, y],
        [x - 6, y - 7],
        [u, v],
        [x + 7, y - 3],
      ],
      shade,
    );
    poly(
      [
        [x, y - 1],
        [x - 4, y - 7],
        [u, v],
        [x + 5, y - 4],
      ],
      base,
    );
    line(x, y, u, v, lit);
  };
  const eye = (x: number, y: number) => {
    box(x, y, 4, 6, ink);
    box(x, y, 2, 2, white);
    box(x + 2, y + 4, 1, 1, c.palette[1]);
  };
  const face = (x: number, y: number, gap = 11) => {
    part = "face";
    eye(x, y);
    eye(x + gap, y);
    box(x - 3, y + 6, 4, 2, blush);
    box(x + gap + 3, y + 6, 4, 2, blush);
    line(x + 5, y + 8, x + 7, y + 9, ink);
    line(x + 7, y + 9, x + 9, y + 8, ink);
  };
  if (c.id === "001") {
    part = "tail";
    leaf(43, 43, 56, 24);
    leaf(46, 43, 57, 39);
    part = "body";
    oval(20, 54, 6, 3, shade);
    oval(39, 54, 6, 3, shade);
    volume(30, 40, 17, 14);
    oval(28, 44, 11, 8, light);
    oval(21, 46, 4, 7, mid);
    oval(38, 46, 4, 7, mid);
    box(19, 49, 3, 3, lit);
    volume(28, 31, 15, 12);
    poly(
      [
        [15, 29],
        [10, 23],
        [18, 20],
        [22, 29],
      ],
      shade,
    );
    poly(
      [
        [39, 26],
        [46, 21],
        [46, 31],
        [39, 33],
      ],
      mid,
    );
    part = "crown";
    line(28, 22, 28, 14, shade, 2);
    leaf(28, 17, 17, 6);
    leaf(29, 15, 43, 4);
    box(24, 20, 11, 3, lit);
    face(19, 30, 13);
  } else if (c.id === "002") {
    part = "body";
    oval(24, 55, 6, 3, shade);
    oval(40, 52, 6, 3, shade);
    poly(
      [
        [22, 28],
        [40, 29],
        [43, 49],
        [35, 54],
        [24, 53],
        [19, 46],
      ],
      light,
    );
    oval(35, 42, 7, 11, "#dec292");
    oval(27, 40, 7, 10, light);
    poly(
      [
        [21, 33],
        [14, 40],
        [14, 44],
        [19, 42],
        [25, 37],
      ],
      mid,
    );
    poly(
      [
        [39, 33],
        [49, 35],
        [49, 39],
        [40, 38],
      ],
      mid,
    );
    part = "crown";
    oval(31, 27, 24, 6, shade);
    poly(
      [
        [7, 26],
        [13, 16],
        [23, 8],
        [36, 6],
        [47, 13],
        [56, 26],
        [52, 30],
        [13, 31],
      ],
      shade,
    );
    oval(30, 21, 22, 12, mid);
    oval(29, 18, 20, 10, base);
    oval(24, 13, 11, 4, lit);
    oval(19, 20, 4, 3, white);
    oval(35, 13, 3, 3, light);
    oval(44, 23, 5, 3, light);
    box(11, 26, 38, 2, lit);
    for (let i = 0; i < 7; i++) line(16 + i * 5, 29, 21 + i * 3, 32, "#e8b48c");
    part = "body";
    poly(
      [
        [20, 33],
        [26, 36],
        [30, 33],
        [34, 37],
        [42, 33],
        [42, 37],
        [33, 41],
        [23, 39],
      ],
      white,
    );
    face(25, 41, 10);
  } else if (c.id === "003" || c.id === "007") {
    const royal = c.id === "007";
    part = "wings";
    if (royal) {
      poly(
        [
          [29, 29],
          [15, 8],
          [5, 7],
          [5, 26],
          [12, 37],
          [6, 46],
          [13, 56],
          [25, 45],
          [31, 34],
        ],
        shade,
      );
      poly(
        [
          [34, 29],
          [48, 5],
          [58, 10],
          [56, 28],
          [49, 37],
          [57, 49],
          [49, 57],
          [37, 46],
        ],
        shade,
      );
      poly(
        [
          [28, 28],
          [14, 11],
          [8, 11],
          [9, 26],
          [17, 32],
        ],
        base,
      );
      poly(
        [
          [35, 28],
          [49, 9],
          [55, 12],
          [52, 27],
          [43, 33],
        ],
        base,
      );
      oval(18, 43, 7, 10, base);
      oval(46, 44, 7, 10, base);
      for (const [x, y] of [
        [15, 22],
        [49, 21],
        [18, 44],
        [46, 44],
      ]) {
        oval(x, y, 5, 6, light);
        oval(x, y, 3, 4, shade);
        oval(x - 1, y - 1, 1, 2, white);
      }
      line(11, 13, 27, 30, lit);
      line(53, 13, 36, 30, lit);
    } else {
      poly(
        [
          [29, 31],
          [18, 13],
          [7, 12],
          [5, 22],
          [10, 35],
          [23, 40],
        ],
        shade,
      );
      poly(
        [
          [34, 30],
          [45, 10],
          [55, 13],
          [58, 24],
          [51, 35],
          [40, 39],
        ],
        shade,
      );
      oval(16, 25, 9, 10, base);
      oval(47, 23, 9, 10, base);
      oval(22, 40, 7, 9, mid);
      oval(42, 40, 7, 9, mid);
      oval(14, 23, 4, 5, light);
      oval(48, 21, 4, 5, light);
      oval(16, 22, 3, 4, base);
      oval(50, 20, 3, 4, base);
      line(10, 30, 27, 36, lit);
      line(53, 29, 37, 35, lit);
    }
    part = "body";
    volume(32, 35, 6, 14);
    for (let i = 0; i < 4; i++) box(29, 34 + i * 4, 6, 1, light);
    volume(32, 27, 9, 8);
    poly(
      [
        [26, 33],
        [24, 36],
        [29, 35],
        [32, 38],
        [35, 35],
        [40, 36],
        [37, 32],
      ],
      light,
    );
    part = "crown";
    line(27, 22, 22, 12, mid, 2);
    line(37, 22, 41, 10, mid, 2);
    oval(22, 11, 2, 2, light);
    oval(42, 9, 2, 2, light);
    face(26, 25, 9);
  } else if (c.id === "004") {
    part = "tail";
    oval(32, 53, 24, 5, "#337d71");
    poly(
      [
        [11, 50],
        [30, 46],
        [48, 49],
        [36, 55],
        [17, 55],
      ],
      "#68bd83",
    );
    part = "body";
    volume(17, 44, 10, 8);
    volume(46, 44, 10, 8);
    volume(32, 38, 16, 14);
    oval(31, 43, 11, 8, light);
    volume(31, 29, 21, 12);
    volume(20, 23, 8, 9);
    volume(43, 22, 8, 9);
    line(21, 41, 21, 50, mid, 3);
    line(42, 41, 42, 50, mid, 3);
    box(17, 50, 9, 3, lit);
    box(39, 50, 9, 3, lit);
    part = "crown";
    poly(
      [
        [24, 17],
        [22, 10],
        [29, 12],
        [34, 5],
        [37, 13],
        [43, 10],
        [41, 18],
      ],
      shade,
    );
    poly(
      [
        [26, 16],
        [25, 12],
        [30, 14],
        [34, 9],
        [36, 15],
        [40, 13],
        [39, 17],
      ],
      light,
    );
    part = "face";
    eye(17, 22);
    eye(40, 21);
    box(12, 30, 6, 2, blush);
    box(46, 29, 6, 2, blush);
    line(25, 34, 31, 37, ink);
    line(31, 37, 39, 33, ink);
    box(30, 37, 5, 2, blush);
  } else if (c.id === "005") {
    part = "tail";
    poly(
      [
        [35, 49],
        [43, 50],
        [56, 43],
        [59, 30],
        [55, 14],
        [51, 25],
        [44, 21],
        [47, 33],
        [35, 39],
      ],
      shade,
    );
    poly(
      [
        [40, 44],
        [51, 42],
        [56, 32],
        [53, 20],
        [50, 29],
        [46, 26],
        [49, 35],
      ],
      base,
    );
    poly(
      [
        [50, 38],
        [55, 31],
        [53, 20],
        [50, 29],
        [47, 27],
        [50, 34],
      ],
      light,
    );
    part = "body";
    volume(30, 43, 13, 12);
    oval(28, 46, 7, 8, light);
    box(18, 51, 9, 5, shade);
    box(31, 51, 8, 5, shade);
    poly(
      [
        [14, 29],
        [13, 8],
        [25, 18],
        [35, 16],
        [44, 7],
        [43, 32],
      ],
      shade,
    );
    poly(
      [
        [16, 27],
        [16, 12],
        [25, 22],
        [34, 21],
        [41, 12],
        [40, 30],
      ],
      base,
    );
    poly(
      [
        [18, 16],
        [19, 26],
        [24, 24],
      ],
      blush,
    );
    poly(
      [
        [39, 16],
        [34, 25],
        [39, 26],
      ],
      blush,
    );
    volume(28, 31, 16, 11);
    poly(
      [
        [12, 33],
        [19, 33],
        [26, 38],
        [28, 35],
        [32, 38],
        [44, 32],
        [39, 41],
        [28, 44],
        [19, 41],
      ],
      light,
    );
    part = "crown";
    poly(
      [
        [22, 22],
        [28, 15],
        [29, 20],
        [33, 16],
        [32, 24],
      ],
      lit,
    );
    face(18, 28, 15);
    box(27, 36, 3, 2, ink);
  } else if (c.id === "006") {
    part = "tail";
    leaf(44, 39, 58, 27);
    part = "body";
    line(22, 41, 20, 55, shade, 4);
    line(39, 41, 43, 55, shade, 4);
    line(28, 44, 27, 57, mid, 3);
    line(35, 43, 36, 55, mid, 3);
    volume(33, 38, 14, 9);
    volume(24, 29, 8, 14);
    oval(25, 34, 4, 9, light);
    volume(24, 22, 11, 9);
    poly(
      [
        [16, 21],
        [8, 15],
        [12, 13],
        [22, 19],
      ],
      base,
    );
    poly(
      [
        [31, 20],
        [42, 15],
        [41, 21],
        [33, 25],
      ],
      base,
    );
    part = "crown";
    line(21, 15, 16, 6, shade, 2);
    line(18, 10, 10, 7, shade, 2);
    line(28, 15, 34, 5, shade, 2);
    line(32, 9, 42, 7, shade, 2);
    leaf(17, 9, 14, 3);
    leaf(35, 9, 44, 3);
    oval(27, 14, 4, 2, light);
    part = "wings";
    leaf(35, 34, 39, 22);
    leaf(40, 35, 50, 20);
    leaf(42, 37, 57, 32);
    face(16, 22, 11);
    box(30, 39, 2, 2, light);
    box(38, 38, 2, 2, light);
    box(34, 42, 2, 2, light);
  } else if (c.id === "008") {
    part = "tail";
    poly(
      [
        [38, 46],
        [51, 46],
        [56, 39],
        [54, 33],
        [52, 38],
        [45, 40],
        [40, 37],
      ],
      shade,
    );
    poly(
      [
        [44, 43],
        [52, 42],
        [55, 38],
        [52, 38],
        [46, 40],
      ],
      base,
    );
    part = "wings";
    poly(
      [
        [31, 32],
        [41, 13],
        [48, 8],
        [48, 24],
        [58, 19],
        [55, 36],
        [42, 42],
      ],
      shade,
    );
    poly(
      [
        [35, 31],
        [46, 13],
        [46, 26],
        [54, 23],
        [51, 33],
        [42, 38],
      ],
      base,
    );
    line(45, 17, 42, 36, light);
    line(49, 28, 42, 36, light);
    poly(
      [
        [23, 32],
        [12, 17],
        [7, 15],
        [9, 32],
        [20, 41],
      ],
      shade,
    );
    part = "body";
    volume(31, 42, 13, 12);
    oval(28, 44, 7, 9, light);
    oval(19, 53, 6, 3, shade);
    oval(38, 53, 6, 3, shade);
    volume(27, 27, 14, 12);
    volume(24, 34, 11, 6);
    part = "crown";
    poly(
      [
        [16, 20],
        [13, 8],
        [18, 12],
        [21, 22],
      ],
      light,
    );
    poly(
      [
        [31, 18],
        [37, 7],
        [37, 15],
        [34, 23],
      ],
      light,
    );
    poly(
      [
        [22, 17],
        [26, 11],
        [29, 16],
      ],
      base,
    );
    part = "face";
    eye(17, 25);
    eye(31, 24);
    box(14, 32, 4, 2, blush);
    box(36, 31, 4, 2, blush);
    box(23, 35, 3, 2, shade);
    line(24, 38, 29, 37, ink);
  } else {
    part = "tail";
    oval(36, 45, 20, 12, shade);
    oval(39, 42, 14, 9, base);
    oval(36, 39, 10, 8, ink);
    oval(36, 37, 10, 8, "#000000"); // Cleared below: a curled, open tail rather than a filled disc.
    for (const [key, p] of grid) if (p.color === "#000000") grid.delete(key);
    poly(
      [
        [50, 42],
        [58, 30],
        [57, 24],
        [53, 30],
        [48, 27],
        [49, 35],
      ],
      light,
    );
    line(22, 49, 40, 54, lit, 2);
    part = "wings";
    poly(
      [
        [28, 31],
        [13, 15],
        [5, 14],
        [10, 28],
        [7, 31],
        [20, 42],
      ],
      shade,
    );
    poly(
      [
        [26, 29],
        [14, 19],
        [9, 18],
        [15, 31],
        [23, 35],
      ],
      lit,
    );
    poly(
      [
        [37, 27],
        [47, 9],
        [57, 8],
        [52, 19],
        [58, 21],
        [47, 33],
      ],
      shade,
    );
    poly(
      [
        [39, 26],
        [49, 13],
        [54, 11],
        [48, 23],
        [52, 22],
        [45, 29],
      ],
      light,
    );
    part = "body";
    volume(28, 38, 9, 15);
    oval(26, 41, 5, 10, light);
    volume(29, 24, 13, 11);
    poly(
      [
        [15, 26],
        [10, 28],
        [17, 32],
        [24, 32],
      ],
      lit,
    );
    poly(
      [
        [40, 24],
        [47, 28],
        [41, 31],
        [35, 30],
      ],
      light,
    );
    part = "crown";
    line(21, 17, 17, 7, light, 2);
    line(18, 11, 11, 8, light);
    line(35, 16, 40, 5, light, 2);
    line(39, 9, 46, 5, light);
    poly(
      [
        [25, 14],
        [29, 5],
        [34, 13],
      ],
      base,
    );
    box(28, 9, 2, 4, white);
    part = "face";
    eye(20, 22);
    eye(34, 21);
    box(18, 28, 4, 2, blush);
    box(38, 27, 4, 2, blush);
    line(27, 31, 31, 30, ink);
    part = "crown";
    for (const [x, y] of [
      [8, 39],
      [52, 49],
      [44, 4],
    ]) {
      box(x, y - 2, 1, 5, light);
      box(x - 2, y, 5, 1, light);
    }
  }
  // Seeded fur flecks, scales and spores: never random during render.
  let n = seed >>> 0;
  for (let i = 0; i < 28; i++) {
    n = (Math.imul(n, 1664525) + 1013904223) >>> 0;
    const x = 8 + (n % 48);
    n = (Math.imul(n, 1664525) + 1013904223) >>> 0;
    const y = 10 + (n % 43);
    const p = grid.get(`${x},${y}`);
    if (p?.color === base) {
      part = p.part;
      put(x, y, lit);
    }
  }
  const outline = new Map<string, Pixel>();
  for (const p of grid.values())
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const x = p.x + dx,
        y = p.y + dy,
        key = `${x},${y}`;
      if (!grid.has(key) && x >= 0 && x < 64 && y >= 0 && y < 64)
        outline.set(key, { x, y, color: ink, part: p.part });
    }
  return [...outline.values(), ...grid.values()];
}
// Merge pixels into SVG paths per part/color: hundreds of pixels, only a few dozen DOM nodes.
export function spritePaths(c: Creature, seed = c.seed) {
  const groups = new Map<string, { part: Part; color: string; d: string }>();
  for (const p of spritePixels(c, seed)) {
    const key = p.part + p.color;
    const g = groups.get(key) || { part: p.part, color: p.color, d: "" };
    g.d += `M${p.x} ${p.y}h1v1h-1z`;
    groups.set(key, g);
  }
  return [...groups.values()];
}
// Exact inspection palette, including species-specific accents (gills, lily pad, etc.).
export function usedSpritePalette(c: Creature, seed = c.seed) {
  return [...new Set(spritePixels(c, seed).map((p) => p.color))];
}
