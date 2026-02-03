"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Eye,
  Pencil,
  Mail,
  Phone,
  Calendar,
  Save,
  X as XIcon,
  ChevronLeft,
  ChevronRight,
  User,
  Check,
  Loader2,
  Search,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  Music,
} from "lucide-react";
import { toast } from "sonner";

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
import { Switch } from "@/components/ui/switch";
import { PremiumStatCard } from "@/components/premium-stat-card";
import { tableContainerStyle } from "@/utils/premium-styles";

import { useAdminUsers } from "@/hooks/useAdminUsers";
import { adminUserService } from "@/services/admin-user.service";
import {
  AdminUser,
  UserRole,
  MemberPart,
  ROLE_DISPLAY_NAMES,
  MEMBER_PART_DISPLAY_NAMES,
} from "@/types/admin";

// Available roles for selection
const USER_ROLES: UserRole[] = [
  "super_admin",
  "admin",
  "finance_admin",
  "attendance_officer",
  "treasurer",
  "part_leader",
  "member",
];

const MEMBER_PARTS: MemberPart[] = [
  "soprano",
  "alto",
  "tenor",
  "bass",
  "instrumentalist",
  "directorate",
];

// Helper to derive display status
function getUserStatus(user: AdminUser): "Active" | "Inactive" | "Pending" {
  if (!user.is_approved) return "Pending";
  if (!user.is_active) return "Inactive";
  return "Active";
}

// Get role badge color
const getRoleColor = (role: UserRole) => {
  switch (role) {
    case "super_admin":
      return "bg-gradient-to-br from-[#5A1E6E]/15 to-[#5A1E6E]/25 text-[#5A1E6E] dark:text-[#9F7FB8] shadow-sm shadow-[#5A1E6E]/10";
    case "admin":
      return "bg-gradient-to-br from-[#F36A21]/15 to-[#F36A21]/25 text-[#F36A21] dark:text-[#FF8F5E] shadow-sm shadow-[#F36A21]/10";
    case "finance_admin":
    case "treasurer":
      return "bg-gradient-to-br from-[#3D123F]/15 to-[#3D123F]/25 text-[#3D123F] dark:text-[#8B6B8E] shadow-sm shadow-[#3D123F]/10";
    default:
      return "bg-gradient-to-br from-gray-500/15 to-gray-600/25 text-gray-700 dark:text-gray-300 shadow-sm shadow-gray-500/10";
  }
};

