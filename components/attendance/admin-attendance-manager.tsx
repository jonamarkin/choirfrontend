"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Loader2, Save, Search, X } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/components/ui/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AttendanceStatus,
  ATTENDANCE_STATUS_LABELS,
  EligibleMember,
} from "@/types/events";
import { attendanceService } from "@/services/attendance.service";
import { useEligibleMembers } from "@/hooks/useAttendance";
import { getAttendanceStyles, getVoicePartStyles } from "@/utils/premium-styles";

interface AdminAttendanceManagerProps {
  slug: string;
  onUpdate: () => void;
}

export function AdminAttendanceManager({
  slug,
  onUpdate,
}: AdminAttendanceManagerProps) {
  const { members, isLoading, mutate } = useEligibleMembers(slug);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [pendingChanges, setPendingChanges] = React.useState<
    Record<string, { status: AttendanceStatus; notes?: string }>
  >({});
  const [isSaving, setIsSaving] = React.useState(false);

  // Initialize pending changes from existing attendance
  // identifying which members already have attendance is tricky without
  // merging the lists, but getting eligible members returns 'has_attendance'.
  // We might want to fetch the actual attendance list to pre-fill specific statuses
  // For now, we'll assume we mark new ones or update existing ones freely.

  const handleStatusChange = (
    userId: string,
    status: AttendanceStatus
  ) => {
    setPendingChanges((prev) => ({
      ...prev,
      [userId]: { ...prev[userId], status },
    }));
  };

  const handleNoteChange = (userId: string, notes: string) => {
    setPendingChanges((prev) => ({
      ...prev,
      [userId]: { ...prev[userId], status: prev[userId]?.status || "present", notes },
    }));
  };

  const handleSave = async () => {
    const updates = Object.entries(pendingChanges).map(([userId, data]) => ({
      user_id: userId,
      status: data.status,
      notes: data.notes,
    }));

    if (updates.length === 0) return;

    setIsSaving(true);
    try {
      await attendanceService.bulkMarkAttendance(slug, {
        attendances: updates,
      });
      toast.success(`Successfully marked attendance for ${updates.length} members`);
      setPendingChanges({});
      mutate(); // Reload eligible members list
      onUpdate(); // Trigger parent refresh (e.g. event stats)
    } catch (error) {
      console.error(error);
      toast.error("Failed to save attendance");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.voice_part && member.voice_part.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const hasChanges = Object.keys(pendingChanges).length > 0;

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
             {hasChanges && (
                <span className="text-sm text-muted-foreground">
                    {Object.keys(pendingChanges).length} change(s) pending
                </span>
             )}
            <Button 
                onClick={handleSave} 
                disabled={!hasChanges || isSaving}
                className="w-full sm:w-auto"
            >
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                Save Changes
            </Button>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Voice Part</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        No members found.
                    </TableCell>
                </TableRow>
            ) : (
                filteredMembers.map((member) => {
                const pending = pendingChanges[member.id];
                // If we implemented pre-filling existing status, we'd use it here
                // For now, simpler approach: if has_attendance, show 'Saved' or checkmark unless changed
                
                return (
                    <TableRow key={member.id}>
                    <TableCell>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-xs text-muted-foreground">{member.email}</div>
                    </TableCell>
                    <TableCell>
                        {member.voice_part && (
                        <Badge variant="outline" className={cn("font-normal", getVoicePartStyles(member.voice_part))}>
                            {member.voice_part}
                        </Badge>
                        )}
                    </TableCell>
                    <TableCell>
                        <Select
                            value={pending?.status} 
                            onValueChange={(val) => handleStatusChange(member.id, val as AttendanceStatus)}
                        >
                            <SelectTrigger className={cn(
                                "w-[130px] h-8",
                                pending?.status && "border-primary ring-1 ring-primary/20",
                                !pending?.status && member.has_attendance && "bg-muted/50 text-muted-foreground"
                            )}>
                                <SelectValue placeholder={member.has_attendance ? "Marked" : "Select..."} />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(ATTENDANCE_STATUS_LABELS).map(([key, label]) => (
                                    <SelectItem key={key} value={key}>
                                        <div className="flex items-center gap-2">
                                            <div className={cn("w-2 h-2 rounded-full", 
                                                key === 'present' ? "bg-green-500" :
                                                key === 'absent' ? "bg-red-500" :
                                                key === 'late' ? "bg-orange-500" : "bg-blue-500"
                                            )} />
                                            {label}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </TableCell>
                    <TableCell>
                        <Input 
                            className="h-8 w-full min-w-[150px]" 
                            placeholder="Add note..."
                            value={pending?.notes || ""}
                            onChange={(e) => handleNoteChange(member.id, e.target.value)}
                        />
                    </TableCell>
                    </TableRow>
                );
                })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
