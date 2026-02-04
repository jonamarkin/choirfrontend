import { apiClient } from "@/lib/api-client";
import {
  Contact,
  CreateContactRequest,
  BulkCreateContactsRequest,
  BulkCreateContactsResponse,
  PaginatedResponse,
} from "@/types/sms";

const BASE_PATH = "/communication/contacts";

export const contactsService = {
  /**
   * List all contacts
   */
  async listContacts(): Promise<Contact[]> {
    const response = await apiClient.get<Contact[] | PaginatedResponse<Contact>>(`${BASE_PATH}/`);
    if ('results' in response && Array.isArray(response.results)) {
      return response.results;
    }
    return Array.isArray(response) ? response : [];
  },

  /**
   * Create a single contact
   */
  async createContact(data: CreateContactRequest): Promise<Contact> {
    return apiClient.post<Contact>(`${BASE_PATH}/`, data);
  },

  /**
   * Bulk create contacts
   */
  async bulkCreate(data: BulkCreateContactsRequest): Promise<BulkCreateContactsResponse> {
    return apiClient.post<BulkCreateContactsResponse>(`${BASE_PATH}/bulk-create/`, data);
  },

  /**
   * Update a contact
   */
  async updateContact(id: string, data: Partial<CreateContactRequest>): Promise<Contact> {
    return apiClient.put<Contact>(`${BASE_PATH}/${id}/`, data);
  },

  /**
   * Delete a contact
   */
  async deleteContact(id: string): Promise<void> {
    return apiClient.delete<void>(`${BASE_PATH}/${id}/`);
  },
};
