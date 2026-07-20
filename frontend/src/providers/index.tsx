'use client';

import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { QueryProvider } from './QueryProvider';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      forcedTheme="dark"
    >
      <QueryProvider>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgba(11, 18, 36, 0.95)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#FFFFFF',
              borderRadius: '14px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            },
            className: 'sonner-toast',
          }}
          richColors
        />
      </QueryProvider>
    </ThemeProvider>
  );
}
