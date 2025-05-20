
'use client';

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";

interface AuthProviderProps {
  children: React.ReactNode;
  session: Session | null;
}

export function AuthProvider({ children, session }: AuthProviderProps) {
  return (
    <SessionProvider
      session={session}
      refetchInterval={0}
      refetchOnWindowFocus={false}
    >
      {children}
    </SessionProvider>
  );
}