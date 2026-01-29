"use client";

import * as React from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import {
  Calendar as CalendarIcon,
  ChevronRight,
  Filter,
  Loader2,
  MapPin,
  Plus,
  Search,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/components/ui/utils";
import { useEvents } from "@/hooks/useEvents";
import { useAuth } from "@/components/providers/auth-provider";
import {
  EventStatus,
  EventType,
  EVENT_STATUS_LABELS,
  EVENT_TYPE_LABELS,
} from "@/types/events";
import { cardBaseStyle } from "@/utils/premium-styles";
import { CreateEventDialog } from "@/components/attendance/create-event-dialog";

export function EventsList() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<EventType | "all">("all");
  const [statusFilter, setStatusFilter] = React.useState<EventStatus | "all">(
    "all"
  );
  const [showCreateDialog, setShowCreateDialog] = React.useState(false);

  // Fetch events
  const { events, isLoading, mutate } = useEvents({
    // We can pass API filters here, but for client-side search/filter
    // on a smallish list, fetching all is often smoother.
    // Let's pass 'upcoming' if we want to default to that
  });

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === "all" || event.event_type === typeFilter;
    const matchesStatus =
      statusFilter === "all" || event.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const canManageEvents =
    user?.role === "super_admin" ||
    user?.role === "admin" ||
    user?.role === "attendance_officer";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Events</h2>
          <p className="text-sm text-muted-foreground">
            Upcoming rehearsals and programs
          </p>
        </div>
        {canManageEvents && (
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="gap-2 bg-primary hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Create Event
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 bg-background/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Select
          value={typeFilter}
          onValueChange={(v) => setTypeFilter(v as EventType | "all")}
        >
          <SelectTrigger className="w-full sm:w-[160px] h-10 bg-background/50">
            <SelectValue placeholder="Event Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {Object.entries(EVENT_TYPE_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as EventStatus | "all")}
        >
          <SelectTrigger className="w-full sm:w-[160px] h-10 bg-background/50">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {Object.entries(EVENT_STATUS_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Events Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border rounded-xl bg-muted/10">
          <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No events found matching your filters.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className={cn(
                cardBaseStyle,
                "flex flex-col gap-4 hover:shadow-md transition-shadow cursor-pointer bg-card border border-border/50"
              )}
              onClick={() => router.push(`/events/${event.slug}`)}
            >
              <div className="flex justify-between items-start">
                <Badge variant="outline" className="capitalize">
                  {event.event_type_display}
                </Badge>
                <div
                  className={cn(
                    "text-xs font-medium px-2 py-0.5 rounded-full",
                    event.status === "scheduled"
                      ? "bg-blue-500/10 text-blue-500"
                      : event.status === "completed"
                      ? "bg-green-500/10 text-green-500"
                      : "bg-gray-500/10 text-gray-500"
                  )}
                >
                  {event.status_display}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg line-clamp-1">
                  {event.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <CalendarIcon className="h-4 w-4" />
                  <span>
                    {format(new Date(event.start_datetime), "MMM d, h:mm a")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <MapPin className="h-4 w-4" />
                  <span className="line-clamp-1">{event.location}</span>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-border/20 flex justify-between items-center text-sm">
                <span className="text-muted-foreground">
                  {event.attendance_count} Attended
                </span>
                <Button variant="ghost" size="sm" className="h-8 px-2 gap-1">
                  Details <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateEventDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={() => mutate()}
      />
    </div>
  );
}
