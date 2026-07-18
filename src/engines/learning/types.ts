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
 */
export type LessonStepKind =
  | 'intro' // hook d'ouverture
  | 'explain'
  | 'observe' // observation guidée
  | 'example'
  | 'chart' // graphique déterministe
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
  /** Texte du step (optionnel : un 'chart' ou une 'flashcard' peut s'en passer). */
  body?: string;
  /** Pour kind 'chart' : graine du graphique reproductible. */
  chartSeed?: number;
  /** Pour kind 'flashcard'. */
  flashcard?: Flashcard;
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
