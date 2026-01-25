/**
 * Subscription Admin Service
 * API methods for admin management of subscription plans
 */

import { apiClient } from "@/lib/api-client";
import { Subscription, UserSubscription, PaginatedResponse } from "@/types/subscription";

export interface SubscriptionCreateRequest {
    name: string;
    description: string;
    amount: string;
    start_date: string;
    end_date: string;
    assignees_category: "EXECUTIVES" | "MEMBERS" | "BOTH";
    is_active?: boolean;
}

export interface SubscriptionUpdateRequest {
    name?: string;
    description?: string;
    amount?: string;
    start_date?: string;
    end_date?: string;
    assignees_category?: "EXECUTIVES" | "MEMBERS" | "BOTH";
    is_active?: boolean;
}

export const subscriptionAdminService = {
    /**
     * List all subscription plans for the organization
     */
    async listSubscriptions(): Promise<Subscription[]> {
        const response = await apiClient.get<PaginatedResponse<Subscription>>("/subscriptions");
        return response.results;
    },

    /**
     * Get a single subscription by ID
     */
    async getSubscription(id: string): Promise<Subscription> {
        return apiClient.get<Subscription>(`/subscriptions/${id}`);
    },

    /**
     * Create a new subscription plan
     * Only executives can create subscriptions
     */
    async createSubscription(
        data: SubscriptionCreateRequest
    ): Promise<Subscription> {
        return apiClient.post<Subscription>("/subscriptions", data);
    },

    /**
     * Update an existing subscription plan
     */
    async updateSubscription(
        id: string,
        data: SubscriptionUpdateRequest
    ): Promise<Subscription> {
        return apiClient.patch<Subscription>(`/subscriptions/${id}`, data);
    },

    /**
     * Delete a subscription plan
     */
    async deleteSubscription(id: string): Promise<void> {
        return apiClient.delete<void>(`/subscriptions/${id}`);
    },

    /**
     * Get all users assigned to a subscription with payment info
     * Requires executive role
     */
    async getSubscriptionAssignees(
        subscriptionId: string,
        status?: string
    ): Promise<UserSubscription[]> {
        const params: Record<string, string> = {};
        if (status) params.status = status;

        return apiClient.get<UserSubscription[]>(
            `/subscriptions/${subscriptionId}/assignees`,
            { params }
        );
    },
};
