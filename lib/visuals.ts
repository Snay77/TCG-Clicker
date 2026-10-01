import type { Creature } from "./cards";
export type Habitat =
  "grove" | "mushrooms" | "moon" | "pond" | "embers" | "dawn" | "astral";
export const VISUALS: Record<
  string,
  { habitat: Habitat; title: string; flavor: string; accent: string }
> = {
  "001": {
    habitat: "grove",
    title: "Élan de la pousse",
    flavor: "Il emporte un printemps entier dans sa fourrure.",
    accent: "#a2ed91",
  },
  "002": {
    habitat: "mushrooms",
    title: "Chœur des spores",
    flavor: "Sa chanson ne se répète jamais deux fois.",
    accent: "#ffaece",
  },
  "003": {
    habitat: "moon",
    title: "Poussière de lune",
    flavor: "Un battement d’ailes, et la nuit retient son souffle.",
    accent: "#bebaff",
  },
  "004": {
    habitat: "pond",
    title: "Source de rosée",
    flavor: "Chaque goutte est un minuscule ciel à protéger.",
    accent: "#87f2e2",
  },
  "005": {
    habitat: "embers",
    title: "Étincelle vagabonde",
    flavor: "Le feu qui danse au bout de sa queue ne brûle que la peur.",
    accent: "#ffc17e",
  },
  "006": {
    habitat: "grove",
    title: "Pacte des ramures",
    flavor: "Les sentiers oubliés refleurissent sous ses pas.",
    accent: "#baffc8",
  },
  "007": {
    habitat: "moon",
    title: "Songe nocturne",
    flavor: "Ses ailes gardent les constellations disparues.",
    accent: "#e1a4ff",
  },
  "008": {
    habitat: "dawn",
    title: "Souffle d’aurore",
    flavor: "Le soleil se lève un peu plus tôt pour le voir jouer.",
    accent: "#ffe59b",
  },
  "009": {
    habitat: "astral",
    title: "Mémoire des mondes",
    flavor: "La clairière rêvait de lui avant la première étoile.",
    accent: "#f3b9ff",
  },
};
export const REVEAL_TIMINGS = [160, 280, 1000, 1500, 2100, 2700];
export const FINISHES = [
  "Vélin",
  "Satin",
  "Foil",
  "Prismatique",
  "Or solaire",
  "Astral",
];
export function atmosphere(seed: number, count = 14) {
  let n = seed >>> 0;
  return Array.from({ length: count }, (_, i) => {
    n = (Math.imul(n, 1664525) + 1013904223) >>> 0;
    return {
      x: 5 + (n % 90),
      y: 8 + ((n >>> 8) % 76),
      size: 1 + (n % 3),
      delay: -(i * 0.73),
      duration: 3 + (n % 5),
    };
  });
}
