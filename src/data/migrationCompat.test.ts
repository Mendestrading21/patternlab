import { describe, it, expect } from '@jest/globals';
import { migrateProgress, PROGRESS_SCHEMA_VERSION } from './repositories';
import { conceptMasteryStatus } from './conceptMastery';
import { buildLearningPath, worldEntryById } from './learningMap';
import { WORLDS } from './learningConcept';
import { V5_CONCEPTS } from './learningContent';
import { rotateExercises } from './exerciseRotation';
import { getExercises, CHECKPOINT_ID } from './seed';

const T0 = 1_700_000_000_000;

/**
 * Compatibilité descendante des changements P0 (machine d'états stricte, verrou de
 * complétion des mondes, rotation). AUCUN nouveau champ persistant n'a été ajouté :
 * tout dérive de l'état existant. Ces tests prouvent que les ANCIENNES données
 * restent lisibles et sont relues de façon cohérente et prudente (jamais de perte,
 * jamais de sur-attribution de maîtrise), et que la reprise reste stable.
 */
describe('P0 — compatibilité des anciennes données (aucune migration destructive)', () => {
  const anatomy = V5_CONCEPTS.find((c) => c.slug === 'anatomie-bougie')!;

  it('une ancienne compétence « très solide » sans checkpoint n’est PLUS sur-notée « maîtrisée »', () => {
    // Ancien état (v6) : compétence au plafond SM-2, MAIS aucun completedSkills (checkpoint).
    const legacy = {
      schemaVersion: 6,
      totalXp: 300,
      skills: {
        'skill.candles': { skillId: 'skill.candles', xp: 300, mastery: 0.95, confidence: 0.9, review: { repetitions: 4, easiness: 2.6, intervalDays: 20, dueAt: T0 } },
      },
      learning: { conceptsExplored: ['anatomie-bougie'], worldsExplored: [], falseSignalsSpotted: 0 },
    };
    const m = migrateProgress(legacy, T0)!;
    expect(m.schemaVersion).toBe(PROGRESS_SCHEMA_VERSION);
    expect(m.skills['skill.candles'].mastery).toBeCloseTo(0.95); // progression conservée, pas perdue

    const st = conceptMasteryStatus(anatomy, {
      exploredSlugs: m.learning!.conceptsExplored,
      skills: m.skills,
      completedSkills: m.completedSkills, // [] après migration → checkpoint non prouvé
    });
    expect(st.mastered).toBe(false); // relu plus honnêtement
    expect(st.state).toBe('strong');
  });

  it('la même donnée AVEC checkpoint réussi devient légitimement « maîtrisée »', () => {
    const legacy = {
      totalXp: 300,
      completedSkills: [CHECKPOINT_ID],
      skills: {
        'skill.candles': { skillId: 'skill.candles', xp: 300, mastery: 0.95, confidence: 0.9, review: { repetitions: 4, easiness: 2.6, intervalDays: 20, dueAt: T0 } },
      },
      learning: { conceptsExplored: ['anatomie-bougie'], worldsExplored: [], falseSignalsSpotted: 0 },
    };
    const m = migrateProgress(legacy, T0)!;
    const st = conceptMasteryStatus(anatomy, {
      exploredSlugs: m.learning!.conceptsExplored,
      skills: m.skills,
      completedSkills: m.completedSkills,
    });
    expect(st.mastered).toBe(true);
  });

  it('un état sans `learning` ni `completedSkills` reste lisible (défauts sûrs, pas de crash)', () => {
    const m = migrateProgress({ totalXp: 0 }, T0)!;
    expect(m.completedSkills).toEqual([]);
    expect(m.learning!.conceptsExplored).toEqual([]);
    const st = conceptMasteryStatus(anatomy, {
      exploredSlugs: m.learning!.conceptsExplored,
      skills: m.skills,
      completedSkills: m.completedSkills,
    });
    expect(st.state).toBe('new');
    // Le parcours se construit sans erreur : monde 1 en cours, reste verrouillé.
    const path = buildLearningPath(WORLDS, V5_CONCEPTS, {
      completedSkills: m.completedSkills,
      exploredSlugs: m.learning!.conceptsExplored,
    });
    expect(worldEntryById(path, 'world.foundations')!.status).toBe('current');
  });

  it('reprise cohérente : même état → même round → même sélection d’exercices (déterministe)', () => {
    const raw = {
      totalXp: 50,
      skills: { 'skill.actions': { skillId: 'skill.actions', xp: 50, mastery: 0.4, confidence: 0.4, review: { repetitions: 2, easiness: 2.5, intervalDays: 6, dueAt: T0 } } },
    };
    // Deux « ouvertures d'app » : on migre deux fois la même donnée persistée.
    const a = migrateProgress(raw, T0)!;
    const b = migrateProgress(raw, T0)!;
    const roundA = a.skills['skill.actions'].review.repetitions;
    const roundB = b.skills['skill.actions'].review.repetitions;
    expect(roundA).toBe(roundB); // état stable après reprise
    const all = getExercises('skill.actions');
    expect(rotateExercises(all, 5, roundA)).toEqual(rotateExercises(all, 5, roundB));
  });
});
