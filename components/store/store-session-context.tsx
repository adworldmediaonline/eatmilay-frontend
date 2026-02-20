"use client";

import { createContext, useContext } from "react";

export type StoreSessionUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role?: string;
};

export type StoreSession = {
  user: StoreSessionUser;
} | null;

const StoreSessionContext = createContext<StoreSession>(null);

export function StoreSessionProvider({
  session,
  children,
}: {
  session: StoreSession;
  children: React.ReactNode;
}) {
  return (
    <StoreSessionContext.Provider value={session}>
      {children}
    </StoreSessionContext.Provider>
  );
}

export function useStoreSession(): StoreSession {
  return useContext(StoreSessionContext);
}
