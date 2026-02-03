import { apiClient } from "@/lib/api-client";
import {
  AdminUser,
  AdminUserFilters,
  AdminUserUpdateRequest,
  PaginatedResponse,
} from "@/types/admin";

const BASE_PATH = "/auth/admin/users";

export const adminUserService = {
  /**
   * List users with optional filters
   */
  async listUsers(
    filters?: AdminUserFilters
  ): Promise<PaginatedResponse<AdminUser>> {
    const params: Record<string, string | number | boolean | undefined> = {};

    if (filters?.search) params.search = filters.search;
    if (filters?.is_approved !== undefined)
      params.is_approved = filters.is_approved;
    if (filters?.is_active !== undefined) params.is_active = filters.is_active;
    if (filters?.role) params.role = filters.role;
    if (filters?.member_part) params.member_part = filters.member_part;
    if (filters?.page) params.page = filters.page;

    return apiClient.get<PaginatedResponse<AdminUser>>(BASE_PATH, { params });
  },

  /**
   * Get a single user by ID
   */
  async getUser(id: string): Promise<AdminUser> {
    return apiClient.get<AdminUser>(`${BASE_PATH}/${id}`);
  },

  /**
   * Update user fields (partial update)
   */
  async updateUser(
    id: string,
    data: AdminUserUpdateRequest
  ): Promise<AdminUser> {
    return apiClient.patch<AdminUser>(`${BASE_PATH}/${id}`, data);
  },

  /**
   * Approve a pending user
   */
  async approveUser(id: string): Promise<{ message: string; user: AdminUser }> {
    return apiClient.post<{ message: string; user: AdminUser }>(
      `${BASE_PATH}/${id}/approve`,
      {}
    );
  },

  /**
   * Activate a user
   */
  async activateUser(
    id: string
  ): Promise<{ message: string; user: AdminUser }> {
    return apiClient.post<{ message: string; user: AdminUser }>(
      `${BASE_PATH}/${id}/activate`,
      {}
    );
  },

  /**
   * Deactivate a user
   */
  async deactivateUser(
    id: string
  ): Promise<{ message: string; user: AdminUser }> {
    return apiClient.post<{ message: string; user: AdminUser }>(
      `${BASE_PATH}/${id}/deactivate`,
      {}
    );
  },
};
