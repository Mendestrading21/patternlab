import { describe, it, expect } from '@jest/globals';
import { gradeExercise, isTypeSupported, supportedTypes } from './registry';
import type { McqExercise, TrueFalseExercise, BaseExercise } from './types';

const feedback = {
  correct: 'Bien vu.',
  incorrect: 'Pas tout à fait.',
  rule: 'Une action = une part d’entreprise.',
};

const mcq: McqExercise = {
  id: 'ex.mcq.1',
  type: 'mcq',
  skillId: 'skill.actions',
  prompt: 'Qu’est-ce qu’une action ?',
  options: ['Une dette', 'Une part d’entreprise', 'Une monnaie'],
  validation: { correctIndex: 1 },
  feedback,
};

const tf: TrueFalseExercise = {
  id: 'ex.tf.1',
  type: 'true_false',
  skillId: 'skill.actions',
  prompt: 'Un actionnaire possède une part de l’entreprise.',
  validation: { answer: true },
  feedback,
};

describe('exercise registry', () => {
  it('supporte mcq et true_false', () => {
    expect(isTypeSupported('mcq')).toBe(true);
    expect(isTypeSupported('true_false')).toBe(true);
    expect(supportedTypes()).toEqual(expect.arrayContaining(['mcq', 'true_false']));
  });

  it('corrige un QCM', () => {
    expect(gradeExercise(mcq, 1).correct).toBe(true);
    expect(gradeExercise(mcq, 0).correct).toBe(false);
  });

  it('corrige un vrai/faux', () => {
    expect(gradeExercise(tf, true).correct).toBe(true);
    expect(gradeExercise(tf, false).correct).toBe(false);
  });

  it('renvoie le feedback attaché à l’exercice', () => {
    expect(gradeExercise(mcq, 1).feedback.rule).toContain('action');
  });

  it('lève une erreur claire pour un format non implémenté', () => {
    const notYet: BaseExercise = {
      id: 'ex.timed.1',
      type: 'timed',
      skillId: 'skill.actions',
      prompt: '…',
      feedback,
    };
    expect(() => gradeExercise(notYet, 0)).toThrow(/non encore impl/);
  });
});
