/** Taxonomie d'évènements analytics — typée, alignée sur le skill (liste essentielle). */
export type AnalyticsEvent =
  // cycle de vie
  | 'app_opened'
  | 'app_error'
  | 'session_not_found'
  // onboarding
  | 'onboarding_started'
  | 'goal_selected'
  | 'diagnostic_completed'
  | 'path_generated'
  | 'onboarding_completed'
  // apprentissage
  | 'daily_mission_started'
  | 'daily_mission_completed'
  | 'lesson_started'
  | 'lesson_completed'
  | 'interaction_started'
  | 'interaction_completed'
  | 'exercise_answered'
  | 'answer_changed'
  | 'hint_requested'
  | 'feedback_viewed'
  | 'false_signal_identified'
  | 'recognition_completed'
  | 'review_completed'
  | 'mastery_changed'
  | 'checkpoint_completed'
  | 'lab_started'
  | 'lab_completed'
  // engagement
  | 'streak_updated'
  | 'path_node_unlocked'
  | 'quest_completed'
  | 'achievement_unlocked'
  | 'stats_viewed'
  | 'glossary_searched'
  | 'concept_viewed'
  | 'favorite_added'
  | 'world_opened'
  // monétisation
  | 'premium_gate_hit'
  | 'paywall_viewed'
  | 'subscription_started'
  | 'subscription_restored'
  | 'subscription_expired';

export type AnalyticsCategory =
  | 'lifecycle'
  | 'onboarding'
  | 'learning'
  | 'engagement'
  | 'monetization';

/** Catégorie de chaque évènement (routage/agrégation ; testé comme source unique). */
export const EVENT_CATEGORIES: Record<AnalyticsEvent, AnalyticsCategory> = {
  app_opened: 'lifecycle',
  app_error: 'lifecycle',
  session_not_found: 'lifecycle',
  onboarding_started: 'onboarding',
  goal_selected: 'onboarding',
  diagnostic_completed: 'onboarding',
  path_generated: 'onboarding',
  onboarding_completed: 'onboarding',
  daily_mission_started: 'learning',
  daily_mission_completed: 'learning',
  lesson_started: 'learning',
  lesson_completed: 'learning',
  interaction_started: 'learning',
  interaction_completed: 'learning',
  exercise_answered: 'learning',
  answer_changed: 'learning',
  hint_requested: 'learning',
  feedback_viewed: 'learning',
  false_signal_identified: 'learning',
  recognition_completed: 'learning',
  review_completed: 'learning',
  mastery_changed: 'learning',
  checkpoint_completed: 'learning',
  lab_started: 'learning',
  lab_completed: 'learning',
  streak_updated: 'engagement',
  path_node_unlocked: 'engagement',
  quest_completed: 'engagement',
  achievement_unlocked: 'engagement',
  stats_viewed: 'engagement',
  glossary_searched: 'engagement',
  concept_viewed: 'engagement',
  favorite_added: 'engagement',
  world_opened: 'engagement',
  premium_gate_hit: 'monetization',
  paywall_viewed: 'monetization',
  subscription_started: 'monetization',
  subscription_restored: 'monetization',
  subscription_expired: 'monetization',
};

export const ANALYTICS_EVENTS: AnalyticsEvent[] = Object.keys(EVENT_CATEGORIES) as AnalyticsEvent[];
