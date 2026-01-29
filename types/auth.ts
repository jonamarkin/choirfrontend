// Voice part options for choir members
export type VoicePart = "soprano" | "alto" | "tenor" | "bass";

// Gender options
export type Gender = "male" | "female" | "other";

// Employment status options
export type EmploymentStatus = "employed" | "self_employed" | "student" | "unemployed" | "retired";

// Attendance stats returned from /auth/me
export interface AttendanceStats {
  total_mandatory_events: number;
  events_attended: number;
  present: number;
  late: number;
  excused: number;
  absent: number;
  attendance_percentage: number;
}

export interface User {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  role:
    | "system_admin"
    | "super_admin"
    | "admin"
    | "finance_admin"
    | "attendance_officer"
    | "treasurer"
    | "member";
  organization: string | null;
  organization_name?: string;
  has_organization?: boolean;
  phone_number?: string;
  profile_picture?: string | null;
  auth_method?: "email" | "google" | "github" | "microsoft";
  email_verified?: boolean;
  is_active: boolean;
  filled_form?: boolean;
  subscriptions?: UserSubscriptionSummary[];
  attendance_stats?: AttendanceStats | null;
  created_at?: string;
  last_login_at?: string;

  // Profile Details
  member_part?: VoicePart;
  gender?: Gender;
  date_of_birth?: string; // YYYY-MM-DD format
  denomination?: string;
  address?: string;

  // Employment Details
  employment_status?: EmploymentStatus;
  occupation?: string;
  employer?: string;
  join_date?: string; // YYYY-MM-DD format

  // Emergency Contact
  emergency_contact_name?: string;
  emergency_contact_relationship?: string;
  emergency_contact_phone?: string;
}

export interface UserSubscriptionSummary {
  id: string;
  subscription_name: string;
  status: "fully_paid" | "partially_paid" | "overdue" | "not_paid" | "refunded";
  outstanding_amount: string;
}

export interface ProfileUpdateRequest {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  profile_picture?: string;

  // Profile Details
  member_part?: VoicePart;
  gender?: Gender;
  date_of_birth?: string; // YYYY-MM-DD format
  denomination?: string;
  address?: string;

  // Employment Details
  employment_status?: EmploymentStatus;
  occupation?: string;
  employer?: string;
  join_date?: string; // YYYY-MM-DD format

  // Emergency Contact
  emergency_contact_name?: string;
  emergency_contact_relationship?: string;
  emergency_contact_phone?: string;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
  new_password_confirm: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface LoginCredentials {
  email?: string;
  username?: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password1: string;
  password2: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  organization_code?: string;
}
