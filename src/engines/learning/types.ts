/**
 * Moteur d'apprentissage — indépendant du contenu.
 * Hiérarchie : LearningPath > World > Module > Skill > Lesson > (Step | Exercise | Review).
 * Réf. kit : reference/06-learning-engine.md + schemas/lesson.schema.json.
 */

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type ContentStatus =
  | 'raw_imported'
  | 'normalized'
  | 'draft'
  | 'needs_review'
  | 'approved'
  | 'published'
  | 'archived';

/** Traçabilité de migration WMB (règle kit : origine + hash conservés). */
export interface LegacyMeta {
  legacySource?: string;
  legacyTable?: string;
  legacyId?: string | number;
  legacySlug?: string;
  sourceHash?: string;
  migrationVersion?: number;
  importedAt?: string;
  humanReviewStatus?: 'pending' | 'approved' | 'rejected';
}

/**
 * Types de steps d'une leçon V2 (réf. skill : « Leçon V2 »).
 * Anciens contenus (explain/example/interaction/summary) restent valides.
 * V5 (visual-first) ajoute `visual` (schéma d'un concept riche) et `hypothesis`
 * (hypothèse conditionnelle Toto/Bobo à partir des scénarios d'un concept).
 */
export type LessonStepKind =
  | 'intro' // hook d'ouverture
  | 'explain'
  | 'observe' // observation guidée
  | 'example'
  | 'chart' // graphique déterministe
  | 'visual' // V5 : visuel SVG d'un concept (via conceptRef)
  | 'hypothesis' // V5 : hypothèse Toto (haussière) / Bobo (risque) d'un concept
  | 'interaction'
  | 'warning'
  | 'falseSignal' // faux signal / limite
  | 'summary'
  | 'flashcard';

export interface Flashcard {
  front: string;
  back: string;
}

export interface LessonStep {
  id: string;
  kind: LessonStepKind;
  /** Texte du step (optionnel : un 'chart', 'flashcard' ou 'visual' peut s'en passer). */
  body?: string;
  /** Pour kind 'chart' : graine du graphique reproductible. */
  chartSeed?: number;
  /** Pour kind 'flashcard'. */
  flashcard?: Flashcard;
  /**
   * V5 : slug d'un `LearningConcept` (visual-first). Pour 'visual' → rend son `visualSpec` ;
   * pour 'hypothesis' → rend ses scénarios haussier/baissier via Toto/Bobo.
   * Chaîne primitive : aucune dépendance de `engines/learning` vers `data` (résolu à l'écran).
   */
  conceptRef?: string;
}

export interface Lesson {
  id: string;
  slug: string;
  title: string;
  skillId: string;
  objective?: string;
  difficulty?: Difficulty;
  estimatedMinutes?: number;
  steps: LessonStep[];
  /** Erreur fréquente à désamorcer (voix WMB/pédagogique). */
  commonMistake?: string;
  sources?: string[];
  status: ContentStatus;
  legacy?: LegacyMeta;
}

export interface Skill {
  id: string;
  name: string;
  description?: string;
}
