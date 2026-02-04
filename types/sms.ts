// SMS & Contact Management Types

// ============================================
// SMS Types
// ============================================

export interface SingleSMSRequest {
  to: string; // Phone number e.g., "233209335976"
  content: string;
}

export interface SingleSMSResponse {
  rate: number;
  messageId: string;
  status: number;
  networkId: string | null;
  clientReference: string | null;
  statusDescription: string;
}

export interface BatchSMSRequest {
  recipients: string[];
  content: string;
}

export interface BatchRecipient {
  recipient: string;
  content: string;
  messageId: string;
}

export interface BatchSMSResponse {
  batchId: string;
  status: number;
  data: BatchRecipient[];
}

// ============================================
// Contact Types
// ============================================

export interface Contact {
  id: string;
  name: string;
  phone_number: string;
  groups: string[]; // Array of group IDs
  user_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateContactRequest {
  name: string;
  phone_number: string;
  group_id?: string;
}

export interface BulkCreateContactsRequest {
  contacts: { name: string; phone_number: string }[];
  group_id?: string;
}

export interface BulkCreateContactsResponse {
  created: number;
  contacts: Contact[];
}

// ============================================
// Contact Group Types
// ============================================

export interface ContactGroup {
  id: string;
  name: string;
  description: string;
  contact_count: number;
  created_at: string;
  updated_at: string;
}

export interface ContactGroupDetail extends ContactGroup {
  contacts: Contact[];
}

export interface CreateContactGroupRequest {
  name: string;
  description?: string;
}

export interface AddContactsToGroupRequest {
  contact_ids: string[];
}

export interface RemoveContactsFromGroupRequest {
  contact_ids: string[];
}

// ============================================
// Member Phone Types (for SMS)
// ============================================

export interface MemberPhone {
  id: string;
  full_name: string;
  phone_number: string;
  email: string;
  member_part: string;
  role: string;
}

// Voice parts for filtering
export type VoicePart =
  | "soprano"
  | "alto"
  | "tenor"
  | "bass"
  | "instrumentalist"
  | "directorate";

// Roles for filtering
export type MemberRole =
  | "super_admin"
  | "admin"
  | "finance_admin"
  | "attendance_officer"
  | "treasurer"
  | "part_leader"
  | "member";

// Display names
export const VOICE_PART_DISPLAY: Record<VoicePart, string> = {
  soprano: "Soprano",
  alto: "Alto",
  tenor: "Tenor",
  bass: "Bass",
  instrumentalist: "Instrumentalist",
  directorate: "Directorate",
};

export const MEMBER_ROLE_DISPLAY: Record<MemberRole, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  finance_admin: "Finance Admin",
  attendance_officer: "Attendance Officer",
  treasurer: "Treasurer",
  part_leader: "Part Leader",
  member: "Member",
};

// ============================================
// Recipient Selection Types
// ============================================

export interface SelectedRecipient {
  id: string;
  name: string;
  phone: string;
  source: "manual" | "contact" | "group" | "member";
}
