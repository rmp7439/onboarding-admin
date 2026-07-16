import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router } from "./routes";
import { ToastProvider } from "./contexts/ToastContext";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "./components/ui/Toaster";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <AuthProvider>
            <RouterProvider router={router} />
            <Toaster />
          </AuthProvider>
        </ToastProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;