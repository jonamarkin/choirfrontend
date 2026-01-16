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
      credentials
    );

    // Handle session persistence here or in the calling component
    if (response.access && typeof window !== "undefined") {
      localStorage.setItem("access_token", response.access);
      localStorage.setItem("refresh_token", response.refresh);
      // Store user details for simple access checks
      if (response.user) {
        localStorage.setItem("user", JSON.stringify(response.user));
      }
    }

    return response;
  },

  async register(data: RegisterCredentials): Promise<AuthResponse> {
    // dj-rest-auth registration endpoint
    const response = await apiClient.post<AuthResponse>(
      "/auth/register",
      data
    );

    if (response.access && typeof window !== "undefined") {
      localStorage.setItem("access_token", response.access);
      localStorage.setItem("refresh_token", response.refresh);
      if (response.user) {
        localStorage.setItem("user", JSON.stringify(response.user));
      }
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
      localStorage.setItem("access_token", response.access);
      localStorage.setItem("refresh_token", response.refresh);
      // Store user details for simple access checks
      if (response.user) {
        localStorage.setItem("user", JSON.stringify(response.user));
      }
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
