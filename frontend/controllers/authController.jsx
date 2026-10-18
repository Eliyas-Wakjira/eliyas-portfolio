/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Frontend Controller: AuthController (C in MVC)
 * Maintains administrator session state using an HttpOnly server cookie.
 */
import { createContext, useContext, useState, useEffect } from "react";
import { apiFetch as fetch } from "./api";

const AuthContext = createContext(void 0);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/auth/me")
      .then(async (response) => {
        if (response.status === 401) return null;
        const result = await response.json();
        if (!response.ok) throw new Error(result.error?.message || "Could not verify administrator session");
        return result.data;
      })
      .then((sessionUser) => {
        if (isMounted && sessionUser) setUser(sessionUser);
      })
      .catch((requestError) => {
        if (isMounted) setError(requestError.message || "Could not verify administrator session");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error?.message || "Sign-in failed");
        return false;
      }

      setUser(result.data);
      return true;
    } catch {
      setError("Unable to reach the sign-in service");
      return false;
    }
  };

  const logout = async () => {
    setUser(null);
    setError(null);
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });
      if (!response.ok) setError("The server could not close the administrator session");
    } catch {
      setError("The server could not close the administrator session");
    }
  };

  const isAuthenticated = Boolean(user);
  const isAdmin = user?.role === "super_admin" || user?.role === "admin";

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isAdmin, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export { AuthProvider, useAuth };
