/**
 * Toto (taureau vert) & Bobo (ours rouge).
 * Réf. kit : reference/03-toto-bobo-character-bible.md + reference/05-animation-system.md.
 */
export type CharacterId = 'toto' | 'bobo';

/** États d'animation prévus (le rendu Lottie viendra remplir chacun — voir ADR-005). */
export type CharacterState =
  | 'idle'
  | 'wave'
  | 'explain'
  | 'inspect'
  | 'think'
  | 'agree'
  | 'disagree'
  | 'encourage'
  | 'celebrate-small'
  | 'celebrate-big'
  | 'warning'
  | 'wrong'
  | 'confused'
  | 'debate'
  | 'streak'
  | 'level-up'
  | 'rest'
  | 'offline'
  | 'loading';

/** Expression faciale déduite d'un état (utilisée par l'avatar SVG de P0.1). */
export type Expression = 'happy' | 'excited' | 'thinking' | 'concerned' | 'sad' | 'neutral';

export const STATE_TO_EXPRESSION: Record<CharacterState, Expression> = {
  idle: 'neutral',
  wave: 'happy',
  explain: 'happy',
  inspect: 'thinking',
  think: 'thinking',
  agree: 'happy',
  disagree: 'concerned',
  encourage: 'happy',
  'celebrate-small': 'happy',
  'celebrate-big': 'excited',
  warning: 'concerned',
  wrong: 'sad',
  confused: 'thinking',
  debate: 'concerned',
  streak: 'excited',
  'level-up': 'excited',
  rest: 'neutral',
  offline: 'concerned',
  loading: 'neutral',
};

export const CHARACTER_NAME: Record<CharacterId, string> = {
  toto: 'Toto',
  bobo: 'Bobo',
};
