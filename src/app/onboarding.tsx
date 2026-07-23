import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Pressable, StyleSheet } from 'react-native';
import { Screen, Text, Button, Card, Chip, ProgressBar, TrademyIcon, theme } from '@/design-system';
import { CharacterScene, MascotFigure } from '@/characters';
import { MiniVisual } from '@/engines/visual';
import {
  useProgress,
  SKILLS,
  skillById,
  OBJECTIVES,
  LEVELS,
  DAILY_OPTIONS,
  TOPICS,
  recommendStartSkill,
  exercisesForMinutes,
  ONBOARDING_SCHEMA_VERSION,
  type Objective,
  type DeclaredLevel,
  type DailyMinutes,
  type Topic,
  type OnboardingProfile,
  type VisualSpec,
} from '@/data';
import { analytics } from '@/analytics';

const STEPS = ['Bienvenue', 'Objectif', 'Niveau', 'Temps', 'Sujets', 'Diagnostic', 'Ton parcours'] as const;

type DiagQuestion = { prompt: string; options: string[]; correct: number; visual?: VisualSpec };

const DIAGNOSTIC: DiagQuestion[] = [
  { prompt: 'Une action, c’est avant tout…', options: ['Une part d’entreprise', 'Un prêt à une entreprise', 'Une monnaie numérique'], correct: 0 },
  { prompt: 'Des sommets et creux de plus en plus hauts décrivent une tendance…', options: ['Haussière', 'Baissière', 'Sans direction'], correct: 0 },
  {
    prompt: 'Une bougie verte : la clôture est…',
    options: ['Au-dessus de l’ouverture', 'En dessous de l’ouverture', 'Toujours au plus haut'],
    correct: 0,
    // Vraie bougie affichée pour la question : résumé accessible neutre (ne divulgue pas la réponse).
    visual: {
      type: 'candlestick-pattern',
      variant: 'bullish-marubozu',
      direction: 'bullish',
      labels: [],
      annotations: [],
      datasetKey: 'candle.bullish-marubozu.v1',
      accessibilitySummary: 'Une bougie.',
    },
  },
];

type DiagState = 'intro' | 'running' | 'done';

