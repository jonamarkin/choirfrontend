"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Eye, Pencil, Mail, Phone, Calendar, MapPin, Save,
  X as XIcon, ChevronLeft, ChevronRight, Briefcase,
  GraduationCap, Heart, User, Church, Check, Loader2,
  Search, ShieldCheck, Power, PowerOff,
} from "lucide-react";

import { cn } from "@/components/ui/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { PremiumStatCard } from "@/components/premium-stat-card";
import { tableContainerStyle } from "@/utils/premium-styles";
import { useAdminUsers, useAdminUser } from "@/hooks/useAdminUsers";
import { adminUserService } from "@/services/admin-user.service";
import {
  AdminUser, AdminUserDetail, AdminUserFilters, AdminUserUpdateRequest,
  UserRole, MemberPart, ROLE_DISPLAY_NAMES, MEMBER_PART_DISPLAY_NAMES,
} from "@/types/admin";

const ROLES_LIST: { value: UserRole; label: string }[] = [
  { value: "super_admin", label: "Super Admin" },
  { value: "admin", label: "Administrator" },
  { value: "finance_admin", label: "Finance Admin" },
  { value: "attendance_officer", label: "Attendance Officer" },
  { value: "treasurer", label: "Treasurer" },
  { value: "part_leader", label: "Part Leader" },
  { value: "member", label: "Member" },
];

const PARTS_LIST: { value: MemberPart; label: string }[] = [
  { value: "soprano", label: "Soprano" },
  { value: "alto", label: "Alto" },
  { value: "tenor", label: "Tenor" },
  { value: "bass", label: "Bass" },
  { value: "instrumentalist", label: "Instrumentalist" },
  { value: "directorate", label: "Directorate" },
];

const denominations = [
  "Catholic", "Baptist", "Methodist", "Presbyterian", "Lutheran",
  "Pentecostal", "Anglican", "Non-Denominational", "Other",
] as const;

