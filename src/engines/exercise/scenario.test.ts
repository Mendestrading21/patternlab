import { describe, it, expect } from '@jest/globals';
import {
  buildScenarioExercise,
  buildScenarioExercises,
  scenarioInteractionTypes,
  scenarioA11ySummary,
  highestThird,
  highestCandleIndex,
  SCENARIO_CANDLE_COUNT,
  DIRECTION_INDEX_BY_TREND,
  type LearningScenario,
} from './scenario';
import { generateCandles } from '../pattern/demoChart';
import { candleTrend, describeCandles } from '../pattern/chartA11y';

const T = { conceptId: 'concept.demo', objectiveId: 'concept.demo::recognize' };

const DIRECTION: LearningScenario = {
  id: 's.dir', skillId: 'skill.x', target: T, interaction: 'read-direction', chartSeed: 77,
  prompt: 'Sens ?', options: ['Hausse', 'Baisse', 'Latéral'],
};
const ZONE: LearningScenario = {
  id: 's.zone', skillId: 'skill.x', target: T, interaction: 'touch-extreme-zone', chartSeed: 77, prompt: 'Tiers du plus haut ?',
};
const LABEL: LearningScenario = {
  id: 's.label', skillId: 'skill.x', target: T, interaction: 'label-extreme', chartSeed: 77,
  prompt: 'Repère ?', options: ['Le plus haut atteint', 'Le plancher', 'Le volume'], correctIndex: 0,
};
const ORDER: LearningScenario = {
  id: 's.order', skillId: 'skill.x', target: T, interaction: 'read-order',
  prompt: 'Ordre ?', steps: ['Corps', 'Couleur', 'Mèches'], correctOrder: [0, 1, 2],
};
const FALSE: LearningScenario = {
  id: 's.false', skillId: 'skill.x', target: T, interaction: 'spot-false-signal',
  prompt: 'Faux ?', statements: ['Vrai A', 'Vrai B', 'La couleur prédit la suite'], errorIndex: 2,
};

describe('scenario — vérité unique dérivée du graphique (cohérence par construction)', () => {
  it('read-direction : la réponse dérive de la tendance réellement rendue', () => {
    const ex = buildScenarioExercise(DIRECTION);
    if (ex.type !== 'identify_pattern') throw new Error('type');
    const candles = generateCandles(DIRECTION.chartSeed as number, SCENARIO_CANDLE_COUNT);
    expect(ex.validation.correctIndex).toBe(DIRECTION_INDEX_BY_TREND[candleTrend(candles)]);
    expect(ex.feedback.correct.toLowerCase()).toContain(candleTrend(candles));
  });

  it('touch-extreme-zone : la bonne zone est le tiers réel du plus haut', () => {
    const ex = buildScenarioExercise(ZONE);
    if (ex.type !== 'select_chart_zone') throw new Error('type');
    const candles = generateCandles(ZONE.chartSeed as number, SCENARIO_CANDLE_COUNT);
    expect(ex.validation.correctZone).toBe(highestThird(candles));
    expect(ex.zones).toHaveLength(3);
  });

  it('label-extreme : le repère est posé sur la bougie la plus haute réelle', () => {
    const ex = buildScenarioExercise(LABEL);
    if (ex.type !== 'label_chart') throw new Error('type');
    const candles = generateCandles(LABEL.chartSeed as number, SCENARIO_CANDLE_COUNT);
    expect(ex.markerIndex).toBe(highestCandleIndex(candles));
    // La bonne option décrit bien « le plus haut ».
    expect(ex.options[ex.validation.correctIndex].toLowerCase()).toContain('plus haut');
  });

  it('read-order : ordre attendu = permutation valide des étapes', () => {
    const ex = buildScenarioExercise(ORDER);
    if (ex.type !== 'order') throw new Error('type');
    expect([...ex.validation.correctOrder].sort()).toEqual([0, 1, 2]);
    expect(ex.items).toHaveLength(3);
  });

  it('spot-false-signal : l’index pointe l’affirmation fausse', () => {
    const ex = buildScenarioExercise(FALSE);
    if (ex.type !== 'find_error') throw new Error('type');
    expect(ex.validation.errorIndex).toBe(2);
    expect(ex.feedback.correct).toContain('prédit');
  });

  it('le résumé accessible d’un scénario graphique = la description de la série réelle', () => {
    const candles = generateCandles(ZONE.chartSeed as number, SCENARIO_CANDLE_COUNT);
    expect(scenarioA11ySummary(ZONE)).toBe(describeCandles(candles));
    expect(scenarioA11ySummary(ORDER).length).toBeGreaterThan(0);
  });

  it('chaque exercice dérivé porte la cible du scénario (conceptId + objectiveId)', () => {
    for (const s of [DIRECTION, ZONE, LABEL, ORDER, FALSE]) {
      expect(buildScenarioExercise(s).target).toEqual(T);
    }
  });

  it('déterministe : deux constructions identiques donnent le même exercice', () => {
    expect(buildScenarioExercise(ZONE)).toEqual(buildScenarioExercise(ZONE));
  });

  it('diversité : au moins 4 interactions réellement différentes', () => {
    const kinds = scenarioInteractionTypes([DIRECTION, ZONE, LABEL, ORDER, FALSE]);
    expect(kinds.length).toBeGreaterThanOrEqual(4);
    expect(kinds).toEqual(expect.arrayContaining(['touch-extreme-zone', 'label-extreme', 'read-order']));
  });

  it('aucun texte dérivé ne contient BUY/SELL ni promesse de gain', () => {
    const forbidden = /\b(buy|sell|achet|profit garanti|gain garanti|trade gagnant)\b/i;
    for (const ex of buildScenarioExercises([DIRECTION, ZONE, LABEL, ORDER, FALSE])) {
      const text = [ex.prompt, ex.feedback.correct, ex.feedback.incorrect, ex.feedback.rule ?? '', ex.feedback.whenItFails ?? ''].join(' ');
      expect(text).not.toMatch(forbidden);
    }
  });
});
