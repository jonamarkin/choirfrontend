/**
 * SWR hooks for attendance data fetching
 */

import useSWR from "swr";
import { attendanceService } from "@/services/attendance.service";
import {
  EventAttendance,
  EligibleMembersResponse,
  MyAttendance,
} from "@/types/events";
import { AttendanceStats } from "@/types/auth";

/**
 * Hook to fetch attendance for a specific event
 */
export function useEventAttendance(slug: string | null) {
  const { data, error, isLoading, mutate } = useSWR<EventAttendance[]>(
    slug ? ["event-attendance", slug] : null,
    () => attendanceService.getEventAttendance(slug!),
    {
      revalidateOnFocus: true,
    }
  );

  return {
    attendance: data ?? [],
    isLoading,
    error,
    mutate,
  };
}

/**
 * Hook to fetch eligible members for an event (admin use)
 */
export function useEligibleMembers(slug: string | null) {
  const { data, error, isLoading, mutate } = useSWR<EligibleMembersResponse>(
    slug ? ["eligible-members", slug] : null,
    () => attendanceService.getEligibleMembers(slug!),
    {
      revalidateOnFocus: false, // Don't constantly reload this list
    }
  );

  return {
    members: data?.members ?? [],
    count: data?.count ?? 0,
    isLoading,
    error,
    mutate,
  };
}

/**
 * Hook to fetch current user's attendance history
 */
export function useMyAttendance() {
  const { data, error, isLoading, mutate } = useSWR<MyAttendance[]>(
    "my-attendance",
    attendanceService.getMyAttendance,
    {
      revalidateOnFocus: true,
    }
  );

  return {
    attendance: data ?? [],
    isLoading,
    error,
    mutate,
  };
}

/**
 * Hook to fetch current user's attendance statistics
 */
export function useMyAttendanceStats() {
  const { data, error, isLoading, mutate } = useSWR<AttendanceStats>(
    "my-attendance-stats",
    attendanceService.getMyAttendanceStats,
    {
      revalidateOnFocus: true,
    }
  );

  return {
    stats: data,
    isLoading,
    error,
    mutate,
  };
}
