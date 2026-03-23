"use client";

import { useCallback, useEffect, useMemo, useState, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import api from "../services/api";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  sessionKey: number;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

// Shared provider so every component sees the same auth state.
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionKey, setSessionKey] = useState<number>(Date.now());

  const resetUserState = useCallback(() => {
    // Increment sessionKey to force remounts of user-scoped areas.
    setSessionKey(Date.now());
  }, []);

  const fetchMe = useCallback(async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.user);
    } catch (_err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const handleUserChange = useCallback(
    (nextUser: User | null) => {
      setUser(nextUser);
      resetUserState();
    },
    [resetUserState]
  );

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      handleUserChange(res.data.user);
      router.push("/dashboard");
    },
    [handleUserChange, router]
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const res = await api.post("/auth/register", { name, email, password });
      localStorage.setItem("token", res.data.token);
      handleUserChange(res.data.user);
      router.push("/dashboard");
    },
    [handleUserChange, router]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    handleUserChange(null);
    router.push("/login");
  }, [handleUserChange, router]);

  const value = useMemo(
    () => ({ user, loading, sessionKey, login, register, logout, refresh: fetchMe }),
    [user, loading, sessionKey, login, register, logout, fetchMe]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
