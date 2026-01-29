"use client";

import * as React from "react";
import { format } from "date-fns";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Loader2,
  MapPin,
  Users,
  XCircle,
  AlertCircle,
  ArrowLeft,
  CalendarCheck,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";

import { cn } from "@/components/ui/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/providers/auth-provider";
import { useEvent } from "@/hooks/useEvents";
import { useEventAttendance } from "@/hooks/useAttendance";
import { AdminAttendanceManager } from "@/components/attendance/admin-attendance-manager";
import {
  EventStatus,
  EventType,
  ATTENDANCE_STATUS_LABELS,
  EVENT_STATUS_LABELS,
  EVENT_TYPE_LABELS,
} from "@/types/events";
import {
  cardBaseStyle,
  getAttendanceStyles,
  getPaymentStyles,
} from "@/utils/premium-styles";

// Helper for event status badge
function EventStatusBadge({ status }: { status: EventStatus }) {
  const styles =
    status === "scheduled"
      ? "bg-blue-500/10 text-blue-500 border-blue-200/20"
      : status === "completed"
      ? "bg-green-500/10 text-green-500 border-green-200/20"
      : status === "cancelled"
      ? "bg-red-500/10 text-red-500 border-red-200/20"
      : "bg-gray-500/10 text-gray-500 border-gray-200/20";

  return (
    <Badge variant="outline" className={styles}>
      {EVENT_STATUS_LABELS[status]}
    </Badge>
  );
}

export default function EventDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const { user } = useAuth();
  const { event, isLoading, mutate, error } = useEvent(slug);
  
  const { attendance: myAttendanceList, isLoading: attendanceLoading } = useEventAttendance(slug);
  
  const myAttendance = myAttendanceList.find((a) => a.user === user?.id);

  const canManageEvents =
    user?.role === "super_admin" ||
    user?.role === "admin" ||
    user?.role === "attendance_officer";

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <AlertCircle className="h-12 w-12 text-destructive opacity-50" />
        <p className="text-lg font-medium text-destructive">Error loading event</p>
        <p className="text-muted-foreground">{error.message || "Failed to fetch event details"}</p>
        <Button onClick={() => router.push("/events")}>Back to Events</Button>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <p className="text-muted-foreground">Event not found.</p>
        <Button onClick={() => router.push("/events")}>Back to Events</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {/* Navigation */}
      <Button
        variant="ghost"
        className="gap-2 pl-0 hover:pl-2 transition-all"
        onClick={() => router.push("/events")}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Events
      </Button>

      {/* Header Card */}
      <div className={cardBaseStyle}>
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                  {EVENT_TYPE_LABELS[event.event_type]}
                </Badge>
                <EventStatusBadge status={event.status} />
                {event.is_mandatory && (
                  <Badge variant="destructive" className="rounded-full">
                    Mandatory
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold tracking-tight">{event.title}</h1>
            </div>

            <div className="grid gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="font-medium text-foreground">
                    {format(new Date(event.start_datetime), "EEEE, MMMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>
                    {format(new Date(event.start_datetime), "h:mm a")} - {format(new Date(event.end_datetime), "h:mm a")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{event.location}</span>
              </div>
            </div>
          </div>

          {/* Stats / Status Box */}
          <div className="bg-muted/30 rounded-xl p-4 min-w-[240px] border border-border/50">
            {canManageEvents ? (
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  AttendanceSummary
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className="text-2xl font-bold">{event.attendance_summary.attendance_rate.toFixed(0)}%</div>
                        <div className="text-xs text-muted-foreground">Rate</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-green-600">
                             {event.attendance_summary.present}
                        </div>
                        <div className="text-xs text-muted-foreground">Present</div>
                    </div>
                     <div>
                        <div className="text-2xl font-bold text-orange-500">
                             {event.attendance_summary.late}
                        </div>
                        <div className="text-xs text-muted-foreground">Late</div>
                    </div>
                     <div>
                        <div className="text-2xl font-bold text-red-500">
                             {event.attendance_summary.absent}
                        </div>
                        <div className="text-xs text-muted-foreground">Absent</div>
                    </div>
                </div>
              </div>
            ) : (
                <div className="space-y-3">
                     <h3 className="font-semibold flex items-center gap-2">
                        <CalendarCheck className="h-4 w-4 text-primary" />
                         My Status
                    </h3>
                    {attendanceLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    ) : myAttendance ? (
                        <div className="space-y-2">
                            <div className={cn(
                                "flex flex-col items-center justify-center p-3 rounded-lg border",
                                myAttendance.status === 'present' ? "bg-green-500/10 border-green-200 text-green-700" :
                                myAttendance.status === 'late' ? "bg-orange-500/10 border-orange-200 text-orange-700" :
                                myAttendance.status === 'excused' ? "bg-blue-500/10 border-blue-200 text-blue-700" :
                                "bg-red-500/10 border-red-200 text-red-700"
                            )}>
                                <span className="text-lg font-bold">{ATTENDANCE_STATUS_LABELS[myAttendance.status]}</span>
                                {myAttendance.marked_at && (
                                    <span className="text-xs opacity-80">Marked at {format(new Date(myAttendance.marked_at), "h:mm a")}</span>
                                )}
                            </div>
                            {myAttendance.notes && (
                                <p className="text-xs text-muted-foreground italic text-center">"{myAttendance.notes}"</p>
                            )}
                        </div>
                    ) : (
                         <div className="text-center py-4 text-muted-foreground">
                            <p>Not marked yet</p>
                         </div>
                    )}
                </div>
            )}
          </div>
        </div>

        {event.description && (
            <div className="mt-6 pt-6 border-t border-border/20">
                <h3 className="font-semibold mb-2">About Event</h3>
                <p className="text-muted-foreground leading-relaxed">{event.description}</p>
            </div>
        )}
      </div>

      {canManageEvents && (
        <div className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight">Manage Attendance</h2>
            <AdminAttendanceManager slug={event.slug} onUpdate={mutate} />
        </div>
      )}
    </div>
  );
}
