/**
 * SWR hooks for subscription data fetching
 */

import useSWR from "swr";
import { subscriptionService } from "@/services/subscription.service";
import {
    UserSubscription,
    SubscriptionStatus,
    PaymentStatus,
} from "@/types/subscription";

/**
 * Hook to fetch current user's subscriptions
 * API returns direct array, not paginated
 */
export function useMySubscriptions(status?: SubscriptionStatus) {
    const { data, error, isLoading, mutate } = useSWR<UserSubscription[]>(
        ["my-subscriptions", status],
        () => subscriptionService.fetchMySubscriptions(status),
        {
            revalidateOnFocus: false,
            dedupingInterval: 60000, // 1 minute deduping
        }
    );

    return {
        subscriptions: data ?? [],
        totalCount: data?.length ?? 0,
        isLoading,
        error,
        mutate,
    };
}

/**
 * Hook to fetch pending (unpaid/partially paid) subscriptions
 */
export function usePendingSubscriptions() {
    const { subscriptions, isLoading, error, mutate } = useMySubscriptions();

    const pendingSubscriptions = subscriptions.filter(
        (sub) =>
            sub.status === "not_paid" ||
            sub.status === "partially_paid" ||
            sub.status === "overdue"
    );

    return {
        pendingSubscriptions,
        isLoading,
        error,
        mutate,
    };
}

/**
 * Hook to poll payment status
 */
export function usePaymentStatus(
    transactionId: string | null,
    shouldPoll: boolean = false
) {
    const { data, error, isLoading, mutate } = useSWR<PaymentStatus>(
        transactionId ? ["payment-status", transactionId] : null,
        () => subscriptionService.checkPaymentStatus(transactionId!),
        {
            refreshInterval: shouldPoll ? 3000 : 0, // Poll every 3 seconds when active
            revalidateOnFocus: false,
        }
    );

    const isTerminal =
        data?.status &&
        ["success", "failed", "expired", "cancelled", "refunded"].includes(
            data.status
        );

    return {
        paymentStatus: data,
        isLoading,
        error,
        isTerminal,
        mutate,
    };
}
