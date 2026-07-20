import { StateView } from './StateView';

export type EmptyStateProps = {
  icon?: string;
  title: string;
  message?: string;
};

/** Compat : état « vide » — délègue à la primitive d'état unifiée (StateView). */
export function EmptyState({ icon, title, message }: EmptyStateProps) {
  return <StateView variant="empty" icon={icon} title={title} message={message} />;
}
