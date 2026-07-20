/** Réussites (badges) — dérivées de la progression réelle. */
import { emptyLearning, type ProgressState } from './repositories';

export interface Badge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  /** Famille d'affichage : progression générale (v1) ou compréhension V5. */
  family?: 'progress' | 'understanding';
  earned: (s: ProgressState) => boolean;
}

const learn = (s: ProgressState) => s.learning ?? emptyLearning();
const skillMastery = (s: ProgressState, id: string) => s.skills[id]?.mastery ?? 0;

export const BADGES: Badge[] = [
  { id: 'first-step', name: 'Premier pas', emoji: '👣', description: 'Tu as démarré PatternLab.', family: 'progress', earned: (s) => s.onboarded },
  { id: 'first-skill', name: 'Première compétence', emoji: '🎓', description: 'Termine ta première compétence.', family: 'progress', earned: (s) => s.completedSkills.length >= 1 },
  { id: 'streak-3', name: 'Série de 3', emoji: '🔥', description: 'Reviens 3 jours d’affilée.', family: 'progress', earned: (s) => s.streakDays >= 3 },
  { id: 'explorer', name: 'Explorateur', emoji: '🧭', description: 'Atteins le niveau 2.', family: 'progress', earned: (s) => s.level >= 2 },
  { id: 'collector', name: 'Collectionneur', emoji: '🪙', description: 'Amasse 50 pièces.', family: 'progress', earned: (s) => s.coins >= 50 },
  { id: 'studious', name: 'Studieux', emoji: '📚', description: 'Gagne 100 XP au total.', family: 'progress', earned: (s) => s.totalXp >= 100 },
  { id: 'mastery', name: 'Maîtrise', emoji: '🧠', description: 'Atteins 80 % de maîtrise sur une compétence.', family: 'progress', earned: (s) => Object.values(s.skills).some((sk) => sk.mastery >= 0.8) },
  { id: 'module-done', name: 'Module bouclé', emoji: '🏔️', description: 'Termine les 4 compétences du module.', family: 'progress', earned: (s) => s.completedSkills.length >= 4 },
  // ── Compréhension V5 : récompensent le savoir et la diversité, jamais des gains ──
  { id: 'candle-anatomist', name: 'Anatomiste des bougies', emoji: '🕯️', description: 'Atteins 50 % de maîtrise sur les chandeliers.', family: 'understanding', earned: (s) => skillMastery(s, 'skill.candles') >= 0.5 },
  { id: 'trend-cartographer', name: 'Cartographe des tendances', emoji: '🗺️', description: 'Atteins 50 % de maîtrise sur les tendances.', family: 'understanding', earned: (s) => skillMastery(s, 'skill.trend') >= 0.5 },
  { id: 'pattern-reader', name: 'Lecteur de figures', emoji: '📐', description: 'Atteins 50 % de maîtrise sur les figures.', family: 'understanding', earned: (s) => skillMastery(s, 'skill.patterns') >= 0.5 },
  { id: 'false-signal-spotter', name: 'Détecteur de faux signaux', emoji: '🚩', description: 'Repère 3 faux signaux ou invalidations.', family: 'understanding', earned: (s) => learn(s).falseSignalsSpotted >= 3 },
  { id: 'curious', name: 'Curieux', emoji: '🔍', description: 'Explore 5 concepts.', family: 'understanding', earned: (s) => learn(s).conceptsExplored.length >= 5 },
  { id: 'world-cartographer', name: 'Cartographe des mondes', emoji: '🌍', description: 'Explore 3 mondes.', family: 'understanding', earned: (s) => learn(s).worldsExplored.length >= 3 },
  { id: 'reader-eye', name: 'Œil de lecteur', emoji: '👁️', description: 'Reconnais 15 figures à l’entraîneur.', family: 'understanding', earned: (s) => learn(s).figuresRecognized >= 15 },
  // ── Paliers supérieurs (rétention longue) ──
  { id: 'streak-7', name: 'Série de 7', emoji: '📅', description: 'Reviens 7 jours d’affilée.', family: 'progress', earned: (s) => s.streakDays >= 7 },
  { id: 'climber', name: 'Grimpeur', emoji: '🧗', description: 'Atteins le niveau 5.', family: 'progress', earned: (s) => s.level >= 5 },
  { id: 'devoted', name: 'Assidu', emoji: '📖', description: 'Gagne 500 XP au total.', family: 'progress', earned: (s) => s.totalXp >= 500 },
  { id: 'treasurer', name: 'Trésorier', emoji: '💰', description: 'Amasse 200 pièces.', family: 'progress', earned: (s) => s.coins >= 200 },
  { id: 'curious-plus', name: 'Grand curieux', emoji: '🔭', description: 'Explore 25 concepts.', family: 'understanding', earned: (s) => learn(s).conceptsExplored.length >= 25 },
  { id: 'world-tour', name: 'Tour des mondes', emoji: '🌐', description: 'Explore les 15 mondes.', family: 'understanding', earned: (s) => learn(s).worldsExplored.length >= 15 },
  { id: 'sharp-eye', name: 'Œil aiguisé', emoji: '🦅', description: 'Reconnais 30 figures à l’entraîneur.', family: 'understanding', earned: (s) => learn(s).figuresRecognized >= 30 },
  { id: 'flawless-reco', name: 'Sans faute', emoji: '🎯', description: 'Enchaîne 8 figures reconnues d’affilée.', family: 'understanding', earned: (s) => learn(s).bestRecognitionStreak >= 8 },
];

export function earnedBadges(state: ProgressState | null): Set<string> {
  if (!state) return new Set();
  return new Set(BADGES.filter((b) => b.earned(state)).map((b) => b.id));
}
