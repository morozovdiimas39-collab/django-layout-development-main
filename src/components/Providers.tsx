'use client';

import { Suspense, useEffect } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { ContentProvider } from '@/contexts/ContentContext';
import { saveUTMToStorage } from '@/lib/utm';
import ScrollToTop from '@/components/ScrollToTop';
import TouchpointTracker from '@/components/TouchpointTracker';

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    saveUTMToStorage();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <ContentProvider>
            <Suspense fallback={null}>
              <TouchpointTracker />
            </Suspense>
            <ScrollToTop />
            <Toaster />
            <Sonner />
            {children}
          </ContentProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
