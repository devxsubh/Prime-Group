"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { useAuth } from "@/components/hooks/useAuth";

interface CreditsContextValue {
  credits: number;
  loading: boolean;
  refreshCredits: () => Promise<void>;
  spendCredits: (amount: number) => void;
}

const CreditsContext = createContext<CreditsContextValue>({
  credits: 0,
  loading: true,
  refreshCredits: async () => {},
  spendCredits: () => {},
});

export function CreditsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchCredits = useCallback(async () => {
    if (!user) {
      setCredits(0);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/credits/balance");
      if (res.ok) {
        const data = await res.json();
        setCredits(data.credits ?? 0);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  const spendCredits = useCallback((amount: number) => {
    setCredits((prev) => Math.max(0, prev - amount));
  }, []);

  return (
    <CreditsContext.Provider value={{ credits, loading, refreshCredits: fetchCredits, spendCredits }}>
      {children}
    </CreditsContext.Provider>
  );
}

export function useCredits() {
  return useContext(CreditsContext);
}
