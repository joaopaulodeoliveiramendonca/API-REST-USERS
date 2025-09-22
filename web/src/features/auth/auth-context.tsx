import React from 'react';
import { jwtDecode } from 'jwt-decode';

const STORAGE_KEY = 'users-web.auth';

interface JwtPayload {
  sub: string;
  email?: string;
}

export interface AuthUser {
  id: string;
  email?: string;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
}

export interface AuthContextValue extends AuthState {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  setUser: (user: AuthUser | null) => void;
}

function getStoredAuth(): AuthState {
  if (typeof window === 'undefined') {
    return { token: null, user: null };
  }

  try {
    const persisted = window.localStorage.getItem(STORAGE_KEY);
    if (!persisted) {
      return { token: null, user: null };
    }

    const parsed = JSON.parse(persisted) as AuthState;
    if (!parsed.token) {
      return { token: null, user: null };
    }

    return {
      token: parsed.token,
      user: parsed.user ?? refreshUserFromToken(parsed.token),
    };
  } catch (error) {
    console.warn('Erro ao recuperar autenticação persistida:', error);
    return { token: null, user: null };
  }
}

function refreshUserFromToken(token: string): AuthUser | null {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    if (!decoded.sub) {
      return null;
    }

    return { id: decoded.sub, email: decoded.email };
  } catch (error) {
    console.warn('Erro ao decodificar token JWT:', error);
    return null;
  }
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<AuthState>(() => getStoredAuth());

  const login = React.useCallback((token: string) => {
    setState({ token, user: refreshUserFromToken(token) });
  }, []);

  const logout = React.useCallback(() => {
    setState({ token: null, user: null });
  }, []);

  const setUser = React.useCallback((user: AuthUser | null) => {
    setState((prev) => ({ ...prev, user }));
  }, []);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!state.token) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ token: state.token, user: state.user }),
    );
  }, [state]);

  const value = React.useMemo<AuthContextValue>(
    () => ({
      ...state,
      isAuthenticated: Boolean(state.token),
      login,
      logout,
      setUser,
    }),
    [login, logout, setUser, state],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider.');
  }

  return context;
}
