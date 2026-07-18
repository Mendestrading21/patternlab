/**
 * Contenu du module pilote « Lire un graphique » (voix pédagogique, aucune donnée personnelle WMB).
 * Structure : Module → Compétences ordonnées → Leçons + Exercices. Extensible vers 30-40 leçons.
 */
import type { Lesson, Skill } from '../engines/learning';
import { initialProgress } from '../engines/learning';
import type { Exercise } from '../engines/exercise';
import type { Pattern } from '../engines/pattern';
import { PROGRESS_SCHEMA_VERSION, type ProgressState } from './repositories';

export interface ContentModule {
  id: string;
  title: string;
  description: string;
  skills: Skill[];
}

// ─── Compétences (ordre = progression du parcours) ───────────────────
export const SKILLS: Skill[] = [
  { id: 'skill.actions', name: 'Comprendre une action', description: 'Ce qu’est une action et ce qu’implique d’en détenir.' },
  { id: 'skill.trend', name: 'Tendance, support & résistance', description: 'Lire la direction du prix et ses niveaux clés.' },
  { id: 'skill.candles', name: 'Chandeliers japonais', description: 'Décoder une bougie : corps, mèches, couleur.' },
  { id: 'skill.patterns', name: 'Premières figures', description: 'Repérer une figure de retournement simple.' },
];

export const PILOT_MODULE: ContentModule = {
  id: 'module.read-chart',
  title: 'Lire un graphique',
  description: 'Le parcours fondateur : de l’action au premier pattern.',
  skills: SKILLS,
};

