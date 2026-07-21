import { describe, it, expect } from '@jest/globals';
import {
  repoTruth,
  REPO_TRUTH,
  exerciseFormatReconciliation,
  repoTruthLines,
  allExercisesFlat,
  allLessonsFlat,
} from './repoTruth';
import { SKILLS, getLessons, getExercises, CONCEPT_BY_SKILL } from './seed';
import { V5_CONCEPTS } from './learningContent';
import { BADGES } from './badges';
import { WORLDS, CATEGORIES } from './learningConcept';
import { GLOSSARY_TERMS } from './glossary';
import { SUPPORTED_VISUAL_TYPES } from '../engines/visual/visualDatasets';

function dupes<T>(values: T[]): T[] {
  const seen = new Set<T>();
  const out: T[] = [];
  for (const v of values) {
    if (seen.has(v)) out.push(v);
    seen.add(v);
  }
  return out;
}

describe('repoTruth — vérité du dépôt', () => {
  it('les compteurs reflètent exactement les registres du code', () => {
    const t = repoTruth();
    expect(t.concepts).toBe(V5_CONCEPTS.length);
    expect(t.skills).toBe(SKILLS.length);
    expect(t.lessons).toBe(allLessonsFlat().length);
    expect(t.exercises).toBe(allExercisesFlat().length);
    expect(t.glossaryTerms).toBe(GLOSSARY_TERMS.length);
    expect(t.badges).toBe(BADGES.length);
    expect(t.worlds).toBe(WORLDS.length);
    expect(t.categories).toBe(CATEGORIES.length);
    expect(t.visualTypes).toBe(SUPPORTED_VISUAL_TYPES.length);
    expect(REPO_TRUTH).toEqual(t);
  });

  it('aucun doublon d’identifiant/slug (unicité)', () => {
    expect(dupes(V5_CONCEPTS.map((c) => c.slug))).toEqual([]);
    expect(dupes(SKILLS.map((s) => s.id))).toEqual([]);
    expect(dupes(BADGES.map((b) => b.id))).toEqual([]);
    expect(dupes(GLOSSARY_TERMS.map((g) => g.slug))).toEqual([]);
    expect(dupes(WORLDS.map((w) => w.id))).toEqual([]);
    expect(dupes(CATEGORIES.map((c) => c.id))).toEqual([]);
    expect(dupes([...SUPPORTED_VISUAL_TYPES])).toEqual([]);
  });

  it('réconciliation des formats d’exercice : déclarés vs branchés (incohérence explicitée)', () => {
    const { declared, implemented, unimplemented } = exerciseFormatReconciliation();
    expect(declared.length).toBe(16);
    expect(implemented.length).toBe(13);
    // Les 3 formats déclarés sans grader ni renderer canonique (à finaliser/retirer au Lot 7).
    expect(unimplemented).toEqual(['drag_drop', 'draw_level', 'timed']);
    // Tout format branché est bien déclaré.
    for (const t of implemented) expect(declared).toContain(t);
  });

  it('intégrité du parcours : chaque compétence a leçon + exercices ; les liens concept résolvent', () => {
    const slugs = new Set(V5_CONCEPTS.map((c) => c.slug));
    for (const s of SKILLS) {
      expect(getExercises(s.id).length).toBeGreaterThan(0);
      expect(getLessons(s.id).length).toBeGreaterThan(0);
    }
    for (const [skillId, slug] of Object.entries(CONCEPT_BY_SKILL)) {
      expect(SKILLS.some((s) => s.id === skillId)).toBe(true);
      expect(slugs.has(slug)).toBe(true);
    }
  });

  it('pins structurels (un changement = un lot dédié, pas une dérive)', () => {
    // Compteurs structurels stables : leur évolution passe par un lot explicite du programme.
    expect(REPO_TRUTH.skills).toBe(4);
    expect(REPO_TRUTH.worlds).toBe(15);
    expect(REPO_TRUTH.categories).toBe(13);
    expect(REPO_TRUTH.visualTypes).toBe(10);
  });

  it('repoTruthLines produit une ligne lisible non vide par métrique', () => {
    const lines = repoTruthLines();
    expect(lines.length).toBe(10);
    for (const l of lines) expect(l.length).toBeGreaterThan(0);
    expect(lines.join('\n')).toContain('16 déclarés / 13 branchés');
  });
});
