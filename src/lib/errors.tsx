import { Component, type ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../design-system/theme';
import { StateView } from '../design-system/components/StateView';
import { analytics } from '../analytics';

type Props = { children: ReactNode };
type State = { hasError: boolean; message?: string };

/** Garde-fou global : capture les erreurs de rendu et affiche un état d'erreur propre. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: unknown): State {
    return { hasError: true, message: error instanceof Error ? error.message : 'Erreur inconnue' };
  }

  componentDidCatch(error: unknown): void {
    analytics.track('app_error', { message: error instanceof Error ? error.message : String(error) });
  }

  private reset = () => this.setState({ hasError: false, message: undefined });

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <View style={styles.wrap}>
        <StateView
          variant="error"
          message="Rien de perdu. Réessaie — ton avancée est sauvegardée localement."
          action={{ label: 'Réessayer', onPress: this.reset }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
});
