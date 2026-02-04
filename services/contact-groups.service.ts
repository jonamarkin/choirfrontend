import { apiClient } from "@/lib/api-client";
import {
  ContactGroup,
  ContactGroupDetail,
  Contact,
  CreateContactGroupRequest,
  AddContactsToGroupRequest,
  RemoveContactsFromGroupRequest,
} from "@/types/sms";

const BASE_PATH = "/communication/contact-groups";

export const contactGroupsService = {
  /**
   * List all contact groups
   */
  async listGroups(): Promise<ContactGroup[]> {
    return apiClient.get<ContactGroup[]>(`${BASE_PATH}/`);
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
    return apiClient.get<Contact[]>(`${BASE_PATH}/${groupId}/contacts/`);
  },
};
