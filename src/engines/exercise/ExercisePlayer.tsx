import { useEffect, useState } from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import Svg, { Line, Rect, Polygon } from 'react-native-svg';
import { Text, Button, AnswerOption, theme } from '../../design-system';
import type { AnswerState } from '../../design-system';
import { PatternChart, InteractiveChart, generateCandles, priceScale } from '../pattern';
import type {
  Exercise,
  GradeResult,
  NumericExercise,
  OrderExercise,
  MatchExercise,
  IdentifyPatternExercise,
  ScenarioExercise,
  SelectChartZoneExercise,
  PlaceInvalidationExercise,
  LabelChartExercise,
  SequenceMarketStructureExercise,
} from './types';

export type ExercisePlayerProps = {
  exercise: Exercise;
  result: GradeResult | null;
  onValidate: (answer: unknown) => void;
};

/** Rend l'UI de l'exercice selon son type et remonte la réponse composée. */
export function ExercisePlayer({ exercise, result, onValidate }: ExercisePlayerProps) {
  const locked = Boolean(result);
  switch (exercise.type) {
    case 'mcq':
      return <ChoicePlayer options={exercise.options} correctIndex={exercise.validation.correctIndex} locked={locked} onPick={onValidate} />;
    case 'true_false':
      return <ChoicePlayer options={['Vrai', 'Faux']} correctIndex={exercise.validation.answer ? 0 : 1} locked={locked} onPick={(i) => onValidate(i === 0)} />;
    case 'find_error':
      return <ChoicePlayer options={exercise.statements} correctIndex={exercise.validation.errorIndex} locked={locked} onPick={onValidate} />;
    case 'numeric':
      return <NumericPlayer exercise={exercise} locked={locked} onValidate={onValidate} />;
    case 'order':
      return <OrderPlayer exercise={exercise} locked={locked} onValidate={onValidate} />;
    case 'match':
      return <MatchPlayer exercise={exercise} locked={locked} onValidate={onValidate} />;
    case 'identify_pattern':
      return <IdentifyPatternPlayer exercise={exercise} locked={locked} onPick={onValidate} />;
    case 'scenario':
      return <ScenarioPlayer exercise={exercise} locked={locked} onPick={onValidate} />;
    case 'select_chart_zone':
      return <ZonePlayer exercise={exercise} locked={locked} onPick={onValidate} />;
    case 'place_invalidation':
      return <PlaceInvalidationPlayer exercise={exercise} locked={locked} onValidate={onValidate} />;
    case 'label_chart':
      return <LabelChartPlayer exercise={exercise} locked={locked} onPick={onValidate} />;
    case 'sequence_market_structure':
      return <SequencePlayer exercise={exercise} locked={locked} onValidate={onValidate} />;
    default:
      return (
        <Text variant="caption" color={theme.colors.textMuted}>
          Format bientôt disponible.
        </Text>
      );
  }
}

function IdentifyPatternPlayer({
  exercise,
  locked,
  onPick,
}: {
  exercise: IdentifyPatternExercise;
  locked: boolean;
  onPick: (i: number) => void;
}) {
  const candles = generateCandles(exercise.chartSeed, 30);
  return (
    <View style={styles.stack}>
      <View style={styles.chartWrap}>
        <PatternChart candles={candles} width={300} height={150} />
      </View>
      <ChoicePlayer
        options={exercise.options}
        correctIndex={exercise.validation.correctIndex}
        locked={locked}
        onPick={onPick}
      />
    </View>
  );
}

function ScenarioPlayer({
  exercise,
  locked,
  onPick,
}: {
  exercise: ScenarioExercise;
  locked: boolean;
  onPick: (i: number) => void;
}) {
  return (
    <View style={styles.stack}>
      <View style={styles.scenario}>
        <Text variant="label" color={theme.colors.technical}>
          SI…
        </Text>
        <Text variant="body">{exercise.context}</Text>
      </View>
      <Text variant="label" color={theme.colors.textMuted}>
        ALORS…
      </Text>
      <ChoicePlayer
        options={exercise.options}
        correctIndex={exercise.validation.correctIndex}
        locked={locked}
        onPick={onPick}
      />
    </View>
  );
}

