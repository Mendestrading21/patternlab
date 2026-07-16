/** Événements analytics minimums (reference/06-learning-engine.md). */
export type AnalyticsEvent =
  | 'onboarding_started'
  | 'onboarding_completed'
  | 'lesson_started'
  | 'lesson_completed'
  | 'exercise_answered'
  | 'answer_changed'
  | 'feedback_viewed'
  | 'review_completed'
  | 'streak_updated'
  | 'path_node_unlocked'
  | 'paywall_viewed'
  | 'subscription_started'
  | 'app_error';

export const ANALYTICS_EVENTS: AnalyticsEvent[] = [
  'onboarding_started',
  'onboarding_completed',
  'lesson_started',
  'lesson_completed',
  'exercise_answered',
  'answer_changed',
  'feedback_viewed',
  'review_completed',
  'streak_updated',
  'path_node_unlocked',
  'paywall_viewed',
  'subscription_started',
  'app_error',
];
