import useSWR from "swr";
import { adminUserService } from "@/services/admin-user.service";
import { AdminUser, AdminUserFilters, PaginatedResponse } from "@/types/admin";

/**
 * SWR hook for fetching admin users with filters
 */
export function useAdminUsers(filters?: AdminUserFilters) {
  // Build a cache key from filters
  const cacheKey = filters
    ? ["admin-users", JSON.stringify(filters)]
    : ["admin-users"];

  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<AdminUser>>(
    cacheKey,
    () => adminUserService.listUsers(filters),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  );

  return {
    users: data?.results ?? [],
    totalCount: data?.count ?? 0,
    hasNext: !!data?.next,
    hasPrevious: !!data?.previous,
    isLoading,
    error,
    mutate,
  };
}

/**
 * SWR hook for fetching a single user by ID
 */
export function useAdminUser(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<AdminUser>(
    id ? ["admin-user", id] : null,
    () => adminUserService.getUser(id!),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    user: data,
    isLoading,
    error,
    mutate,
  };
}