// ─── Leçons par compétence ───────────────────────────────────────────
const LESSONS: Record<string, Lesson[]> = {
  'skill.actions': [
    {
      id: 'lesson.action-definition',
      slug: 'quest-ce-quune-action',
      title: 'Qu’est-ce qu’une action ?',
      skillId: 'skill.actions',
      objective: 'Comprendre ce que représente une action.',
      difficulty: 'beginner',
      estimatedMinutes: 4,
      steps: [
        { id: 's0', kind: 'intro', body: 'Derrière chaque action se cache une vraie entreprise. En détenir une, c’est en posséder un petit morceau.' },
        { id: 's1', kind: 'explain', body: 'Une action représente une petite part d’une entreprise. En détenir une fait de toi un actionnaire.' },
        { id: 's2', kind: 'example', body: 'Si une entreprise est découpée en 1 000 actions et que tu en as 10, tu possèdes 1 % de l’entreprise.' },
        { id: 's3', kind: 'summary', body: 'Une action = une part d’entreprise. Son prix varie selon l’offre et la demande.' },
        { id: 's4', kind: 'flashcard', flashcard: { front: 'Qu’est-ce qu’une action ?', back: 'Une part de propriété d’une entreprise : la détenir fait de toi un actionnaire.' } },
      ],
      commonMistake: 'Confondre le prix d’une action avec la « valeur » de l’entreprise.',
      sources: ['WMB — Glossaire : Action'],
      status: 'approved',
    },
    {
      id: 'lesson.action-vs-bond',
      slug: 'action-ou-obligation',
      title: 'Action ou obligation ?',
      skillId: 'skill.actions',
      objective: 'Distinguer être propriétaire (action) et être créancier (obligation).',
      difficulty: 'beginner',
      estimatedMinutes: 4,
      steps: [
        { id: 's1', kind: 'explain', body: 'Une action te rend copropriétaire. Une obligation est une dette : l’entreprise te doit de l’argent, tu n’en es pas propriétaire.' },
        { id: 's2', kind: 'summary', body: 'Action = part (risque + potentiel). Obligation = prêt (plus prévisible, remboursé).' },
      ],
      commonMistake: 'Croire qu’une obligation donne un droit de vote comme une action.',
      sources: ['WMB — Glossaire : Obligation'],
      status: 'approved',
    },
  ],
  'skill.trend': [
    {
      id: 'lesson.read-trend',
      slug: 'lire-une-tendance',
      title: 'Lire une tendance',
      skillId: 'skill.trend',
      objective: 'Identifier une tendance haussière, baissière ou latérale.',
      difficulty: 'beginner',
      estimatedMinutes: 5,
      steps: [
        { id: 's1', kind: 'explain', body: 'Des sommets et des creux de plus en plus hauts = tendance haussière. De plus en plus bas = baissière.' },
        { id: 's2', kind: 'summary', body: 'C’est la structure du prix qui définit la tendance, pas une opinion. En range, le prix oscille sans direction.' },
      ],
      commonMistake: 'Croire qu’une seule grosse bougie verte définit une tendance haussière.',
      sources: ['WMB — Glossaire : Tendance'],
      status: 'approved',
    },
    {
      id: 'lesson.support-resistance',
      slug: 'support-resistance',
      title: 'Support & résistance',
      skillId: 'skill.trend',
      objective: 'Repérer les niveaux où le prix a tendance à buter.',
      difficulty: 'beginner',
      estimatedMinutes: 5,
      steps: [
        { id: 's1', kind: 'explain', body: 'Le support est un plancher où les acheteurs reviennent. La résistance est un plafond où les vendeurs reprennent la main.' },
        { id: 's2', kind: 'summary', body: 'Ce sont des zones de mémoire du marché : des repères, pas des garanties.' },
      ],
      sources: ['WMB — Glossaire : Support & Résistance'],
      status: 'approved',
    },
  ],
  'skill.candles': [
    {
      id: 'lesson.candle-basics',
      slug: 'la-bougie-japonaise',
      title: 'La bougie japonaise',
      skillId: 'skill.candles',
      objective: 'Lire ce qu’une bougie raconte sur une période.',
      difficulty: 'beginner',
      estimatedMinutes: 6,
      steps: [
        { id: 's0', kind: 'intro', body: 'Une seule bougie raconte déjà une histoire : qui, des acheteurs ou des vendeurs, a eu le dernier mot sur la période.' },
        { id: 's1', kind: 'explain', body: 'Une bougie résume une période : ouverture, clôture, plus haut et plus bas. Le corps relie ouverture et clôture.' },
        { id: 's2', kind: 'observe', body: 'Repère le corps (épais) et les mèches (fins traits) : le corps dit le sens, les mèches disent jusqu’où le prix est allé.' },
        { id: 's3', kind: 'chart', chartSeed: 77, body: 'Sur ce graphique de démonstration, chaque bougie verte clôture plus haut qu’elle n’a ouvert, chaque rouge l’inverse.' },
        { id: 's4', kind: 'example', body: 'Bougie verte : la clôture est au-dessus de l’ouverture (hausse sur la période). Rouge : l’inverse.' },
        { id: 's5', kind: 'falseSignal', body: 'Une grande bougie verte n’annonce pas la suite : une longue mèche haute juste après peut signaler un rejet. Le contexte prime.' },
        { id: 's6', kind: 'summary', body: 'Les mèches montrent les extrêmes atteints ; le corps montre le sens dominant.' },
        { id: 's7', kind: 'flashcard', flashcard: { front: 'Que montre le corps d’une bougie ?', back: 'La distance ouverture ↔ clôture — donc le sens dominant de la période.' } },
      ],
      commonMistake: 'Lire la couleur sans regarder la taille du corps ni les mèches.',
      sources: ['WMB — Analyse technique : Chandeliers'],
      status: 'approved',
    },
    {
      id: 'lesson.candle-anatomy',
      slug: 'corps-meches-couleur',
      title: 'Corps, mèches, couleur',
      skillId: 'skill.candles',
      objective: 'Décomposer une bougie.',
      difficulty: 'beginner',
      estimatedMinutes: 4,
      steps: [
        { id: 's1', kind: 'explain', body: 'Corps = distance ouverture↔clôture. Mèche haute = plus haut. Mèche basse = plus bas.' },
        { id: 's2', kind: 'summary', body: 'Une longue mèche montre un rejet de prix : le marché y est allé puis en est revenu.' },
      ],
      sources: ['WMB — Analyse technique : Chandeliers'],
      status: 'approved',
    },
  ],
  'skill.patterns': [
    {
      id: 'lesson.reversal-figures',
      slug: 'figures-de-retournement',
      title: 'Figures de retournement',
      skillId: 'skill.patterns',
      objective: 'Comprendre l’idée d’une figure de retournement.',
      difficulty: 'intermediate',
      estimatedMinutes: 5,
      steps: [
        { id: 's1', kind: 'explain', body: 'Une figure de retournement suggère qu’une tendance pourrait s’inverser — sans jamais garantir quoi que ce soit.' },
        { id: 's2', kind: 'summary', body: 'On attend une confirmation (ex. cassure d’un niveau) avant de considérer la figure comme active.' },
      ],
      commonMistake: 'Anticiper une figure avant sa confirmation.',
      sources: ['WMB — Figures chartistes'],
      status: 'approved',
    },
    {
      id: 'lesson.double-bottom',
      slug: 'le-double-creux',
      title: 'Le double creux',
      skillId: 'skill.patterns',
      objective: 'Reconnaître un double creux et sa confirmation.',
      difficulty: 'intermediate',
      estimatedMinutes: 6,
      steps: [
        { id: 's0', kind: 'intro', body: 'Après une baisse, le prix teste deux fois le même plancher sans le casser : les vendeurs s’essoufflent-ils ?' },
        { id: 's1', kind: 'explain', body: 'Deux creux à un niveau proche séparés par un rebond forment un « W ». C’est une figure potentiellement haussière.' },
        { id: 's2', kind: 'chart', chartSeed: 314, body: 'Observe la structure en « W » : deux creux proches et un sommet intermédiaire (la ligne de cou).' },
        { id: 's3', kind: 'falseSignal', body: 'Tant que la ligne de cou n’est pas cassée, la figure n’est pas confirmée ; un nouveau plus-bas sous le second creux l’invalide.' },
        { id: 's4', kind: 'summary', body: 'La confirmation vient de la cassure de la ligne de cou, idéalement avec du volume.' },
        { id: 's5', kind: 'flashcard', flashcard: { front: 'Qu’est-ce qui confirme un double creux ?', back: 'La cassure de la ligne de cou (le sommet intermédiaire), idéalement soutenue par le volume.' } },
      ],
      commonMistake: 'Ignorer le volume, souvent plus faible sur le second creux.',
      sources: ['WMB — Figures chartistes : Double Creux'],
      status: 'approved',
    },
  ],
};

