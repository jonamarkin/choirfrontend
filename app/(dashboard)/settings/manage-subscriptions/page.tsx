"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus,
  Eye,
  Pencil,
  Calendar,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  Check,
  Save,
  Loader2,
  X as XIcon,
  Users,
} from "lucide-react";

import { cn } from "@/components/ui/utils";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PremiumStatCard } from "@/components/premium-stat-card";
import {
  tableContainerStyle,
  paginationActiveStyle,
  paginationInactiveStyle,
} from "@/utils/premium-styles";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  amount: number;
  startDate: string;
  endDate: string;
  status: "Active" | "Upcoming" | "Expired";
  memberCount: number;
  createdAt: string;
  memberType: "Executive" | "Members" | "Both";
}

const mockPlans: SubscriptionPlan[] = [
  {
    id: "PLAN001",
    name: "Annual Subscription 2025",
    description: "Annual membership for 2025 calendar year",
    amount: 150.00,
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    status: "Active",
    memberCount: 45,
    createdAt: "2024-11-15",
    memberType: "Both",
  },
  {
    id: "PLAN002",
    name: "Annual Subscription 2024",
    description: "Annual membership for 2024 calendar year",
    amount: 120.00,
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    status: "Expired",
    memberCount: 52,
    createdAt: "2023-11-20",
    memberType: "Both",
  },
  {
    id: "PLAN003",
    name: "Summer Session 2025",
    description: "Summer performance season membership",
    amount: 75.00,
    startDate: "2025-06-01",
    endDate: "2025-08-31",
    status: "Upcoming",
    memberCount: 0,
    createdAt: "2024-12-10",
    memberType: "Both",
  },
];

function StatusBadge({ status }: { status: SubscriptionPlan["status"] }) {
  const colors = {
    Active: "text-[#16a34a]",
    Upcoming: "text-[#F2B705]",
    Expired: "text-[#94a3b8]",
  };

  return (
    <span className={cn("text-sm font-medium", colors[status])}>
      {status}
    </span>
  );
}