function ZonePlayer({
  exercise,
  locked,
  onPick,
}: {
  exercise: SelectChartZoneExercise;
  locked: boolean;
  onPick: (i: number) => void;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  useEffect(() => {
    if (!locked) setPicked(null);
  }, [locked]);

  const W = 300;
  const H = 160;
  const candles = generateCandles(exercise.chartSeed, 30);

  const zoneColor = (i: number): string => {
    if (!locked) return picked === i ? theme.colors.primary : theme.colors.borderStrong;
    if (i === exercise.validation.correctZone) return theme.colors.feedbackCorrect;
    if (i === picked) return theme.colors.feedbackIncorrect;
    return theme.colors.borderStrong;
  };

  return (
    <View style={styles.stack}>
      <View style={[styles.chartWrap, styles.zoneWrap, { width: W }]}>
        <PatternChart candles={candles} width={W} height={H} />
        <View style={[StyleSheet.absoluteFill, styles.zoneRow]}>
          {exercise.zones.map((z, i) => {
            const active = picked === i || (locked && i === exercise.validation.correctZone);
            const color = zoneColor(i);
            return (
              <Pressable
                key={i}
                disabled={locked}
                onPress={() => {
                  setPicked(i);
                  onPick(i);
                }}
                accessibilityRole="button"
                accessibilityState={{ selected: picked === i, disabled: locked }}
                accessibilityLabel={`Zone ${i + 1} : ${z}`}
                style={[
                  styles.zone,
                  { borderColor: color },
                  i < exercise.zones.length - 1 ? styles.zoneDivider : null,
                  active ? { backgroundColor: 'rgba(66,183,232,0.12)', borderWidth: 2 } : null,
                ]}
              >
                <Text variant="caption" center color={color}>
                  {z}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
      <Text variant="caption" color={theme.colors.textMuted} center>
        Touche la zone du graphique qui répond à la question.
      </Text>
    </View>
  );
}

function PlaceInvalidationPlayer({
  exercise,
  locked,
  onValidate,
}: {
  exercise: PlaceInvalidationExercise;
  locked: boolean;
  onValidate: (answer: unknown) => void;
}) {
  const W = 300;
  const H = 170;
  const candles = generateCandles(exercise.chartSeed, 30);
  const scale = priceScale(candles, H);
  const step = scale.range * 0.02;
  const [userPrice, setUserPrice] = useState<number | null>(null);
  useEffect(() => {
    if (!locked) setUserPrice(null);
  }, [locked]);

  const nudge = (dir: -1 | 1) =>
    setUserPrice((p) => {
      const base = p ?? (scale.min + scale.max) / 2;
      return Math.max(scale.min, Math.min(scale.max, base + dir * step));
    });

  return (
    <View style={styles.stack}>
      <View style={styles.chartWrap}>
        <InteractiveChart
          candles={candles}
          width={W}
          height={H}
          userPrice={userPrice}
          targetPrice={locked ? exercise.validation.targetPrice : null}
          disabled={locked}
          onPickPrice={(price) => setUserPrice(price)}
        />
      </View>
      {exercise.hint ? (
        <Text variant="caption" color={theme.colors.textMuted} center>
          Indice : {exercise.hint}
        </Text>
      ) : null}
      <View style={styles.rowCenter}>
        <ArrowBtn label="↑" disabled={locked} onPress={() => nudge(1)} />
        <ArrowBtn label="↓" disabled={locked} onPress={() => nudge(-1)} />
        {userPrice != null ? (
          <Text variant="caption" color={theme.colors.technical}>
            Ton niveau : {userPrice.toFixed(0)}
          </Text>
        ) : null}
      </View>
      <Button
        label="Valider mon niveau"
        disabled={locked || userPrice == null}
        disabledReason={locked ? undefined : 'Place ta ligne sur le graphique.'}
        onPress={() => userPrice != null && onValidate(userPrice)}
      />
    </View>
  );
}

function LabelChartPlayer({
  exercise,
  locked,
  onPick,
}: {
  exercise: LabelChartExercise;
  locked: boolean;
  onPick: (i: number) => void;
}) {
  const W = 300;
  const H = 160;
  const candles = generateCandles(exercise.chartSeed, 30);
  const scale = priceScale(candles, H);
  const y = scale.priceToY;
  const n = candles.length;
  const slot = W / n;
  const bodyW = Math.max(2, slot * 0.6);
  const mi = Math.max(0, Math.min(n - 1, exercise.markerIndex));
  const cx = mi * slot + slot / 2;
  const markerY = y(candles[mi].h) - 10;

  return (
    <View style={styles.stack}>
      <View style={styles.chartWrap}>
        <Svg width={W} height={H} accessibilityLabel={`Graphique en chandeliers ; un repère marque la bougie numéro ${mi + 1}.`}>
          {candles.map((c, i) => {
            const x = i * slot + slot / 2;
            const up = c.c >= c.o;
            const stroke = up ? theme.colors.bullish : theme.colors.bearish;
            return <Line key={`w-${i}`} x1={x} y1={y(c.h)} x2={x} y2={y(c.l)} stroke={stroke} strokeWidth={1.2} opacity={i === mi ? 1 : 0.5} />;
          })}
          {candles.map((c, i) => {
            const x = i * slot + slot / 2;
            const up = c.c >= c.o;
            const stroke = up ? theme.colors.bullish : theme.colors.bearish;
            const top = y(Math.max(c.o, c.c));
            const h = Math.max(1.5, Math.abs(y(c.o) - y(c.c)));
            return <Rect key={`b-${i}`} x={x - bodyW / 2} y={top} width={bodyW} height={h} fill={stroke} opacity={i === mi ? 1 : 0.5} rx={1} />;
          })}
          {/* Repère au-dessus de la bougie marquée (jamais porté par la seule couleur : forme + label) */}
          <Polygon points={`${cx - 5},${markerY} ${cx + 5},${markerY} ${cx},${markerY + 9}`} fill={theme.colors.reward} />
        </Svg>
      </View>
      <Text variant="caption" color={theme.colors.textMuted} center>
        Que représente l’élément marqué (▲) ?
      </Text>
      <ChoicePlayer options={exercise.options} correctIndex={exercise.validation.correctIndex} locked={locked} onPick={onPick} />
    </View>
  );
}

function SequencePlayer({
  exercise,
  locked,
  onValidate,
}: {
  exercise: SequenceMarketStructureExercise;
  locked: boolean;
  onValidate: (answer: unknown) => void;
}) {
  return (
    <View style={styles.stack}>
      {exercise.chartSeed != null ? (
        <View style={styles.chartWrap}>
          <PatternChart candles={generateCandles(exercise.chartSeed, 30)} width={300} height={140} />
        </View>
      ) : null}
      <ReorderList items={exercise.steps} locked={locked} validateLabel="Valider la séquence" onValidate={onValidate} />
    </View>
  );
}

function ReorderList({
  items,
  locked,
  validateLabel,
  onValidate,
}: {
  items: string[];
  locked: boolean;
  validateLabel: string;
  onValidate: (order: number[]) => void;
}) {
  const [order, setOrder] = useState<number[]>(items.map((_, i) => i));
  useEffect(() => {
    if (!locked) setOrder(items.map((_, i) => i));
  }, [locked, items]);

  const move = (pos: number, dir: -1 | 1) => {
    const next = pos + dir;
    if (next < 0 || next >= order.length) return;
    const copy = [...order];
    [copy[pos], copy[next]] = [copy[next], copy[pos]];
    setOrder(copy);
  };

  return (
    <>
      {order.map((itemIndex, pos) => (
        <View key={itemIndex} style={styles.orderRow}>
          <Text variant="body" style={styles.orderLabel}>
            {pos + 1}. {items[itemIndex]}
          </Text>
          <View style={styles.orderBtns}>
            <ArrowBtn label="↑" disabled={locked || pos === 0} onPress={() => move(pos, -1)} />
            <ArrowBtn label="↓" disabled={locked || pos === order.length - 1} onPress={() => move(pos, 1)} />
          </View>
        </View>
      ))}
      <Button label={validateLabel} disabled={locked} onPress={() => onValidate(order)} />
    </>
  );
}

function ChoicePlayer({
  options,
  correctIndex,
  locked,
  onPick,
}: {
  options: string[];
  correctIndex: number;
  locked: boolean;
  onPick: (i: number) => void;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  useEffect(() => {
    if (!locked) setPicked(null);
  }, [locked]);

  const stateFor = (i: number): AnswerState => {
    if (!locked) return picked === i ? 'selected' : 'idle';
    if (i === correctIndex) return 'correct';
    if (i === picked) return 'incorrect';
    return 'idle';
  };

  return (
    <View style={styles.stack}>
      {options.map((opt, i) => (
        <AnswerOption
          key={i}
          index={i}
          label={opt}
          state={stateFor(i)}
          disabled={locked}
          onPress={() => {
            setPicked(i);
            onPick(i);
          }}
        />
      ))}
    </View>
  );
}

function NumericPlayer({
  exercise,
  locked,
  onValidate,
}: {
  exercise: NumericExercise;
  locked: boolean;
  onValidate: (answer: unknown) => void;
}) {
  const [value, setValue] = useState('');
  useEffect(() => {
    if (!locked) setValue('');
  }, [locked]);

  return (
    <View style={styles.stack}>
      <View style={styles.numeric}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={setValue}
          editable={!locked}
          keyboardType="numeric"
          placeholder="Ta réponse"
          placeholderTextColor={theme.colors.textMuted}
          accessibilityLabel="Réponse numérique"
        />
        {exercise.unit ? (
          <Text variant="body" color={theme.colors.textSecondary}>
            {exercise.unit}
          </Text>
        ) : null}
      </View>
      <Button
        label="Valider"
        disabled={locked || value.trim() === '' || Number.isNaN(Number(value))}
        disabledReason={locked ? undefined : 'Saisis un nombre'}
        onPress={() => onValidate(Number(value))}
      />
    </View>
  );
}

function OrderPlayer({
  exercise,
  locked,
  onValidate,
}: {
  exercise: OrderExercise;
  locked: boolean;
  onValidate: (answer: unknown) => void;
}) {
  return (
    <View style={styles.stack}>
      <ReorderList items={exercise.items} locked={locked} validateLabel="Valider l’ordre" onValidate={onValidate} />
    </View>
  );
}

function MatchPlayer({
  exercise,
  locked,
  onValidate,
}: {
  exercise: MatchExercise;
  locked: boolean;
  onValidate: (answer: unknown) => void;
}) {
  const [picks, setPicks] = useState<number[]>(exercise.left.map(() => -1));
  useEffect(() => {
    if (!locked) setPicks(exercise.left.map(() => -1));
  }, [locked, exercise.left]);

  const setPick = (leftIdx: number, rightIdx: number) => {
    const copy = [...picks];
    copy[leftIdx] = rightIdx;
    setPicks(copy);
  };

  const complete = picks.every((p) => p >= 0);

  return (
    <View style={styles.stack}>
      {exercise.left.map((left, li) => (
        <View key={li} style={styles.matchRow}>
          <Text variant="label">{left}</Text>
          <View style={styles.matchOptions}>
            {exercise.right.map((right, ri) => (
              <Pressable
                key={ri}
                disabled={locked}
                onPress={() => setPick(li, ri)}
                accessibilityRole="button"
                accessibilityState={{ selected: picks[li] === ri }}
                style={[styles.matchChip, picks[li] === ri && styles.matchChipActive]}
              >
                <Text variant="caption" color={picks[li] === ri ? theme.colors.onPrimary : theme.colors.textSecondary}>
                  {right}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      ))}
      <Button
        label="Valider les paires"
        disabled={locked || !complete}
        disabledReason={locked ? undefined : 'Associe chaque terme'}
        onPress={() => onValidate(picks)}
      />
    </View>
  );
}

function ArrowBtn({ label, disabled, onPress }: { label: string; disabled: boolean; onPress: () => void }) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label === '↑' ? 'Monter' : 'Descendre'}
      style={[styles.arrow, disabled && styles.arrowDisabled]}
    >
      <Text variant="title">{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  stack: { gap: theme.spacing.sm, marginTop: theme.spacing.md },
  rowCenter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: theme.spacing.sm },
  chartWrap: {
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surfaceSunken,
  },
  scenario: {
    gap: theme.spacing.xs,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.technical,
    backgroundColor: theme.colors.surface,
  },
  zoneWrap: { alignSelf: 'center', overflow: 'hidden' },
  zoneRow: { flexDirection: 'row' },
  zone: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  zoneDivider: { borderRightWidth: 1, borderRightColor: theme.colors.border },
  numeric: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  input: {
    flex: 1,
    minHeight: 48,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    borderColor: theme.colors.borderStrong,
    backgroundColor: theme.colors.surface,
    color: theme.colors.textPrimary,
    fontSize: 16,
  },
  orderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  orderLabel: { flex: 1 },
  orderBtns: { flexDirection: 'row', gap: theme.spacing.xs },
  arrow: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surfaceElevated,
  },
  arrowDisabled: { opacity: 0.35 },
  matchRow: {
    gap: theme.spacing.xs,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  matchOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.xs },
  matchChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
  },
  matchChipActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
});
