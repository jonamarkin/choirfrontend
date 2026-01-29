/**
 * Attendance Service
 * API methods for attendance management
 */

import { apiClient } from "@/lib/api-client";
import { AttendanceStats } from "@/types/auth";
import {
  EventAttendance,
  EligibleMembersResponse,
  MarkAttendanceRequest,
  BulkMarkAttendanceRequest,
  BulkMarkAttendanceResponse,
  MyAttendance,
} from "@/types/events";

export const attendanceService = {
  /**
   * Get attendance records for an event
   * Accessible by all authenticated users
   */
  async getEventAttendance(slug: string): Promise<EventAttendance[]> {
    return apiClient.get<EventAttendance[]>(
      `/events/${slug}/attendance`
    );
  },

  /**
   * Get members eligible for an event (based on target_voice_parts)
   * Accessible by all authenticated users
   */
  async getEligibleMembers(slug: string): Promise<EligibleMembersResponse> {
    return apiClient.get<EligibleMembersResponse>(
      `/events/${slug}/eligible_members`
    );
  },

  /**
   * Mark attendance for a single member
   * Requires: super_admin, admin, or attendance_officer role
   */
  async markAttendance(
    slug: string,
    data: MarkAttendanceRequest
  ): Promise<EventAttendance> {
    return apiClient.post<EventAttendance>(
      `/events/${slug}/mark_attendance`,
      data
    );
  },

  /**
   * Bulk mark attendance for multiple members
   * Requires: super_admin, admin, or attendance_officer role
   */
  async bulkMarkAttendance(
    slug: string,
    data: BulkMarkAttendanceRequest
  ): Promise<BulkMarkAttendanceResponse> {
    return apiClient.post<BulkMarkAttendanceResponse>(
      `/events/${slug}/bulk_mark_attendance`,
      data
    );
  },

  /**
   * Get current user's attendance history
   * Accessible by all authenticated users
   */
  async getMyAttendance(): Promise<MyAttendance[]> {
    return apiClient.get<MyAttendance[]>("/attendance/my-attendance");
  },

  /**
   * Get current user's attendance statistics
   * Accessible by all authenticated users
   */
  async getMyAttendanceStats(): Promise<AttendanceStats> {
    return apiClient.get<AttendanceStats>("/attendance/my-attendance/stats");
  },
};
