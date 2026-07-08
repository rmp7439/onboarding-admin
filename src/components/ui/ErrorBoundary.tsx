import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "./Button";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 max-w-md w-full flex flex-col items-center">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h1 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h1>
            <p className="text-sm text-gray-500 mb-6">
              An unexpected error occurred in the application. Our team has been notified.
            </p>
            <Button onClick={() => window.location.href = '/dashboard'} className="w-full">
              Return to Dashboard
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}