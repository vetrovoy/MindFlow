import { Component, type ErrorInfo, type ReactNode } from "react";

import { useCopy } from "@/app/providers/language-provider";
import { logError } from "@/shared/lib/error-logger";
import { SectionTitle, StateCard, SurfaceCard } from "@/shared/ui";
import styles from "./index.module.css";

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
      action: "ErrorBoundary.componentDidCatch",
      metadata: { componentStack: info.componentStack }
    });
  }

  handleReset = (): void => {
    this.props.onReset?.();
    this.setState((prev) => ({
      hasError: false,
      error: null,
      resetCount: prev.resetCount + 1
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

function ErrorFallback({ onReset }: { onReset: () => void }) {
  const copy = useCopy();

  return (
    <div className={styles.root}>
      <SurfaceCard>
        <SectionTitle title={copy.errorBoundary.title} />
        <StateCard
          description={copy.errorBoundary.description}
          title={copy.errorBoundary.title}
          variant="error"
        />
        <div className={styles.actions}>
          <button
            className={styles.resetButton}
            onClick={onReset}
            type="button"
          >
            {copy.errorBoundary.resetButton}
          </button>
        </div>
      </SurfaceCard>
    </div>
  );
}

function ErrorMaxResetFallback() {
  const copy = useCopy();

  return (
    <div className={styles.root}>
      <SurfaceCard>
        <SectionTitle title={copy.errorBoundary.maxResetTitle} />
        <StateCard
          description={copy.errorBoundary.maxResetDescription}
          title={copy.errorBoundary.maxResetTitle}
          variant="error"
        />
      </SurfaceCard>
    </div>
  );
}
