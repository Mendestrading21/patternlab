/**
 * Test d'INTÉGRATION RENDU du parcours pilote — les composants sont RÉELLEMENT montés et les
 * contrôles RÉELLEMENT actionnés (react-test-renderer, fourni par jest-expo → aucune dépendance
 * ajoutée). On ne reconstruit PAS l'état final avec des fonctions internes : on rend `ExercisePlayer`,
 * on clique ses boutons/flèches, la réponse passe par le grader RÉEL, le feedback et l'intervention
 * de Bobo (misconception réelle) sont ceux du parcours, la variante et la progression en découlent.
 *
 * Limite assumée : le sprite animé de la mascotte (`CharacterScene` → Reanimated worklets) et la
 * coquille expo-router ne sont pas montés (les worklets natifs de Reanimated 4 sont absents sous
 * jest). Ils sont purement décoratifs / de navigation ; la logique d'entrée accueil→monde→unité est
 * couverte par `pilotJourney.test.ts` (buildLearningPath). Ici on démontre le CŒUR interactif :
 * exercice affiché → mauvaise réponse cliquée → feedback contextualisé + Bobo → continuer → variante
 * (même cible, présentation différente) → bonne réponse → checkpoint → progression affichée.
 */
import { describe, it, expect } from '@jest/globals';
import { useState } from 'react';
import { create, act, type ReactTestInstance, type ReactTestRenderer } from 'react-test-renderer';
import { View } from 'react-native';
import { Button, FeedbackPanel, Text } from '../design-system';
import {
  ExercisePlayer,
  gradeExercise,
  scenarioA11ySummary,
  type Exercise,
  type GradeResult,
} from '../engines/exercise';
import { CANDLE_PILOT_EXERCISES, CANDLE_PILOT_SCENARIOS, PILOT_CANDLE_CONCEPT_ID } from './pilotScenarios';
import { mistakeMoment } from './mascotMoment';
import { getExercises, CHECKPOINT_ID, isCheckpoint } from './seed';
import { objectiveId } from './learningTarget';
import { aggregateAnswered, type AnsweredRecord } from './sessionFlow';

// ── Helpers d'inspection/interaction de l'arbre rendu (react-test-renderer) ──

/** Texte concaténé rendu sous une instance (labels des boutons, feedback, Bobo…). */
function textOf(inst: ReactTestInstance): string {
  const out: string[] = [];
  const visit = (n: ReactTestInstance | string) => {
    if (typeof n === 'string') return void out.push(n);
    for (const c of n.children) visit(c);
  };
  for (const c of inst.children) visit(c);
  return out.join(' ');
}

/** Tous les contrôles cliquables réellement rendus (un `onPress` = un bouton/flèche/zone). */
function pressables(root: ReactTestInstance): ReactTestInstance[] {
  return root.findAll((n) => typeof n.props?.onPress === 'function', { deep: true });
}

/** Clique le contrôle rendu dont le texte contient `text` (échoue si aucun → aucun bouton mort). */
function pressText(root: ReactTestInstance, text: string): void {
  const b = pressables(root).find((n) => textOf(n).includes(text));
  if (!b) throw new Error(`Aucun contrôle rendu ne contient « ${text} »`);
  act(() => (b.props.onPress as () => void)());
}

/** Clique le contrôle rendu dont le libellé accessible contient `labelIncludes`. */
function pressLabel(root: ReactTestInstance, labelIncludes: string): void {
  const b = pressables(root).find((n) => String(n.props.accessibilityLabel ?? '').includes(labelIncludes));
  if (!b) throw new Error(`Aucun contrôle avec libellé « ${labelIncludes} »`);
  act(() => (b.props.onPress as () => void)());
}

/** Libellés accessibles présents dans l'arbre rendu. */
function a11yLabels(root: ReactTestInstance): string[] {
  return root
    .findAll((n) => typeof n.props?.accessibilityLabel === 'string', { deep: true })
    .map((n) => String(n.props.accessibilityLabel));
}

/** Ordre d'affichage courant d'un exercice `order`, lu depuis les libellés des flèches « Monter ». */
function readOrder(root: ReactTestInstance, items: string[]): number[] {
  const byPos: string[] = [];
  for (const n of pressables(root)) {
    const m = String(n.props.accessibilityLabel ?? '').match(/^Monter « (.*) » \(position (\d+) sur \d+\)$/);
    if (m) byPos[Number(m[2]) - 1] = m[1];
  }
  return byPos.map((t) => items.indexOf(t));
}

/** Reconstitue l'ordre attendu en cliquant RÉELLEMENT les flèches (tri à bulles via l'UI). */
function solveOrder(root: ReactTestInstance, items: string[], correctOrder: number[]): void {
  const rank = (itemIdx: number) => correctOrder.indexOf(itemIdx);
  for (let guard = 0; guard <= items.length * items.length + 2; guard++) {
    const cur = readOrder(root, items);
    const pos = cur.findIndex((_, i) => i < cur.length - 1 && rank(cur[i]) > rank(cur[i + 1]));
    if (pos < 0) return; // trié
    pressLabel(root, `Descendre « ${items[cur[pos]]} » (position ${pos + 1} sur ${cur.length})`);
  }
  throw new Error('solveOrder : ordre non reconstitué');
}

