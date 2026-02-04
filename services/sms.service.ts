import { apiClient } from "@/lib/api-client";
import {
  SingleSMSRequest,
  SingleSMSResponse,
  BatchSMSRequest,
  BatchSMSResponse,
} from "@/types/sms";

const BASE_PATH = "/communication/sms";

export const smsService = {
  /**
   * Send SMS to a single recipient
   */
  async sendSingle(request: SingleSMSRequest): Promise<SingleSMSResponse> {
    return apiClient.post<SingleSMSResponse>(`${BASE_PATH}/send-single/`, request);
  },

  /**
   * Send SMS to multiple recipients
   */
  async sendBatch(request: BatchSMSRequest): Promise<BatchSMSResponse> {
    return apiClient.post<BatchSMSResponse>(`${BASE_PATH}/send-batch/`, request);
  },

  /**
   * Convenience method: send to array of phone numbers
   */
  async sendToRecipients(
    phoneNumbers: string[],
    content: string
  ): Promise<SingleSMSResponse | BatchSMSResponse> {
    // Deduplicate phone numbers
    const uniquePhones = [...new Set(phoneNumbers)];

    if (uniquePhones.length === 1) {
      return this.sendSingle({ to: uniquePhones[0], content });
    }

    return this.sendBatch({ recipients: uniquePhones, content });
  },
};
