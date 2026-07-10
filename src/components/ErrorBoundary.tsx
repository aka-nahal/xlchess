import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string | null;
}

/**
 * Top-level error boundary. A marketing hero should never white-screen:
 * if anything throws during render, show a branded fallback with a recovery
 * action instead of a blank page. The error message is surfaced (small and
 * unobtrusive) so bug reports are actionable from a single screenshot.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: null };

  static getDerivedStateFromError(error: unknown): State {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : String(error),
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Hook point for an error reporter (e.g. Sentry). Console in the meantime
    // so issues are visible during review without extra infrastructure.
    console.error("Unhandled render error:", error, info.componentStack);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-navy-950 px-6 text-center"
        >
          <span className="text-5xl text-brand-light" aria-hidden>
            {"\u265E"}
          </span>
          <h1 className="text-xl font-bold text-white">Something went wrong</h1>
          <p className="max-w-sm text-sm text-slate-400">
            An unexpected error occurred while rendering the page. Reloading
            usually fixes it.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="focus-brand mt-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-light"
          >
            Reload page
          </button>
          {this.state.message && (
            <p className="mt-4 max-w-lg break-words rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 font-mono text-xs text-slate-500">
              {this.state.message}
            </p>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}
