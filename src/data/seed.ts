/**
 * Contenu de démonstration (voix pédagogique, aucune donnée personnelle WMB).
 * Sert la tranche verticale P0.2 ; en P0.1 il alimente les écrans Leçons/Quiz/Laboratoire.
 */
import type { Lesson, Skill } from '../engines/learning';
import { initialProgress } from '../engines/learning';
import type { Exercise } from '../engines/exercise';
import type { Pattern } from '../engines/pattern';
import { PROGRESS_SCHEMA_VERSION, type ProgressState } from './repositories';

export const DEMO_SKILL: Skill = {
  id: 'skill.actions',
  name: 'Comprendre une action',
  description: 'Ce qu’est une action, comment lire son prix et sa tendance.',
};

export const DEMO_LESSONS: Lesson[] = [
  {
    id: 'lesson.action-definition',
    slug: 'quest-ce-quune-action',
    title: 'Qu’est-ce qu’une action ?',
    skillId: DEMO_SKILL.id,
    objective: 'Comprendre ce que représente une action et ce qu’implique d’en détenir.',
    difficulty: 'beginner',
    estimatedMinutes: 4,
    steps: [
      {
        id: 'step.1',
        kind: 'explain',
        body: 'Une action représente une petite part d’une entreprise. En posséder une fait de toi un actionnaire : tu détiens une fraction de la société.',
      },
      {
        id: 'step.2',
        kind: 'example',
        body: 'Si une entreprise est découpée en 1 000 actions et que tu en détiens 10, tu possèdes 1 % de l’entreprise — et 1 % de ses bénéfices distribués.',
      },
      {
        id: 'step.3',
        kind: 'summary',
        body: 'Retiens : une action = une part d’entreprise. Son prix monte et descend selon l’offre et la demande.',
      },
    ],
    commonMistake:
      'Confondre le prix d’une action avec la « valeur » de l’entreprise : un prix élevé ne veut pas dire une entreprise « chère » sans regarder le nombre d’actions.',
    sources: ['WMB — Glossaire : Action'],
    status: 'approved',
  },
  {
    id: 'lesson.read-trend',
    slug: 'lire-une-tendance',
    title: 'Lire une tendance',
    skillId: DEMO_SKILL.id,
    objective: 'Identifier une tendance haussière, baissière ou latérale à partir de la structure du prix.',
    difficulty: 'beginner',
    estimatedMinutes: 5,
    steps: [
      {
        id: 'step.1',
        kind: 'explain',
        body: 'La tendance est la direction générale du prix : une succession de sommets et de creux de plus en plus hauts = tendance haussière.',
      },
      {
        id: 'step.2',
        kind: 'summary',
        body: 'C’est la structure du prix qui définit la tendance, pas une opinion. En latéral (range), le prix oscille sans direction claire.',
      },
    ],
    commonMistake: 'Croire qu’une seule grosse bougie verte suffit à définir une tendance haussière.',
    sources: ['WMB — Glossaire : Tendance'],
    status: 'approved',
  },
];