/** Monte un `ExercisePlayer` isolé et expose la dernière réponse remontée au grader. */
function renderExercise(ex: Exercise): { root: ReactTestInstance; captured: () => unknown } {
  let captured: unknown;
  let renderer!: ReactTestRenderer;
  act(() => {
    renderer = create(<ExercisePlayer exercise={ex} result={null} onValidate={(a) => (captured = a)} />);
  });
  return { root: renderer.root, captured: () => captured };
}

/** Clique la BONNE réponse d'un exercice selon son type, via un contrôle réellement rendu. */
function answerCorrect(root: ReactTestInstance, ex: Exercise): void {
  switch (ex.type) {
    case 'identify_pattern':
    case 'label_chart':
      return pressText(root, ex.options[ex.validation.correctIndex]);
    case 'select_chart_zone':
      return pressLabel(root, `Zone ${ex.validation.correctZone + 1} :`);
    case 'find_error':
      return pressText(root, ex.statements[ex.validation.errorIndex]);
    case 'order':
      solveOrder(root, ex.items, ex.validation.correctOrder);
      return pressText(root, 'Valider l’ordre');
    default:
      throw new Error(`type non géré dans le test: ${ex.type}`);
  }
}

// ── Harnais fidèle à la boucle de session (validate → feedback + Bobo → continuer) ──

function PilotHarness({ exercises }: { exercises: Exercise[] }) {
  const [index, setIndex] = useState(0);
  const [result, setResult] = useState<GradeResult | null>(null);
  // Réponses réellement validées, accumulées par les clics « Continuer » (état, jamais un ref lu au rendu).
  const [answered, setAnswered] = useState<AnsweredRecord[]>([]);

  if (index >= exercises.length) {
    const agg = aggregateAnswered(answered);
    const correct = answered.filter((a) => a.correct).length;
    return (
      <View>
        <Text>{`SESSION_TERMINEE ${correct}/${answered.length}`}</Text>
        {agg.perTarget.map((t) => (
          <Text key={t.objectiveId}>{`CIBLE ${t.objectiveId} ${t.correct}/${t.total}`}</Text>
        ))}
      </View>
    );
  }

  const exercise = exercises[index];
  const bobo = result && !result.correct ? mistakeMoment(exercise.id) : null;
  const validate = (answer: unknown) => {
    if (result) return;
    setResult(gradeExercise(exercise, answer));
  };
  const next = () => {
    if (result) {
      setAnswered((prev) => [
        ...prev,
        {
          exerciseId: exercise.id,
          skillId: exercise.skillId,
          conceptId: exercise.target?.conceptId,
          objectiveId: exercise.target?.objectiveId,
          correct: result.correct,
        },
      ]);
    }
    setIndex((i) => i + 1);
    setResult(null);
  };

  return (
    <View>
      <Text>{`Exercice ${index + 1} / ${exercises.length}`}</Text>
      <ExercisePlayer key={exercise.id} exercise={exercise} result={result} onValidate={validate} />
      {result ? (
        <View>
          <FeedbackPanel
            correct={result.correct}
            message={result.correct ? result.feedback.correct : result.feedback.incorrect}
            rule={result.feedback.rule}
            whenItFails={result.feedback.whenItFails}
          >
            {bobo ? <Text>{`BOBO ${bobo.text}`}</Text> : null}
          </FeedbackPanel>
          <Button label={index + 1 >= exercises.length ? 'Voir mon résultat' : 'Continuer'} onPress={next} />
        </View>
      ) : null}
    </View>
  );
}

const C = PILOT_CANDLE_CONCEPT_ID;

