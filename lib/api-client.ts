const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined | null>;
  skipAuth?: boolean;
}

class ApiClient {
  private async request<T>(
    endpoint: string,
    method: RequestMethod,
    data?: unknown,
    options: FetchOptions = {}
  ): Promise<T> {
    const { headers = {}, params, skipAuth, ...customConfig } = options;

    // Handle Query Parameters
    let url = `${API_BASE_URL}${endpoint}`;
    if (params) {
      const cleanParams: Record<string, string> = {};
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          cleanParams[key] = String(value);
        }
      });
      const searchParams = new URLSearchParams(cleanParams);
      url += `?${searchParams.toString()}`;
    }

    // Default Headers
    const config: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      ...customConfig,
    };

    // Attach Token if available (Client-side example)
    // For Server Components, you would pass the token via headers or cookies
    if (typeof window !== "undefined" && !skipAuth) {
      const token = localStorage.getItem("access_token");
      if (token && config.headers) {
        (config.headers as Record<string, string>)[
          "Authorization"
        ] = `Bearer ${token}`;
      }
    }

    if (data) {
      config.body = JSON.stringify(data);
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      if (response.status === 401 && !options.skipAuth && typeof window !== "undefined") {
        const refresh = localStorage.getItem("refresh_token");
        if (refresh) {
          try {
            // Attempt to refresh the token
            const refreshResponse = await fetch(`${API_BASE_URL}/auth/token/refresh`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refresh }),
            });

            if (refreshResponse.ok) {
              const data = await refreshResponse.json();
              localStorage.setItem("access_token", data.access);
              if (data.refresh) {
                localStorage.setItem("refresh_token", data.refresh);
              }

              // Retry the original request with the new token
              const newConfig = { ...config };
              if (newConfig.headers) {
                (newConfig.headers as Record<string, string>)[
                  "Authorization"
                ] = `Bearer ${data.access}`;
              }
              const retryResponse = await fetch(url, newConfig);
              if (retryResponse.ok) {
                if (retryResponse.status === 204) return {} as T;
                return retryResponse.json();
              }
              // If retry fails, continue to normal error handling
            }
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
          }
        }
        
        // If we get here, refresh failed or was not possible
        // Clear tokens and redirect to login if we are in the browser
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        if (window.location.pathname !== "/login") {
            window.location.href = "/login";
        }
      }

      // Handle django-style error responses
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.detail ||
        errorData.error ||
        errorData.message ||
        (errorData.non_field_errors && errorData.non_field_errors[0]) ||
        `API Error: ${response.statusText}`;
      throw new Error(errorMessage);
    }

    // Handle empty responses (e.g. 204 No Content)
    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  get<T>(endpoint: string, options?: FetchOptions) {
    return this.request<T>(endpoint, "GET", undefined, options);
  }
  post<T>(endpoint: string, data: unknown, options?: FetchOptions) {
    return this.request<T>(endpoint, "POST", data, options);
  }
  put<T>(endpoint: string, data: unknown, options?: FetchOptions) {
    return this.request<T>(endpoint, "PUT", data, options);
  }
  delete<T>(endpoint: string, options?: FetchOptions) {
    return this.request<T>(endpoint, "DELETE", undefined, options);
  }
  patch<T>(endpoint: string, data: unknown, options?: FetchOptions) {
    return this.request<T>(endpoint, "PATCH", data, options);
  }
}

export const apiClient = new ApiClient();
