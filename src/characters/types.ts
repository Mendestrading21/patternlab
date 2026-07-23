/**
 * Toto (taureau vert) & Bobo (ours rouge).
 * Réf. kit : reference/03-toto-bobo-character-bible.md + reference/05-animation-system.md.
 */
export type CharacterId = 'toto' | 'bobo';

/**
 * États canoniques (Toto/Bobo V2). Couvre la liste du skill :
 * idle, welcome, explain, observe, think, debate, celebrate, encourage, confused,
 * warning, wrong(Answer), false-signal, level-up, streak, review, rest, loading,
 * offline, premium — plus quelques nuances (wave, inspect, agree, disagree).
 * Le registre `CHARACTER_STATES` (states.ts) est la source unique de leur métadonnée.
 */
export type CharacterState =
  | 'idle'
  | 'wave'
  | 'welcome'
  | 'explain'
  | 'observe'
  | 'inspect'
  | 'think'
  | 'point'
  | 'agree'
  | 'disagree'
  | 'debate'
  | 'encourage'
  | 'celebrate-small'
  | 'celebrate-big'
  | 'warning'
  | 'wrong'
  | 'false-signal'
  | 'confused'
  | 'streak'
  | 'level-up'
  | 'review'
  | 'premium'
  | 'rest'
  | 'offline'
  | 'loading';

/** Expression faciale déduite d'un état (utilisée par l'avatar SVG). */
export type Expression = 'happy' | 'excited' | 'thinking' | 'concerned' | 'sad' | 'neutral';

export const CHARACTER_NAME: Record<CharacterId, string> = {
  toto: 'Toto',
  bobo: 'Bobo',
};
