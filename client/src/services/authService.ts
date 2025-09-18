import api from "../context/apiSetup";
import type { LoginCredentials, User } from "../types/auth.types";

interface LoginResponse {
  accessToken: string;
  expiresAt: string;
  user: User;
  message: string;
}

interface RefreshResponse {
  accessToken: string;
  expiresAt: string;
  message: string;
}

export class AuthService {
  private static readonly AUTH_PATH = "/auth";
  private static readonly USER_KEY = "user";
  private static readonly TOKEN_KEY = "accessToken";
  private static readonly TOKEN_EXPIRY_KEY = "tokenExpiry";

  static async login(
    credentials: LoginCredentials
  ): Promise<{ user: User } | null> {
    try {
      const response = await api.post<LoginResponse>(
        `${this.AUTH_PATH}/login`,
        credentials,
        {
          withCredentials: true,
        }
      );

      this.setAccessToken(response.data.accessToken, response.data.expiresAt);

      this.setUser(response.data.user);

      return { user: response.data.user };
    } catch (error) {
      console.error("Login failed:", error);
      return null;
    }
  }

  static async logout(): Promise<void> {
    try {
      await api.post(
        `${this.AUTH_PATH}/logout`,
        {},
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      this.clearUserData();
    }
  }

  static async refreshToken(): Promise<boolean> {
    try {
      const currentToken = this.getAccessToken();
      if (!currentToken) {
        return false;
      }

      const response = await api.post<RefreshResponse>(
        `${this.AUTH_PATH}/refresh`,
        {},
        {
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
          withCredentials: true,
        }
      );

      this.setAccessToken(response.data.accessToken, response.data.expiresAt);

      return true;
    } catch (error) {
      console.error("Token refresh failed:", error);
      this.clearUserData();
      return false;
    }
  }

  static async checkAuthStatus(): Promise<User | null> {
    try {
      const token = this.getAccessToken();
      if (!token) {
        return null;
      }

      if (this.isTokenExpired()) {
        const refreshSuccess = await this.refreshToken();
        if (!refreshSuccess) {
          return null;
        }
      }

      const response = await api.get<{ user: User }>("/auth/me", {
        headers: {
          Authorization: `Bearer ${this.getAccessToken()}`,
        },
      });

      this.setUser(response.data.user);
      return response.data.user;
    } catch (error) {
      this.clearUserData();
      return null;
    }
  }

  static setAccessToken(token: string, expiresAt: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiresAt);
  }

  static getAccessToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static isTokenExpired(): boolean {
    const expiry = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
    if (!expiry) return true;

    return new Date(expiry) <= new Date();
  }

  static setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  static getUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  static clearUserData(): void {
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
  }
}
