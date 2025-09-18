import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { AuthService } from "../services/authService";
import type {
  AuthContextType,
  AuthProviderProps,
  User,
  LoginCredentials,
} from "../types/auth.types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const serverUser = await AuthService.checkAuthStatus();
      setUser(serverUser);
    } catch (error) {
      console.error("Failed to initialize auth:", error);
      await logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await AuthService.login(credentials);

      if (response) {
        setUser(response.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await AuthService.logout();
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const success = await AuthService.refreshToken();
      if (!success) {
        await logout();
      }
      return success;
    } catch (error) {
      console.error("Token refresh failed:", error);
      await logout();
      return false;
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(async () => {
      const user = await AuthService.checkAuthStatus();
      if (!user) {
        await logout();
      }
    }, 15 * 60 * 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
