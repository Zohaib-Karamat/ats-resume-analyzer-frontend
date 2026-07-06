import { Toaster } from 'react-hot-toast';
import { useTheme } from '../hooks/useTheme';

export function ToastProvider() {
  const { theme } = useTheme();

  return (
    <Toaster
      position="top-right"
      toastOptions={{
        className: 'dark:bg-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-lg',
        style: {
          background: theme === 'dark' ? 'var(--zinc-900)' : '#fff',
          color: theme === 'dark' ? 'var(--zinc-50)' : 'var(--zinc-900)',
          borderRadius: 'var(--radius-md)',
        },
        success: {
          iconTheme: {
            primary: 'var(--emerald-500)',
            secondary: 'white',
          },
        },
        error: {
          iconTheme: {
            primary: 'var(--rose-500)',
            secondary: 'white',
          },
        },
      }}
    />
  );
}
