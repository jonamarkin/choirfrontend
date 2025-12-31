"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Eye,
  Pencil,
  UserPlus,
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
  SheetHeader,
  SheetTitle,
  SheetClose,
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
import { PremiumBadge } from "@/components/premium-badge";
import {
  tableContainerStyle,
  tableHeaderRowStyle,
  tableHeaderCellStyle,
  paginationActiveStyle,
  paginationInactiveStyle,
  buttonStyles,
  gradientTextStyles,
} from "@/utils/premium-styles";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "Super Admin" | "Administrator" | "Financial Controller" | "Treasurer" | "Member";
  status: "Active" | "Inactive" | "Pending";
  dateAdded: string;
  lastLogin?: string;
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.j@vocalessence.org",
    phone: "+1 (555) 123-4567",
    role: "Super Admin",
    status: "Active",
    dateAdded: "2020-01-15",
    lastLogin: "2024-12-27",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.c@vocalessence.org",
    phone: "+1 (555) 234-5678",
    role: "Administrator",
    status: "Active",
    dateAdded: "2020-03-22",
    lastLogin: "2024-12-26",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.r@vocalessence.org",
    phone: "+1 (555) 345-6789",
    role: "Financial Controller",
    status: "Active",
    dateAdded: "2021-09-10",
    lastLogin: "2024-12-25",
  },
  {
    id: "4",
    name: "David Thompson",
    email: "david.t@vocalessence.org",
    phone: "+1 (555) 456-7890",
    role: "Treasurer",
    status: "Active",
    dateAdded: "2019-11-05",
    lastLogin: "2024-12-24",
  },
  {
    id: "5",
    name: "Jessica Martinez",
    email: "jessica.m@vocalessence.org",
    phone: "+1 (555) 567-8901",
    role: "Financial Controller",
    status: "Active",
    dateAdded: "2022-01-20",
    lastLogin: "2024-12-23",
  },
  {
    id: "6",
    name: "Robert Wilson",
    email: "robert.w@vocalessence.org",
    phone: "+1 (555) 678-9012",
    role: "Treasurer",
    status: "Inactive",
    dateAdded: "2021-06-12",
    lastLogin: "2024-10-15",
  },
  {
    id: "7",
    name: "Jennifer Adams",
    email: "jennifer.adams@gmail.com",
    phone: "+1 (555) 789-1234",
    role: "Member",
    status: "Pending",
    dateAdded: "2024-12-27",
  },
  {
    id: "8",
    name: "Thomas Brown",
    email: "thomas.brown@yahoo.com",
    phone: "+1 (555) 890-2345",
    role: "Member",
    status: "Pending",
    dateAdded: "2024-12-26",
  },
];

const userRoles = ["Super Admin", "Administrator", "Financial Controller", "Treasurer", "Member"] as const;

const ITEMS_PER_PAGE = 8;

// Helper function to get role colors
const getRoleColor = (role: User["role"]) => {
  switch (role) {
    case "Super Admin":
      return "bg-gradient-to-br from-[#5A1E6E]/15 to-[#5A1E6E]/25 text-[#5A1E6E] dark:text-[#9F7FB8] shadow-sm shadow-[#5A1E6E]/10";
    case "Administrator":
      return "bg-gradient-to-br from-[#F36A21]/15 to-[#F36A21]/25 text-[#F36A21] dark:text-[#FF8F5E] shadow-sm shadow-[#F36A21]/10";
    case "Financial Controller":
      return "bg-gradient-to-br from-[#3D123F]/15 to-[#3D123F]/25 text-[#3D123F] dark:text-[#8B6B8E] shadow-sm shadow-[#3D123F]/10";
    case "Treasurer":
      return "bg-gradient-to-br from-gray-500/15 to-gray-600/25 text-gray-700 dark:text-gray-300 shadow-sm shadow-gray-500/10";
    case "Member":
      return "bg-gradient-to-br from-gray-500/15 to-gray-600/25 text-gray-700 dark:text-gray-300 shadow-sm shadow-gray-500/10";
    default:
      return "bg-gradient-to-br from-gray-500/15 to-gray-600/25 text-gray-700 dark:text-gray-300 shadow-sm shadow-gray-500/10";
  }
};

