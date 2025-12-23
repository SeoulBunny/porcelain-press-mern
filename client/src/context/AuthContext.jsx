import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../lib/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const u = localStorage.getItem("pp_user");
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    try { return localStorage.getItem("pp_token"); } catch { return null; }
  });

  const isAuthed = !!user && !!token;

  async function login(email, password) {
    const data = await api("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem("pp_user", JSON.stringify(data.user));
    localStorage.setItem("pp_token", data.token);
    return data.user;
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem("pp_user");
    localStorage.removeItem("pp_token");
  }

  const value = useMemo(() => ({
    user,
    token,
    isAuthed,
    login,
    logout,
    hasRole: (roles) => !!user && roles.includes(user.role),
  }), [user, token, isAuthed]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
