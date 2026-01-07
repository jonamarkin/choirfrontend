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
  phone_number?: string;
  profile_picture?: string | null;
  is_active: boolean;
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
