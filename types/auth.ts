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
  subscriptions?: UserSubscriptionSummary[];
  created_at?: string;
  last_login_at?: string;
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
