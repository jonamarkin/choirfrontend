"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Assuming this exists or I'll use Input
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox"; // Assuming this exists
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/components/ui/utils";
import { eventsService } from "@/services/events.service";
import { EventFormData, EventType, EVENT_TYPE_LABELS } from "@/types/events";

interface CreateEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateEventDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateEventDialogProps) {
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState<EventFormData>({
    title: "",
    description: "",
    event_type: "rehearsal",
    location: "Church Hall",
    start_datetime: "", // Will handle date/time separately in UI
    end_datetime: "",
    is_mandatory: true,
    status: "scheduled",
    target_voice_parts: null,
  });

  // UI state for date pickers
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = React.useState("18:00");
  const [endTime, setEndTime] = React.useState("20:00");

  // Recurring Event State
  const [isRecurring, setIsRecurring] = React.useState(false);
  const [frequency, setFrequency] = React.useState<"daily" | "weekly" | "biweekly">("weekly");
  const [recurrenceCount, setRecurrenceCount] = React.useState(10);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      toast.error("Please select a date");
      return;
    }

    setLoading(true);

    try {
      // Combine date and time
      const dateStr = format(date, "yyyy-MM-dd");
      const startDateTime = `${dateStr}T${startTime}:00`;
      const endDateTime = `${dateStr}T${endTime}:00`;

      const eventPayload = {
        ...formData,
        start_datetime: startDateTime,
        end_datetime: endDateTime,
      };

      if (isRecurring) {
        await eventsService.createRecurringEvent({
           base_event: eventPayload,
           frequency,
           count: recurrenceCount,
        });
        toast.success(`Successfully created ${recurrenceCount} events`);
      } else {
        await eventsService.createEvent(eventPayload);
        toast.success("Event created successfully");
      }
      setFormData({
        title: "",
        description: "",
        event_type: "rehearsal",
        location: "Church Hall",
        start_datetime: "",
        end_datetime: "",
        is_mandatory: true,
        status: "scheduled",
        target_voice_parts: null,
      });
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
          <DialogDescription>
            Schedule a new rehearsal, concert, or event for the choir.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              required
              placeholder="e.g. Weekly Rehearsal"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Event Type</Label>
              <Select
                value={formData.event_type}
                onValueChange={(v) =>
                  setFormData({ ...formData, event_type: v as EventType })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(EVENT_TYPE_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                required
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2 flex flex-col">
              <Label>Date {isRecurring && "(Start Date)"}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
             <div className="space-y-2 flex flex-col justify-end pb-0.5">
               <div className="flex items-center space-x-2">
                 <Checkbox
                    id="recurring"
                    checked={isRecurring}
                    onCheckedChange={(checked) => setIsRecurring(checked as boolean)}
                 />
                 <Label htmlFor="recurring" className="font-normal cursor-pointer">
                   Recurring Event
                 </Label>
               </div>
            </div>
          </div>

          {isRecurring && (
            <div className="grid grid-cols-2 gap-4 p-3 bg-muted/30 rounded-md border border-border/50">
               <div className="space-y-2">
                  <Label>Frequency</Label>
                  <Select
                    value={frequency}
                    onValueChange={(v) => setFrequency(v as "daily" | "weekly" | "biweekly")}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Bi-Weekly</SelectItem>
                    </SelectContent>
                  </Select>
               </div>
               <div className="space-y-2">
                  <Label>Number of Events</Label>
                  <Input
                    type="number"
                    min={2}
                    max={52}
                    value={recurrenceCount}
                    onChange={(e) => setRecurrenceCount(parseInt(e.target.value) || 2)}
                  />
               </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="mandatory"
              checked={formData.is_mandatory}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, is_mandatory: checked as boolean })
              }
            />
            <Label htmlFor="mandatory" className="font-normal cursor-pointer">
              This event is mandatory
            </Label>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-primary">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isRecurring ? `Create ${recurrenceCount} Events` : "Create Event"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
