/** Événements analytics minimums (reference/06-learning-engine.md). */
export type AnalyticsEvent =
  | 'onboarding_started'
  | 'goal_selected'
  | 'diagnostic_completed'
  | 'path_generated'
  | 'onboarding_completed'
  | 'lesson_started'
  | 'lesson_completed'
  | 'exercise_answered'
  | 'answer_changed'
  | 'feedback_viewed'
  | 'review_completed'
  | 'streak_updated'
  | 'path_node_unlocked'
  | 'checkpoint_completed'
  | 'quest_completed'
  | 'achievement_unlocked'
  | 'stats_viewed'
  | 'lab_started'
  | 'lab_completed'
  | 'paywall_viewed'
  | 'subscription_started'
  | 'app_error';

export const ANALYTICS_EVENTS: AnalyticsEvent[] = [
  'onboarding_started',
  'goal_selected',
  'diagnostic_completed',
  'path_generated',
  'onboarding_completed',
  'lesson_started',
  'lesson_completed',
  'exercise_answered',
  'answer_changed',
  'feedback_viewed',
  'review_completed',
  'streak_updated',
  'path_node_unlocked',
  'checkpoint_completed',
  'quest_completed',
  'achievement_unlocked',
  'stats_viewed',
  'lab_started',
  'lab_completed',
  'paywall_viewed',
  'subscription_started',
  'app_error',
];
