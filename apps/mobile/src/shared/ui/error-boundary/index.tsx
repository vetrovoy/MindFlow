import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '@shared/theme/use-theme';
import { useCopy } from '@shared/lib/use-copy';
import { logError } from '@shared/lib/error-logger';
import { Icon } from '@shared/ui/icons';
import { StateCard } from '@shared/ui/primitives';
import { Body } from '@shared/ui/typography';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  resetCount: number;
}

const MAX_RESETS = 3;

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null, resetCount: 0 };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, resetCount: 0 };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    logError(error, {
      action: 'ErrorBoundary.componentDidCatch',
      metadata: { componentStack: info.componentStack },
    });
  }

  handleReset = (): void => {
    this.props.onReset?.();
    this.setState(prev => ({
      hasError: false,
      error: null,
      resetCount: prev.resetCount + 1,
    }));
  };

  render(): ReactNode {
    if (this.state.hasError && this.state.resetCount >= MAX_RESETS) {
      return <ErrorMaxResetFallback />;
    }
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return <ErrorFallback onReset={this.handleReset} />;
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
});

function ErrorFallback({ onReset }: { onReset: () => void }) {
  const { theme } = useTheme();
  const copy = useCopy();

  return (
    <View style={styles.container}>
      <StateCard
        variant="error"
        title={copy.errorBoundary.title}
        description={copy.errorBoundary.description}
      />
      <Pressable
        onPress={onReset}
        style={[
          styles.resetButton,
          {
            backgroundColor: theme.colors.accentPrimary,
            borderColor: theme.colors.borderSoft,
          },
        ]}
      >
        <Icon decorative name="restore" size={18} tone="accent" />
        <Body style={{ color: theme.colors.textPrimary }}>
          {copy.errorBoundary.resetButton}
        </Body>
      </Pressable>
    </View>
  );
}

function ErrorMaxResetFallback() {
  const copy = useCopy();

  return (
    <View style={styles.container}>
      <StateCard
        variant="error"
        title={copy.errorBoundary.maxResetTitle}
        description={copy.errorBoundary.maxResetDescription}
      />
    </View>
  );
}