// ─── Exercices par compétence (formats variés) ───────────────────────
const fb = (correct: string, incorrect: string, rule?: string, whenItFails?: string) => ({ correct, incorrect, rule, whenItFails });

const EXERCISES: Record<string, Exercise[]> = {
  'skill.actions': [
    { id: 'ex.actions.mcq', type: 'mcq', skillId: 'skill.actions', prompt: 'Que représente une action ?', options: ['Un prêt à une entreprise', 'Une part d’une entreprise', 'Une monnaie numérique'], validation: { correctIndex: 1 }, difficulty: 'easy', feedback: fb('Exact — une action, c’est une part d’entreprise.', 'Une action n’est ni un prêt ni une monnaie.', 'Action = part d’entreprise.', 'Un prêt à une entreprise, c’est une obligation.') },
    { id: 'ex.actions.tf', type: 'true_false', skillId: 'skill.actions', prompt: 'Un actionnaire possède une part de l’entreprise.', validation: { answer: true }, difficulty: 'easy', feedback: fb('Oui : détenir une action, c’est posséder une fraction de l’entreprise.', 'C’est pourtant vrai : l’actionnaire est copropriétaire.', 'Actionnaire = copropriétaire.') },
    { id: 'ex.actions.numeric', type: 'numeric', skillId: 'skill.actions', prompt: 'Sur 1 000 actions, combien en faut-il pour 1 % ?', unit: 'actions', validation: { answer: 10, tolerance: 0 }, difficulty: 'easy', feedback: fb('Exact : 1 % de 1 000 = 10.', '1 % de 1 000 = 10 actions.', 'Part = actions détenues ÷ total.') },
    { id: 'ex.actions.match', type: 'match', skillId: 'skill.actions', prompt: 'Associe chaque terme à sa définition.', left: ['Action', 'Obligation', 'Dividende'], right: ['Part d’entreprise', 'Dette de l’entreprise', 'Part du bénéfice versée'], validation: { matches: [0, 1, 2] }, difficulty: 'medium', feedback: fb('Parfait : action = part, obligation = dette, dividende = bénéfice versé.', 'Une obligation est une dette, pas une part.', 'Action ≠ obligation.') },
    { id: 'ex.actions.find', type: 'find_error', skillId: 'skill.actions', prompt: 'Repère l’affirmation FAUSSE.', statements: ['Une action est une part d’entreprise.', 'Le prix d’une action ne varie jamais.', 'Un actionnaire peut recevoir des dividendes.'], validation: { errorIndex: 1 }, difficulty: 'easy', feedback: fb('Exact : le prix varie en permanence.', 'L’erreur est « le prix ne varie jamais ».', 'Le prix d’une action fluctue toujours.') },
  ],
  'skill.trend': [
    { id: 'ex.trend.tf', type: 'true_false', skillId: 'skill.trend', prompt: 'Des sommets et creux de plus en plus hauts décrivent une tendance haussière.', validation: { answer: true }, difficulty: 'easy', feedback: fb('Oui : c’est la définition structurelle d’une tendance haussière.', 'C’est vrai : ce sont les points hauts/bas croissants qui font la tendance.', 'La structure du prix définit la tendance.') },
    { id: 'ex.trend.order', type: 'order', skillId: 'skill.trend', prompt: 'Ordonne du plus baissier au plus haussier.', items: ['Marché haussier (bull)', 'Marché en range', 'Marché baissier (bear)'], validation: { correctOrder: [2, 1, 0] }, difficulty: 'medium', feedback: fb('Bien vu : bear → range → bull.', 'Ordre attendu : baissier, range, haussier.', 'Bear = baisse durable ; bull = hausse durable.') },
    { id: 'ex.trend.mcq', type: 'mcq', skillId: 'skill.trend', prompt: 'Qu’est-ce qu’une résistance ?', options: ['Un plancher où les acheteurs reviennent', 'Un plafond où les vendeurs reprennent la main', 'Un indicateur de volume'], validation: { correctIndex: 1 }, difficulty: 'medium', feedback: fb('Exact : la résistance plafonne la hausse.', 'La résistance est un plafond ; le plancher, c’est le support.', 'Résistance = plafond, support = plancher.') },
    { id: 'ex.trend.find', type: 'find_error', skillId: 'skill.trend', prompt: 'Repère l’affirmation FAUSSE.', statements: ['Le support agit comme un plancher.', 'La résistance garantit à 100 % que le prix redescend.', 'Ces niveaux sont des repères, pas des certitudes.'], validation: { errorIndex: 1 }, difficulty: 'medium', feedback: fb('Exact : rien n’est garanti à 100 %.', 'L’erreur est le « garantit à 100 % ».', 'Un niveau est un repère, jamais une garantie.') },
    { id: 'ex.trend.identify', type: 'identify_pattern', skillId: 'skill.trend', prompt: 'Quelle tendance générale ce graphique montre-t-il ?', chartSeed: 2024, options: ['Haussière', 'Baissière', 'Latérale (range)'], validation: { correctIndex: 0 }, difficulty: 'medium', feedback: fb('Oui : la structure globale monte (sommets/creux plus hauts).', 'Regarde la structure d’ensemble : elle progresse vers le haut.', 'La tendance se lit sur la structure, pas sur une bougie.') },
    { id: 'ex.trend.zone', type: 'select_chart_zone', skillId: 'skill.trend', prompt: 'Le support est le plancher où les acheteurs reviennent. Touche la zone du support.', chartSeed: 2024, zones: ['Zone haute', 'Zone médiane', 'Zone basse'], validation: { correctZone: 2 }, difficulty: 'medium', feedback: fb('Exact — le support, c’est la zone basse (le plancher).', 'Le support est la zone basse ; le plafond du haut, c’est la résistance.', 'Support = plancher (bas), résistance = plafond (haut).', 'Un support finit parfois par céder : rien n’est garanti à 100 %.') },
  ],
  'skill.candles': [
    { id: 'ex.candles.mcq', type: 'mcq', skillId: 'skill.candles', prompt: 'Une bougie verte signifie…', options: ['Clôture au-dessus de l’ouverture', 'Clôture en dessous de l’ouverture', 'Aucun échange'], validation: { correctIndex: 0 }, difficulty: 'easy', feedback: fb('Exact : verte = clôture > ouverture.', 'Verte = clôture au-dessus de l’ouverture (hausse sur la période).', 'Couleur = sens ouverture→clôture.') },
    { id: 'ex.candles.tf', type: 'true_false', skillId: 'skill.candles', prompt: 'Les mèches montrent les prix extrêmes atteints pendant la période.', validation: { answer: true }, difficulty: 'easy', feedback: fb('Oui : mèche haute = plus haut, mèche basse = plus bas.', 'C’est vrai : les mèches marquent les extrêmes.', 'Corps = sens ; mèches = extrêmes.') },
    { id: 'ex.candles.match', type: 'match', skillId: 'skill.candles', prompt: 'Associe chaque élément à ce qu’il représente.', left: ['Corps', 'Mèche haute', 'Couleur'], right: ['Ouverture ↔ clôture', 'Plus haut atteint', 'Sens de la période'], validation: { matches: [0, 1, 2] }, difficulty: 'medium', feedback: fb('Parfait.', 'Corps = ouverture↔clôture, mèche haute = plus haut, couleur = sens.', 'Chaque partie raconte quelque chose de précis.') },
    { id: 'ex.candles.find', type: 'find_error', skillId: 'skill.candles', prompt: 'Repère l’affirmation FAUSSE.', statements: ['Le corps relie ouverture et clôture.', 'Une longue mèche indique un rejet de prix.', 'La couleur d’une bougie prédit la bougie suivante.'], validation: { errorIndex: 2 }, difficulty: 'medium', feedback: fb('Exact : une couleur ne prédit pas la suite.', 'L’erreur : la couleur ne prédit pas la bougie suivante.', 'Une bougie décrit le passé, pas l’avenir.') },
  ],
  'skill.patterns': [
    { id: 'ex.patterns.identify', type: 'identify_pattern', skillId: 'skill.patterns', prompt: 'Sur ce schéma, quelle est la direction dominante ?', chartSeed: 314, options: ['Plutôt haussière', 'Plutôt baissière', 'Sans direction nette'], validation: { correctIndex: 0 }, difficulty: 'medium', feedback: fb('Bien lu : la structure progresse vers le haut.', 'Observe l’ensemble : la structure monte.', 'On lit la direction sur la structure globale.') },
    { id: 'ex.patterns.mcq', type: 'mcq', skillId: 'skill.patterns', prompt: 'Un double creux est une figure plutôt…', options: ['Haussière', 'Baissière', 'Neutre par nature'], validation: { correctIndex: 0 }, difficulty: 'medium', feedback: fb('Exact : le double creux est une figure de retournement haussier.', 'Le double creux (« W ») est plutôt haussier.', 'Deux creux + cassure = potentiel haussier.') },
    { id: 'ex.patterns.tf', type: 'true_false', skillId: 'skill.patterns', prompt: 'Un double creux est confirmé par la cassure de la ligne de cou.', validation: { answer: true }, difficulty: 'medium', feedback: fb('Oui : sans cassure de la ligne de cou, la figure n’est pas confirmée.', 'C’est vrai : la cassure de la ligne de cou confirme.', 'Pas de confirmation sans cassure.') },
    { id: 'ex.patterns.find', type: 'find_error', skillId: 'skill.patterns', prompt: 'Repère l’affirmation FAUSSE sur le double creux.', statements: ['Les deux creux sont à un niveau proche.', 'La figure est invalidée si le prix casse nettement sous le second creux.', 'La figure garantit une hausse.'], validation: { errorIndex: 2 }, difficulty: 'medium', feedback: fb('Exact : aucune figure ne garantit un mouvement.', 'L’erreur : rien n’est garanti.', 'Une figure donne un scénario, jamais une certitude.') },
    { id: 'ex.patterns.scenario', type: 'scenario', skillId: 'skill.patterns', prompt: 'Que peux-tu en conclure ?', context: 'Un double creux s’est formé et le prix casse la ligne de cou avec du volume.', options: ['La figure est confirmée : hypothèse haussière.', 'La figure est invalidée.', 'Il ne se passe rien de notable.'], validation: { correctIndex: 0 }, difficulty: 'medium', feedback: fb('Oui : cassure de la ligne de cou + volume = confirmation.', 'La cassure de la ligne de cou avec volume confirme la figure.', 'Confirmation = cassure de la ligne de cou, idéalement avec volume.', 'Une confirmation n’est jamais une certitude : le prix peut refranchir le niveau (faux signal).') },
  ],
};

