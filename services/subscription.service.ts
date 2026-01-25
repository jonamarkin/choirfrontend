/**
 * Subscription Service
 * API methods for subscription payments and management
 */

import { apiClient } from "@/lib/api-client";
import {
    UserSubscription,
    PaymentInitiateRequest,
    PaymentInitiateResponse,
    PaymentStatus,
    PaymentTransaction,
    SubscriptionStatus,
} from "@/types/subscription";

export const subscriptionService = {
    /**
     * Fetch current user's subscriptions with payment info
     * API returns plain array, not paginated
     */
    async fetchMySubscriptions(
        status?: SubscriptionStatus
    ): Promise<UserSubscription[]> {
        const params: Record<string, string> = {};
        if (status) params.status = status;

        return apiClient.get<UserSubscription[]>(
            "/subscriptions/my-subscriptions",
            { params }
        );
    },

    /**
     * Initiate a payment for a user subscription
     * Returns a checkout URL to redirect the user to Hubtel
     */
    async initiatePayment(
        userSubscriptionId: string,
        amount?: number
    ): Promise<PaymentInitiateResponse> {
        const payload: PaymentInitiateRequest = {
            user_subscription_id: userSubscriptionId,
        };
        if (amount !== undefined) {
            payload.amount = amount.toString();
        }

        // Debug: log the exact request being sent
        console.log("[initiatePayment] Sending payload:", JSON.stringify(payload, null, 2));

        return apiClient.post<PaymentInitiateResponse>(
            "/subscriptions/payments/initiate",
            payload
        );
    },

    /**
     * Check the status of a payment transaction
     */
    async checkPaymentStatus(transactionId: string): Promise<PaymentStatus> {
        return apiClient.get<PaymentStatus>(
            `/subscriptions/payments/${transactionId}/status`
        );
    },

    /**
     * Get full details of a payment transaction
     */
    async getPaymentDetails(transactionId: string): Promise<PaymentTransaction> {
        return apiClient.get<PaymentTransaction>(
            `/subscriptions/payments/${transactionId}`
        );
    },

    /**
     * List user's payment transactions
     */
    async fetchPaymentHistory(filters?: {
        status?: string;
        user_subscription_id?: string;
    }): Promise<PaymentTransaction[]> {
        const params: Record<string, string> = {};
        if (filters?.status) params.status = filters.status;
        if (filters?.user_subscription_id)
            params.user_subscription_id = filters.user_subscription_id;

        return apiClient.get<PaymentTransaction[]>("/subscriptions/payments", {
            params,
        });
    },
};
