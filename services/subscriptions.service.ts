import { apiClient } from "@/lib/api-client";
import { UserSubscription, Subscription } from "@/types/subscriptions";

export const subscriptionsService = {
  // Get all subscriptions assigned to the current user
  async getMySubscriptions(status?: string): Promise<UserSubscription[]> {
    return apiClient.get<UserSubscription[]>("/subscriptions/my-subscriptions/", {
      params: { status },
    });
  },

  // Get details of a specific subscription (admin/listing view)
  async getSubscription(id: string): Promise<Subscription> {
    return apiClient.get<Subscription>(`/subscriptions/${id}/`);
  },

  // Get all users assigned to a specific subscription (Admin only)
  async getSubscriptionAssignees(id: string, status?: string): Promise<UserSubscription[]> {
    return apiClient.get<UserSubscription[]>(`/subscriptions/${id}/assignees/`, {
      params: { status },
    });
  },
  
  // List all subscriptions (Admin/General view depending on permissions)
  async getSubscriptions(): Promise<Subscription[]> {
      return apiClient.get<Subscription[]>("/subscriptions/");
  }
};
