import { apiClient } from "@/lib/api-client";
import { MemberPhone, VoicePart, MemberRole } from "@/types/sms";

const BASE_PATH = "/communication/members/phones";

export const membersSmsService = {
  /**
   * Get all members with phone numbers
   */
  async getMembersWithPhones(): Promise<MemberPhone[]> {
    return apiClient.get<MemberPhone[]>(`${BASE_PATH}/`);
  },

  /**
   * Get members by voice part
   */
  async getMembersByPart(part: VoicePart): Promise<MemberPhone[]> {
    return apiClient.get<MemberPhone[]>(`${BASE_PATH}/by-part/${part}/`);
  },

  /**
   * Get members by role
   */
  async getMembersByRole(role: MemberRole): Promise<MemberPhone[]> {
    return apiClient.get<MemberPhone[]>(`${BASE_PATH}/by-role/${role}/`);
  },
};
