'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ReactNode } from 'react';
import { NeuralToastProvider } from '@/components/ui/neural-toast';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <NeuralToastProvider>
        {children}
      </NeuralToastProvider>
    </NextThemesProvider>
  );
}