export const DEMO_EXERCISES: Exercise[] = [
  {
    id: 'ex.action-mcq',
    type: 'mcq',
    skillId: DEMO_SKILL.id,
    prompt: 'Que représente une action ?',
    options: ['Un prêt fait à une entreprise', 'Une petite part d’une entreprise', 'Une monnaie numérique'],
    validation: { correctIndex: 1 },
    difficulty: 'easy',
    feedback: {
      correct: 'Exact — détenir une action, c’est posséder une fraction de l’entreprise.',
      incorrect: 'Pas tout à fait : une action n’est ni un prêt (ça, c’est une obligation), ni une monnaie.',
      rule: 'Une action = une part d’entreprise.',
      whenItFails: 'Une obligation, elle, est une dette : l’entreprise te doit de l’argent, tu n’en es pas propriétaire.',
    },
    sources: ['WMB — Glossaire : Action'],
  },
  {
    id: 'ex.trend-tf',
    type: 'true_false',
    skillId: DEMO_SKILL.id,
    prompt: 'Vrai ou faux : une succession de sommets et de creux de plus en plus hauts décrit une tendance haussière.',
    validation: { answer: true },
    difficulty: 'easy',
    feedback: {
      correct: 'Oui : c’est la définition structurelle d’une tendance haussière.',
      incorrect: 'C’est pourtant vrai : ce sont les points hauts/bas croissants qui font la tendance.',
      rule: 'La structure du prix définit la tendance.',
    },
    sources: ['WMB — Glossaire : Tendance'],
  },
  {
    id: 'ex.action-numeric',
    type: 'numeric',
    skillId: DEMO_SKILL.id,
    prompt: 'Une entreprise est découpée en 1 000 actions. Combien d’actions représentent 1 % ?',
    unit: 'actions',
    validation: { answer: 10, tolerance: 0 },
    difficulty: 'easy',
    feedback: {
      correct: 'Exact : 1 % de 1 000, c’est 10 actions.',
      incorrect: '1 % de 1 000 = 10. Chaque action vaut 0,1 % de l’entreprise.',
      rule: 'Ta part = nombre d’actions détenues ÷ nombre total d’actions.',
    },
  },
  {
    id: 'ex.regimes-order',
    type: 'order',
    skillId: DEMO_SKILL.id,
    prompt: 'Ordonne ces régimes du plus baissier au plus haussier.',
    items: ['Marché haussier (bull)', 'Marché en range', 'Marché baissier (bear)'],
    validation: { correctOrder: [2, 1, 0] },
    difficulty: 'medium',
    feedback: {
      correct: 'Bien vu : bear → range → bull, du plus baissier au plus haussier.',
      incorrect: 'Ordre attendu : baissier (bear), puis range, puis haussier (bull).',
      rule: 'Bear = prix qui baissent durablement ; bull = prix qui montent durablement.',
    },
  },
  {
    id: 'ex.terms-match',
    type: 'match',
    skillId: DEMO_SKILL.id,
    prompt: 'Associe chaque terme à sa définition.',
    left: ['Action', 'Obligation', 'Dividende'],
    right: ['Part d’entreprise', 'Dette de l’entreprise', 'Part du bénéfice versée'],
    validation: { matches: [0, 1, 2] },
    difficulty: 'medium',
    feedback: {
      correct: 'Parfait : action = part, obligation = dette, dividende = bénéfice versé.',
      incorrect: 'Rappel : une obligation est une dette (pas une part), le dividende est versé aux actionnaires.',
      rule: 'Action ≠ obligation : l’une te rend propriétaire, l’autre créancier.',
    },
  },
  {
    id: 'ex.action-find-error',
    type: 'find_error',
    skillId: DEMO_SKILL.id,
    prompt: 'Repère l’affirmation FAUSSE.',
    statements: [
      'Une action représente une part d’entreprise.',
      'Le prix d’une action ne varie jamais.',
      'Un actionnaire peut recevoir des dividendes.',
    ],
    validation: { errorIndex: 1 },
    difficulty: 'easy',
    feedback: {
      correct: 'Exact : le prix d’une action varie en permanence selon l’offre et la demande.',
      incorrect: 'L’erreur est « le prix ne varie jamais » : il bouge en continu.',
      rule: 'Le prix d’une action fluctue ; il n’est jamais figé.',
    },
  },
];

export const DEMO_PATTERN: Pattern = {
  id: 'pattern.double-bottom',
  slug: 'double-creux',
  name: 'Double Creux',
  aliases: ['Double Bottom', 'W'],
  family: 'double_top_bottom',
  direction: 'bullish',
  difficulty: 'beginner',
  definition:
    'Deux creux à un niveau proche séparés par un rebond, formant un « W ». Une figure de retournement potentiellement haussière.',
  recognitionRules: [
    'Deux creux à un niveau similaire (le second ne casse pas nettement le premier).',
    'Un sommet intermédiaire (la « ligne de cou ») entre les deux creux.',
    'Une cassure au-dessus de la ligne de cou pour confirmer.',
  ],
  invalidationRules: [
    'Le prix casse nettement sous le second creux.',
    'Aucune cassure de la ligne de cou : la figure n’est pas confirmée.',
  ],
  commonMistakes: [
    'Anticiper la figure avant la cassure de la ligne de cou.',
    'Ignorer le volume, souvent plus faible sur le second creux.',
  ],
  confirmationSignals: ['Cassure de la ligne de cou, idéalement avec une hausse du volume.'],
  sources: ['WMB — Figures chartistes : Double Creux'],
  status: 'approved',
};

/** État de progression par défaut d'un nouvel utilisateur. */
export function defaultProgress(now: number): ProgressState {
  return {
    onboarded: false,
    level: 1,
    totalXp: 0,
    streakDays: 0,
    coins: 0,
    skills: { [DEMO_SKILL.id]: initialProgress(DEMO_SKILL.id, now) },
    schemaVersion: PROGRESS_SCHEMA_VERSION,
  };
}
