/**
 * Events & Attendance TypeScript interfaces
 * Based on the backend API schema
 */

import { VoicePart } from "./auth";

// Event type options
export type EventType =
  | "rehearsal"
  | "funeral"
  | "wedding"
  | "corporate"
  | "concert"
  | "church_service"
  | "other";

// Event status options
export type EventStatus = "scheduled" | "ongoing" | "completed" | "cancelled";

// Attendance status options
export type AttendanceStatus = "present" | "absent" | "excused" | "late";

// Display labels for event types
export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  rehearsal: "Rehearsal",
  funeral: "Funeral",
  wedding: "Wedding",
  corporate: "Corporate Event",
  concert: "Concert",
  church_service: "Church Service",
  other: "Other",
};

// Display labels for event statuses
export const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  scheduled: "Scheduled",
  ongoing: "Ongoing",
  completed: "Completed",
  cancelled: "Cancelled",
};

// Display labels for attendance statuses
export const ATTENDANCE_STATUS_LABELS: Record<AttendanceStatus, string> = {
  present: "Present",
  absent: "Absent",
  excused: "Excused",
  late: "Late",
};

/**
 * Attendance summary for an event
 */
export interface AttendanceSummary {
  total_marked: number;
  present: number;
  late: number;
  absent: number;
  excused: number;
  attendance_rate: number;
}

/**
 * Event list item (from GET /events)
 */
export interface EventListItem {
  id: string;
  slug: string;
  title: string;
  event_type: EventType;
  event_type_display: string;
  location: string;
  start_datetime: string;
  end_datetime: string;
  is_mandatory: boolean;
  status: EventStatus;
  status_display: string;
  attendance_count: number;
  is_past: boolean;
}

/**
 * Full event details (from GET /events/{id})
 */
export interface Event extends EventListItem {
  description: string;
  target_voice_parts: VoicePart[] | null;
  created_by: string;
  created_by_name: string;
  attendance_summary: AttendanceSummary;
  created_at: string;
  updated_at: string;
}

/**
 * Request to create/update an event
 */
export interface EventFormData {
  title: string;
  description?: string;
  event_type: EventType;
  location: string;
  start_datetime: string;
  end_datetime: string;
  is_mandatory: boolean;
  target_voice_parts?: VoicePart[] | null;
  status?: EventStatus;
}

/**
 * Individual attendance record (from GET /events/{id}/attendance)
 */
export interface EventAttendance {
  id: string;
  event: string;
  event_title: string;
  user: string;
  user_email: string;
  user_name: string;
  user_voice_part: VoicePart | null;
  status: AttendanceStatus;
  status_display: string;
  marked_by: string;
  marked_by_name: string;
  marked_at: string;
  notes: string;
  created_at: string;
}

/**
 * Member eligible for an event (from GET /events/{id}/eligible_members)
 */
export interface EligibleMember {
  id: string;
  email: string;
  name: string;
  voice_part: VoicePart | null;
  has_attendance: boolean;
}

/**
 * Eligible members response
 */
export interface EligibleMembersResponse {
  count: number;
  members: EligibleMember[];
}

/**
 * Request to mark single attendance
 */
export interface MarkAttendanceRequest {
  user_id: string;
  status: AttendanceStatus;
  notes?: string;
}

/**
 * Request for bulk attendance marking
 */
export interface BulkMarkAttendanceRequest {
  attendances: MarkAttendanceRequest[];
}

/**
 * Response from bulk attendance marking
 */
export interface BulkMarkAttendanceResponse {
  message: string;
  created: number;
  updated: number;
  total: number;
}

/**
 * Member's own attendance record (from GET /my-attendance)
 */
export interface MyAttendance {
  id: string;
  event: string;
  event_title: string;
  event_type: EventType;
  event_date: string;
  status: AttendanceStatus;
  status_display: string;
  notes: string;
  marked_at: string;
}

/**
 * Filter options for events list
 */
export interface EventFilters {
  event_type?: EventType;
  status?: EventStatus;
  start_date?: string;
  end_date?: string;
  upcoming?: boolean;
}