export default function ManageUsers() {
  const [users, setUsers] = React.useState<User[]>(mockUsers);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedUser, setEditedUser] = React.useState<User | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [saveStatus, setSaveStatus] = React.useState<"idle" | "saving" | "success">("idle");
  const [itemsPerPage, setItemsPerPage] = React.useState(10);

  // Search and filter states
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterRole, setFilterRole] = React.useState<string>("all");
  const [filterStatus, setFilterStatus] = React.useState<string>("all");

  // Add user state
  const [isAddingUser, setIsAddingUser] = React.useState(false);
  const [newUser, setNewUser] = React.useState<User>({
    id: "",
    name: "",
    email: "",
    phone: "",
    role: "Treasurer",
    status: "Active",
    dateAdded: new Date().toISOString().split("T")[0],
    lastLogin: "",
  });

  // Ref for the scrollable drawer content
  const drawerContentRef = React.useRef<HTMLDivElement>(null);
  const addUserContentRef = React.useRef<HTMLDivElement>(null);

  // Reset scroll position when drawer opens or mode changes
  React.useEffect(() => {
    if (selectedUser && drawerContentRef.current) {
      const timeoutId = setTimeout(() => {
        if (drawerContentRef.current) {
          drawerContentRef.current.scrollTop = 0;
        }
      }, 0);

      return () => clearTimeout(timeoutId);
    }
  }, [selectedUser?.id, isEditing]);

  // Filter and search users
  const filteredUsers = React.useMemo(() => {
    return users.filter((user) => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        searchQuery === "" ||
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.phone?.toLowerCase().includes(searchLower) ||
        user.role.toLowerCase().includes(searchLower);

      // Role filter
      const matchesRole = filterRole === "all" || user.role === filterRole;

      // Status filter
      const matchesStatus =
        filterStatus === "all" || user.status === filterStatus;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, filterRole, filterStatus]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  // Reset to page 1 when items per page changes or filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage, searchQuery, filterRole, filterStatus]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setFilterRole("all");
    setFilterStatus("all");
  };

  const hasActiveFilters =
    searchQuery !== "" ||
    filterRole !== "all" ||
    filterStatus !== "all";

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setEditedUser({ ...user });
    setIsEditing(false);
  };

  const handleCloseSheet = () => {
    setSelectedUser(null);
    setEditedUser(null);
    setIsEditing(false);
    setSaveStatus("idle");
  };

  const handleEditClick = () => {
    setIsEditing(true);
    if (selectedUser) {
      setEditedUser({ ...selectedUser });
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (selectedUser) {
      setEditedUser({ ...selectedUser });
    }
  };

  const handleSaveEdit = async () => {
    if (!editedUser) return;

    setSaveStatus("saving");

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Update the user in the list
    setUsers((prev) =>
      prev.map((user) => (user.id === editedUser.id ? editedUser : user))
    );
    setSelectedUser(editedUser);
    setSaveStatus("success");

    // Wait a bit to show success, then exit edit mode
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsEditing(false);
    setSaveStatus("idle");
  };

  const handleOpenAddUser = () => {
    setIsAddingUser(true);
    setNewUser({
      id: "",
      name: "",
      email: "",
      phone: "",
      role: "Treasurer",
      status: "Active",
      dateAdded: new Date().toISOString().split("T")[0],
      lastLogin: "",
    });
  };

  const handleCloseAddUser = () => {
    setIsAddingUser(false);
    setNewUser({
      id: "",
      name: "",
      email: "",
      phone: "",
      role: "Treasurer",
      status: "Active",
      dateAdded: new Date().toISOString().split("T")[0],
      lastLogin: "",
    });
    setSaveStatus("idle");
  };

  const handleAddUser = async () => {
    if (newUser.name.trim() === "" || newUser.email.trim() === "") {
      return;
    }

    setSaveStatus("saving");

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Generate new ID
    const newId = (Math.max(...users.map((u) => parseInt(u.id))) + 1).toString();

    // Add user to list
    const userToAdd = { ...newUser, id: newId };
    setUsers((prev) => [...prev, userToAdd]);

    setSaveStatus("success");

    // Wait a bit to show success, then close
    await new Promise((resolve) => setTimeout(resolve, 800));
    handleCloseAddUser();
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="ml-0 md:ml-0 pl-14 md:pl-0">
          <h1 className="tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">Manage Users</h1>
        </div>
        <motion.div whileTap={{ scale: 0.96 }}>
          <Button
            onClick={handleOpenAddUser}
            className="gap-2 rounded-xl shadow-lg shadow-primary/10 bg-gradient-to-br from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
          >
            <UserPlus className="h-4 w-4" />
            Add User
          </Button>
        </motion.div>
      </div>

      {/* Stats Cards - Ultra Minimal */}
      <div className="grid gap-6 md:grid-cols-4">
        <PremiumStatCard
          value={filteredUsers.length}
          label="Total Users"
          variant="primary"
        />
        <PremiumStatCard
          value={filteredUsers.filter((u) => u.role === "Super Admin" || u.role === "Administrator").length}
          label="Admins"
          variant="secondary"
        />
        <PremiumStatCard
          value={filteredUsers.filter((u) => u.status === "Pending").length}
          label="Pending"
          variant="gold"
        />
        <PremiumStatCard
          value={filteredUsers.filter((u) => u.status === "Active").length}
          label="Active"
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
            placeholder="Search by name, email, phone, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-4 h-9 rounded-xl bg-background/60 backdrop-blur-sm border-border/40 focus:border-primary/40 shadow-sm"
          />
        </div>

        {/* Filter Options */}
        <div className="flex gap-3">
          <Select value={filterRole} onValueChange={(value) => setFilterRole(value)}>
            <SelectTrigger className="w-[200px] h-9 rounded-xl bg-background/60 backdrop-blur-sm border-border/40">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="Super Admin">Super Admin</SelectItem>
              <SelectItem value="Administrator">Administrator</SelectItem>
              <SelectItem value="Financial Controller">Financial Controller</SelectItem>
              <SelectItem value="Treasurer">Treasurer</SelectItem>
              <SelectItem value="Member">Member</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value)}>
            <SelectTrigger className="w-[140px] h-9 rounded-xl bg-background/60 backdrop-blur-sm border-border/40">
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

      {/* Premium Minimal Table */}
      <div
        className={cn(
          "rounded-2xl bg-gradient-to-br from-background/60 to-background/30 backdrop-blur-sm overflow-hidden shadow-lg shadow-primary/5 flex flex-col",
          tableContainerStyle
        )}
      >
        <div
          className="overflow-x-auto overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-muted/20 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-primary/30 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-primary/40"
          style={{ minHeight: "calc(100vh - 370px)", maxHeight: "calc(100vh - 370px)" }}
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
                <TableHead className="h-10 px-3 md:px-6 text-center text-[13px] font-semibold uppercase tracking-wider text-muted-foreground/90 w-[140px]">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody style={{ minHeight: `${itemsPerPage * 40}px` }}>
              {currentUsers.map((user, index) => (
                <TableRow
                  key={user.id}
                  className={cn(
                    "border-border/20 transition-all duration-200",
                    "hover:bg-accent/30",
                    index === currentUsers.length - 1 && "border-0"
                  )}
                >
                  <TableCell className="py-1.5 px-3 md:px-6 w-[200px]">
                    <div className="font-medium text-[15px] text-foreground">
                      {user.name}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell py-1.5 px-3 md:px-6 w-[220px]">
                    <div className="text-[14px] text-muted-foreground">
                      {user.email}
                    </div>
                  </TableCell>
                  <TableCell className="py-1.5 px-3 md:px-6 w-[140px]">
                    <div
                      className={cn(
                        "text-[13px] font-medium",
                        user.role === "Super Admin" && "text-[#5A1E6E] dark:text-[#9F7FB8]",
                        user.role === "Administrator" && "text-[#F36A21] dark:text-[#FF8F5E]",
                        user.role === "Financial Controller" && "text-[#3D123F] dark:text-[#8B6B8E]",
                        user.role === "Treasurer" && "text-gray-700 dark:text-gray-300"
                      )}
                    >
                      {user.role}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell py-1.5 px-3 md:px-6 w-[110px]">
                    <div
                      className={cn(
                        "text-[13px] font-medium",
                        user.status === "Active" && "text-emerald-700 dark:text-emerald-400",
                        user.status === "Pending" && "text-[#F2B705]",
                        user.status === "Inactive" && "text-slate-600 dark:text-slate-400"
                      )}
                    >
                      {user.status}
                    </div>
                  </TableCell>
                  <TableCell className="py-1.5 px-3 md:px-6 w-[140px]">
                    <div className="flex items-center justify-center gap-2">
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
                            setSelectedUser(user);
                            setEditedUser({ ...user });
                            setIsEditing(true);
                          }}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-lg hover:bg-accent/50"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    </div>
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
                {filteredUsers.length === 0 ? 0 : startIndex + 1}-{Math.min(endIndex, filteredUsers.length)}
              </span>{" "}
              of <span className="font-medium text-foreground">{filteredUsers.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-muted-foreground">Items per page:</span>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => setItemsPerPage(Number(value))}
              >
                <SelectTrigger className="w-[80px] h-8 rounded-lg text-[13px] bg-transparent hover:bg-transparent dark:bg-transparent dark:hover:bg-transparent">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
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
                (page) => {
                  // Show first page, last page, current page, and pages around current
                  const showPage =
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1);

                  if (!showPage) {
                    // Show ellipsis
                    if (page === currentPage - 2 || page === currentPage + 2) {
                      return (
                        <span
                          key={page}
                          className="px-2 text-sm text-muted-foreground"
                        >
                          ...
                        </span>
                      );
                    }
                    return null;
                  }

                  return (
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
                  );
                }
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

      {/* View/Edit User Drawer */}
      <Sheet open={!!selectedUser} onOpenChange={handleCloseSheet}>
        <SheetContent className="sm:max-w-[380px] p-0 flex flex-col">
          {/* Visually hidden but accessible title and description */}
          <SheetTitle className="sr-only">
            {isEditing ? "Edit User" : "User Details"}
          </SheetTitle>
          <SheetDescription className="sr-only">
            {isEditing
              ? "Update user information and save changes"
              : "View detailed information about this user"}
          </SheetDescription>

          {editedUser && (
            <div ref={drawerContentRef} className="flex flex-col h-full overflow-y-auto">
              {/* Header Section */}
              <div className="px-6 pt-8 pb-6 border-b border-border/20">
                {/* User Name and Email */}
                <div className="space-y-1 mb-4">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    {editedUser.name}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {editedUser.email}
                  </p>
                </div>

                {/* Status Badges */}
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="secondary"
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium",
                      getRoleColor(editedUser.role)
                    )}
                  >
                    {editedUser.role}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium",
                      editedUser.status === "Active"
                        ? "bg-gradient-to-br from-emerald-500/15 to-emerald-600/25 text-emerald-700 dark:text-emerald-400 shadow-sm shadow-emerald-500/10"
                        : editedUser.status === "Pending"
                        ? "bg-gradient-to-br from-[#F2B705]/15 to-[#F2B705]/25 text-[#F2B705] shadow-sm shadow-[#F2B705]/10"
                        : "bg-gradient-to-br from-slate-500/15 to-slate-600/25 text-slate-600 dark:text-slate-400 shadow-sm shadow-slate-500/10"
                    )}
                  >
                    {editedUser.status}
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
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      {/* Edit Mode */}
                      <div className="space-y-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
                          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Basic Information
                          </h3>

                          <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm">Full Name</Label>
                            <Input
                              id="name"
                              value={editedUser.name}
                              onChange={(e) =>
                                setEditedUser({ ...editedUser, name: e.target.value })
                              }
                              className="rounded-xl border-border/60"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={editedUser.email}
                              onChange={(e) =>
                                setEditedUser({ ...editedUser, email: e.target.value })
                              }
                              className="rounded-xl border-border/60"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="phone" className="text-sm">Phone</Label>
                            <Input
                              id="phone"
                              value={editedUser.phone || ""}
                              onChange={(e) =>
                                setEditedUser({ ...editedUser, phone: e.target.value })
                              }
                              className="rounded-xl border-border/60"
                            />
                          </div>
                        </div>

                        <Separator className="bg-gradient-to-r from-transparent via-border/60 to-transparent" />

                        {/* Role & Status */}
                        <div className="space-y-4">
                          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Role & Status
                          </h3>

                          <div className="space-y-2">
                            <Label htmlFor="role" className="text-sm">User Role</Label>
                            <Select
                              value={editedUser.role}
                              onValueChange={(value) =>
                                setEditedUser({
                                  ...editedUser,
                                  role: value as User["role"],
                                })
                              }
                            >
                              <SelectTrigger className="rounded-xl border-border/60">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {userRoles.map((role) => (
                                  <SelectItem key={role} value={role}>
                                    {role}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="status" className="text-sm">Status</Label>
                            <div className="flex items-center gap-3 rounded-xl border border-border/60 px-4 py-2.5 bg-background">
                              <Switch
                                id="status"
                                checked={editedUser.status === "Active"}
                                onCheckedChange={(checked) =>
                                  setEditedUser({
                                    ...editedUser,
                                    status: checked ? "Active" : "Inactive",
                                  })
                                }
                              />
                              <Label htmlFor="status" className="cursor-pointer text-sm">
                                {editedUser.status}
                              </Label>
                            </div>
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
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      {/* View Mode */}
                      <div className="space-y-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
                          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Basic Information
                          </h3>

                          <div className="space-y-4">
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                <User className="h-3.5 w-3.5" />
                                Name
                              </div>
                              <div className="text-sm text-foreground pl-5.5">
                                {editedUser.name}
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                <Mail className="h-3.5 w-3.5" />
                                Email
                              </div>
                              <div className="text-sm text-foreground pl-5.5">
                                {editedUser.email}
                              </div>
                            </div>

                            {editedUser.phone && (
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                  <Phone className="h-3.5 w-3.5" />
                                  Phone
                                </div>
                                <div className="text-sm text-foreground pl-5.5">
                                  {editedUser.phone}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <Separator className="bg-gradient-to-r from-transparent via-border/60 to-transparent" />

                        {/* Role & Status */}
                        <div className="space-y-4">
                          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Role & Status
                          </h3>

                          <div className="space-y-4">
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                <Shield className="h-3.5 w-3.5" />
                                Role
                              </div>
                              <div className="text-sm text-foreground pl-5.5">
                                {editedUser.role}
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                <User className="h-3.5 w-3.5" />
                                Status
                              </div>
                              <div className="text-sm text-foreground pl-5.5">
                                {editedUser.status}
                              </div>
                            </div>
                          </div>
                        </div>

                        <Separator className="bg-gradient-to-r from-transparent via-border/60 to-transparent" />

                        {/* Activity Information */}
                        <div className="space-y-4">
                          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Activity
                          </h3>

                          <div className="space-y-4">
                            {editedUser && (
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                  <Calendar className="h-3.5 w-3.5" />
                                  Date Added
                                </div>
                                <div className="text-sm text-foreground pl-5.5">
                                  {new Date(editedUser.dateAdded).toLocaleDateString(
                                    "en-US",
                                    {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    }
                                  )}
                                </div>
                              </div>
                            )}

                            {editedUser?.lastLogin && (
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                  <Clock className="h-3.5 w-3.5" />
                                  Last Login
                                </div>
                                <div className="text-sm text-foreground pl-5.5">
                                  {new Date(editedUser.lastLogin).toLocaleDateString(
                                    "en-US",
                                    {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    }
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
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
                          onClick={handleSaveEdit}
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
                                    delay: 0.1 
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
                        onClick={handleEditClick}
                        className="w-full gap-2 rounded-xl shadow-lg shadow-primary/10 bg-gradient-to-br from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
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

      {/* Add User Drawer */}
      <Sheet open={isAddingUser} onOpenChange={handleCloseAddUser}>
        <SheetContent className="sm:max-w-[380px] p-0 flex flex-col">
          <SheetTitle className="sr-only">Add New User</SheetTitle>
          <SheetDescription className="sr-only">
            Add a new user account for the portal
          </SheetDescription>

          <div ref={addUserContentRef} className="flex flex-col h-full overflow-y-auto">
            {/* Header Section */}
            <div className="px-6 pt-8 pb-6 border-b border-border/20">
              <h2 className="text-2xl font-semibold tracking-tight">Add New User</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Create a new user account for the portal
              </p>
            </div>

            {/* Content Section */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Basic Information
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="new-name" className="text-sm">Full Name *</Label>
                    <Input
                      id="new-name"
                      value={newUser.name}
                      onChange={(e) =>
                        setNewUser({ ...newUser, name: e.target.value })
                      }
                      placeholder="Enter full name"
                      className="rounded-xl border-border/60"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-email" className="text-sm">Email *</Label>
                    <Input
                      id="new-email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) =>
                        setNewUser({ ...newUser, email: e.target.value })
                      }
                      placeholder="user@vocalessence.org"
                      className="rounded-xl border-border/60"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-phone" className="text-sm">Phone</Label>
                    <Input
                      id="new-phone"
                      value={newUser.phone}
                      onChange={(e) =>
                        setNewUser({ ...newUser, phone: e.target.value })
                      }
                      placeholder="+1 (555) 123-4567"
                      className="rounded-xl border-border/60"
                    />
                  </div>
                </div>

                <Separator className="bg-gradient-to-r from-transparent via-border/60 to-transparent" />

                {/* Role & Status */}
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Role & Status
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="new-role" className="text-sm">User Role</Label>
                    <Select
                      value={newUser.role}
                      onValueChange={(value) =>
                        setNewUser({ ...newUser, role: value as User["role"] })
                      }
                    >
                      <SelectTrigger className="rounded-xl border-border/60">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {userRoles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-status" className="text-sm">Status</Label>
                    <div className="flex items-center gap-3 rounded-xl border border-border/60 px-4 py-2.5 bg-background">
                      <Switch
                        id="new-status"
                        checked={newUser.status === "Active"}
                        onCheckedChange={(checked) =>
                          setNewUser({
                            ...newUser,
                            status: checked ? "Active" : "Inactive",
                          })
                        }
                      />
                      <Label htmlFor="new-status" className="cursor-pointer text-sm">
                        {newUser.status}
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="border-t border-border/20 px-6 py-4 bg-muted/10">
              <div className="flex gap-3">
                <motion.div whileTap={{ scale: 0.96 }} className="flex-1">
                  <Button
                    onClick={handleCloseAddUser}
                    variant="outline"
                    className="w-full rounded-xl border-border/60 hover:bg-muted/50"
                    disabled={saveStatus === "saving"}
                  >
                    Cancel
                  </Button>
                </motion.div>
                <motion.div whileTap={{ scale: 0.96 }} className="flex-1">
                  <Button
                    onClick={handleAddUser}
                    className="w-full gap-2 rounded-xl bg-gradient-to-br from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/10"
                    disabled={
                      saveStatus === "saving" ||
                      !newUser.name.trim() ||
                      !newUser.email.trim()
                    }
                  >
                    {saveStatus === "saving" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : saveStatus === "success" ? (
                      <>
                        <Check className="h-4 w-4" />
                        Added!
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4" />
                        Add User
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