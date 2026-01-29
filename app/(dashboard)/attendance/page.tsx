"use client";

import * as React from "react";
import { format } from "date-fns";
import {
  CalendarDays,
  Calendar,
  Loader2,
} from "lucide-react";

import { cn } from "@/components/ui/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PremiumStatCard } from "@/components/premium-stat-card";
import {
  tableContainerStyle,
  getAttendanceStyles,
} from "@/utils/premium-styles";
import { useMyAttendance, useMyAttendanceStats } from "@/hooks/useAttendance";
import {
  AttendanceStatus,
  ATTENDANCE_STATUS_LABELS,
} from "@/types/events";

function AttendanceStatusBadge({ status }: { status: AttendanceStatus }) {
  const styles = getAttendanceStyles(ATTENDANCE_STATUS_LABELS[status]);

  return (
    <Badge
      variant="secondary"
      className={cn("rounded-full px-2 py-0.5 text-xs font-medium", styles)}
    >
      {ATTENDANCE_STATUS_LABELS[status]}
    </Badge>
  );
}

export default function AttendancePage() {
  const { attendance, isLoading: historyLoading } = useMyAttendance();
  const { stats, isLoading: statsLoading } = useMyAttendanceStats();

  const isLoading = historyLoading || statsLoading;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent text-3xl font-bold">
          My Attendance
        </h1>
        <p className="text-muted-foreground mt-1">
          View your attendance statistics and history
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#5A1E6E]" />
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-4">
            <PremiumStatCard
              value={`${stats?.attendance_percentage ?? 0}%`}
              label="Attendance Rate"
              variant="primary"
            />
            <PremiumStatCard
              value={stats?.present ?? 0}
              label="Present"
              variant="green"
            />
            <PremiumStatCard
              value={stats?.late ?? 0}
              label="Late"
              variant="gold"
            />
            <PremiumStatCard
              value={(stats?.absent ?? 0) + (stats?.excused ?? 0)}
              label="Absent / Excused"
              variant="pink"
            />
          </div>

          {/* Attendance History Table */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold tracking-tight flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-muted-foreground" />
              Recent History
            </h2>

            {attendance.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground border rounded-xl bg-muted/10">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No attendance records found yet.</p>
              </div>
            ) : (
              <div className={cn("rounded-xl border", tableContainerStyle)}>
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-b border-border/10">
                      <TableHead className="w-[180px]">Date</TableHead>
                      <TableHead>Event</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Marked At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendance.map((record) => (
                      <TableRow key={record.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          {format(
                            new Date(record.event_date),
                            "MMM d, yyyy"
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{record.event_title}</div>
                          {record.notes && (
                            <div className="text-xs text-muted-foreground mt-0.5">
                              Note: {record.notes}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="capitalize">
                          {record.event_type.replace("_", " ")}
                        </TableCell>
                        <TableCell>
                          <AttendanceStatusBadge status={record.status} />
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground text-xs">
                          {format(new Date(record.marked_at), "h:mm a")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}