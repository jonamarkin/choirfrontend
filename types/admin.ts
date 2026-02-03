// Admin User Management Types

export type UserRole =
  | "super_admin"
  | "admin"
  | "finance_admin"
  | "attendance_officer"
  | "treasurer"
  | "part_leader"
  | "member";

export type MemberPart =
  | "soprano"
  | "alto"
  | "tenor"
  | "bass"
  | "instrumentalist"
  | "directorate";

export interface AdminUser {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  role: UserRole;
  member_part: MemberPart | "";
  is_active: boolean;
  is_approved: boolean;
  email_verified: boolean;
  filled_form: boolean;
  organization: string | null;
  organization_name: string | null;
  created_at: string;
  last_login_at: string | null;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface AdminUserFilters {
  search?: string;
  is_approved?: boolean;
  is_active?: boolean;
  role?: UserRole;
  member_part?: MemberPart;
  page?: number;
}

export interface AdminUserUpdateRequest {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  role?: UserRole;
  member_part?: MemberPart | "";
  is_active?: boolean;
  is_approved?: boolean;
  gender?: string;
  date_of_birth?: string;
  denomination?: string;
  address?: string;
  join_date?: string;
  employment_status?: string;
  occupation?: string;
  employer?: string;
  emergency_contact_name?: string;
  emergency_contact_relationship?: string;
  emergency_contact_phone?: string;
}

// Display name mappings
export const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  super_admin: "Super Admin",
  admin: "Administrator",
  finance_admin: "Finance Admin",
  attendance_officer: "Attendance Officer",
  treasurer: "Treasurer",
  part_leader: "Part Leader",
  member: "Member",
};

export const MEMBER_PART_DISPLAY_NAMES: Record<MemberPart, string> = {
  soprano: "Soprano",
  alto: "Alto",
  tenor: "Tenor",
  bass: "Bass",
  instrumentalist: "Instrumentalist",
  directorate: "Directorate",
};
