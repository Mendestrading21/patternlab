/**
 * Disponibilité hors-ligne — pure et testable.
 *
 * PatternLab embarque tout le contenu du parcours (compétences, leçons, exercices,
 * glossaire, badges) et stocke la progression localement (AsyncStorage). Ce module
 * résume ce qui est réellement disponible sans réseau, pour l'afficher honnêtement à
 * l'utilisateur (« tout fonctionne hors-ligne ») et le garantir par test.
 */
import { SKILLS, allLessons, getExercises } from './seed';
import { GLOSSARY_TERMS } from './glossary';
import { BADGES } from './badges';

export interface OfflineCapabilities {
  skills: number;
  lessons: number;
  exercises: number;
  glossaryTerms: number;
  badges: number;
  /** Tout le contenu du parcours est embarqué (disponible hors-ligne). */
  contentReady: boolean;
  /** La progression est stockée localement (aucune dépendance réseau). */
  progressLocal: boolean;
}

export function offlineCapabilities(): OfflineCapabilities {
  const lessons = allLessons().length;
  const exercises = SKILLS.reduce((n, s) => n + getExercises(s.id).length, 0);
  return {
    skills: SKILLS.length,
    lessons,
    exercises,
    glossaryTerms: GLOSSARY_TERMS.length,
    badges: BADGES.length,
    contentReady: SKILLS.length > 0 && lessons > 0 && exercises > 0,
    progressLocal: true,
  };
}
