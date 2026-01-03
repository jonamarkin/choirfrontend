const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
  params?: Record<string, string>;
}

class ApiClient {
  private async request<T>(
    endpoint: string,
    method: RequestMethod,
    data?: unknown,
    options: FetchOptions = {}
  ): Promise<T> {
    const { headers = {}, params, ...customConfig } = options;

    // Handle Query Parameters
    let url = `${API_BASE_URL}${endpoint}`;
    if (params) {
      const searchParams = new URLSearchParams(params);
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
    if (typeof window !== "undefined") {
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
      // You can parse specific error messages from your API here
      const errorData = await response.json().catch(() => ({}));
      // Handle Django DRF 'detail', 'non_field_errors', or standard 'message'
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
}

export const apiClient = new ApiClient();