// ─── Checkpoint (revue mixte du module) ──────────────────────────────
// Nœud de fin de module : réunit quelques exercices de chaque compétence.
// Les exercices gardent leur skillId réel → répondre met à jour la maîtrise réelle.
export const CHECKPOINT_ID = 'checkpoint.read-chart';
export const CHECKPOINT_TITLE = 'Revue — Lire un graphique';
export function isCheckpoint(id: string): boolean {
  return id === CHECKPOINT_ID;
}

// ─── Helpers de contenu ──────────────────────────────────────────────
export function getLessons(skillId: string): Lesson[] {
  return LESSONS[skillId] ?? [];
}
export function getExercises(skillId: string): Exercise[] {
  if (skillId === CHECKPOINT_ID) {
    return SKILLS.flatMap((s) => (EXERCISES[s.id] ?? []).slice(0, 2));
  }
  return EXERCISES[skillId] ?? [];
}
export function skillById(id: string): Skill | undefined {
  if (id === CHECKPOINT_ID) return { id: CHECKPOINT_ID, name: CHECKPOINT_TITLE };
  return SKILLS.find((s) => s.id === id);
}
export function allLessons(): Lesson[] {
  return SKILLS.flatMap((s) => getLessons(s.id));
}

export const DEMO_PATTERN: Pattern = {
  id: 'pattern.double-bottom',
  slug: 'double-creux',
  name: 'Double Creux',
  aliases: ['Double Bottom', 'W'],
  family: 'double_top_bottom',
  direction: 'bullish',
  difficulty: 'beginner',
  definition: 'Deux creux à un niveau proche séparés par un rebond, formant un « W ». Une figure de retournement potentiellement haussière.',
  recognitionRules: ['Deux creux à un niveau similaire.', 'Un sommet intermédiaire (ligne de cou).', 'Une cassure au-dessus de la ligne de cou confirme.'],
  invalidationRules: ['Le prix casse nettement sous le second creux.', 'Aucune cassure de la ligne de cou : figure non confirmée.'],
  commonMistakes: ['Anticiper avant la cassure de la ligne de cou.'],
  sources: ['WMB — Figures chartistes : Double Creux'],
  status: 'approved',
};

// ─── Rétro-compat (P0.1/P0.2) ────────────────────────────────────────
export const DEMO_SKILL: Skill = SKILLS[0];
export const DEMO_LESSONS: Lesson[] = getLessons('skill.actions');
export const DEMO_EXERCISES: Exercise[] = getExercises('skill.actions');

/** Progression par défaut : une entrée par compétence du module. */
export function defaultProgress(now: number): ProgressState {
  const skills = Object.fromEntries(SKILLS.map((s) => [s.id, initialProgress(s.id, now)]));
  return {
    onboarded: false,
    level: 1,
    totalXp: 0,
    streakDays: 0,
    coins: 0,
    completedSkills: [],
    skills,
    daily: { date: '', sessions: 0, correct: 0, xp: 0 },
    claimedQuestIds: [],
    claimedStreakMilestones: [],
    history: [],
    schemaVersion: PROGRESS_SCHEMA_VERSION,
  };
}
