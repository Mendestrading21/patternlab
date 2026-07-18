/**
 * Registry des graders d'exercices. Ajouter un format = enregistrer un grader,
 * sans toucher au reste du moteur (extensibilité exigée par le kit).
 */
import type {
  Exercise,
  ExerciseType,
  GradeResult,
  McqExercise,
  TrueFalseExercise,
  NumericExercise,
  OrderExercise,
  MatchExercise,
  FindErrorExercise,
  IdentifyPatternExercise,
  ScenarioExercise,
  SelectChartZoneExercise,
} from './types';

export type Grader<E extends Exercise> = (exercise: E, answer: unknown) => GradeResult;

function result(correct: boolean, exercise: Exercise): GradeResult {
  return { correct, feedback: exercise.feedback };
}

function numberArrayEquals(a: unknown, b: number[]): boolean {
  return Array.isArray(a) && a.length === b.length && b.every((v, i) => a[i] === v);
}

const gradeMcq: Grader<McqExercise> = (exercise, answer) => {
  return result(answer === exercise.validation.correctIndex, exercise);
};

const gradeTrueFalse: Grader<TrueFalseExercise> = (exercise, answer) => {
  return result(answer === exercise.validation.answer, exercise);
};

const gradeNumeric: Grader<NumericExercise> = (exercise, answer) => {
  const tolerance = exercise.validation.tolerance ?? 0;
  const ok = typeof answer === 'number' && Math.abs(answer - exercise.validation.answer) <= tolerance;
  return result(ok, exercise);
};

const gradeOrder: Grader<OrderExercise> = (exercise, answer) => {
  return result(numberArrayEquals(answer, exercise.validation.correctOrder), exercise);
};

const gradeMatch: Grader<MatchExercise> = (exercise, answer) => {
  return result(numberArrayEquals(answer, exercise.validation.matches), exercise);
};

const gradeFindError: Grader<FindErrorExercise> = (exercise, answer) => {
  return result(answer === exercise.validation.errorIndex, exercise);
};

const gradeIdentifyPattern: Grader<IdentifyPatternExercise> = (exercise, answer) => {
  return result(answer === exercise.validation.correctIndex, exercise);
};

const gradeScenario: Grader<ScenarioExercise> = (exercise, answer) => {
  return result(answer === exercise.validation.correctIndex, exercise);
};

const gradeSelectChartZone: Grader<SelectChartZoneExercise> = (exercise, answer) => {
  return result(answer === exercise.validation.correctZone, exercise);
};

const graders: Partial<Record<ExerciseType, Grader<Exercise>>> = {
  mcq: gradeMcq as Grader<Exercise>,
  true_false: gradeTrueFalse as Grader<Exercise>,
  numeric: gradeNumeric as Grader<Exercise>,
  order: gradeOrder as Grader<Exercise>,
  match: gradeMatch as Grader<Exercise>,
  find_error: gradeFindError as Grader<Exercise>,
  identify_pattern: gradeIdentifyPattern as Grader<Exercise>,
  scenario: gradeScenario as Grader<Exercise>,
  select_chart_zone: gradeSelectChartZone as Grader<Exercise>,
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
