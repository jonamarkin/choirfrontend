"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Eye,
  Pencil,
  Plus,
  Calendar,
  MapPin,
  DollarSign,
  User,
  Phone,
  Save,
  X as XIcon,
  ChevronLeft,
  ChevronRight,
  Check,
  Loader2,
  Search,
  PartyPopper,
  Clock,
  FileText,
} from "lucide-react";

import { cn } from "@/components/ui/utils";
import { Button } from "@/components/ui/button";
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PremiumStatCard } from "@/components/premium-stat-card";

interface Program {
  id: string;
  clientName: string;
  eventType: string;
  amountCharged: number;
  eventDate: string;
  eventTime?: string;
  venue: string;
  contactPersonName: string;
  contactPersonPhone: string;
  contactPersonEmail?: string;
  notes?: string;
  status: "Upcoming" | "Completed" | "Cancelled";
  createdDate: string;
}

const eventTypes = [
  "Wedding",
  "Funeral",
  "Corporate Event",
  "Concert",
  "Church Service",
  "Birthday Party",
  "Anniversary",
  "Charity Event",
  "Custom",
] as const;

const mockPrograms: Program[] = [
  {
    id: "1",
    clientName: "Mensah & Asante Wedding",
    eventType: "Wedding",
    amountCharged: 3500,
    eventDate: "2025-01-15",
    eventTime: "14:00",
    venue: "Kempinski Hotel Gold Coast City",
    contactPersonName: "Akosua Mensah",
    contactPersonPhone: "+233 24 123 4567",
    contactPersonEmail: "akosua.mensah@email.com",
    notes: "200 guests expected. Need 2-hour performance with traditional Ghanaian hymns and contemporary gospel pieces.",
    status: "Upcoming",
    createdDate: "2024-12-10",
  },
  {
    id: "2",
    clientName: "Memorial Service - Nana Yaw Osei",
    eventType: "Funeral",
    amountCharged: 2000,
    eventDate: "2025-01-05",
    eventTime: "11:00",
    venue: "Holy Trinity Cathedral, Accra",
    contactPersonName: "Ama Osei",
    contactPersonPhone: "+233 20 234 5678",
    contactPersonEmail: "ama.osei@email.com",
    notes: "Perform traditional Akan funeral dirges and 4 hymns. Family prefers 'Abide With Me' and 'Awurade Kasa'.",
    status: "Upcoming",
    createdDate: "2024-12-20",
  },
  {
    id: "3",
    clientName: "MTN Ghana Corporate Gala",
    eventType: "Corporate Event",
    amountCharged: 5000,
    eventDate: "2025-02-10",
    eventTime: "19:00",
    venue: "Accra International Conference Centre",
    contactPersonName: "Kwame Boateng",
    contactPersonPhone: "+233 24 345 6789",
    contactPersonEmail: "k.boateng@mtn.com.gh",
    notes: "600 attendees. Opening and closing performances needed. Mix of highlife, gospel and contemporary pieces.",
    status: "Upcoming",
    createdDate: "2024-11-15",
  },
  {
    id: "4",
    clientName: "Adjei 50th Anniversary",
    eventType: "Anniversary",
    amountCharged: 2500,
    eventDate: "2024-12-15",
    eventTime: "18:00",
    venue: "Labadi Beach Hotel Gardens",
    contactPersonName: "Abena Adjei",
    contactPersonPhone: "+233 55 456 7890",
    notes: "Intimate gathering. Couple's favorite highlife classics and gospel songs from the 70s.",
    status: "Completed",
    createdDate: "2024-11-01",
  },
  {
    id: "5",
    clientName: "National Theatre Christmas Concert",
    eventType: "Concert",
    amountCharged: 6500,
    eventDate: "2024-12-20",
    eventTime: "20:00",
    venue: "National Theatre of Ghana",
    contactPersonName: "Efua Adomako",
    contactPersonPhone: "+233 26 567 8901",
    contactPersonEmail: "e.adomako@nationaltheatre.gov.gh",
    notes: "Public concert. Full Christmas repertoire featuring Ghanaian carols and classics. Tickets sold out.",
    status: "Completed",
    createdDate: "2024-10-01",
  },
  {
    id: "6",
    clientName: "Owusu-Ansah Wedding",
    eventType: "Wedding",
    amountCharged: 3000,
    eventDate: "2024-11-28",
    venue: "La Palm Royal Beach Hotel",
    contactPersonName: "Kofi Owusu-Ansah",
    contactPersonPhone: "+233 50 678 9012",
    notes: "Beach ceremony cancelled due to weather. Moved to indoor ballroom.",
    status: "Cancelled",
    createdDate: "2024-10-15",
  },
];

