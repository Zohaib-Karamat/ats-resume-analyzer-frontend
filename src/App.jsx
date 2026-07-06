import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './components/ToastProvider';
import { AppRoutes } from './routes/AppRoutes';
import { ErrorBoundary } from './components/ErrorBoundary';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60, // 1 minute
      onError: (error) => {
        const status = error?.response?.status;
        // Skip 401 – the axios interceptor already handles redirect + toast
        if (status === 401) return;
        if (status >= 500) {
          toast.error("Server error. Please try again later.");
        } else if (!navigator.onLine) {
          toast.error("You appear to be offline. Check your connection.");
        } else {
          toast.error(error?.response?.data?.message || "Something went wrong.");
        }
      },
    },
    mutations: {
      onError: (error) => {
        const status = error?.response?.status;
        if (status === 401) return;
        if (status === 422 || status === 400) {
          // Validation errors – individual forms will show field-level errors
          return;
        }
        toast.error(error?.response?.data?.message || "Operation failed. Please try again.");
      },
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <ErrorBoundary>
            <AppRoutes />
          </ErrorBoundary>
          <ToastProvider />
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
