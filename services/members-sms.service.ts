import { apiClient } from "@/lib/api-client";
import { MemberPhone, VoicePart, MemberRole, PaginatedResponse } from "@/types/sms";

const BASE_PATH = "/communication/members/phones";

export const membersSmsService = {
  /**
   * Get all members with phone numbers
   */
  async getMembersWithPhones(): Promise<MemberPhone[]> {
    const response = await apiClient.get<MemberPhone[] | PaginatedResponse<MemberPhone>>(`${BASE_PATH}/`);
    if ('results' in response && Array.isArray(response.results)) {
      return response.results;
    }
    return Array.isArray(response) ? response : [];
  },

  /**
   * Get members by voice part
   */
  async getMembersByPart(part: VoicePart): Promise<MemberPhone[]> {
    const response = await apiClient.get<MemberPhone[] | PaginatedResponse<MemberPhone>>(`${BASE_PATH}/by-part/${part}/`);
    if ('results' in response && Array.isArray(response.results)) {
      return response.results;
    }
    return Array.isArray(response) ? response : [];
  },

  /**
   * Get members by role
   */
  async getMembersByRole(role: MemberRole): Promise<MemberPhone[]> {
    const response = await apiClient.get<MemberPhone[] | PaginatedResponse<MemberPhone>>(`${BASE_PATH}/by-role/${role}/`);
    if ('results' in response && Array.isArray(response.results)) {
      return response.results;
    }
    return Array.isArray(response) ? response : [];
  },
};
