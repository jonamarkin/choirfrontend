/**
 * SWR hooks for admin subscription management
 */

import useSWR from "swr";
import { Subscription, UserSubscription } from "@/types/subscription";
import { subscriptionAdminService } from "@/services/subscription-admin.service";

/**
 * Hook to fetch all subscription plans for admin management
 */
export function useAdminSubscriptions() {
    const { data, error, isLoading, mutate } = useSWR<Subscription[]>(
        "admin-subscriptions",
        () => subscriptionAdminService.listSubscriptions(),
        {
            revalidateOnFocus: false,
            dedupingInterval: 30000,
        }
    );

    return {
        subscriptions: data ?? [],
        isLoading,
        error,
        mutate,
    };
}

/**
 * Hook to fetch a single subscription by ID
 */
export function useAdminSubscription(id: string | null) {
    const { data, error, isLoading, mutate } = useSWR<Subscription>(
        id ? `admin-subscription-${id}` : null,
        () => (id ? subscriptionAdminService.getSubscription(id) : null!),
        {
            revalidateOnFocus: false,
        }
    );

    return {
        subscription: data,
        isLoading,
        error,
        mutate,
    };
}

/**
 * Hook to fetch assignees for a subscription
 */
export function useSubscriptionAssignees(
    subscriptionId: string | null,
    status?: string
) {
    const { data, error, isLoading, mutate } = useSWR<UserSubscription[]>(
        subscriptionId
            ? `subscription-assignees-${subscriptionId}-${status || "all"}`
            : null,
        () =>
            subscriptionId
                ? subscriptionAdminService.getSubscriptionAssignees(
                    subscriptionId,
                    status
                )
                : null!,
        {
            revalidateOnFocus: false,
        }
    );

    return {
        assignees: data ?? [],
        isLoading,
        error,
        mutate,
    };
}