export default function Members() {
  // Filter & pagination state
  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [filterPart, setFilterPart] = React.useState<string>("all");
  const [filterStatus, setFilterStatus] = React.useState<string>("all");
  const [filterRole, setFilterRole] = React.useState<string>("all");

  // Detail / edit state
  const [selectedMemberId, setSelectedMemberId] = React.useState<string | null>(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editData, setEditData] = React.useState<AdminUserUpdateRequest>({});
  const [saveStatus, setSaveStatus] = React.useState<"idle" | "saving" | "success">("idle");
  const [actionLoading, setActionLoading] = React.useState<string | null>(null);
  const [customDenomination, setCustomDenomination] = React.useState("");
  const drawerContentRef = React.useRef<HTMLDivElement>(null);

  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Build API filters
  const filters: AdminUserFilters = React.useMemo(() => {
    const f: AdminUserFilters = { page: currentPage };
    if (debouncedSearch) f.search = debouncedSearch;
    if (filterPart !== "all") f.member_part = filterPart as MemberPart;
    if (filterStatus === "active") f.is_active = true;
    else if (filterStatus === "inactive") f.is_active = false;
    if (filterRole !== "all") f.role = filterRole as UserRole;
    return f;
  }, [currentPage, debouncedSearch, filterPart, filterStatus, filterRole]);

  // Fetch members list
  const { users, totalCount, hasNext, hasPrevious, isLoading, error, mutate } = useAdminUsers(filters);

  // Fetch selected member detail
  const { user: memberDetail, isLoading: detailLoading, mutate: mutateDetail } = useAdminUser(selectedMemberId);

  const totalPages = Math.max(1, Math.ceil(totalCount / 20));

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, filterPart, filterStatus, filterRole]);

  // Reset scroll on drawer open/mode change
  React.useEffect(() => {
    if (selectedMemberId && drawerContentRef.current) {
      const t = setTimeout(() => { drawerContentRef.current?.scrollTo(0, 0); }, 0);
      return () => clearTimeout(t);
    }
  }, [selectedMemberId, isEditing]);

  const handleViewDetails = (member: AdminUser) => {
    setSelectedMemberId(member.id);
    setIsEditing(false);
    setSaveStatus("idle");
    setEditData({});
  };

  const handleCloseSheet = () => {
    setSelectedMemberId(null);
    setIsEditing(false);
    setSaveStatus("idle");
    setEditData({});
    setCustomDenomination("");
  };

  const handleEdit = () => {
    if (memberDetail) {
      setEditData({
        first_name: memberDetail.first_name,
        last_name: memberDetail.last_name,
        phone_number: memberDetail.phone_number,
        role: memberDetail.role,
        member_part: memberDetail.member_part || undefined,
        is_active: memberDetail.is_active,
        is_approved: memberDetail.is_approved,
        gender: memberDetail.gender || undefined,
        date_of_birth: memberDetail.date_of_birth || undefined,
        denomination: memberDetail.denomination || undefined,
        address: memberDetail.address || undefined,
        join_date: memberDetail.join_date || undefined,
        employment_status: memberDetail.employment_status || undefined,
        occupation: memberDetail.occupation || undefined,
        employer: memberDetail.employer || undefined,
        emergency_contact_name: memberDetail.emergency_contact_name || undefined,
        emergency_contact_relationship: memberDetail.emergency_contact_relationship || undefined,
        emergency_contact_phone: memberDetail.emergency_contact_phone || undefined,
      });
      const denom = memberDetail.denomination || "";
      const isCustom = denom && !denominations.slice(0, -1).includes(denom as (typeof denominations)[number]);
      setCustomDenomination(isCustom ? denom : "");
    }
    setIsEditing(true);
    setSaveStatus("idle");
  };

  const handleSave = async () => {
    if (!selectedMemberId || !editData) return;
    setSaveStatus("saving");
    try {
      await adminUserService.updateUser(selectedMemberId, editData);
      setSaveStatus("success");
      await mutateDetail();
      await mutate();
      await new Promise((r) => setTimeout(r, 800));
      setIsEditing(false);
      setSaveStatus("idle");
    } catch (err) {
      setSaveStatus("idle");
      alert(err instanceof Error ? err.message : "Failed to save changes");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSaveStatus("idle");
  };

  const handleApprove = async (userId: string) => {
    setActionLoading(userId);
    try {
      await adminUserService.approveUser(userId);
      await mutate();
      if (selectedMemberId) await mutateDetail();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to approve user");
    }
    setActionLoading(null);
  };

  const handleActivate = async (userId: string) => {
    setActionLoading(userId);
    try {
      await adminUserService.activateUser(userId);
      await mutate();
      if (selectedMemberId) await mutateDetail();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to activate user");
    }
    setActionLoading(null);
  };

  const handleDeactivate = async (userId: string) => {
    setActionLoading(userId);
    try {
      await adminUserService.deactivateUser(userId);
      await mutate();
      if (selectedMemberId) await mutateDetail();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to deactivate user");
    }
    setActionLoading(null);
  };

  const getPartColor = (part: string) => {
    switch (part) {
      case "soprano": return "bg-gradient-to-br from-rose-500/15 to-rose-600/20 text-rose-700 dark:text-rose-300 shadow-sm shadow-rose-500/10";
      case "alto": return "bg-gradient-to-br from-[#5A1E6E]/15 to-[#5A1E6E]/20 text-[#5A1E6E] dark:text-[#9F7FB8] shadow-sm shadow-[#5A1E6E]/10";
      case "tenor": return "bg-gradient-to-br from-[#F36A21]/15 to-[#F36A21]/20 text-[#F36A21] dark:text-[#FF8F5E] shadow-sm shadow-[#F36A21]/10";
      case "bass": return "bg-gradient-to-br from-[#3D123F]/15 to-[#3D123F]/20 text-[#3D123F] dark:text-[#8B6B8E] shadow-sm shadow-[#3D123F]/10";
      default: return "bg-gradient-to-br from-gray-500/15 to-gray-600/20 text-gray-700 dark:text-gray-300 shadow-sm shadow-gray-500/10";
    }
  };

  const getMemberName = (m: AdminUser | AdminUserDetail) => `${m.first_name} ${m.last_name}`.trim();

  const activeCount = users.filter((u) => u.is_active).length;
  const pendingCount = users.filter((u) => !u.is_approved).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="ml-0 md:ml-0 pl-14 md:pl-0">
          <h1 className="tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">Members</h1>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <PremiumStatCard label="Total Members" value={totalCount} />
        <PremiumStatCard label="Active" value={activeCount} />
        <PremiumStatCard label="Pending Approval" value={pendingCount} />
      </div>

      {/* Search & Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm"
            />
          </div>

          <Select value={filterPart} onValueChange={setFilterPart}>
            <SelectTrigger className="w-full sm:w-[180px] rounded-xl border-border/50 bg-background/50">
              <SelectValue placeholder="Voice Part" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Parts</SelectItem>
              {PARTS_LIST.map((p) => (
                <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-[160px] rounded-xl border-border/50 bg-background/50">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-full sm:w-[180px] rounded-xl border-border/50 bg-background/50">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {ROLES_LIST.map((r) => (
                <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-4 text-center text-destructive">
          Failed to load members. Please try again.
        </div>
      )}

      {/* Table */}
      <div className={tableContainerStyle}>
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="font-semibold text-foreground/80">Name</TableHead>
              <TableHead className="font-semibold text-foreground/80">Role</TableHead>
              <TableHead className="font-semibold text-foreground/80">Part</TableHead>
              <TableHead className="font-semibold text-foreground/80">Status</TableHead>
              <TableHead className="font-semibold text-foreground/80">Approved</TableHead>
              <TableHead className="text-right font-semibold text-foreground/80">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Loading members...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No members found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((member, index) => (
                <motion.tr
                  key={member.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="group border-border/30 hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => handleViewDetails(member)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">
                          {member.first_name?.[0]}{member.last_name?.[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{getMemberName(member)}</p>
                        <p className="text-xs text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="rounded-lg capitalize">
                      {ROLE_DISPLAY_NAMES[member.role] || member.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {member.member_part ? (
                      <Badge className={cn("rounded-lg border-0", getPartColor(member.member_part))}>
                        {MEMBER_PART_DISPLAY_NAMES[member.member_part as MemberPart] || member.member_part}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={member.is_active ? "default" : "secondary"} className={cn("rounded-lg", member.is_active ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20" : "bg-gray-500/15 text-gray-600 dark:text-gray-400")}>
                      {member.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={member.is_approved ? "default" : "secondary"} className={cn("rounded-lg", member.is_approved ? "bg-blue-500/15 text-blue-700 dark:text-blue-300" : "bg-amber-500/15 text-amber-700 dark:text-amber-300")}>
                      {member.is_approved ? "Approved" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary/10" onClick={() => handleViewDetails(member)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      {!member.is_approved && (
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-emerald-500/10 text-emerald-600" onClick={() => handleApprove(member.id)} disabled={actionLoading === member.id}>
                          {actionLoading === member.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                        </Button>
                      )}
                      {member.is_active ? (
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-red-500/10 text-red-600" onClick={() => handleDeactivate(member.id)} disabled={actionLoading === member.id}>
                          {actionLoading === member.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <PowerOff className="h-4 w-4" />}
                        </Button>
                      ) : (
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-emerald-500/10 text-emerald-600" onClick={() => handleActivate(member.id)} disabled={actionLoading === member.id}>
                          {actionLoading === member.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Power className="h-4 w-4" />}
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages} · {totalCount} total members
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="rounded-xl" onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={!hasPrevious}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          <div className="hidden sm:flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  className={cn("h-8 w-8 rounded-xl p-0", currentPage === pageNum && "bg-gradient-to-br from-primary to-primary/90")}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
          <Button variant="outline" size="sm" className="rounded-xl" onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={!hasNext}>
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Member Detail Sheet */}
      <Sheet open={!!selectedMemberId} onOpenChange={(open) => { if (!open) handleCloseSheet(); }}>
        <SheetContent className="w-full sm:max-w-[540px] p-0 border-l-border/50 bg-background/95 backdrop-blur-xl flex flex-col">
          <SheetTitle className="sr-only">Member Details</SheetTitle>
          <SheetDescription className="sr-only">View and edit member information</SheetDescription>

          {/* Sheet Header */}
          <div className="px-6 pt-6 pb-4 border-b border-border/30">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-primary/20 shadow-lg shadow-primary/5">
                  <span className="text-xl font-bold text-primary">
                    {memberDetail?.first_name?.[0]}{memberDetail?.last_name?.[0]}
                  </span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{memberDetail ? getMemberName(memberDetail) : "Loading..."}</h2>
                  <p className="text-sm text-muted-foreground">{memberDetail?.email}</p>
                  <div className="flex gap-2 mt-1">
                    {memberDetail?.member_part && (
                      <Badge className={cn("rounded-md text-xs border-0", getPartColor(memberDetail.member_part))}>
                        {MEMBER_PART_DISPLAY_NAMES[memberDetail.member_part as MemberPart] || memberDetail.member_part}
                      </Badge>
                    )}
                    <Badge variant={memberDetail?.is_active ? "default" : "secondary"} className={cn("rounded-md text-xs", memberDetail?.is_active ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" : "")}>
                      {memberDetail?.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="rounded-xl" onClick={handleCloseSheet}>
                <XIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Sheet Body */}
          <div ref={drawerContentRef} className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            {detailLoading ? (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : memberDetail && isEditing ? (
              /* ========== EDIT MODE ========== */
              <div className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground/80 mb-3 flex items-center gap-2"><User className="h-4 w-4" /> Personal Information</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-muted-foreground">First Name</Label>
                        <Input value={editData.first_name || ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditData({ ...editData, first_name: e.target.value })} className="rounded-lg mt-1" />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Last Name</Label>
                        <Input value={editData.last_name || ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditData({ ...editData, last_name: e.target.value })} className="rounded-lg mt-1" />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Phone</Label>
                      <Input value={editData.phone_number || ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditData({ ...editData, phone_number: e.target.value })} className="rounded-lg mt-1" />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Gender</Label>
                      <Select value={editData.gender || ""} onValueChange={(value: string) => setEditData({ ...editData, gender: value })}>
                        <SelectTrigger className="rounded-lg mt-1"><SelectValue placeholder="Select gender" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Date of Birth</Label>
                      <Input type="date" value={editData.date_of_birth || ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditData({ ...editData, date_of_birth: e.target.value })} className="rounded-lg mt-1" />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Address</Label>
                      <Input value={editData.address || ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditData({ ...editData, address: e.target.value })} className="rounded-lg mt-1" />
                    </div>
                  </div>
                </div>

                <Separator className="opacity-50" />

                {/* Church Information */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground/80 mb-3 flex items-center gap-2"><Church className="h-4 w-4" /> Church Information</h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Role</Label>
                      <Select value={editData.role || ""} onValueChange={(value: string) => setEditData({ ...editData, role: value as UserRole })}>
                        <SelectTrigger className="rounded-lg mt-1"><SelectValue placeholder="Select role" /></SelectTrigger>
                        <SelectContent>
                          {ROLES_LIST.map((r) => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Voice Part</Label>
                      <Select value={editData.member_part || ""} onValueChange={(value: string) => setEditData({ ...editData, member_part: value as MemberPart })}>
                        <SelectTrigger className="rounded-lg mt-1"><SelectValue placeholder="Select part" /></SelectTrigger>
                        <SelectContent>
                          {PARTS_LIST.map((p) => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Denomination</Label>
                      <Select
                        value={editData.denomination && denominations.slice(0, -1).includes(editData.denomination as (typeof denominations)[number]) ? editData.denomination : editData.denomination ? "Other" : ""}
                        onValueChange={(value: string) => {
                          if (value === "Other") {
                            setEditData({ ...editData, denomination: customDenomination || "Other" });
                          } else {
                            setEditData({ ...editData, denomination: value });
                            setCustomDenomination("");
                          }
                        }}
                      >
                        <SelectTrigger className="rounded-lg mt-1"><SelectValue placeholder="Select denomination" /></SelectTrigger>
                        <SelectContent>
                          {denominations.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      {(editData.denomination === "Other" || (editData.denomination && !denominations.slice(0, -1).includes(editData.denomination as (typeof denominations)[number]))) && (
                        <Input
                          placeholder="Enter denomination..."
                          value={customDenomination}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setCustomDenomination(e.target.value);
                            setEditData({ ...editData, denomination: e.target.value || "Other" });
                          }}
                          className="rounded-lg mt-2"
                        />
                      )}
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Join Date</Label>
                      <Input type="date" value={editData.join_date || ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditData({ ...editData, join_date: e.target.value })} className="rounded-lg mt-1" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-muted-foreground">Active</Label>
                      <Switch checked={editData.is_active ?? false} onCheckedChange={(checked: boolean) => setEditData({ ...editData, is_active: checked })} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-muted-foreground">Approved</Label>
                      <Switch checked={editData.is_approved ?? false} onCheckedChange={(checked: boolean) => setEditData({ ...editData, is_approved: checked })} />
                    </div>
                  </div>
                </div>

                <Separator className="opacity-50" />

                {/* Employment Information */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground/80 mb-3 flex items-center gap-2"><Briefcase className="h-4 w-4" /> Employment</h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Employment Status</Label>
                      <Select value={editData.employment_status || ""} onValueChange={(value: string) => setEditData({ ...editData, employment_status: value })}>
                        <SelectTrigger className="rounded-lg mt-1"><SelectValue placeholder="Select status" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="employed">Employed</SelectItem>
                          <SelectItem value="self_employed">Self-Employed</SelectItem>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="retired">Retired</SelectItem>
                          <SelectItem value="unemployed">Unemployed</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Occupation</Label>
                      <Input value={editData.occupation || ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditData({ ...editData, occupation: e.target.value })} className="rounded-lg mt-1" />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Employer</Label>
                      <Input value={editData.employer || ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditData({ ...editData, employer: e.target.value })} className="rounded-lg mt-1" />
                    </div>
                  </div>
                </div>

                <Separator className="opacity-50" />

                {/* Emergency Contact */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground/80 mb-3 flex items-center gap-2"><Heart className="h-4 w-4" /> Emergency Contact</h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Contact Name</Label>
                      <Input value={editData.emergency_contact_name || ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditData({ ...editData, emergency_contact_name: e.target.value })} className="rounded-lg mt-1" />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Relationship</Label>
                      <Input value={editData.emergency_contact_relationship || ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditData({ ...editData, emergency_contact_relationship: e.target.value })} className="rounded-lg mt-1" />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Contact Phone</Label>
                      <Input value={editData.emergency_contact_phone || ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditData({ ...editData, emergency_contact_phone: e.target.value })} className="rounded-lg mt-1" />
                    </div>
                  </div>
                </div>
              </div>
            ) : memberDetail ? (
              /* ========== VIEW MODE ========== */
              <div className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground/80 mb-3 flex items-center gap-2"><User className="h-4 w-4" /> Personal Information</h3>
                  <div className="space-y-2.5">
                    <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={memberDetail.email} />
                    <InfoRow icon={<Phone className="h-4 w-4" />} label="Phone" value={memberDetail.phone_number} />
                    <InfoRow icon={<User className="h-4 w-4" />} label="Gender" value={memberDetail.gender} />
                    <InfoRow icon={<Calendar className="h-4 w-4" />} label="Date of Birth" value={memberDetail.date_of_birth ? new Date(memberDetail.date_of_birth).toLocaleDateString() : null} />
                    <InfoRow icon={<MapPin className="h-4 w-4" />} label="Address" value={memberDetail.address} />
                  </div>
                </div>

                <Separator className="opacity-50" />

                {/* Church Information */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground/80 mb-3 flex items-center gap-2"><Church className="h-4 w-4" /> Church Information</h3>
                  <div className="space-y-2.5">
                    <InfoRow icon={<GraduationCap className="h-4 w-4" />} label="Role" value={ROLE_DISPLAY_NAMES[memberDetail.role] || memberDetail.role} />
                    <InfoRow icon={<User className="h-4 w-4" />} label="Voice Part" value={memberDetail.member_part ? (MEMBER_PART_DISPLAY_NAMES[memberDetail.member_part as MemberPart] || memberDetail.member_part) : null} />
                    <InfoRow icon={<Church className="h-4 w-4" />} label="Denomination" value={memberDetail.denomination} />
                    <InfoRow icon={<Calendar className="h-4 w-4" />} label="Join Date" value={memberDetail.join_date ? new Date(memberDetail.join_date).toLocaleDateString() : null} />
                    <div className="flex items-center justify-between py-1.5">
                      <span className="text-sm text-muted-foreground">Approved</span>
                      <Badge variant={memberDetail.is_approved ? "default" : "secondary"} className={cn("rounded-md text-xs", memberDetail.is_approved ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" : "bg-amber-500/15 text-amber-700 dark:text-amber-300")}>
                        {memberDetail.is_approved ? "Yes" : "Pending"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <Separator className="opacity-50" />

                {/* Employment Information */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground/80 mb-3 flex items-center gap-2"><Briefcase className="h-4 w-4" /> Employment</h3>
                  <div className="space-y-2.5">
                    <InfoRow icon={<Briefcase className="h-4 w-4" />} label="Status" value={memberDetail.employment_status} />
                    <InfoRow icon={<GraduationCap className="h-4 w-4" />} label="Occupation" value={memberDetail.occupation} />
                    <InfoRow icon={<Briefcase className="h-4 w-4" />} label="Employer" value={memberDetail.employer} />
                  </div>
                </div>

                <Separator className="opacity-50" />

                {/* Emergency Contact */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground/80 mb-3 flex items-center gap-2"><Heart className="h-4 w-4" /> Emergency Contact</h3>
                  <div className="space-y-2.5">
                    <InfoRow icon={<User className="h-4 w-4" />} label="Name" value={memberDetail.emergency_contact_name} />
                    <InfoRow icon={<Heart className="h-4 w-4" />} label="Relationship" value={memberDetail.emergency_contact_relationship} />
                    <InfoRow icon={<Phone className="h-4 w-4" />} label="Phone" value={memberDetail.emergency_contact_phone} />
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Sheet Footer */}
          {memberDetail && (
            <div className="px-6 py-4 border-t border-border/30 flex items-center gap-2">
              {isEditing ? (
                <>
                  <Button variant="outline" className="flex-1 rounded-xl" onClick={handleCancel} disabled={saveStatus === "saving"}>
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 rounded-xl gap-2 bg-gradient-to-br from-primary to-primary/90"
                    onClick={handleSave}
                    disabled={saveStatus === "saving"}
                  >
                    <AnimatePresence mode="wait">
                      {saveStatus === "idle" && <motion.span key="save" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2"><Save className="h-4 w-4" /> Save Changes</motion.span>}
                      {saveStatus === "saving" && <motion.span key="saving" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Saving...</motion.span>}
                      {saveStatus === "success" && <motion.span key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2"><Check className="h-4 w-4" /> Saved!</motion.span>}
                    </AnimatePresence>
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="flex-1 rounded-xl gap-2" onClick={handleEdit}>
                    <Pencil className="h-4 w-4" /> Edit
                  </Button>
                  {!memberDetail.is_approved && (
                    <Button className="flex-1 rounded-xl gap-2 bg-emerald-600 hover:bg-emerald-700" onClick={() => handleApprove(memberDetail.id)} disabled={actionLoading === memberDetail.id}>
                      {actionLoading === memberDetail.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                      Approve
                    </Button>
                  )}
                  {memberDetail.is_active ? (
                    <Button variant="destructive" className="flex-1 rounded-xl gap-2" onClick={() => handleDeactivate(memberDetail.id)} disabled={actionLoading === memberDetail.id}>
                      {actionLoading === memberDetail.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <PowerOff className="h-4 w-4" />}
                      Deactivate
                    </Button>
                  ) : (
                    <Button className="flex-1 rounded-xl gap-2 bg-emerald-600 hover:bg-emerald-700" onClick={() => handleActivate(memberDetail.id)} disabled={actionLoading === memberDetail.id}>
                      {actionLoading === memberDetail.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Power className="h-4 w-4" />}
                      Activate
                    </Button>
                  )}
                </>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

/* Helper component for view mode info rows */
function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | null | undefined }) {
  return (
    <div className="flex items-center gap-3 py-1.5">
      <span className="text-muted-foreground">{icon}</span>
      <span className="text-sm text-muted-foreground min-w-[100px]">{label}</span>
      <span className="text-sm font-medium">{value || "—"}</span>
    </div>
  );
}