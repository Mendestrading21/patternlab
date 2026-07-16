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

export type LessonStepKind = 'explain' | 'example' | 'interaction' | 'summary';

export interface LessonStep {
  id: string;
  kind: LessonStepKind;
  body: string;
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