describe('Parcours pilote — RENDU réel et manipulé (react-test-renderer)', () => {
  it('exercice d’ordre : présenté MÉLANGÉ (jamais résolu) et validé à vide → refusé par le grader', () => {
    const order = CANDLE_PILOT_EXERCISES.find((e) => e.id === 'ex.candles.read-order')!;
    if (order.type !== 'order') throw new Error('type');
    const { root, captured } = renderExercise(order);

    const initial = readOrder(root, order.items);
    expect(initial).toHaveLength(order.items.length);
    expect([...initial].sort((a, b) => a - b)).toEqual(order.items.map((_, i) => i)); // permutation valide
    expect(initial).not.toEqual(order.validation.correctOrder); // JAMAIS la solution au départ

    // Valider sans rien reconstituer → l'ordre affiché est transmis tel quel, le grader RÉEL le refuse.
    pressText(root, 'Valider l’ordre');
    expect(captured()).toEqual(initial);
    expect(gradeExercise(order, captured()).correct).toBe(false);
  });

  it('exercice d’ordre : reconstitué à la main (flèches) → indices exacts transmis → réussite', () => {
    const order = CANDLE_PILOT_EXERCISES.find((e) => e.id === 'ex.candles.read-order')!;
    if (order.type !== 'order') throw new Error('type');
    const { root, captured } = renderExercise(order);

    solveOrder(root, order.items, order.validation.correctOrder);
    expect(readOrder(root, order.items)).toEqual(order.validation.correctOrder); // reconstitué via l'UI
    pressText(root, 'Valider l’ordre');
    expect(captured()).toEqual(order.validation.correctOrder); // indices exacts remontés au grader
    expect(gradeExercise(order, captured()).correct).toBe(true);
  });

  it('résumé accessible affiché par le graphique = résumé CANONIQUE du scénario (sans fuite de réponse)', () => {
    for (const scenario of CANDLE_PILOT_SCENARIOS) {
      if (!('chartSeed' in scenario)) continue; // seulement les scénarios graphiques
      const ex = CANDLE_PILOT_EXERCISES.find((e) => e.id === scenario.id)!;
      const { root } = renderExercise(ex);
      const summary = scenarioA11ySummary(scenario);
      const labels = a11yLabels(root);
      // un nœud rendu porte EXACTEMENT le résumé canonique (image du graphique) ou commence par lui (svg repère).
      expect(labels.some((l) => l === summary || l.startsWith(summary))).toBe(true);
      if (scenario.interaction === 'label-extreme') {
        const svgLabel = labels.find((l) => l.startsWith(summary))!;
        expect(svgLabel).toContain('repère marque la bougie numéro'); // présence + position du repère
        expect(svgLabel).not.toContain('mèche haute'); // ne révèle PAS la bonne option avant validation
      }
    }
  });

  it('boucle rendue : erreur → Bobo (misconception réelle) → variante (même cible) → réussite → progression', () => {
    const exs = getExercises('skill.candles');
    let renderer!: ReactTestRenderer;
    act(() => {
      renderer = create(<PilotHarness exercises={exs} />);
    });
    const root = renderer.root;

    // (a) direction (recognize) : on CLIQUE une mauvaise réponse.
    const direction = exs[0];
    expect(direction.id).toBe('ex.candles.direction');
    if (direction.type !== 'identify_pattern') throw new Error('type');
    pressText(root, direction.options[(direction.validation.correctIndex + 1) % direction.options.length]);

    // Feedback contextualisé (incorrect) + Bobo pointe la misconception RÉELLE (pas un conseil générique).
    expect(textOf(root)).toContain('BOBO');
    expect(textOf(root)).toContain('Conclure sur une seule bougie'); // libellé de 'tendance-une-bougie'
    expect(mistakeMoment('ex.candles.direction').misconceptionId).toBe('tendance-une-bougie');

    // (b) continuer IMMÉDIATEMENT → variante recognize : MÊME cible, présentation DIFFÉRENTE.
    pressText(root, 'Continuer');
    const labelHigh = exs[1];
    expect(labelHigh.id).toBe('ex.candles.label-high');
    expect(labelHigh.target?.objectiveId).toBe(direction.target?.objectiveId); // même sous-notion (recognize)
    expect(labelHigh.type).not.toBe(direction.type); // présentation réellement différente
    answerCorrect(root, labelHigh);
    expect(textOf(root)).toContain('Exact'); // feedback de réussite rendu
    pressText(root, 'Continuer');

    // (c) zone-high (interpret) — clic sur la bonne zone du graphique.
    answerCorrect(root, exs[2]);
    pressText(root, 'Continuer');

    // (d) read-order (interpret) — reconstitution réelle par les flèches.
    answerCorrect(root, exs[3]);
    pressText(root, 'Continuer');

    // (e) false-signal (avoid-false-signal) — clic sur l'affirmation fausse.
    answerCorrect(root, exs[4]);
    pressText(root, 'Voir mon résultat');

    // (f) progression RÉELLEMENT affichée, dérivée des clics (1 erreur : direction ; 4 justes).
    const done = textOf(root);
    expect(done).toContain('SESSION_TERMINEE 4/5');
    expect(done).toContain(`CIBLE ${objectiveId(C, 'recognize')} 1/2`); // direction faux + label-high juste
    expect(done).toContain(`CIBLE ${objectiveId(C, 'interpret')} 2/2`);
    expect(done).toContain(`CIBLE ${objectiveId(C, 'avoid-false-signal')} 1/1`);
  });

  it('checkpoint indépendant : un exercice RÉEL de l’unité est rendu et se répond', () => {
    expect(isCheckpoint(CHECKPOINT_ID)).toBe(true);
    const cp = getExercises(CHECKPOINT_ID).filter((e) => e.skillId === 'skill.candles');
    expect(cp.length).toBeGreaterThan(0);
    const ex = cp[0];
    const { root, captured } = renderExercise(ex);
    answerCorrect(root, ex);
    expect(gradeExercise(ex, captured()).correct).toBe(true);
  });
});
