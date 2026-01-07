import { apiClient } from "@/lib/api-client";
import {
  LoginCredentials,
  AuthResponse,
  User,
  RegisterCredentials,
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
      "/auth/register/",
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

  async loginWithGoogle(accessToken: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      "/auth/social/google/",
      {
        access_token: accessToken,
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
    }
    // Optional: Call backend logout endpoint if needed
    // await apiClient.post('/auth/logout', {});
  },

  async getCurrentUser(): Promise<User> {
    return apiClient.get<User>("/auth/me_view");
  },
};
