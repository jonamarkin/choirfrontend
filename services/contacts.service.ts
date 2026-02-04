import { apiClient } from "@/lib/api-client";
import {
  Contact,
  CreateContactRequest,
  BulkCreateContactsRequest,
  BulkCreateContactsResponse,
} from "@/types/sms";

const BASE_PATH = "/core/contacts";

export const contactsService = {
  /**
   * List all contacts
   */
  async listContacts(): Promise<Contact[]> {
    return apiClient.get<Contact[]>(BASE_PATH);
  },

  /**
   * Create a single contact
   */
  async createContact(data: CreateContactRequest): Promise<Contact> {
    return apiClient.post<Contact>(BASE_PATH, data);
  },

  /**
   * Bulk create contacts
   */
  async bulkCreate(data: BulkCreateContactsRequest): Promise<BulkCreateContactsResponse> {
    return apiClient.post<BulkCreateContactsResponse>(`${BASE_PATH}/bulk-create`, data);
  },

  /**
   * Update a contact
   */
  async updateContact(id: string, data: Partial<CreateContactRequest>): Promise<Contact> {
    return apiClient.put<Contact>(`${BASE_PATH}/${id}`, data);
  },

  /**
   * Delete a contact
   */
  async deleteContact(id: string): Promise<void> {
    return apiClient.delete<void>(`${BASE_PATH}/${id}`);
  },
};
