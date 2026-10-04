// Catalogue visuel. Chaque futur set devra aussi fournir ses propres règles de tirage.
export const BOOSTERS = [{
  id: 'faerie', name: 'Faerie', subtitle: 'Les murmures de la forêt',
  set: 'SET 01', description: 'Cinq créatures de la clairière. Une Peu commune ou mieux garantie.',
  species: 60,
}] as const;
export type BoosterId = typeof BOOSTERS[number]['id'];
export const isBoosterId = (value: unknown): value is BoosterId => BOOSTERS.some(booster => booster.id === value);
export const favoriteBooster = (id: BoosterId | null | undefined) => id === null ? null : BOOSTERS.find(booster => booster.id === (id ?? 'faerie')) ?? null;
