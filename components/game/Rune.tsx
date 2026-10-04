type RuneKind = 'click' | 'auto' | 'critChance' | 'critMultiplier' | 'combo' | 'global' | 'faerie' | 'storage';
const strokes: Record<RuneKind, string> = {
  click:'M12 2 19 8 12 22 5 8Z M5 8h14 M12 2v20',
  auto:'M12 3v4 M12 17v4 M3 12h4 M17 12h4 M7 7l10 10 M17 7 7 17 M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8',
  critChance:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18 M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10 M12 1v3 M12 20v3',
  critMultiplier:'M12 3 22 20H2Z M12 3v17 M2 20 12 12 22 20',
  combo:'M3 17V7h4v10h4V7h4v10h6 M3 12h18',
  global:'M12 2 21 12 12 22 3 12Z M12 7 17 12 12 17 7 12Z',
  faerie:'M12 22V10 M12 16C2 16 3 4 4 3c7 1 8 8 8 13Z M12 12C22 12 21 2 20 2c-7 1-8 5-8 10Z',
  storage:'M6 6h12l3 15H3Z M8 6V3h8v3 M3 12h18 M10 16h4',
};
export default function Rune({kind='global'}:{kind?:RuneKind}) {
  return <svg className="ui-rune" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={strokes[kind]}/></svg>;
}
