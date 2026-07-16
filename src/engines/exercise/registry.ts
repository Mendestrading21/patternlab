/**
 * Registry des graders d'exercices. Ajouter un format = enregistrer un grader,
 * sans toucher au reste du moteur (extensibilité exigée par le kit).
 */
import type { Exercise, ExerciseType, GradeResult, McqExercise, TrueFalseExercise } from './types';

export type Grader<E extends Exercise> = (exercise: E, answer: unknown) => GradeResult;

function result(correct: boolean, exercise: Exercise): GradeResult {
  return { correct, feedback: exercise.feedback };
}

const gradeMcq: Grader<McqExercise> = (exercise, answer) => {
  return result(answer === exercise.validation.correctIndex, exercise);
};

const gradeTrueFalse: Grader<TrueFalseExercise> = (exercise, answer) => {
  return result(answer === exercise.validation.answer, exercise);
};

const graders: Partial<Record<ExerciseType, Grader<Exercise>>> = {
  mcq: gradeMcq as Grader<Exercise>,
  true_false: gradeTrueFalse as Grader<Exercise>,
};

export function isTypeSupported(type: ExerciseType): boolean {
  return Boolean(graders[type]);
}

export function supportedTypes(): ExerciseType[] {
  return Object.keys(graders) as ExerciseType[];
}

/** Corrige une réponse. Lève une erreur explicite si le format n'est pas encore branché. */
export function gradeExercise(exercise: Exercise, answer: unknown): GradeResult {
  const grader = graders[exercise.type];
  if (!grader) {
    throw new Error(`Format d'exercice non encore implémenté : ${exercise.type}`);
  }
  return grader(exercise, answer);
}
