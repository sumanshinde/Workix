'use client';

import React, { useEffect } from 'react';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Ping health endpoint to wake up server/prevent cold starts
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api`;
    const baseUrl = url.endsWith('/api') ? url.replace(/\/api$/, '') : url;
    fetch(`${baseUrl}/health`).catch(() => {});
  }, []);

  return (
    <SessionProvider>
      <Toaster position="top-right" reverseOrder={false} />
      {children}
    </SessionProvider>
  );
}
