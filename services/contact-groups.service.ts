import { apiClient } from "@/lib/api-client";
import {
  ContactGroup,
  ContactGroupDetail,
  Contact,
  CreateContactGroupRequest,
  AddContactsToGroupRequest,
  RemoveContactsFromGroupRequest,
  PaginatedResponse,
} from "@/types/sms";

const BASE_PATH = "/communication/contact-groups";

export const contactGroupsService = {
  /**
   * List all contact groups
   */
  async listGroups(): Promise<ContactGroup[]> {
    const response = await apiClient.get<ContactGroup[] | PaginatedResponse<ContactGroup>>(`${BASE_PATH}/`);
    if ('results' in response && Array.isArray(response.results)) {
      return response.results;
    }
    return Array.isArray(response) ? response : [];
  },

  /**
   * Create a new group
   */
  async createGroup(data: CreateContactGroupRequest): Promise<ContactGroup> {
    return apiClient.post<ContactGroup>(`${BASE_PATH}/`, data);
  },

  /**
   * Get group with contacts
   */
  async getGroup(id: string): Promise<ContactGroupDetail> {
    return apiClient.get<ContactGroupDetail>(`${BASE_PATH}/${id}/`);
  },

  /**
   * Update a group
   */
  async updateGroup(id: string, data: Partial<CreateContactGroupRequest>): Promise<ContactGroup> {
    return apiClient.put<ContactGroup>(`${BASE_PATH}/${id}/`, data);
  },

  /**
   * Delete a group
   */
  async deleteGroup(id: string): Promise<void> {
    return apiClient.delete<void>(`${BASE_PATH}/${id}/`);
  },

  /**
   * Add contacts to a group
   */
  async addContacts(groupId: string, data: AddContactsToGroupRequest): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(`${BASE_PATH}/${groupId}/add-contacts/`, data);
  },

  /**
   * Remove contacts from a group
   */
  async removeContacts(groupId: string, data: RemoveContactsFromGroupRequest): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(`${BASE_PATH}/${groupId}/remove-contacts/`, data);
  },

  /**
   * Get contacts in a group
   */
  async getGroupContacts(groupId: string): Promise<Contact[]> {
    const response = await apiClient.get<Contact[] | PaginatedResponse<Contact>>(`${BASE_PATH}/${groupId}/contacts/`);
    if ('results' in response && Array.isArray(response.results)) {
      return response.results;
    }
    return Array.isArray(response) ? response : [];
  },
};