export default function ManageSubscriptionPlans() {
  const [selectedPlan, setSelectedPlan] = React.useState<SubscriptionPlan | null>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [isAddingPlan, setIsAddingPlan] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);
  const [saveStatus, setSaveStatus] = React.useState<"idle" | "saving" | "success">("idle");

  // Form state for editing existing plans
  const [editedPlan, setEditedPlan] = React.useState<SubscriptionPlan | null>(null);
  
  // Form state for adding new plan
  const [newPlan, setNewPlan] = React.useState<SubscriptionPlan>({
    id: "",
    name: "",
    description: "",
    amount: 0,
    startDate: "",
    endDate: "",
    status: "Active",
    memberCount: 0,
    createdAt: new Date().toISOString().split('T')[0],
    memberType: "Both",
  });

  const handleViewDetails = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setEditedPlan(plan);
    setIsEditing(false);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setIsEditing(false);
    setTimeout(() => {
      setSelectedPlan(null);
      setEditedPlan(null);
    }, 300);
  };

  const handleOpenAddPlan = () => {
    setNewPlan({
      id: "",
      name: "",
      description: "",
      amount: 0,
      startDate: "",
      endDate: "",
      status: "Active",
      memberCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      memberType: "Both",
    });
    setSaveStatus("idle");
    setIsAddingPlan(true);
  };

  const handleCloseAddPlan = () => {
    setIsAddingPlan(false);
    setNewPlan({
      id: "",
      name: "",
      description: "",
      amount: 0,
      startDate: "",
      endDate: "",
      status: "Active",
      memberCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      memberType: "Both",
    });
    setSaveStatus("idle");
  };

  const handleAddPlan = async () => {
    if (newPlan.name.trim() === "") {
      return;
    }

    setSaveStatus("saving");
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Generate new ID
    const newId = `PLAN${(mockPlans.length + 1).toString().padStart(3, '0')}`;
    
    // Add plan to list (in real app, this would update the backend)
    const planToAdd = { ...newPlan, id: newId };
    console.log("Adding plan:", planToAdd);
    
    setSaveStatus("success");
    
    // Wait a bit to show success, then close
    await new Promise((resolve) => setTimeout(resolve, 800));
    handleCloseAddPlan();
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (isAddingPlan) {
      handleCloseDrawer();
      setIsAddingPlan(false);
    } else {
      setEditedPlan(selectedPlan);
      setIsEditing(false);
    }
  };

  const handleSave = async () => {
    if (editedPlan) {
      // Set to saving state
      setSaveStatus("saving");
      
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Update the plan
      console.log("Saving plan:", editedPlan);
      setSelectedPlan(editedPlan);
      
      // Set to success state
      setSaveStatus("success");
      
      // Wait a bit to show success state, then close edit mode
      await new Promise((resolve) => setTimeout(resolve, 800));
      setIsEditing(false);
      setSaveStatus("idle");
      
      // If adding a new plan, close the drawer
      if (isAddingPlan) {
        setIsAddingPlan(false);
        handleCloseDrawer();
      }
    }
  };

  // Filter plans
  const filteredPlans = mockPlans.filter((plan) => {
    const matchesSearch =
      plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPlans.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPlans = filteredPlans.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const activePlans = mockPlans.filter((p) => p.status === "Active").length;
  const upcomingPlans = mockPlans.filter((p) => p.status === "Upcoming").length;
  const expiredPlans = mockPlans.filter((p) => p.status === "Expired").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="ml-0 md:ml-0 pl-14 md:pl-0">
          <h1 className="tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            Manage Subscription Plans
          </h1>
        </div>
        <motion.div whileTap={{ scale: 0.96 }}>
          <Button
            onClick={handleOpenAddPlan}
            className="gap-2 rounded-xl shadow-lg shadow-[#5A1E6E]/10 bg-gradient-to-br from-[#5A1E6E] to-[#3D123F] hover:from-[#5A1E6E]/90 hover:to-[#3D123F]/90"
          >
            <Plus className="h-4 w-4" />
            Create Plan
          </Button>
        </motion.div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <PremiumStatCard
          value={mockPlans.length}
          label="Total Plans"
          variant="primary"
        />
        <PremiumStatCard
          value={activePlans}
          label="Active"
          variant="green"
        />
        <PremiumStatCard
          value={upcomingPlans}
          label="Upcoming"
          variant="gold"
        />
        <PremiumStatCard
          value={expiredPlans}
          label="Expired"
          variant="pink"
        />
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by plan name, description, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-11 rounded-xl border-border/40 bg-background/40 backdrop-blur-sm focus-visible:ring-[#5A1E6E]/20"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
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
          className="overflow-x-auto overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-muted/20 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-primary/30 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-primary/40"
          style={{ minHeight: "calc(100vh - 370px)", maxHeight: "calc(100vh - 370px)" }}
        >
          <Table className="table-fixed w-full">
            <TableHeader>
              <TableRow className="border-border/20 hover:bg-transparent">
                <TableHead className="h-10 px-3 md:px-6 text-[13px] font-semibold uppercase tracking-wider text-muted-foreground/90 w-[130px]">
                  ID
                </TableHead>
                <TableHead className="h-10 px-3 md:px-6 text-[13px] font-semibold uppercase tracking-wider text-muted-foreground/90 w-[250px]">
                  Plan Name
                </TableHead>
                <TableHead className="h-10 px-3 md:px-6 text-[13px] font-semibold uppercase tracking-wider text-muted-foreground/90 w-[120px]">
                  Status
                </TableHead>
                <TableHead className="hidden sm:table-cell h-10 px-3 md:px-6 text-[13px] font-semibold uppercase tracking-wider text-muted-foreground/90 w-[140px]">
                  Start Date
                </TableHead>
                <TableHead className="hidden md:table-cell h-10 px-3 md:px-6 text-[13px] font-semibold uppercase tracking-wider text-muted-foreground/90 w-[140px]">
                  End Date
                </TableHead>
                <TableHead className="h-10 px-3 md:px-6 text-[13px] font-semibold uppercase tracking-wider text-muted-foreground/90 w-[120px]">
                  Amount
                </TableHead>
                <TableHead className="h-10 px-3 md:px-6 text-center text-[13px] font-semibold uppercase tracking-wider text-muted-foreground/90 w-[180px]">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody style={{ minHeight: `${itemsPerPage * 40}px` }}>
              {currentPlans.map((plan, index) => (
                <TableRow
                  key={plan.id}
                  className={cn(
                    "border-border/20 transition-all duration-200",
                    "hover:bg-accent/30",
                    index === currentPlans.length - 1 && "border-0"
                  )}
                >
                  <TableCell className="py-1.5 px-3 md:px-6 w-[130px]">
                    <div className="font-mono text-sm text-muted-foreground">
                      {plan.id}
                    </div>
                  </TableCell>
                  <TableCell className="py-1.5 px-3 md:px-6 w-[250px]">
                    <div className="font-medium text-[15px] text-foreground">
                      {plan.name}
                    </div>
                  </TableCell>
                  <TableCell className="py-1.5 px-3 md:px-6 w-[120px]">
                    <StatusBadge status={plan.status} />
                  </TableCell>
                  <TableCell className="hidden sm:table-cell py-1.5 px-3 md:px-6 w-[140px]">
                    <div className="text-[14px] text-muted-foreground">
                      {new Date(plan.startDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell py-1.5 px-3 md:px-6 w-[140px]">
                    <div className="text-[14px] text-muted-foreground">
                      {new Date(plan.endDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </TableCell>
                  <TableCell className="py-1.5 px-3 md:px-6 w-[120px]">
                    <div className="font-semibold text-[15px] text-foreground">
                      GH₵ {plan.amount.toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell className="py-1.5 px-3 md:px-6 text-center w-[180px]">
                    <div className="flex items-center justify-center gap-2">
                      <motion.div whileTap={{ scale: 0.96 }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(plan)}
                          className="h-8 gap-2 rounded-lg hover:bg-accent/50 px-3"
                        >
                          <Eye className="h-4 w-4" />
                          <span className="hidden sm:inline">View</span>
                        </Button>
                      </motion.div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Premium Pagination */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-border/20 px-8 py-2 bg-background/20">
          <div className="flex items-center gap-4">
            <div className="text-[13px] text-muted-foreground">
              Showing{" "}
              <span className="font-medium text-foreground">
                {filteredPlans.length === 0 ? 0 : startIndex + 1}-{Math.min(endIndex, filteredPlans.length)}
              </span>{" "}
              of <span className="font-medium text-foreground">{filteredPlans.length}</span>
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

      {/* Drawer */}
      <Sheet open={drawerOpen} onOpenChange={handleCloseDrawer}>
        <SheetContent className="sm:max-w-[380px] p-0 flex flex-col">
          {/* Visually hidden but accessible title and description */}
          <SheetTitle className="sr-only">
            {isEditing ? (isAddingPlan ? "Create Plan" : "Edit Plan") : "Plan Details"}
          </SheetTitle>
          <SheetDescription className="sr-only">
            {isEditing
              ? "Update plan information and save changes"
              : "View detailed information about this plan"}
          </SheetDescription>

          {editedPlan && (
            <div className="flex flex-col h-full overflow-y-auto">
              {/* Header Section */}
              <div className="px-6 pt-8 pb-6 border-b border-border/20">
                {/* Plan Name and Status */}
                <div className="space-y-1 mb-4">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    {editedPlan.name || "New Plan"}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {editedPlan.description || "No description"}
                  </p>
                </div>

                {/* Status Badges */}
                {!isAddingPlan && (
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="secondary"
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-medium",
                        editedPlan.status === "Active" && "bg-gradient-to-br from-emerald-500/15 to-emerald-600/25 text-emerald-700 dark:text-emerald-400 shadow-sm shadow-emerald-500/10",
                        editedPlan.status === "Upcoming" && "bg-gradient-to-br from-[#F2B705]/15 to-[#F2B705]/25 text-[#F2B705] shadow-sm shadow-[#F2B705]/10",
                        editedPlan.status === "Expired" && "bg-gradient-to-br from-slate-500/15 to-slate-600/25 text-slate-600 dark:text-slate-400 shadow-sm shadow-slate-500/10"
                      )}
                    >
                      {editedPlan.status}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="rounded-full px-3 py-1 text-xs font-medium bg-gradient-to-br from-[#5A1E6E]/15 to-[#5A1E6E]/25 text-[#5A1E6E] shadow-sm shadow-[#5A1E6E]/10"
                    >
                      {editedPlan.memberCount} Members
                    </Badge>
                  </div>
                )}
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
                        <div className="space-y-4">
                          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Plan Information
                          </h3>

                          <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm">
                              Plan Name
                            </Label>
                            <Input
                              id="name"
                              placeholder="e.g., Annual Subscription 2025"
                              value={editedPlan.name}
                              onChange={(e) =>
                                setEditedPlan({ ...editedPlan, name: e.target.value })
                              }
                              className="rounded-xl border-border/60"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="description" className="text-sm">
                              Description
                            </Label>
                            <Input
                              id="description"
                              placeholder="Brief description of the subscription period"
                              value={editedPlan.description}
                              onChange={(e) =>
                                setEditedPlan({ ...editedPlan, description: e.target.value })
                              }
                              className="rounded-xl border-border/60"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="amount" className="text-sm">
                              Amount (GH₵)
                            </Label>
                            <Input
                              id="amount"
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              value={editedPlan.amount || ""}
                              onChange={(e) =>
                                setEditedPlan({ ...editedPlan, amount: parseFloat(e.target.value) || 0 })
                              }
                              className="rounded-xl border-border/60"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="startDate" className="text-sm">
                              Start Date
                            </Label>
                            <div className="relative">
                              <Input
                                id="startDate"
                                type="date"
                                value={editedPlan.startDate}
                                onChange={(e) =>
                                  setEditedPlan({ ...editedPlan, startDate: e.target.value })
                                }
                                className="rounded-xl border-border/60 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-datetime-edit]:text-foreground [&::-webkit-datetime-edit-fields-wrapper]:text-foreground"
                                style={{
                                  colorScheme: 'light'
                                }}
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="endDate" className="text-sm">
                              End Date
                            </Label>
                            <div className="relative">
                              <Input
                                id="endDate"
                                type="date"
                                value={editedPlan.endDate}
                                onChange={(e) =>
                                  setEditedPlan({ ...editedPlan, endDate: e.target.value })
                                }
                                className="rounded-xl border-border/60 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-datetime-edit]:text-foreground [&::-webkit-datetime-edit-fields-wrapper]:text-foreground"
                                style={{
                                  colorScheme: 'light'
                                }}
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="memberType" className="text-sm">
                              Assign To
                            </Label>
                            <Select
                              value={editedPlan.memberType}
                              onValueChange={(value: "Executive" | "Members" | "Both") =>
                                setEditedPlan({ ...editedPlan, memberType: value })
                              }
                            >
                              <SelectTrigger id="memberType" className="rounded-xl border-border/60">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Both">Both (Executive & Members)</SelectItem>
                                <SelectItem value="Executive">Executive Only</SelectItem>
                                <SelectItem value="Members">Members Only</SelectItem>
                              </SelectContent>
                            </Select>
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
                        <div className="space-y-4">
                          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Plan Details
                          </h3>

                          <div className="space-y-4">
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                <DollarSign className="h-3.5 w-3.5" />
                                Subscription Amount
                              </div>
                              <div className="text-sm text-foreground pl-5.5 font-semibold">
                                GH₵ {editedPlan.amount.toFixed(2)}
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                <Calendar className="h-3.5 w-3.5" />
                                Start Date
                              </div>
                              <div className="text-sm text-foreground pl-5.5">
                                {editedPlan.startDate
                                  ? new Date(editedPlan.startDate).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })
                                  : "—"}
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                <Calendar className="h-3.5 w-3.5" />
                                End Date
                              </div>
                              <div className="text-sm text-foreground pl-5.5">
                                {editedPlan.endDate
                                  ? new Date(editedPlan.endDate).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })
                                  : "—"}
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                <Users className="h-3.5 w-3.5" />
                                Assigned To
                              </div>
                              <div className="text-sm text-foreground pl-5.5">
                                {editedPlan.memberType === "Both"
                                  ? "Both (Executive & Members)"
                                  : editedPlan.memberType === "Executive"
                                  ? "Executive Only"
                                  : "Members Only"}
                              </div>
                            </div>

                            {!isAddingPlan && editedPlan.createdAt && (
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                  <Calendar className="h-3.5 w-3.5" />
                                  Created On
                                </div>
                                <div className="text-sm text-foreground pl-5.5">
                                  {new Date(editedPlan.createdAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
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
                          onClick={handleCancel}
                          className="w-full gap-2 rounded-xl"
                        >
                          <X className="h-4 w-4" />
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
                              : "bg-gradient-to-br from-[#5A1E6E] to-[#3D123F] hover:from-[#5A1E6E]/90 hover:to-[#3D123F]/90 shadow-[#5A1E6E]/10",
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
                      key="view-buttons"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex gap-2"
                    >
                      <motion.div whileTap={{ scale: 0.96 }} className="flex-1">
                        <Button
                          variant="outline"
                          onClick={handleCloseDrawer}
                          className="w-full gap-2 rounded-xl"
                        >
                          Close
                        </Button>
                      </motion.div>
                      <motion.div whileTap={{ scale: 0.96 }} className="flex-1">
                        <Button
                          onClick={handleEdit}
                          className="w-full gap-2 rounded-xl bg-gradient-to-br from-[#5A1E6E] to-[#3D123F] hover:from-[#5A1E6E]/90 hover:to-[#3D123F]/90"
                        >
                          <Pencil className="h-4 w-4" />
                          Edit Plan
                        </Button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Add Plan Sheet */}
      <Sheet open={isAddingPlan} onOpenChange={handleCloseAddPlan}>
        <SheetContent className="sm:max-w-[380px] p-0 flex flex-col">
          <SheetTitle className="sr-only">Add New Subscription Plan</SheetTitle>
          <SheetDescription className="sr-only">
            Create a new subscription plan with custom dates and pricing
          </SheetDescription>

          <div className="flex flex-col h-full overflow-y-auto">
            {/* Header Section */}
            <div className="px-6 pt-8 pb-6 border-b border-border/20">
              <h2 className="text-2xl font-semibold tracking-tight">Add New Plan</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Create a subscription plan with custom dates and pricing
              </p>
            </div>

            {/* Content Section */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Plan Information
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="new-name" className="text-sm">
                      Plan Name
                    </Label>
                    <Input
                      id="new-name"
                      placeholder="e.g., Annual Subscription 2025"
                      value={newPlan.name}
                      onChange={(e) =>
                        setNewPlan({ ...newPlan, name: e.target.value })
                      }
                      className="rounded-xl border-border/60"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-description" className="text-sm">
                      Description
                    </Label>
                    <Input
                      id="new-description"
                      placeholder="Brief description of the subscription period"
                      value={newPlan.description}
                      onChange={(e) =>
                        setNewPlan({ ...newPlan, description: e.target.value })
                      }
                      className="rounded-xl border-border/60"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-amount" className="text-sm">
                      Amount (GH₵)
                    </Label>
                    <Input
                      id="new-amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={newPlan.amount || ""}
                      onChange={(e) =>
                        setNewPlan({ ...newPlan, amount: parseFloat(e.target.value) || 0 })
                      }
                      className="rounded-xl border-border/60"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-startDate" className="text-sm">
                      Start Date
                    </Label>
                    <div className="relative">
                      <Input
                        id="new-startDate"
                        type="date"
                        value={newPlan.startDate}
                        onChange={(e) =>
                          setNewPlan({ ...newPlan, startDate: e.target.value })
                        }
                        className="rounded-xl border-border/60 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-datetime-edit]:text-foreground [&::-webkit-datetime-edit-fields-wrapper]:text-foreground"
                        style={{
                          colorScheme: 'light'
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-endDate" className="text-sm">
                      End Date
                    </Label>
                    <div className="relative">
                      <Input
                        id="new-endDate"
                        type="date"
                        value={newPlan.endDate}
                        onChange={(e) =>
                          setNewPlan({ ...newPlan, endDate: e.target.value })
                        }
                        className="rounded-xl border-border/60 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-datetime-edit]:text-foreground [&::-webkit-datetime-edit-fields-wrapper]:text-foreground"
                        style={{
                          colorScheme: 'light'
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-memberType" className="text-sm">
                      Assign To
                    </Label>
                    <Select
                      value={newPlan.memberType}
                      onValueChange={(value: "Executive" | "Members" | "Both") =>
                        setNewPlan({ ...newPlan, memberType: value })
                      }
                    >
                      <SelectTrigger id="new-memberType" className="rounded-xl border-border/60">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Both">Both (Executive & Members)</SelectItem>
                        <SelectItem value="Executive">Executive Only</SelectItem>
                        <SelectItem value="Members">Members Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="border-t border-border/20 px-6 py-4 bg-muted/10">
              <div className="flex gap-3">
                <motion.div whileTap={{ scale: 0.96 }} className="flex-1">
                  <Button
                    variant="outline"
                    onClick={handleCloseAddPlan}
                    disabled={saveStatus === "saving"}
                    className="w-full rounded-xl border-border/60 hover:bg-muted/50"
                  >
                    Cancel
                  </Button>
                </motion.div>
                <motion.div whileTap={{ scale: saveStatus === "idle" ? 0.96 : 1 }} className="flex-1">
                  <Button
                    onClick={handleAddPlan}
                    disabled={saveStatus === "saving" || newPlan.name.trim() === ""}
                    className={cn(
                      "w-full gap-2 rounded-xl shadow-lg overflow-hidden relative transition-all duration-300",
                      saveStatus === "success"
                        ? "bg-gradient-to-br from-emerald-600 to-emerald-700 shadow-emerald-500/20"
                        : "bg-gradient-to-br from-[#5A1E6E] to-[#3D123F] hover:from-[#5A1E6E]/90 hover:to-[#3D123F]/90 shadow-[#5A1E6E]/10"
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
                          <Plus className="h-4 w-4" />
                          <span>Create Plan</span>
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
                          <span>Creating...</span>
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
                          <span>Created!</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
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