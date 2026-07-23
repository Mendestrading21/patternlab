import { describe, it, expect } from '@jest/globals';
import { conceptMasteryStatus } from './conceptMastery';
import { V5_CONCEPTS } from './learningContent';
import { CHECKPOINT_ID } from './seed';
import { initialReview, type SkillProgress } from '../engines/learning';

const anatomy = V5_CONCEPTS.find((c) => c.slug === 'anatomie-bougie')!; // skill.candles, REPRÉSENTATIF
const marteau = V5_CONCEPTS.find((c) => c.slug === 'marteau')!; // skill.candles, NON représentatif
const noSkill = V5_CONCEPTS.find((c) => !c.skillId)!;

const sp = (over: Partial<SkillProgress>): SkillProgress => ({
  skillId: 'skill.candles',
  xp: 0,
  mastery: 0,
  confidence: 0,
  review: initialReview(0),
  errorTags: {},
  ...over,
});

/** Compétence remplissant TOUTES les conditions de maîtrise SM-2. */
const fullyMastered = sp({ mastery: 0.9, confidence: 0.9, review: { repetitions: 3, easiness: 2.5, intervalDays: 15, dueAt: 0 } });
/** Solide (mastery haute) mais pas encore prouvée dans le temps (reps < 3). */
const strong = sp({ mastery: 0.85, review: { repetitions: 2, easiness: 2.5, intervalDays: 6, dueAt: 0 } });

describe('conceptMasteryStatus — découverte ≠ maîtrise (machine d’états stricte)', () => {
  it('Nouveau quand ni exploré ni entraîné', () => {
    const s = conceptMasteryStatus(anatomy, { exploredSlugs: [], skills: {} });
    expect(s.state).toBe('new');
    expect(s.label).toBe('Nouveau');
  });

  it('Découvert quand la fiche est consultée mais la compétence pas entraînée', () => {
    const s = conceptMasteryStatus(anatomy, { exploredSlugs: ['anatomie-bougie'], skills: {} });
    expect(s.state).toBe('explored');
    expect(s.explored).toBe(true);
    expect(s.mastered).toBe(false);
  });

  it('« solide » (strong) n’est JAMAIS présenté comme maîtrisé', () => {
    const s = conceptMasteryStatus(anatomy, {
      exploredSlugs: ['anatomie-bougie'],
      skills: { 'skill.candles': strong },
      completedSkills: [CHECKPOINT_ID],
    });
    expect(s.state).toBe('strong');
    expect(s.stateLabel).toBe('Solide');
    expect(s.mastered).toBe(false); // ← le bug historique corrigé
  });

  it('maîtrisé seulement avec TOUTES les preuves (solidité + rétention + checkpoint + exploré)', () => {
    const s = conceptMasteryStatus(anatomy, {
      exploredSlugs: ['anatomie-bougie'],
      skills: { 'skill.candles': fullyMastered },
      completedSkills: [CHECKPOINT_ID],
    });
    expect(s.state).toBe('mastered');
    expect(s.mastered).toBe(true);
  });

  it('sans checkpoint indépendant réussi, pas de maîtrise (au mieux « solide »)', () => {
    const s = conceptMasteryStatus(anatomy, {
      exploredSlugs: ['anatomie-bougie'],
      skills: { 'skill.candles': fullyMastered },
      completedSkills: [], // checkpoint non passé
    });
    expect(s.mastered).toBe(false);
    expect(s.state).toBe('strong');
  });

  it('un concept jamais entraîné ne peut pas hériter de la maîtrise d’un concept voisin (anti-partage)', () => {
    // « marteau » partage skill.candles mais N’EST PAS le concept entraîné (anatomie-bougie l’est).
    const s = conceptMasteryStatus(marteau, {
      exploredSlugs: ['marteau'],
      skills: { 'skill.candles': fullyMastered },
      completedSkills: [CHECKPOINT_ID],
    });
    expect(s.mastered).toBe(false);
    expect(s.state).toBe('explored'); // plafonné : vu, jamais maîtrisé artificiellement
  });

  it('« en cours » (completed) : au moins une session réussie, pas encore solide', () => {
    const trained = sp({ mastery: 0.3, review: { repetitions: 1, easiness: 2.5, intervalDays: 1, dueAt: 0 } });
    const s = conceptMasteryStatus(anatomy, {
      exploredSlugs: ['anatomie-bougie'],
      skills: { 'skill.candles': trained },
      completedSkills: ['skill.candles'],
    });
    expect(s.state).toBe('completed');
    expect(s.mastered).toBe(false);
  });

  it('un concept sans compétence liée reste Nouveau/Découvert', () => {
    expect(conceptMasteryStatus(noSkill, { exploredSlugs: [], skills: {} }).state).toBe('new');
    expect(conceptMasteryStatus(noSkill, { exploredSlugs: [noSkill.slug], skills: {} }).state).toBe('explored');
  });
});