export default function ManageUsers() {
  // Filters
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterRole, setFilterRole] = React.useState<string>("all");
  const [filterStatus, setFilterStatus] = React.useState<string>("all");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);

  // Build API filters
  const apiFilters = React.useMemo(() => {
    const filters: Record<string, unknown> = { page: currentPage };
    if (searchQuery) filters.search = searchQuery;
    if (filterRole !== "all") filters.role = filterRole;
    if (filterStatus === "Pending") filters.is_approved = false;
    else if (filterStatus === "Active") {
      filters.is_approved = true;
      filters.is_active = true;
    } else if (filterStatus === "Inactive") {
      filters.is_approved = true;
      filters.is_active = false;
    }
    return filters;
  }, [searchQuery, filterRole, filterStatus, currentPage]);

  // Fetch users
  const { users, totalCount, isLoading, error, mutate } = useAdminUsers(apiFilters);

  // Sheet state
  const [selectedUser, setSelectedUser] = React.useState<AdminUser | null>(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editForm, setEditForm] = React.useState<Partial<AdminUser>>({});
  const [saveStatus, setSaveStatus] = React.useState<"idle" | "saving" | "success">("idle");
  const [actionLoading, setActionLoading] = React.useState<string | null>(null);

  // Pagination
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterRole, filterStatus, itemsPerPage]);

  // Handlers
  const handleViewDetails = (user: AdminUser) => {
    setSelectedUser(user);
    setEditForm({
      first_name: user.first_name,
      last_name: user.last_name,
      phone_number: user.phone_number,
      role: user.role,
      member_part: user.member_part,
      is_active: user.is_active,
    });
    setIsEditing(false);
  };

  const handleCloseSheet = () => {
    setSelectedUser(null);
    setEditForm({});
    setIsEditing(false);
    setSaveStatus("idle");
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    if (selectedUser) {
      setEditForm({
        first_name: selectedUser.first_name,
        last_name: selectedUser.last_name,
        phone_number: selectedUser.phone_number,
        role: selectedUser.role,
        member_part: selectedUser.member_part,
        is_active: selectedUser.is_active,
      });
    }
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    if (!selectedUser) return;

    setSaveStatus("saving");
    try {
      const updatedUser = await adminUserService.updateUser(selectedUser.id, editForm);
      setSelectedUser(updatedUser);
      setSaveStatus("success");
      mutate();

      await new Promise((resolve) => setTimeout(resolve, 800));
      setIsEditing(false);
      setSaveStatus("idle");
      toast.success("User updated successfully");
    } catch (err) {
      setSaveStatus("idle");
      const message = err instanceof Error ? err.message : "Failed to update user";
      toast.error(message);
    }
  };

  const handleApproveUser = async (user: AdminUser) => {
    setActionLoading(user.id);
    try {
      await adminUserService.approveUser(user.id);
      mutate();
      toast.success(`${user.first_name} ${user.last_name} approved successfully`);
      if (selectedUser?.id === user.id) {
        setSelectedUser({ ...selectedUser, is_approved: true });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to approve user";
      toast.error(message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleActive = async (user: AdminUser) => {
    setActionLoading(user.id);
    try {
      if (user.is_active) {
        await adminUserService.deactivateUser(user.id);
        toast.success(`${user.first_name} ${user.last_name} deactivated`);
      } else {
        await adminUserService.activateUser(user.id);
        toast.success(`${user.first_name} ${user.last_name} activated`);
      }
      mutate();
      if (selectedUser?.id === user.id) {
        setSelectedUser({ ...selectedUser, is_active: !user.is_active });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update user status";
      toast.error(message);
    } finally {
      setActionLoading(null);
    }
  };

  // Stats (from current filtered view)
  const pendingCount = users.filter((u) => !u.is_approved).length;
  const activeCount = users.filter((u) => u.is_approved && u.is_active).length;
  const adminCount = users.filter((u) => u.role === "admin" || u.role === "super_admin").length;

  // Loading state
  if (isLoading && users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <p className="text-lg text-muted-foreground">Failed to load users</p>
        <Button onClick={() => mutate()} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="ml-0 md:ml-0 pl-14 md:pl-0">
          <h1 className="tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            Manage Users
          </h1>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <PremiumStatCard value={totalCount} label="Total Users" variant="primary" />
        <PremiumStatCard value={adminCount} label="Admins" variant="secondary" />
        <PremiumStatCard value={pendingCount} label="Pending" variant="gold" />
        <PremiumStatCard value={activeCount} label="Active" variant="pink" />
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-11 rounded-xl bg-background/60 backdrop-blur-sm border-border/40 focus:border-primary/40 shadow-sm"
          />
        </div>

        <div className="flex gap-3">
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-[180px] h-11 rounded-xl bg-background/60 backdrop-blur-sm border-border/40">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {USER_ROLES.map((role) => (
                <SelectItem key={role} value={role}>
                  {ROLE_DISPLAY_NAMES[role]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[140px] h-11 rounded-xl bg-background/60 backdrop-blur-sm border-border/40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div
        className={cn(
          "rounded-2xl bg-gradient-to-br from-background/60 to-background/30 backdrop-blur-sm overflow-hidden shadow-lg shadow-primary/5 flex flex-col",
          tableContainerStyle
        )}
      >
        <div
          className="overflow-x-auto overflow-y-auto"
          style={{ minHeight: "calc(100vh - 420px)", maxHeight: "calc(100vh - 420px)" }}
        >
          <Table className="table-fixed w-full">
            <TableHeader>
              <TableRow className="border-border/20 hover:bg-transparent">
                <TableHead className="h-10 px-3 md:px-6 text-[13px] font-semibold uppercase tracking-wider text-muted-foreground/90 w-[200px]">
                  Name
                </TableHead>
                <TableHead className="hidden sm:table-cell h-10 px-3 md:px-6 text-[13px] font-semibold uppercase tracking-wider text-muted-foreground/90 w-[220px]">
                  Email
                </TableHead>
                <TableHead className="h-10 px-3 md:px-6 text-[13px] font-semibold uppercase tracking-wider text-muted-foreground/90 w-[140px]">
                  Role
                </TableHead>
                <TableHead className="hidden md:table-cell h-10 px-3 md:px-6 text-[13px] font-semibold uppercase tracking-wider text-muted-foreground/90 w-[110px]">
                  Status
                </TableHead>
                <TableHead className="h-10 px-3 md:px-6 text-center text-[13px] font-semibold uppercase tracking-wider text-muted-foreground/90 w-[160px]">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                    {searchQuery || filterRole !== "all" || filterStatus !== "all"
                      ? "No users match your filters"
                      : "No users found"}
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user, index) => {
                  const status = getUserStatus(user);
                  return (
                    <TableRow
                      key={user.id}
                      className={cn(
                        "border-border/20 transition-all duration-200",
                        "hover:bg-accent/30",
                        index === users.length - 1 && "border-0"
                      )}
                    >
                      <TableCell className="py-2 px-3 md:px-6 w-[200px]">
                        <div className="font-medium text-[15px] text-foreground">
                          {user.first_name} {user.last_name}
                        </div>
                        {user.member_part && (
                          <div className="text-xs text-muted-foreground">
                            {MEMBER_PART_DISPLAY_NAMES[user.member_part]}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell py-2 px-3 md:px-6 w-[220px]">
                        <div className="text-[14px] text-muted-foreground truncate">
                          {user.email}
                        </div>
                      </TableCell>
                      <TableCell className="py-2 px-3 md:px-6 w-[140px]">
                        <div
                          className={cn(
                            "text-[13px] font-medium",
                            user.role === "super_admin" && "text-[#5A1E6E] dark:text-[#9F7FB8]",
                            user.role === "admin" && "text-[#F36A21] dark:text-[#FF8F5E]",
                            (user.role === "finance_admin" || user.role === "treasurer") &&
                              "text-[#3D123F] dark:text-[#8B6B8E]"
                          )}
                        >
                          {ROLE_DISPLAY_NAMES[user.role]}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell py-2 px-3 md:px-6 w-[110px]">
                        <div
                          className={cn(
                            "text-[13px] font-medium",
                            status === "Active" && "text-emerald-700 dark:text-emerald-400",
                            status === "Pending" && "text-[#F2B705]",
                            status === "Inactive" && "text-slate-600 dark:text-slate-400"
                          )}
                        >
                          {status}
                        </div>
                      </TableCell>
                      <TableCell className="py-2 px-3 md:px-6 w-[160px]">
                        <div className="flex items-center justify-center gap-1">
                          <motion.div whileTap={{ scale: 0.95 }}>
                            <Button
                              onClick={() => handleViewDetails(user)}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 rounded-lg hover:bg-accent/50"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </motion.div>
                          <motion.div whileTap={{ scale: 0.95 }}>
                            <Button
                              onClick={() => {
                                handleViewDetails(user);
                                setTimeout(() => setIsEditing(true), 100);
                              }}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 rounded-lg hover:bg-accent/50"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </motion.div>
                          {!user.is_approved && (
                            <motion.div whileTap={{ scale: 0.95 }}>
                              <Button
                                onClick={() => handleApproveUser(user)}
                                variant="ghost"
                                size="sm"
                                disabled={actionLoading === user.id}
                                className="h-8 px-2 rounded-lg hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              >
                                {actionLoading === user.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <>
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Approve
                                  </>
                                )}
                              </Button>
                            </motion.div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-border/20 px-6 py-3 bg-background/20">
          <div className="flex items-center gap-4">
            <div className="text-[13px] text-muted-foreground">
              Showing{" "}
              <span className="font-medium text-foreground">
                {users.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}-
                {Math.min(currentPage * itemsPerPage, totalCount)}
              </span>{" "}
              of <span className="font-medium text-foreground">{totalCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-muted-foreground">Per page:</span>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => setItemsPerPage(Number(value))}
              >
                <SelectTrigger className="w-[70px] h-8 rounded-lg text-[13px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded-xl gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="text-sm text-muted-foreground px-2">
              {currentPage} / {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="rounded-xl gap-2"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* View/Edit User Sheet */}
      <Sheet open={!!selectedUser} onOpenChange={handleCloseSheet}>
        <SheetContent className="sm:max-w-[420px] p-0 flex flex-col">
          <SheetTitle className="sr-only">
            {isEditing ? "Edit User" : "User Details"}
          </SheetTitle>
          <SheetDescription className="sr-only">
            {isEditing ? "Update user information" : "View user details"}
          </SheetDescription>

          {selectedUser && (
            <div className="flex flex-col h-full overflow-y-auto">
              {/* Header */}
              <div className="px-6 pt-8 pb-6 border-b border-border/20">
                <div className="space-y-1 mb-4">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    {selectedUser.first_name} {selectedUser.last_name}
                  </h2>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className={cn("rounded-full px-3 py-1 text-xs font-medium", getRoleColor(selectedUser.role))}>
                    {ROLE_DISPLAY_NAMES[selectedUser.role]}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium",
                      getUserStatus(selectedUser) === "Active"
                        ? "bg-gradient-to-br from-emerald-500/15 to-emerald-600/25 text-emerald-700 dark:text-emerald-400"
                        : getUserStatus(selectedUser) === "Pending"
                        ? "bg-gradient-to-br from-[#F2B705]/15 to-[#F2B705]/25 text-[#F2B705]"
                        : "bg-gradient-to-br from-slate-500/15 to-slate-600/25 text-slate-600 dark:text-slate-400"
                    )}
                  >
                    {getUserStatus(selectedUser)}
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 py-6">
                <AnimatePresence mode="wait">
                  {isEditing ? (
                    <motion.div
                      key="edit-mode"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6"
                    >
                      {/* Edit Form */}
                      <div className="space-y-4">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Basic Information
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="first_name" className="text-sm">First Name</Label>
                            <Input
                              id="first_name"
                              value={editForm.first_name || ""}
                              onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                              className="rounded-xl border-border/60"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="last_name" className="text-sm">Last Name</Label>
                            <Input
                              id="last_name"
                              value={editForm.last_name || ""}
                              onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                              className="rounded-xl border-border/60"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone_number" className="text-sm">Phone</Label>
                          <Input
                            id="phone_number"
                            value={editForm.phone_number || ""}
                            onChange={(e) => setEditForm({ ...editForm, phone_number: e.target.value })}
                            className="rounded-xl border-border/60"
                          />
                        </div>
                      </div>

                      <Separator className="bg-gradient-to-r from-transparent via-border/60 to-transparent" />

                      <div className="space-y-4">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Role & Status
                        </h3>

                        <div className="space-y-2">
                          <Label htmlFor="role" className="text-sm">User Role</Label>
                          <Select
                            value={editForm.role}
                            onValueChange={(value) => setEditForm({ ...editForm, role: value as UserRole })}
                          >
                            <SelectTrigger className="rounded-xl border-border/60">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {USER_ROLES.map((role) => (
                                <SelectItem key={role} value={role}>
                                  {ROLE_DISPLAY_NAMES[role]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="member_part" className="text-sm">Voice Part</Label>
                          <Select
                            value={editForm.member_part || "none"}
                            onValueChange={(value) => setEditForm({ ...editForm, member_part: value === "none" ? "" : value as MemberPart })}
                          >
                            <SelectTrigger className="rounded-xl border-border/60">
                              <SelectValue placeholder="Select voice part" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              {MEMBER_PARTS.map((part) => (
                                <SelectItem key={part} value={part}>
                                  {MEMBER_PART_DISPLAY_NAMES[part]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm">Active Status</Label>
                          <div className="flex items-center gap-3 rounded-xl border border-border/60 px-4 py-2.5 bg-background">
                            <Switch
                              id="is_active"
                              checked={editForm.is_active}
                              onCheckedChange={(checked) => setEditForm({ ...editForm, is_active: checked })}
                            />
                            <Label htmlFor="is_active" className="cursor-pointer text-sm">
                              {editForm.is_active ? "Active" : "Inactive"}
                            </Label>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="view-mode"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6"
                    >
                      {/* View Mode */}
                      <div className="space-y-4">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Basic Information
                        </h3>

                        <div className="space-y-4">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase">
                              <User className="h-3.5 w-3.5" />
                              Name
                            </div>
                            <div className="text-sm text-foreground pl-5.5">
                              {selectedUser.first_name} {selectedUser.last_name}
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase">
                              <Mail className="h-3.5 w-3.5" />
                              Email
                            </div>
                            <div className="text-sm text-foreground pl-5.5">{selectedUser.email}</div>
                          </div>

                          {selectedUser.phone_number && (
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase">
                                <Phone className="h-3.5 w-3.5" />
                                Phone
                              </div>
                              <div className="text-sm text-foreground pl-5.5">{selectedUser.phone_number}</div>
                            </div>
                          )}

                          {selectedUser.member_part && (
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase">
                                <Music className="h-3.5 w-3.5" />
                                Voice Part
                              </div>
                              <div className="text-sm text-foreground pl-5.5">
                                {MEMBER_PART_DISPLAY_NAMES[selectedUser.member_part]}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <Separator className="bg-gradient-to-r from-transparent via-border/60 to-transparent" />

                      <div className="space-y-4">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Role & Status
                        </h3>

                        <div className="space-y-4">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase">
                              <Shield className="h-3.5 w-3.5" />
                              Role
                            </div>
                            <div className="text-sm text-foreground pl-5.5">
                              {ROLE_DISPLAY_NAMES[selectedUser.role]}
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase">
                              <User className="h-3.5 w-3.5" />
                              Status
                            </div>
                            <div className="text-sm text-foreground pl-5.5">
                              {getUserStatus(selectedUser)}
                              {!selectedUser.is_approved && (
                                <span className="text-xs text-muted-foreground ml-2">(Awaiting approval)</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator className="bg-gradient-to-r from-transparent via-border/60 to-transparent" />

                      <div className="space-y-4">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Activity
                        </h3>

                        <div className="space-y-4">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase">
                              <Calendar className="h-3.5 w-3.5" />
                              Joined
                            </div>
                            <div className="text-sm text-foreground pl-5.5">
                              {new Date(selectedUser.created_at).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </div>
                          </div>

                          {selectedUser.last_login_at && (
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase">
                                <Clock className="h-3.5 w-3.5" />
                                Last Login
                              </div>
                              <div className="text-sm text-foreground pl-5.5">
                                {new Date(selectedUser.last_login_at).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Quick Actions */}
                      {!selectedUser.is_approved && (
                        <>
                          <Separator className="bg-gradient-to-r from-transparent via-border/60 to-transparent" />
                          <div className="space-y-4">
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                              Quick Actions
                            </h3>
                            <Button
                              onClick={() => handleApproveUser(selectedUser)}
                              disabled={actionLoading === selectedUser.id}
                              className="w-full gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                              {actionLoading === selectedUser.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <CheckCircle className="h-4 w-4" />
                              )}
                              Approve User
                            </Button>
                          </div>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="border-t border-border/20 px-6 py-4">
                <AnimatePresence mode="wait">
                  {isEditing ? (
                    <motion.div
                      key="edit-buttons"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
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
                          onClick={handleSaveEdit}
                          disabled={saveStatus !== "idle"}
                          className={cn(
                            "w-full gap-2 rounded-xl shadow-lg",
                            saveStatus === "success"
                              ? "bg-gradient-to-br from-emerald-600 to-emerald-700"
                              : "bg-gradient-to-br from-primary to-primary/90"
                          )}
                        >
                          {saveStatus === "idle" && (
                            <>
                              <Save className="h-4 w-4" />
                              Save
                            </>
                          )}
                          {saveStatus === "saving" && (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          )}
                          {saveStatus === "success" && (
                            <>
                              <Check className="h-4 w-4" />
                              Saved!
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="view-button"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      whileTap={{ scale: 0.96 }}
                      className="w-full"
                    >
                      <Button
                        onClick={handleEditClick}
                        className="w-full gap-2 rounded-xl shadow-lg shadow-primary/10 bg-gradient-to-br from-primary to-primary/90"
                      >
                        <Pencil className="h-4 w-4" />
                        Edit User
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}