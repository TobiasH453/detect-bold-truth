import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

// ============================================================================
// MOCK AUTH — UI-only stub. Replace with real auth (Supabase, Clerk, Auth.js…)
// ============================================================================
// Contract a real implementation must satisfy:
//   - useAuth() returns { user, loading, signIn, signUp, signOut }
//   - user: { id: string; email: string } | null
//   - signIn/signUp: (email, password) => Promise<{ error: string | null }>
//   - signOut: () => Promise<void>
// ============================================================================

export interface MockUser {
  id: string;
  email: string;
}

interface AuthContextValue {
  user: MockUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "aisore.mock-user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
      if (raw) setUser(JSON.parse(raw));
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  const persist = (u: MockUser | null) => {
    setUser(u);
    try {
      if (u) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      else window.localStorage.removeItem(STORAGE_KEY);
    } catch { /* ignore */ }
  };

  const signIn = async (email: string, _password: string) => {
    persist({ id: "mock-user-id", email });
    return { error: null };
  };

  const signUp = async (email: string, _password: string) => {
    persist({ id: "mock-user-id", email });
    return { error: null };
  };

  const signOut = async () => {
    persist(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
