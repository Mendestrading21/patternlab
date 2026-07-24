/**
 * Dialogue contextuel de Toto & Bobo — logique PURE et déterministe (aucun rendu, aucun hasard).
 * Rend les mascottes vivantes : au lieu de répliques figées, `characterLine` choisit une phrase
 * VARIÉE et adaptée au contexte (bonne/mauvaise réponse, série, résultat de session, sens d'une
 * figure…). La variété vient d'une graine (index de question, score…) → reproductible et testable.
 *
 * Toto (taureau vert) = encourage, formule l'hypothèse haussière. Bobo (ours rouge) = rassure sur
 * l'erreur, pointe le risque. Jamais prescriptif : aucun ordre, aucune promesse de gain.
 */
import type { CharacterId, CharacterState } from './types';

export interface DialogueLine {
  character: CharacterId;
  state: CharacterState;
  text: string;
}

export type DialogueContext =
  | { kind: 'answer'; correct: boolean; streak?: number }
  | { kind: 'recognition'; correct: boolean; streak?: number }
  | { kind: 'result'; tier: 'perfect' | 'pass' | 'retry' }
  | { kind: 'mission' }
  | { kind: 'concept'; direction: 'bullish' | 'bearish' | 'neutral' };

// ─── Banques de répliques (3–4 variantes chacune, pour éviter la répétition) ──
const TOTO_CORRECT = [
  'Bien vu — ta lecture est juste.',
  'Exact, tu progresses !',
  'Nickel, tu lis bien le graphique.',
  'Parfait, c’est exactement ça.',
];
const TOTO_STREAK = [
  'Série en cours, tu enchaînes !',
  'Encore une — belle lecture !',
  'Tu es dans le rythme, continue !',
];
const BOBO_WRONG = [
  'Pas grave — l’important, c’est de comprendre.',
  'On apprend en se trompant : regarde pourquoi.',
  'Retiens la règle, tu la reverras.',
  'Erreur utile — on avance.',
];
const TOTO_PERFECT = [
  'Sans faute — parfait !',
  'Un carton plein, bravo !',
  'Impeccable du début à la fin !',
];
const TOTO_PASS = [
  'Belle session, tu tiens le rythme !',
  'Réussi — continue comme ça.',
  'Bien joué, ça rentre !',
];
const TOTO_RETRY = [
  'On y retourne quand tu veux.',
  'La répétition paie : on recommence ?',
  'Rien de perdu — on révise et on reprend.',
];
const TOTO_MISSION = [
  'Cinq minutes, et on progresse. On y va ?',
  'Ta mission du jour t’attend !',
  'Un pas de plus aujourd’hui ?',
];
const TOTO_BULL = [
  'Je vois une hypothèse haussière — à confirmer.',
  'Ça pourrait monter… si le contexte suit.',
];
const BOBO_BEAR = [
  'Attention : le risque penche à la baisse.',
  'Et si les vendeurs reprenaient la main ?',
];
const BOBO_NEUTRAL = [
  'Pas de biais net ici : on observe.',
  'Neutre pour l’instant — pas de précipitation.',
];

function pick(bank: string[], seed: number): string {
  const n = bank.length;
  const i = ((Math.floor(Number.isFinite(seed) ? seed : 0) % n) + n) % n;
  return bank[i];
}

const toto = (state: CharacterState, text: string): DialogueLine => ({ character: 'toto', state, text });
const bobo = (state: CharacterState, text: string): DialogueLine => ({ character: 'bobo', state, text });

/** Choisit une réplique adaptée au contexte. `seed` fait varier la phrase (déterministe). */
export function characterLine(ctx: DialogueContext, seed = 0): DialogueLine {
  switch (ctx.kind) {
    case 'answer':
    case 'recognition':
      if (ctx.correct) {
        return (ctx.streak ?? 0) >= 3
          ? toto('streak', pick(TOTO_STREAK, seed))
          : toto('celebrate-small', pick(TOTO_CORRECT, seed));
      }
      return bobo('wrong', pick(BOBO_WRONG, seed));
    case 'result':
      if (ctx.tier === 'perfect') return toto('celebrate-big', pick(TOTO_PERFECT, seed));
      if (ctx.tier === 'pass') return toto('celebrate-small', pick(TOTO_PASS, seed));
      return toto('encourage', pick(TOTO_RETRY, seed));
    case 'mission':
      return toto('welcome', pick(TOTO_MISSION, seed));
    case 'concept':
      if (ctx.direction === 'bullish') return toto('agree', pick(TOTO_BULL, seed));
      if (ctx.direction === 'bearish') return bobo('warning', pick(BOBO_BEAR, seed));
      return bobo('think', pick(BOBO_NEUTRAL, seed));
  }
}