export default function Programs() {
  const [programs, setPrograms] = React.useState<Program[]>(mockPrograms);
  const [selectedProgram, setSelectedProgram] = React.useState<Program | null>(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedProgram, setEditedProgram] = React.useState<Program | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [saveStatus, setSaveStatus] = React.useState<"idle" | "saving" | "success">("idle");
  const [itemsPerPage, setItemsPerPage] = React.useState(10);

  // Search and filter states
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterEventType, setFilterEventType] = React.useState<string>("all");
  const [filterStatus, setFilterStatus] = React.useState<string>("all");

  // Add program state
  const [isAddingProgram, setIsAddingProgram] = React.useState(false);
  const [newProgram, setNewProgram] = React.useState<Program>({
    id: "",
    clientName: "",
    eventType: "Wedding",
    amountCharged: 0,
    eventDate: "",
    eventTime: "",
    venue: "",
    contactPersonName: "",
    contactPersonPhone: "",
    contactPersonEmail: "",
    notes: "",
    status: "Upcoming",
    createdDate: new Date().toISOString().split("T")[0],
  });

  // Custom event type
  const [customEventType, setCustomEventType] = React.useState("");
  const [showCustomEventType, setShowCustomEventType] = React.useState(false);

  // Ref for the scrollable drawer content
  const drawerContentRef = React.useRef<HTMLDivElement>(null);

  // Reset scroll position when drawer opens or mode changes
  React.useEffect(() => {
    if (selectedProgram && drawerContentRef.current) {
      const timeoutId = setTimeout(() => {
        if (drawerContentRef.current) {
          drawerContentRef.current.scrollTop = 0;
        }
      }, 0);

      return () => clearTimeout(timeoutId);
    }
  }, [selectedProgram?.id, isEditing]);

  // Filter and search programs
  const filteredPrograms = React.useMemo(() => {
    return programs.filter((program) => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        searchQuery === "" ||
        program.clientName.toLowerCase().includes(searchLower) ||
        program.venue.toLowerCase().includes(searchLower) ||
        program.contactPersonName.toLowerCase().includes(searchLower) ||
        program.eventType.toLowerCase().includes(searchLower);

      // Event type filter
      const matchesEventType = filterEventType === "all" || program.eventType === filterEventType;

      // Status filter
      const matchesStatus = filterStatus === "all" || program.status === filterStatus;

      return matchesSearch && matchesEventType && matchesStatus;
    });
  }, [programs, searchQuery, filterEventType, filterStatus]);

  const totalPages = Math.ceil(filteredPrograms.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPrograms = filteredPrograms.slice(startIndex, endIndex);

  // Reset to page 1 when items per page changes or filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage, searchQuery, filterEventType, filterStatus]);

  const handleViewDetails = (program: Program) => {
    setSelectedProgram(program);
    setEditedProgram({ ...program });
    setIsEditing(false);
  };

  const handleCloseSheet = () => {
    setSelectedProgram(null);
    setEditedProgram(null);
    setIsEditing(false);
    setSaveStatus("idle");
  };

  const handleEdit = () => {
    setIsEditing(true);
    if (selectedProgram) {
      setEditedProgram({ ...selectedProgram });
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (selectedProgram) {
      setEditedProgram({ ...selectedProgram });
    }
  };

  const handleSave = async () => {
    if (!editedProgram) return;

    setSaveStatus("saving");

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Update the program in the list
    setPrograms((prev) =>
      prev.map((program) => (program.id === editedProgram.id ? editedProgram : program))
    );
    setSelectedProgram(editedProgram);
    setSaveStatus("success");

    // Wait a bit to show success, then exit edit mode
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsEditing(false);
    setSaveStatus("idle");
  };

  const handleOpenAddProgram = () => {
    setIsAddingProgram(true);
    setShowCustomEventType(false);
    setCustomEventType("");
    setNewProgram({
      id: "",
      clientName: "",
      eventType: "Wedding",
      amountCharged: 0,
      eventDate: "",
      eventTime: "",
      venue: "",
      contactPersonName: "",
      contactPersonPhone: "",
      contactPersonEmail: "",
      notes: "",
      status: "Upcoming",
      createdDate: new Date().toISOString().split("T")[0],
    });
  };

  const handleCloseAddProgram = () => {
    setIsAddingProgram(false);
    setShowCustomEventType(false);
    setCustomEventType("");
    setNewProgram({
      id: "",
      clientName: "",
      eventType: "Wedding",
      amountCharged: 0,
      eventDate: "",
      eventTime: "",
      venue: "",
      contactPersonName: "",
      contactPersonPhone: "",
      contactPersonEmail: "",
      notes: "",
      status: "Upcoming",
      createdDate: new Date().toISOString().split("T")[0],
    });
    setSaveStatus("idle");
  };

  const handleAddProgram = async () => {
    if (newProgram.clientName.trim() === "" || newProgram.eventDate === "") {
      return;
    }

    setSaveStatus("saving");

    // Use custom event type if selected
    const finalEventType = showCustomEventType && customEventType.trim() !== ""
      ? customEventType
      : newProgram.eventType;

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Generate new ID
    const newId = (Math.max(...programs.map((p) => parseInt(p.id))) + 1).toString();

    // Add program to list
    const programToAdd = { ...newProgram, id: newId, eventType: finalEventType };
    setPrograms((prev) => [...prev, programToAdd]);

    setSaveStatus("success");

    // Wait a bit to show success, then close
    await new Promise((resolve) => setTimeout(resolve, 800));
    handleCloseAddProgram();
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Calculate stats
  const upcomingCount = filteredPrograms.filter((p) => p.status === "Upcoming").length;
  const completedCount = filteredPrograms.filter((p) => p.status === "Completed").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="ml-0 md:ml-0 pl-14 md:pl-0">
          <h1 className="tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            Programs
          </h1>
        </div>
        <motion.div whileTap={{ scale: 0.96 }}>
          <Button
            onClick={handleOpenAddProgram}
            className="gap-2 rounded-xl shadow-lg shadow-primary/10 bg-gradient-to-br from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
          >
            <Plus className="h-4 w-4" />
            Create Program
          </Button>
        </motion.div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <PremiumStatCard
          value={filteredPrograms.length}
          label="Total Programs"
          variant="primary"
        />
        <PremiumStatCard
          value={upcomingCount}
          label="Upcoming"
          variant="secondary"
        />
        <PremiumStatCard
          value={completedCount}
          label="Completed"
          variant="pink"
        />
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-3">
        {/* Search Box */}
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by client, venue, contact person, or event type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-4 h-9 rounded-xl bg-background/60 backdrop-blur-sm border-border/40 focus:border-primary/40 shadow-sm"
          />
        </div>

        {/* Filter Options */}
        <div className="flex gap-3">
          <Select value={filterEventType} onValueChange={(value) => setFilterEventType(value)}>
            <SelectTrigger className="w-[180px] h-9 rounded-xl bg-background/60 backdrop-blur-sm border-border/40">
              <SelectValue placeholder="Event Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              {eventTypes.filter(t => t !== "Custom").map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value)}>
            <SelectTrigger className="w-[140px] h-9 rounded-xl bg-background/60 backdrop-blur-sm border-border/40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Upcoming">Upcoming</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-gradient-to-br from-background/60 to-background/30 backdrop-blur-sm overflow-hidden shadow-lg shadow-primary/5 flex flex-col">
        <div
          className="overflow-x-auto overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-muted/20 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-primary/30 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-primary/40"
          style={{ minHeight: "calc(100vh - 365px)", maxHeight: "calc(100vh - 365px)" }}
        >
          <Table className="table-fixed w-full">
            <TableHeader>
              <TableRow className="border-border/20 hover:bg-transparent">
                <TableHead className="h-10 px-3 md:px-6 text-[13px] font-semibold uppercase tracking-wider text-muted-foreground/90 w-[200px]">
                  Client
                </TableHead>
                <TableHead className="h-10 px-3 md:px-6 text-[13px] font-semibold uppercase tracking-wider text-muted-foreground/90 w-[140px]">
                  Event Type
                </TableHead>
                <TableHead className="hidden md:table-cell h-10 px-3 md:px-6 text-[13px] font-semibold uppercase tracking-wider text-muted-foreground/90 w-[120px]">
                  Date
                </TableHead>
                <TableHead className="hidden lg:table-cell h-10 px-3 md:px-6 text-[13px] font-semibold uppercase tracking-wider text-muted-foreground/90 w-[180px]">
                  Venue
                </TableHead>
                <TableHead className="h-10 px-3 md:px-6 text-[13px] font-semibold uppercase tracking-wider text-muted-foreground/90 w-[120px]">
                  Amount
                </TableHead>
                <TableHead className="hidden sm:table-cell h-10 px-3 md:px-6 text-[13px] font-semibold uppercase tracking-wider text-muted-foreground/90 w-[110px]">
                  Status
                </TableHead>
                <TableHead className="h-10 px-3 md:px-6 text-center text-[13px] font-semibold uppercase tracking-wider text-muted-foreground/90 w-[140px]">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentPrograms.map((program, index) => (
                <TableRow
                  key={program.id}
                  className={cn(
                    "border-border/20 transition-all duration-200",
                    "hover:bg-accent/30",
                    index === currentPrograms.length - 1 && "border-0"
                  )}
                >
                  <TableCell className="py-1.5 px-3 md:px-6 w-[200px]">
                    <div className="font-medium text-[15px] text-foreground truncate">
                      {program.clientName}
                    </div>
                  </TableCell>
                  <TableCell className="py-1.5 px-3 md:px-6 w-[140px]">
                    <div className="text-[14px] font-medium text-[#F36A21]">
                      {program.eventType}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell py-1.5 px-3 md:px-6 w-[120px]">
                    <div className="text-[14px] text-muted-foreground">
                      {new Date(program.eventDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell py-1.5 px-3 md:px-6 w-[180px]">
                    <div className="text-[14px] text-muted-foreground truncate">
                      {program.venue}
                    </div>
                  </TableCell>
                  <TableCell className="py-1.5 px-3 md:px-6 w-[120px]">
                    <div className="text-[14px] font-medium text-foreground">
                      GH₵ {program.amountCharged.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell py-1.5 px-3 md:px-6 w-[110px]">
                    <div
                      className={cn(
                        "text-[14px] font-medium",
                        program.status === "Upcoming"
                          ? "text-[#F36A21]"
                          : program.status === "Completed"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-slate-600 dark:text-slate-400"
                      )}
                    >
                      {program.status}
                    </div>
                  </TableCell>
                  <TableCell className="py-1.5 px-3 md:px-6 text-center w-[140px]">
                    <motion.div whileTap={{ scale: 0.96 }} className="inline-block">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 rounded-xl text-[13px] font-medium hover:bg-accent/50"
                        onClick={() => handleViewDetails(program)}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="hidden sm:inline">View</span>
                      </Button>
                    </motion.div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-border/20 px-8 py-2 bg-background/20">
          <div className="flex items-center gap-4">
            <div className="text-[13px] text-muted-foreground">
              Showing{" "}
              <span className="font-medium text-foreground">
                {filteredPrograms.length === 0 ? 0 : startIndex + 1}-{Math.min(endIndex, filteredPrograms.length)}
              </span>{" "}
              of <span className="font-medium text-foreground">{filteredPrograms.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-muted-foreground">Items per page:</span>
              <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                <SelectTrigger className="w-[80px] h-8 rounded-lg text-[13px] bg-transparent hover:bg-transparent dark:bg-transparent dark:hover:bg-transparent">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.div whileTap={{ scale: 0.96 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="rounded-xl gap-2 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
            </motion.div>
            <div className="flex items-center gap-1 px-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <motion.button
                    key={page}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => setCurrentPage(page)}
                    className={cn(
                      "h-9 w-9 rounded-lg text-[13px] font-medium transition-all duration-200",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
                      page === currentPage
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {page}
                  </motion.button>
                )
              )}
            </div>
            <motion.div whileTap={{ scale: 0.96 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="rounded-xl gap-2 disabled:opacity-40"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Details Sheet */}
      <Sheet open={!!selectedProgram} onOpenChange={handleCloseSheet}>
        <SheetContent className="sm:max-w-[380px] p-0 flex flex-col">
          <SheetTitle className="sr-only">
            {isEditing ? "Edit Program" : "Program Details"}
          </SheetTitle>
          <SheetDescription className="sr-only">
            {isEditing
              ? "Update program information and save changes"
              : "View detailed information about this program"}
          </SheetDescription>

          {editedProgram && (
            <div ref={drawerContentRef} className="flex flex-col h-full overflow-y-auto">
              {/* Header Section */}
              <div className="px-6 pt-8 pb-6 border-b border-border/20">
                <div className="space-y-1 mb-4">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    {editedProgram.clientName}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {editedProgram.eventType}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="secondary"
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium",
                      editedProgram.status === "Upcoming"
                        ? "bg-gradient-to-br from-[#F36A21]/15 to-[#F36A21]/25 text-[#F36A21] shadow-sm shadow-[#F36A21]/10"
                        : editedProgram.status === "Completed"
                        ? "bg-gradient-to-br from-emerald-500/15 to-emerald-600/25 text-emerald-700 dark:text-emerald-400 shadow-sm shadow-emerald-500/10"
                        : "bg-gradient-to-br from-slate-500/15 to-slate-600/25 text-slate-600 dark:text-slate-400 shadow-sm shadow-slate-500/10"
                    )}
                  >
                    {editedProgram.status}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="rounded-full px-3 py-1 text-xs font-medium bg-gradient-to-br from-[#F2B705]/15 to-[#F2B705]/25 text-[#F2B705] shadow-sm shadow-[#F2B705]/10"
                  >
                    GH₵ {editedProgram.amountCharged.toLocaleString()}
                  </Badge>
                </div>
              </div>

              {/* Content Section */}
              <div className="flex-1 overflow-y-auto px-6 py-6">
                <AnimatePresence mode="wait">
                  {isEditing ? (
                    <motion.div
                      key="edit-mode"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      {/* Event Details */}
                      <div className="space-y-4">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Event Details
                        </h3>

                        <div className="space-y-2">
                          <Label htmlFor="clientName" className="text-sm">Client Name</Label>
                          <Input
                            id="clientName"
                            value={editedProgram.clientName}
                            onChange={(e) =>
                              setEditedProgram({ ...editedProgram, clientName: e.target.value })
                            }
                            className="rounded-xl border-border/60"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="eventType" className="text-sm">Event Type</Label>
                          <Select
                            value={editedProgram.eventType}
                            onValueChange={(value) =>
                              setEditedProgram({ ...editedProgram, eventType: value })
                            }
                          >
                            <SelectTrigger className="rounded-xl border-border/60">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {eventTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="amountCharged" className="text-sm">Amount Charged (GH₵)</Label>
                          <Input
                            id="amountCharged"
                            type="number"
                            value={editedProgram.amountCharged}
                            onChange={(e) =>
                              setEditedProgram({
                                ...editedProgram,
                                amountCharged: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="rounded-xl border-border/60"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label htmlFor="eventDate" className="text-sm">Event Date</Label>
                            <Input
                              id="eventDate"
                              type="date"
                              value={editedProgram.eventDate}
                              onChange={(e) =>
                                setEditedProgram({ ...editedProgram, eventDate: e.target.value })
                              }
                              className="rounded-xl border-border/60"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="eventTime" className="text-sm">Time</Label>
                            <Input
                              id="eventTime"
                              type="time"
                              value={editedProgram.eventTime || ""}
                              onChange={(e) =>
                                setEditedProgram({ ...editedProgram, eventTime: e.target.value })
                              }
                              className="rounded-xl border-border/60"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="venue" className="text-sm">Venue</Label>
                          <Input
                            id="venue"
                            value={editedProgram.venue}
                            onChange={(e) =>
                              setEditedProgram({ ...editedProgram, venue: e.target.value })
                            }
                            className="rounded-xl border-border/60"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="status" className="text-sm">Status</Label>
                          <Select
                            value={editedProgram.status}
                            onValueChange={(value) =>
                              setEditedProgram({
                                ...editedProgram,
                                status: value as Program["status"],
                              })
                            }
                          >
                            <SelectTrigger className="rounded-xl border-border/60">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Upcoming">Upcoming</SelectItem>
                              <SelectItem value="Completed">Completed</SelectItem>
                              <SelectItem value="Cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <Separator className="bg-gradient-to-r from-transparent via-border/60 to-transparent" />

                      {/* Contact Person */}
                      <div className="space-y-4">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Contact Person
                        </h3>

                        <div className="space-y-2">
                          <Label htmlFor="contactPersonName" className="text-sm">Name</Label>
                          <Input
                            id="contactPersonName"
                            value={editedProgram.contactPersonName}
                            onChange={(e) =>
                              setEditedProgram({ ...editedProgram, contactPersonName: e.target.value })
                            }
                            className="rounded-xl border-border/60"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="contactPersonPhone" className="text-sm">Phone</Label>
                          <Input
                            id="contactPersonPhone"
                            value={editedProgram.contactPersonPhone}
                            onChange={(e) =>
                              setEditedProgram({ ...editedProgram, contactPersonPhone: e.target.value })
                            }
                            className="rounded-xl border-border/60"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="contactPersonEmail" className="text-sm">Email</Label>
                          <Input
                            id="contactPersonEmail"
                            type="email"
                            value={editedProgram.contactPersonEmail || ""}
                            onChange={(e) =>
                              setEditedProgram({ ...editedProgram, contactPersonEmail: e.target.value })
                            }
                            className="rounded-xl border-border/60"
                          />
                        </div>
                      </div>

                      <Separator className="bg-gradient-to-r from-transparent via-border/60 to-transparent" />

                      {/* Notes */}
                      <div className="space-y-4">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Additional Notes
                        </h3>

                        <div className="space-y-2">
                          <Label htmlFor="notes" className="text-sm">Notes</Label>
                          <Textarea
                            id="notes"
                            value={editedProgram.notes || ""}
                            onChange={(e) =>
                              setEditedProgram({ ...editedProgram, notes: e.target.value })
                            }
                            rows={4}
                            className="rounded-xl border-border/60 resize-none"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="view-mode"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      {/* Event Details */}
                      <div className="space-y-4">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Event Details
                        </h3>

                        <div className="space-y-4">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                              <Calendar className="h-3.5 w-3.5" />
                              Date & Time
                            </div>
                            <div className="text-sm text-foreground pl-5.5">
                              {selectedProgram && (
                                <>
                                  {new Date(selectedProgram.eventDate).toLocaleDateString("en-US", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                  {selectedProgram.eventTime && ` at ${selectedProgram.eventTime}`}
                                </>
                              )}
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                              <MapPin className="h-3.5 w-3.5" />
                              Venue
                            </div>
                            <div className="text-sm text-foreground pl-5.5">
                              {selectedProgram && selectedProgram.venue}
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                              <DollarSign className="h-3.5 w-3.5" />
                              Amount Charged
                            </div>
                            <div className="text-sm text-foreground pl-5.5"> 
                              {selectedProgram && `GH₵ ${selectedProgram.amountCharged.toLocaleString()}`}
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator className="bg-gradient-to-r from-transparent via-border/60 to-transparent" />

                      {/* Contact Person */}
                      <div className="space-y-4">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Contact Person
                        </h3>

                        <div className="space-y-4">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                              <User className="h-3.5 w-3.5" />
                              Name
                            </div>
                            <div className="text-sm text-foreground pl-5.5">
                              {selectedProgram && selectedProgram.contactPersonName}
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                              <Phone className="h-3.5 w-3.5" />
                              Phone
                            </div>
                            <div className="text-sm text-foreground pl-5.5">
                              {selectedProgram && selectedProgram.contactPersonPhone}
                            </div>
                          </div>

                          {selectedProgram && selectedProgram.contactPersonEmail && (
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                <Phone className="h-3.5 w-3.5" />
                                Email
                              </div>
                              <div className="text-sm text-foreground pl-5.5">
                                {selectedProgram.contactPersonEmail}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {selectedProgram && selectedProgram.notes && (
                        <>
                          <Separator className="bg-gradient-to-r from-transparent via-border/60 to-transparent" />

                          <div className="space-y-4">
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                              Additional Notes
                            </h3>

                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                <FileText className="h-3.5 w-3.5" />
                                Notes
                              </div>
                              <div className="text-sm text-foreground pl-5.5">
                                {selectedProgram.notes}
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer Actions */}
              <div className="border-t border-border/20 px-6 py-4">
                <AnimatePresence mode="wait">
                  {isEditing ? (
                    <motion.div
                      key="edit-buttons"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex gap-2"
                    >
                      <motion.div whileTap={{ scale: 0.96 }} className="flex-1">
                        <Button
                          variant="outline"
                          onClick={handleCancelEdit}
                          className="w-full gap-2 rounded-xl"
                        >
                          <XIcon className="h-4 w-4" />
                          Cancel
                        </Button>
                      </motion.div>
                      <motion.div whileTap={{ scale: saveStatus === "idle" ? 0.96 : 1 }} className="flex-1">
                        <Button
                          onClick={handleSave}
                          disabled={saveStatus !== "idle"}
                          className={cn(
                            "w-full gap-2 rounded-xl shadow-lg overflow-hidden relative transition-all duration-300",
                            saveStatus === "success"
                              ? "bg-gradient-to-br from-emerald-600 to-emerald-700 shadow-emerald-500/20"
                              : "bg-gradient-to-br from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-primary/10",
                            saveStatus !== "idle" && "opacity-100"
                          )}
                        >
                          <AnimatePresence mode="wait">
                            {saveStatus === "idle" && (
                              <motion.div
                                key="idle"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="flex items-center gap-2"
                              >
                                <Save className="h-4 w-4" />
                                <span>Save</span>
                              </motion.div>
                            )}
                            {saveStatus === "saving" && (
                              <motion.div
                                key="saving"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="flex items-center gap-2"
                              >
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Saving...</span>
                              </motion.div>
                            )}
                            {saveStatus === "success" && (
                              <motion.div
                                key="success"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="flex items-center gap-2"
                              >
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 200,
                                    damping: 10,
                                    delay: 0.1,
                                  }}
                                >
                                  <Check className="h-4 w-4" />
                                </motion.div>
                                <span>Saved!</span>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </Button>
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="view-button"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      whileTap={{ scale: 0.96 }}
                      className="w-full"
                    >
                      <Button
                        onClick={handleEdit}
                        className="w-full gap-2 rounded-xl shadow-lg shadow-primary/10 bg-gradient-to-br from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                      >
                        <Pencil className="h-4 w-4" />
                        Edit Program
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Add Program Sheet */}
      <Sheet open={isAddingProgram} onOpenChange={handleCloseAddProgram}>
        <SheetContent className="sm:max-w-[480px] p-0 flex flex-col">
          <SheetTitle className="sr-only">Create New Program</SheetTitle>
          <SheetDescription className="sr-only">
            Create a new event program for the choir
          </SheetDescription>

          <div className="flex flex-col h-full overflow-y-auto">
            {/* Header Section */}
            <div className="px-6 pt-8 pb-6 border-b border-border/20">
              <h2 className="text-2xl font-semibold tracking-tight">Create New Program</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Add a new event for the choir
              </p>
            </div>

            {/* Content Section */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="space-y-6">
                {/* Event Details */}
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Event Details
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="new-clientName" className="text-sm">Client Name *</Label>
                    <Input
                      id="new-clientName"
                      value={newProgram.clientName}
                      onChange={(e) => setNewProgram({ ...newProgram, clientName: e.target.value })}
                      placeholder="Enter client name"
                      className="rounded-xl border-border/60"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-eventType" className="text-sm">Event Type *</Label>
                    <Select
                      value={showCustomEventType ? "Custom" : newProgram.eventType}
                      onValueChange={(value) => {
                        if (value === "Custom") {
                          setShowCustomEventType(true);
                        } else {
                          setShowCustomEventType(false);
                          setNewProgram({ ...newProgram, eventType: value });
                        }
                      }}
                    >
                      <SelectTrigger className="rounded-xl border-border/60">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {eventTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {showCustomEventType && (
                      <Input
                        value={customEventType}
                        onChange={(e) => setCustomEventType(e.target.value)}
                        placeholder="Enter custom event type"
                        className="rounded-xl border-border/60 mt-2"
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-amountCharged" className="text-sm">Amount Charged (GH₵) *</Label>
                    <Input
                      id="new-amountCharged"
                      type="number"
                      value={newProgram.amountCharged || ""}
                      onChange={(e) =>
                        setNewProgram({
                          ...newProgram,
                          amountCharged: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="0.00"
                      className="rounded-xl border-border/60"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="new-eventDate" className="text-sm">Event Date *</Label>
                      <Input
                        id="new-eventDate"
                        type="date"
                        value={newProgram.eventDate}
                        onChange={(e) => setNewProgram({ ...newProgram, eventDate: e.target.value })}
                        className="rounded-xl border-border/60"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-eventTime" className="text-sm">Time</Label>
                      <Input
                        id="new-eventTime"
                        type="time"
                        value={newProgram.eventTime || ""}
                        onChange={(e) => setNewProgram({ ...newProgram, eventTime: e.target.value })}
                        className="rounded-xl border-border/60"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-venue" className="text-sm">Venue *</Label>
                    <Input
                      id="new-venue"
                      value={newProgram.venue}
                      onChange={(e) => setNewProgram({ ...newProgram, venue: e.target.value })}
                      placeholder="Enter venue location"
                      className="rounded-xl border-border/60"
                    />
                  </div>
                </div>

                <Separator className="bg-gradient-to-r from-transparent via-border/60 to-transparent" />

                {/* Contact Person */}
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Contact Person
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="new-contactPersonName" className="text-sm">Name *</Label>
                    <Input
                      id="new-contactPersonName"
                      value={newProgram.contactPersonName}
                      onChange={(e) =>
                        setNewProgram({ ...newProgram, contactPersonName: e.target.value })
                      }
                      placeholder="Enter contact name"
                      className="rounded-xl border-border/60"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-contactPersonPhone" className="text-sm">Phone *</Label>
                    <Input
                      id="new-contactPersonPhone"
                      value={newProgram.contactPersonPhone}
                      onChange={(e) =>
                        setNewProgram({ ...newProgram, contactPersonPhone: e.target.value })
                      }
                      placeholder="+1 (555) 123-4567"
                      className="rounded-xl border-border/60"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-contactPersonEmail" className="text-sm">Email</Label>
                    <Input
                      id="new-contactPersonEmail"
                      type="email"
                      value={newProgram.contactPersonEmail || ""}
                      onChange={(e) =>
                        setNewProgram({ ...newProgram, contactPersonEmail: e.target.value })
                      }
                      placeholder="contact@email.com"
                      className="rounded-xl border-border/60"
                    />
                  </div>
                </div>

                <Separator className="bg-gradient-to-r from-transparent via-border/60 to-transparent" />

                {/* Notes */}
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Additional Information
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="new-notes" className="text-sm">Notes</Label>
                    <Textarea
                      id="new-notes"
                      value={newProgram.notes || ""}
                      onChange={(e) => setNewProgram({ ...newProgram, notes: e.target.value })}
                      rows={4}
                      placeholder="Add any additional notes or requirements..."
                      className="rounded-xl border-border/60 resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="border-t border-border/20 px-6 py-4 bg-muted/10">
              <div className="flex gap-3">
                <motion.div whileTap={{ scale: 0.96 }} className="flex-1">
                  <Button
                    onClick={handleCloseAddProgram}
                    variant="outline"
                    className="w-full rounded-xl border-border/60 hover:bg-muted/50"
                    disabled={saveStatus === "saving"}
                  >
                    Cancel
                  </Button>
                </motion.div>
                <motion.div whileTap={{ scale: 0.96 }} className="flex-1">
                  <Button
                    onClick={handleAddProgram}
                    className="w-full gap-2 rounded-xl bg-gradient-to-br from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/10"
                    disabled={
                      saveStatus === "saving" ||
                      !newProgram.clientName.trim() ||
                      !newProgram.eventDate
                    }
                  >
                    {saveStatus === "saving" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : saveStatus === "success" ? (
                      <>
                        <Check className="h-4 w-4" />
                        Created!
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        Create Program
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
