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
