export interface User {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  role:
    | "super_admin"
    | "admin"
    | "finance_admin"
    | "attendance_officer"
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
