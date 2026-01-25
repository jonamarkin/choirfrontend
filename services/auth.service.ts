import { apiClient } from "@/lib/api-client";
import {
  LoginCredentials,
  AuthResponse,
  User,
  RegisterCredentials,
  ProfileUpdateRequest,
} from "@/types/auth";

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      "/auth/login",
      credentials,
      { skipAuth: true }
    );

    if (response.access && typeof window !== "undefined") {
      this.setTokens(response.access, response.refresh, response.user);
    }

    return response;
  },

  setTokens(access: string, refresh: string, user?: User) {
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }
    }
  },

  async refreshToken(): Promise<string> {
    const refresh = localStorage.getItem("refresh_token");
    if (!refresh) {
      throw new Error("No refresh token available");
    }

    const response = await apiClient.post<{ access: string; refresh: string }>(
      "/auth/refresh",
      { refresh },
      { skipAuth: true }
    );

    if (response.access && typeof window !== "undefined") {
      localStorage.setItem("access_token", response.access);
      // Backend might rotate refresh token too
      if (response.refresh) {
        localStorage.setItem("refresh_token", response.refresh);
      }
    }

    return response.access;
  },

  async register(data: RegisterCredentials): Promise<AuthResponse> {
    // dj-rest-auth registration endpoint
    const response = await apiClient.post<AuthResponse>(
      "/auth/register",
      data
    );

    if (response.access && typeof window !== "undefined") {
      this.setTokens(response.access, response.refresh, response.user);
    }

    return response;
  },

  async loginWithGoogle(code: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      "/auth/social/google",
      {
        code: code,
        callback_url: window.location.origin,
      }
    );

    if (response.access && typeof window !== "undefined") {
      this.setTokens(response.access, response.refresh, response.user);
    }

    return response;
  },

  async logout(): Promise<void> {
    if (typeof window !== "undefined") {
      const refresh = localStorage.getItem("refresh_token");
      if (refresh) {
        // Best effort to notify backend
        await apiClient.post("/auth/logout", { refresh }).catch(() => { });
      }
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
    }
  },

  /**
   * Get current authenticated user's profile
   */
  async getProfile(): Promise<User> {
    const user = await apiClient.get<User>("/auth/me");
    // Update localStorage with fresh data
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user));
    }
    return user;
  },

  /**
   * Update current user's profile
   */
  async updateProfile(data: ProfileUpdateRequest): Promise<User> {
    const user = await apiClient.patch<User>("/auth/update_profile", data);
    // Update localStorage with updated data
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user));
    }
    return user;
  },

  /**
   * Get cached user from localStorage (for immediate display)
   */
  getCachedUser(): User | null {
    if (typeof window === "undefined") return null;
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  },
};