export default function Onboarding() {
  const router = useRouter();
  const { completeOnboarding } = useProgress();

  const [step, setStep] = useState(0);
  const [objective, setObjective] = useState<Objective | null>(null);
  const [level, setLevel] = useState<DeclaredLevel | null>(null);
  const [minutes, setMinutes] = useState<DailyMinutes | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [diag, setDiag] = useState<DiagState>('intro');
  const [diagIndex, setDiagIndex] = useState(0);
  const [diagCorrect, setDiagCorrect] = useState(0);

  useEffect(() => {
    analytics.track('onboarding_started');
  }, []);

  useEffect(() => {
    if (step === 6) analytics.track('path_generated', { level: level ?? '', topics: topics.join(',') });
  }, [step, level, topics]);

  const startSkillId = recommendStartSkill(level ?? 'debutant', topics, SKILLS);
  const startSkillName = skillById(startSkillId)?.name ?? 'ta première compétence';
  // Question courante du diagnostic (index toujours valide) : capturée en const pour le narrowing TS.
  const currentDiag = DIAGNOSTIC[diagIndex];

  const toggleTopic = (t: Topic) =>
    setTopics((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const canNext = () => {
    switch (step) {
      case 1: return objective !== null;
      case 2: return level !== null;
      case 3: return minutes !== null;
      case 5: return diag !== 'running';
      default: return true;
    }
  };

  const next = () => setStep((s) => Math.min(STEPS.length - 1, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  const answerDiag = (i: number) => {
    const isCorrect = i === DIAGNOSTIC[diagIndex].correct;
    const correct = diagCorrect + (isCorrect ? 1 : 0);
    setDiagCorrect(correct);
    if (diagIndex + 1 < DIAGNOSTIC.length) {
      setDiagIndex(diagIndex + 1);
    } else {
      setDiag('done');
      analytics.track('diagnostic_completed', { score: correct / DIAGNOSTIC.length });
    }
  };

  const finish = () => {
    if (!objective || !level || !minutes) return;
    const profile: OnboardingProfile = {
      schemaVersion: ONBOARDING_SCHEMA_VERSION,
      objective,
      level,
      dailyMinutes: minutes,
      topics,
      diagnosticDone: diag === 'done',
      diagnosticScore: diag === 'done' ? diagCorrect / DIAGNOSTIC.length : null,
      startSkillId,
      completedAt: new Date().toISOString(),
    };
    completeOnboarding(profile);
    router.replace({
      pathname: '/session/[skillId]',
      params: { skillId: startSkillId, count: String(exercisesForMinutes(minutes)) },
    });
  };

  return (
    <Screen>
      <View style={styles.progress}>
        <ProgressBar value={(step + 1) / STEPS.length} accessibilityLabel={`Étape ${step + 1} sur ${STEPS.length}`} />
        <Text variant="caption" color={theme.colors.textMuted}>
          Étape {step + 1} / {STEPS.length} · {STEPS[step]}
        </Text>
      </View>

      {step === 0 && (
        <View style={styles.stepGap}>
          <Text variant="h1">Bienvenue 👋</Text>
          <Text variant="body" color={theme.colors.textSecondary}>
            Apprends à lire un graphique en cinq minutes par jour. On personnalise ton
            parcours en quelques questions — aucun compte requis.
          </Text>
          <MascotFigure name="toto-read" height={170} />
          <CharacterScene character="toto" state="welcome" size={60} speech="Moi c’est Toto : je formule des hypothèses haussières." />
          <CharacterScene character="bobo" state="warning" size={60} reversed speech="Et moi Bobo : je traque le risque et le faux signal." />
        </View>
      )}

      {step === 1 && (
        <View style={styles.stepGap}>
          <Text variant="h1">Ton objectif principal ?</Text>
          {OBJECTIVES.map((o) => (
            <OptionCard
              key={o.value}
              emoji={o.emoji}
              label={o.label}
              selected={objective === o.value}
              onPress={() => {
                setObjective(o.value);
                analytics.track('goal_selected', { objective: o.value });
              }}
            />
          ))}
        </View>
      )}

      {step === 2 && (
        <View style={styles.stepGap}>
          <Text variant="h1">Où en es-tu ?</Text>
          {LEVELS.map((l) => (
            <OptionCard key={l.value} emoji={l.emoji} label={l.label} hint={l.hint} selected={level === l.value} onPress={() => setLevel(l.value)} />
          ))}
        </View>
      )}

      {step === 3 && (
        <View style={styles.stepGap}>
          <Text variant="h1">Combien de temps par jour ?</Text>
          {DAILY_OPTIONS.map((d) => (
            <OptionCard key={d.value} emoji="⏱️" label={d.label} hint={d.hint} selected={minutes === d.value} onPress={() => setMinutes(d.value)} />
          ))}
        </View>
      )}

      {step === 4 && (
        <View style={styles.stepGap}>
          <Text variant="h1">Quels sujets t’intéressent ?</Text>
          <Text variant="body" color={theme.colors.textSecondary}>
            Facultatif — on ajuste ton point de départ. Tu pourras tout débloquer ensuite.
          </Text>
          {TOPICS.map((t) => (
            <OptionCard key={t.value} emoji={t.emoji} label={t.label} selected={topics.includes(t.value)} onPress={() => toggleTopic(t.value)} />
          ))}
        </View>
      )}

      {step === 5 && (
        <View style={styles.stepGap}>
          <Text variant="h1">Diagnostic éclair</Text>
          {diag === 'intro' && (
            <>
              <Text variant="body" color={theme.colors.textSecondary}>
                Trois questions rapides pour calibrer ton départ. C’est facultatif.
              </Text>
              <CharacterScene character="bobo" state="think" size={60} speech="Aucune pression : c’est juste pour t’orienter." />
              <Button label="Faire le diagnostic (30 s)" onPress={() => setDiag('running')} />
              <Button label="Passer" variant="ghost" onPress={next} />
            </>
          )}
          {diag === 'running' && (
            <>
              <Text variant="caption" color={theme.colors.textMuted}>
                Question {diagIndex + 1} / {DIAGNOSTIC.length}
              </Text>
              <Text variant="title">{currentDiag.prompt}</Text>
              {currentDiag.visual ? (
                <View style={styles.diagVisual}>
                  <MiniVisual spec={currentDiag.visual} width={150} />
                </View>
              ) : null}
              {currentDiag.options.map((opt, i) => (
                <OptionCard key={opt} emoji={String.fromCharCode(65 + i)} label={opt} onPress={() => answerDiag(i)} />
              ))}
            </>
          )}
          {diag === 'done' && (
            <>
              <Text variant="display" center>🎯</Text>
              <Text variant="h2" center>
                {diagCorrect} / {DIAGNOSTIC.length} bonnes réponses
              </Text>
              <Text variant="body" color={theme.colors.textSecondary} center>
                Parfait — on cale ton parcours en conséquence.
              </Text>
            </>
          )}
        </View>
      )}

      {step === 6 && (
        <View style={styles.stepGap}>
          <Text variant="h1">Ton parcours 🎉</Text>
          <Card elevated>
            <Text variant="label" color={theme.colors.primaryBright}>ON COMMENCE PAR</Text>
            <Text variant="h2">{startSkillName}</Text>
            <View style={styles.recapMascot}>
              <MascotFigure name="toto-present" height={120} />
            </View>
            <Text variant="body" color={theme.colors.textSecondary}>
              Recommandé d’après ton niveau {LEVELS.find((l) => l.value === level)?.label.toLowerCase()}
              {topics.length ? ' et tes sujets favoris.' : '.'}
            </Text>
            <View style={styles.recapChips}>
              <Chip icon="⏱️" label={`${minutes} min/j`} color={theme.colors.technical} />
              {diag === 'done' ? <Chip icon="🎯" label={`Diag. ${diagCorrect}/${DIAGNOSTIC.length}`} color={theme.colors.reward} /> : null}
              {topics.slice(0, 2).map((t) => (
                <Chip key={t} label={TOPICS.find((x) => x.value === t)?.label ?? t} color={theme.colors.neutral} />
              ))}
            </View>
          </Card>
          <Button label="Commencer ma première leçon" onPress={finish} accessibilityHint="Lancer la première session" />
        </View>
      )}

      {/* Barre de navigation (masquée pendant le diagnostic en cours) */}
      {!(step === 5 && diag === 'running') && step !== 6 && (
        <View style={styles.nav}>
          {step > 0 ? <Button label="Retour" variant="ghost" fullWidth={false} onPress={back} /> : <View />}
          <Button
            label={step === 0 ? 'Commencer' : 'Continuer'}
            fullWidth={false}
            onPress={next}
            disabled={!canNext()}
            disabledReason={!canNext() ? 'Fais un choix pour continuer.' : undefined}
          />
        </View>
      )}
    </Screen>
  );
}

function OptionCard({
  emoji,
  label,
  hint,
  selected,
  onPress,
}: {
  emoji: string;
  label: string;
  hint?: string;
  selected?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected: !!selected }} onPress={onPress}>
      <Card style={selected ? styles.selected : undefined}>
        <View style={styles.optionRow}>
          <Text variant="h2">{emoji}</Text>
          <View style={styles.flex1}>
            <Text variant="title">{label}</Text>
            {hint ? (
              <Text variant="caption" color={theme.colors.textMuted}>
                {hint}
              </Text>
            ) : null}
          </View>
          {selected ? <TrademyIcon name="check" size={20} color={theme.colors.primary} /> : null}
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  progress: { gap: theme.spacing.xs },
  stepGap: { gap: theme.spacing.md },
  selected: { borderColor: theme.colors.primary, borderWidth: 1.5 },
  optionRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
  flex1: { flex: 1 },
  diagVisual: { alignItems: 'center', marginVertical: theme.spacing.xs },
  recapMascot: { alignItems: 'center', marginVertical: theme.spacing.sm },
  recapChips: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm, marginTop: theme.spacing.sm },
  nav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: theme.spacing.sm },
});
