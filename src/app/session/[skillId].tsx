import { useEffect, useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Screen, Text, Card, Button, ProgressBar, StateView, FeedbackPanel, theme } from '@/design-system';
import { CharacterScene, MascotFigure, characterLine } from '@/characters';
import { ExercisePlayer, gradeExercise, exerciseFormatLabel, type GradeResult } from '@/engines/exercise';
import {
  getExercises,
  getLessons,
  skillById,
  limitCount,
  isCheckpoint,
  isFalseSignalExercise,
  useProgress,
  buildSessionSummary,
  conceptBySlug,
  conceptSlugForSkill,
  V5_CONCEPTS,
  mistakeMoment,
  buildLearnSteps,
  sanitizeResume,
  isResumable,
  sessionResumeRepository,
  MASTERY_LABEL,
} from '@/data';
import { xpForGrade, masteryStatus } from '@/engines/learning';
import { LessonStepView } from '@/components/LessonStepView';
import { analytics } from '@/analytics';
import { useNow } from '@/lib/useNow';

/** Seuil de réussite d'une session (déblocage de la compétence). */
const PASS_RATIO = 0.7;
const DAY_MS = 86_400_000;

export default function Session() {
  const { skillId, count } = useLocalSearchParams<{ skillId: string; count?: string }>();
  const router = useRouter();
  const { recordAnswer, completeSession, recordFalseSignal } = useProgress();

  // Session valide = un id qui correspond à un contenu réel (compétence avec exercices, ou point
  // de contrôle dont `getExercises` agrège des exercices réels). AUCUN repli silencieux : un id
  // inconnu affiche un état « Session introuvable » (plus bas), jamais un autre contenu enseigné.
  const resolvedId = typeof skillId === 'string' ? skillId : '';
  const all = resolvedId ? getExercises(resolvedId) : [];
  const known = all.length > 0;
  // `count` (facultatif) provient de la mission du jour : longueur modulée par le temps quotidien.
  const target = count != null ? Number.parseInt(count, 10) : null;
  const list = all.slice(0, limitCount(all.length, target));
  const skillName = skillById(resolvedId)?.name ?? 'Session';
  const lessons = known ? getLessons(resolvedId) : [];

  // Séquence d'apprentissage : les steps de la 1re leçon, avec un contre-exemple garanti.
  const concept = conceptBySlug(V5_CONCEPTS, conceptSlugForSkill(resolvedId) ?? '');
  const learnSteps = lessons.length ? buildLearnSteps(lessons[0].steps, concept?.falseSignals?.[0]) : [];

  const [index, setIndex] = useState(0);
  const [streak, setStreak] = useState(0);
  const [result, setResult] = useState<GradeResult | null>(null);
  const [correct, setCorrect] = useState(0);
  const [learnStep, setLearnStep] = useState(0);
  // Un point de contrôle (`getLessons` vide) démarre directement en « practice ».
  const [phase, setPhase] = useState<'learn' | 'practice'>(lessons.length ? 'learn' : 'practice');
  const [hydrated, setHydrated] = useState(false);
  const hydratedOnce = useRef(false);

  // Reprise exacte : au 1er rendu, restaure la position sauvegardée de CETTE compétence.
  useEffect(() => {
    if (hydratedOnce.current) return;
    hydratedOnce.current = true;
    let cancelled = false;
    (async () => {
      if (known) {
        const resume = sanitizeResume(await sessionResumeRepository.load(), { skillId: resolvedId });
        if (!cancelled && isResumable(resume) && resume) {
          setPhase(resume.phase);
          setLearnStep(resume.learnStep);
          setIndex(resume.index);
          setCorrect(resume.correct);
          setStreak(resume.streak);
        }
      }
      if (!cancelled) setHydrated(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [known, resolvedId]);

  // Journalise l'accès à une session inexistante (transparence ; jamais de repli muet).
  useEffect(() => {
    if (!known) analytics.track('session_not_found', { requested: resolvedId || '(vide)' });
  }, [known, resolvedId]);

  // Persiste la position tant que la session n'est pas terminée (reprise après fermeture).
  useEffect(() => {
    if (!known || !hydrated) return;
    if (index >= list.length) return;
    sessionResumeRepository.save({ skillId: resolvedId, phase, learnStep, index, correct, streak, count: target });
  }, [known, hydrated, phase, learnStep, index, correct, streak, resolvedId, list.length, target]);

  // Session terminée → efface la reprise (rien à restaurer).
  useEffect(() => {
    if (known && hydrated && index >= list.length) sessionResumeRepository.clear();
  }, [known, hydrated, index, list.length]);

  const finished = index >= list.length;

  const restart = () => {
    setPhase(lessons.length ? 'learn' : 'practice');
    setLearnStep(0);
    setIndex(0);
    setResult(null);
    setCorrect(0);
    setStreak(0);
    sessionResumeRepository.clear();
  };

  if (!known) {
    return (
      <Screen>
        <Text variant="caption" color={theme.colors.textMuted}>
          SESSION
        </Text>
        <Text variant="h2">Session introuvable</Text>
        <CharacterScene
          character="bobo"
          state="review"
          size={60}
          speech="Cette session n’existe pas (ou plus). Reprenons depuis le parcours."
        />
        <Card>
          <Text variant="body" color={theme.colors.textMuted}>
            Le contenu demandé est introuvable. Choisis une compétence depuis le parcours pour
            continuer ton apprentissage.
          </Text>
        </Card>
        <Button label="Voir le parcours" onPress={() => router.replace('/parcours')} />
        <Button label="Accueil" variant="ghost" onPress={() => router.replace('/(tabs)')} />
      </Screen>
    );
  }

  if (!hydrated) {
    return (
      <Screen>
        <StateView variant="loading" title="On prépare ta session…" />
      </Screen>
    );
  }

  if (phase === 'learn' && learnSteps.length) {
    const stepIdx = Math.min(learnStep, learnSteps.length - 1);
    const step = learnSteps[stepIdx];
    const isLast = stepIdx >= learnSteps.length - 1;
    return (
      <Screen>
        <View style={styles.header}>
          <View style={styles.headRow}>
            <Text variant="caption" color={theme.colors.primary}>
              APPRENDRE · étape {stepIdx + 1} / {learnSteps.length}
            </Text>
            {stepIdx > 0 || index > 0 ? (
              <Button label="Recommencer" variant="ghost" fullWidth={false} onPress={restart} accessibilityHint="Reprendre la session depuis le début" />
            ) : null}
          </View>
          <Text variant="h2">{skillName}</Text>
          <ProgressBar value={stepIdx / learnSteps.length} accessibilityLabel={`Étape ${stepIdx + 1} sur ${learnSteps.length}`} />
        </View>

        {stepIdx === 0 ? (
          <CharacterScene character="toto" state="explain" size={56} speech="On regarde d’abord, puis on s’exerce." />
        ) : null}

        <LessonStepView key={step.id} step={step} />

        {isLast && lessons.length > 1 ? (
          <Card>
            <Text variant="label" color={theme.colors.textMuted}>
              Pour aller plus loin
            </Text>
            {lessons.slice(1).map((l) => (
              <Button
                key={l.id}
                label={`${l.title} →`}
                variant="ghost"
                onPress={() => router.push(`/lesson/${l.id}`)}
                accessibilityHint={`Ouvrir la leçon ${l.title}`}
              />
            ))}
          </Card>
        ) : null}

        <View style={styles.stepNav}>
          {stepIdx > 0 ? (
            <Button label="◀ Retour" variant="secondary" fullWidth={false} onPress={() => setLearnStep((s) => Math.max(0, s - 1))} />
          ) : null}
          {isLast ? (
            <Button
              label="Commencer les exercices"
              onPress={() => {
                analytics.track('lesson_started', { skillId: resolvedId });
                setPhase('practice');
              }}
            />
          ) : (
            <Button label="Suivant ▶" onPress={() => setLearnStep((s) => s + 1)} />
          )}
        </View>
      </Screen>
    );
  }

  if (finished) {
    return (
      <Results
        skillId={resolvedId}
        total={list.length}
        correct={correct}
        onComplete={(passed) => {
          completeSession(resolvedId, passed);
          if (isCheckpoint(resolvedId)) analytics.track('checkpoint_completed', { passed });
        }}
        onHome={() => router.replace('/(tabs)')}
        onRetry={restart}
      />
    );
  }

  const exercise = list[index];

  const validate = (answer: unknown) => {
    if (result) return;
    const graded = gradeExercise(exercise, answer);
    setResult(graded);
    if (graded.correct) setCorrect((c) => c + 1);
    setStreak((s) => (graded.correct ? s + 1 : 0));
    // Erreur → errorTag = id de l'exercice (concept à retravailler ; révision rapprochée).
    recordAnswer(exercise.skillId, graded.correct ? 5 : 2, graded.correct ? undefined : exercise.id);
    // Réussite « compréhension » V5 : un faux signal / une invalidation correctement repéré.
    if (graded.correct && isFalseSignalExercise(exercise.type)) recordFalseSignal();
    analytics.track('feedback_viewed', { exerciseId: exercise.id, correct: graded.correct });
  };

  const next = () => {
    setIndex((i) => i + 1);
    setResult(null);
  };

  // Réaction de Toto/Bobo : réussite → réplique variée de Toto ; erreur → Bobo pointe l'IDÉE FAUSSE
  // précise (misconception liée à l'exercice), pas un « réessaie » générique (Lot 9).
  const feedbackLine = result
    ? result.correct
      ? characterLine({ kind: 'answer', correct: true, streak }, index)
      : mistakeMoment(exercise.id)
    : null;

  return (
    <Screen>
      <Text variant="h2">{skillName}</Text>
      <View style={styles.header}>
        <Text variant="caption" color={theme.colors.textMuted}>
          Exercice {index + 1} / {list.length}
        </Text>
        <ProgressBar value={index / list.length} accessibilityLabel="Progression de la session" />
      </View>

      <Card>
        <Text variant="caption" color={theme.colors.primary}>
          {exerciseFormatLabel(exercise.type)}
        </Text>
        <Text variant="title">{exercise.prompt}</Text>
        <ExercisePlayer key={exercise.id} exercise={exercise} result={result} onValidate={validate} />
      </Card>

      {result ? (
        <>
          <FeedbackPanel
            correct={result.correct}
            message={result.correct ? result.feedback.correct : result.feedback.incorrect}
            rule={result.feedback.rule}
            whenItFails={result.feedback.whenItFails}
          >
            {feedbackLine ? (
              <CharacterScene
                character={feedbackLine.character}
                state={feedbackLine.state}
                size={60}
                speech={feedbackLine.text}
              />
            ) : null}
          </FeedbackPanel>
          <Button label={index + 1 >= list.length ? 'Voir mon résultat' : 'Continuer'} onPress={next} />
        </>
      ) : null}
    </Screen>
  );
}

function Results({
  skillId,
  total,
  correct,
  onComplete,
  onHome,
  onRetry,
}: {
  skillId: string;
  total: number;
  correct: number;
  onComplete: (passed: boolean) => void;
  onHome: () => void;
  onRetry: () => void;
}) {
  const { state } = useProgress();
  const now = useNow();
  const summary = buildSessionSummary(correct, total, PASS_RATIO);
  const success = summary.passed;
  const done = useRef(false);
  useEffect(() => {
    if (!done.current) {
      done.current = true;
      onComplete(success);
      analytics.track('lesson_completed', { total, correct, passed: success });
    }
  }, [onComplete, success, total, correct]);

  // Barème identique à l'XP réellement enregistré (grade 5 si correct, sinon 2).
  const xp = correct * xpForGrade(5) + (total - correct) * xpForGrade(2);
  // Maîtrise RÉELLE de la compétence (pas un emoji décoratif) + prochaine révision.
  const sp = state?.skills[skillId];
  const masteryLabel = sp ? MASTERY_LABEL[masteryStatus(sp)] : null;
  const dueDays = sp ? Math.max(0, Math.ceil((sp.review.dueAt - now) / DAY_MS)) : null;
  const nextReview = dueDays == null ? null : dueDays <= 0 ? 'aujourd’hui' : dueDays === 1 ? 'demain' : `dans ${dueDays} j`;
  // Réaction contextuelle de Toto/Bobo au résultat (variée selon le score).
  const reaction = characterLine({ kind: 'result', tier: summary.tier }, correct);

  return (
    <Screen>
      <Card elevated style={styles.results}>
        <Text variant="display">{summary.emoji}</Text>
        <Text variant="h1" center>
          {correct} / {total}
        </Text>
        <Text variant="body" color={theme.colors.textSecondary} center>
          {summary.headline}
        </Text>

        <View style={styles.accuracyWrap}>
          <ProgressBar value={summary.accuracy} accessibilityLabel={`Précision : ${summary.accuracyPct} %`} />
        </View>

        {/* Trois tuiles récapitulatives : XP · Précision · MAÎTRISE réelle (plus d'emoji vide). */}
        <View style={styles.statTiles}>
          <StatTile label="XP" value={`+${xp}`} color={theme.colors.reward} />
          <StatTile label="Précision" value={`${summary.accuracyPct}%`} color={theme.colors.technical} />
          <StatTile label="Maîtrise" value={masteryLabel ?? TIER_FALLBACK[summary.tier]} color={theme.colors.bullish} />
        </View>

        {nextReview ? (
          <Text variant="caption" color={theme.colors.textMuted} center accessibilityLabel={`Prochaine révision : ${nextReview}`}>
            🔁 Prochaine révision : {nextReview}
          </Text>
        ) : null}

        {summary.tier === 'retry' ? (
          <CharacterScene character={reaction.character} state={reaction.state} size={72} speech={reaction.text} />
        ) : (
          <>
            <MascotFigure name="celebrate" gesture="celebrate" height={170} />
            <CharacterScene character={reaction.character} state={reaction.state} size={56} speech={reaction.text} />
          </>
        )}
      </Card>
      <Button label="Retour à l’accueil" onPress={onHome} />
      <Button label="Refaire la session" variant="secondary" onPress={onRetry} />
    </Screen>
  );
}

function StatTile({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={styles.tile} accessible accessibilityLabel={`${label} : ${value}`}>
      <Text variant="title" color={color} center>
        {value}
      </Text>
      <Text variant="caption" color={theme.colors.textMuted} center>
        {label}
      </Text>
    </View>
  );
}

/** Étiquette de repli pour la tuile Maîtrise quand la compétence n'a pas de progression propre
 *  (ex. point de contrôle qui agrège plusieurs compétences). */
const TIER_FALLBACK: Record<string, string> = { perfect: 'Excellent', pass: 'Validé', retry: 'À revoir' };

const styles = StyleSheet.create({
  header: { gap: theme.spacing.sm },
  headRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: theme.spacing.sm },
  stepNav: { flexDirection: 'row', gap: theme.spacing.sm, marginTop: theme.spacing.md, alignItems: 'center' },
  results: { alignItems: 'center', gap: theme.spacing.md },
  accuracyWrap: { width: '100%' },
  statTiles: { flexDirection: 'row', gap: theme.spacing.sm, width: '100%' },
  tile: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
});
