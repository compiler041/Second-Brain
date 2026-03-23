import { useState, useEffect } from "react";
import { useAppContext, User } from "@/context/app-context";

const AUTH_KEY = "sb_auth_user";

export function useAuth() {
  const { user, setUser } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(AUTH_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as User;
        setUser(parsed);
      }
    } catch {}
    setIsLoading(false);
  }, []);

  function login(email: string, _password: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const u: User = {
          user_id: 1,
          username: email.split("@")[0],
          email,
        };
        setUser(u);
        localStorage.setItem(AUTH_KEY, JSON.stringify(u));
        resolve();
      }, 600);
    });
  }

  function register(email: string, _password: string, username?: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const u: User = {
          user_id: 1,
          username: username ?? email.split("@")[0],
          email,
        };
        setUser(u);
        localStorage.setItem(AUTH_KEY, JSON.stringify(u));
        resolve();
      }, 800);
    });
  }

  function logout() {
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
  }

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };
}
