import { Component } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "./ui/Button";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // In production, you would log to an error reporting service (e.g., Sentry)
    console.error("[ErrorBoundary] Uncaught render error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) this.props.onReset();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-6 p-8 text-center">
          <div className="rounded-full bg-rose-100 p-4 dark:bg-rose-900/30">
            <AlertTriangle className="h-10 w-10 text-rose-600 dark:text-rose-400" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              Something went wrong
            </h2>
            <p className="max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
              An unexpected error occurred in this section. Try refreshing, or contact support if the problem persists.
            </p>
            {import.meta.env.DEV && this.state.error && (
              <pre className="mt-4 max-w-lg overflow-x-auto rounded-md bg-zinc-100 p-3 text-left text-xs text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
                {this.state.error.toString()}
              </pre>
            )}
          </div>
          <Button onClick={this.handleReset} variant="secondary">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
