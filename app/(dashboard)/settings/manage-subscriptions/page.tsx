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
  Users,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

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
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PremiumStatCard } from "@/components/premium-stat-card";
import { tableContainerStyle } from "@/utils/premium-styles";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useAdminSubscriptions } from "@/hooks/useAdminSubscriptions";
import {
  subscriptionAdminService,
  SubscriptionCreateRequest,
} from "@/services/subscription-admin.service";
import { Subscription } from "@/types/subscription";

// Derive status from dates
function getSubscriptionStatus(
  startDate: string,
  endDate: string,
  isActive: boolean
): "Active" | "Upcoming" | "Expired" | "Inactive" {
  if (!isActive) return "Inactive";
  const today = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (today < start) return "Upcoming";
  if (today > end) return "Expired";
  return "Active";
}

function StatusBadge({
  status,
}: {
  status: "Active" | "Upcoming" | "Expired" | "Inactive";
}) {
  const colors = {
    Active: "text-emerald-600 dark:text-emerald-400",
    Upcoming: "text-amber-600 dark:text-amber-400",
    Expired: "text-slate-500 dark:text-slate-400",
    Inactive: "text-red-500 dark:text-red-400",
  };

  return (
    <span className={cn("text-sm font-medium", colors[status])}>{status}</span>
  );
}

// Form state type
interface SubscriptionForm {
  name: string;
  description: string;
  amount: string;
  start_date: string;
  end_date: string;
  assignees_category: "EXECUTIVES" | "MEMBERS" | "BOTH";
  is_active: boolean;
}

const emptyForm: SubscriptionForm = {
  name: "",
  description: "",
  amount: "",
  start_date: "",
  end_date: "",
  assignees_category: "BOTH",
  is_active: true,
};

export default function ManageSubscriptionPlans() {
  const { subscriptions, isLoading, error, mutate } = useAdminSubscriptions();

  const [selectedPlan, setSelectedPlan] = React.useState<Subscription | null>(
    null
  );
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [isAddingPlan, setIsAddingPlan] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);
  const [saveStatus, setSaveStatus] = React.useState<
    "idle" | "saving" | "success" | "error"
  >("idle");
  const [deleteStatus, setDeleteStatus] = React.useState<
    "idle" | "deleting" | "confirm"
  >("idle");

  // Form state
  const [form, setForm] = React.useState<SubscriptionForm>(emptyForm);

  // Handle view details
  const handleViewDetails = (plan: Subscription) => {
    setSelectedPlan(plan);
    setForm({
      name: plan.name,
      description: plan.description,
      amount: plan.amount,
      start_date: plan.start_date,
      end_date: plan.end_date,
      assignees_category: plan.assignees_category as
        | "EXECUTIVES"
        | "MEMBERS"
        | "BOTH",
      is_active: plan.is_active,
    });
    setIsEditing(false);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setIsEditing(false);
    setIsAddingPlan(false);
    setDeleteStatus("idle");
    setTimeout(() => {
      setSelectedPlan(null);
      setForm(emptyForm);
    }, 300);
  };

  const handleOpenAddPlan = () => {
    setForm(emptyForm);
    setSaveStatus("idle");
    setIsAddingPlan(true);
    setDrawerOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Plan name is required");
      return;
    }

    setSaveStatus("saving");

    try {
      if (isAddingPlan) {
        // Create new subscription
        await subscriptionAdminService.createSubscription({
          name: form.name,
          description: form.description,
          amount: form.amount,
          start_date: form.start_date,
          end_date: form.end_date,
          assignees_category: form.assignees_category,
          is_active: form.is_active,
        });
        toast.success("Subscription plan created successfully");
      } else if (selectedPlan) {
        // Update existing subscription
        await subscriptionAdminService.updateSubscription(selectedPlan.id, {
          name: form.name,
          description: form.description,
          amount: form.amount,
          start_date: form.start_date,
          end_date: form.end_date,
          assignees_category: form.assignees_category,
          is_active: form.is_active,
        });
        toast.success("Subscription plan updated successfully");
      }

      setSaveStatus("success");
      mutate(); // Refresh the list

      await new Promise((resolve) => setTimeout(resolve, 500));
      handleCloseDrawer();
    } catch (err) {
      setSaveStatus("error");
      const message =
        err instanceof Error ? err.message : "Failed to save subscription";
      toast.error(message);
    } finally {
      setSaveStatus("idle");
    }
  };

  const handleDelete = async () => {
    if (!selectedPlan) return;

    if (deleteStatus !== "confirm") {
      setDeleteStatus("confirm");
      return;
    }

    setDeleteStatus("deleting");

    try {
      await subscriptionAdminService.deleteSubscription(selectedPlan.id);
      toast.success("Subscription plan deleted");
      mutate();
      handleCloseDrawer();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete subscription";
      toast.error(message);
    } finally {
      setDeleteStatus("idle");
    }
  };

  // Filter subscriptions
  const filteredPlans = React.useMemo(() => {
    return subscriptions.filter((plan) => {
      const matchesSearch =
        plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plan.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [subscriptions, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredPlans.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPlans = filteredPlans.slice(startIndex, endIndex);

  // Stats
  const activePlans = subscriptions.filter((p) => {
    const status = getSubscriptionStatus(p.start_date, p.end_date, p.is_active);
    return status === "Active";
  }).length;
  const upcomingPlans = subscriptions.filter((p) => {
    const status = getSubscriptionStatus(p.start_date, p.end_date, p.is_active);
    return status === "Upcoming";
  }).length;
  const expiredPlans = subscriptions.filter((p) => {
    const status = getSubscriptionStatus(p.start_date, p.end_date, p.is_active);
    return status === "Expired";
  }).length;

  // Loading state
  if (isLoading) {
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
        <p className="text-lg text-muted-foreground">
          Failed to load subscriptions
        </p>
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
        <div>
          <h1 className="tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            Manage Subscription Plans
          </h1>
        </div>
        <motion.div whileTap={{ scale: 0.96 }}>
          <Button
            onClick={handleOpenAddPlan}
            className="gap-2 rounded-xl shadow-lg shadow-primary/10 bg-gradient-to-br from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
          >
            <Plus className="h-4 w-4" />
            Create Plan
          </Button>
        </motion.div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <PremiumStatCard
          value={subscriptions.length}
          label="Total Plans"
          variant="primary"
        />
        <PremiumStatCard value={activePlans} label="Active" variant="green" />
        <PremiumStatCard
          value={upcomingPlans}
          label="Upcoming"
          variant="gold"
        />
        <PremiumStatCard value={expiredPlans} label="Expired" variant="pink" />
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by plan name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-11 rounded-xl border-border/40 bg-background/40 backdrop-blur-sm focus-visible:ring-primary/20"
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
          className="overflow-x-auto overflow-y-auto"
          style={{
            minHeight: "calc(100vh - 420px)",
            maxHeight: "calc(100vh - 420px)",
          }}
        >
          <Table className="table-fixed w-full">
            <TableHeader>
              <TableRow className="border-border/20 hover:bg-transparent">
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
                <TableHead className="h-10 px-3 md:px-6 text-[13px] font-semibold uppercase tracking-wider text-muted-foreground/90 w-[100px]">
                  Assignees
                </TableHead>
                <TableHead className="h-10 px-3 md:px-6 text-center text-[13px] font-semibold uppercase tracking-wider text-muted-foreground/90 w-[120px]">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentPlans.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-12 text-muted-foreground"
                  >
                    {searchQuery
                      ? "No subscription plans match your search"
                      : "No subscription plans created yet"}
                  </TableCell>
                </TableRow>
              ) : (
                currentPlans.map((plan, index) => {
                  const status = getSubscriptionStatus(
                    plan.start_date,
                    plan.end_date,
                    plan.is_active
                  );
                  return (
                    <TableRow
                      key={plan.id}
                      className={cn(
                        "border-border/20 transition-all duration-200",
                        "hover:bg-accent/30",
                        index === currentPlans.length - 1 && "border-0"
                      )}
                    >
                      <TableCell className="py-2 px-3 md:px-6">
                        <div className="font-medium text-[15px] text-foreground truncate">
                          {plan.name}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {plan.description}
                        </div>
                      </TableCell>
                      <TableCell className="py-2 px-3 md:px-6">
                        <StatusBadge status={status} />
                      </TableCell>
                      <TableCell className="hidden sm:table-cell py-2 px-3 md:px-6">
                        <div className="text-[14px] text-muted-foreground">
                          {new Date(plan.start_date).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell py-2 px-3 md:px-6">
                        <div className="text-[14px] text-muted-foreground">
                          {new Date(plan.end_date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                      </TableCell>
                      <TableCell className="py-2 px-3 md:px-6">
                        <div className="font-semibold text-[15px] text-foreground">
                          GH₵ {parseFloat(plan.amount).toFixed(2)}
                        </div>
                      </TableCell>
                      <TableCell className="py-2 px-3 md:px-6">
                        <div className="text-[14px] text-muted-foreground">
                          {plan.assigned_users_count || 0}
                        </div>
                      </TableCell>
                      <TableCell className="py-2 px-3 md:px-6 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <motion.div whileTap={{ scale: 0.96 }}>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(plan)}
                              className="h-8 w-8 p-0 rounded-lg hover:bg-accent/50"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </motion.div>
                          <motion.div whileTap={{ scale: 0.96 }}>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                handleViewDetails(plan);
                                setTimeout(() => setIsEditing(true), 100);
                              }}
                              className="h-8 w-8 p-0 rounded-lg hover:bg-accent/50"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </motion.div>
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
                {filteredPlans.length === 0 ? 0 : startIndex + 1}-
                {Math.min(endIndex, filteredPlans.length)}
              </span>{" "}
              of{" "}
              <span className="font-medium text-foreground">
                {filteredPlans.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-muted-foreground">
                Per page:
              </span>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  setItemsPerPage(Number(value));
                  setCurrentPage(1);
                }}
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
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
              disabled={currentPage >= totalPages}
              className="rounded-xl gap-2"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Drawer */}
      <Sheet open={drawerOpen} onOpenChange={handleCloseDrawer}>
        <SheetContent className="sm:max-w-[420px] p-0 flex flex-col">
          <SheetTitle className="sr-only">
            {isAddingPlan ? "Create Plan" : isEditing ? "Edit Plan" : "Plan Details"}
          </SheetTitle>
          <SheetDescription className="sr-only">
            {isAddingPlan
              ? "Create a new subscription plan"
              : isEditing
                ? "Edit subscription plan details"
                : "View subscription plan details"}
          </SheetDescription>

          <div className="flex flex-col h-full overflow-y-auto">
            {/* Header */}
            <div className="px-6 pt-8 pb-4 border-b border-border/20">
              <h2 className="text-xl font-semibold">
                {isAddingPlan
                  ? "Create Plan"
                  : isEditing
                    ? "Edit Plan"
                    : form.name || "Plan Details"}
              </h2>
              {!isAddingPlan && selectedPlan && (
                <p className="text-sm text-muted-foreground mt-1">
                  {form.description}
                </p>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {isEditing || isAddingPlan ? (
                // Edit/Create Mode
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="name">Plan Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Annual Subscription 2025"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className="rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      placeholder="Brief description"
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                      className="rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (GH₵) *</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={form.amount}
                      onChange={(e) =>
                        setForm({ ...form, amount: e.target.value })
                      }
                      className="rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start_date">Start Date *</Label>
                      <Input
                        id="start_date"
                        type="date"
                        value={form.start_date}
                        onChange={(e) =>
                          setForm({ ...form, start_date: e.target.value })
                        }
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end_date">End Date *</Label>
                      <Input
                        id="end_date"
                        type="date"
                        value={form.end_date}
                        onChange={(e) =>
                          setForm({ ...form, end_date: e.target.value })
                        }
                        className="rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="assignees_category">Assign To</Label>
                    <Select
                      value={form.assignees_category}
                      onValueChange={(
                        value: "EXECUTIVES" | "MEMBERS" | "BOTH"
                      ) => setForm({ ...form, assignees_category: value })}
                    >
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BOTH">
                          Both (Executives & Members)
                        </SelectItem>
                        <SelectItem value="EXECUTIVES">
                          Executives Only
                        </SelectItem>
                        <SelectItem value="MEMBERS">Members Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="space-y-5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase">
                      <DollarSign className="h-3.5 w-3.5" />
                      Amount
                    </div>
                    <div className="text-lg font-semibold">
                      GH₵ {parseFloat(form.amount || "0").toFixed(2)}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase">
                      <Calendar className="h-3.5 w-3.5" />
                      Duration
                    </div>
                    <div className="text-sm">
                      {form.start_date &&
                        new Date(form.start_date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}{" "}
                      —{" "}
                      {form.end_date &&
                        new Date(form.end_date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase">
                      <Users className="h-3.5 w-3.5" />
                      Assigned To
                    </div>
                    <div className="text-sm">
                      {form.assignees_category === "BOTH"
                        ? "Both (Executives & Members)"
                        : form.assignees_category === "EXECUTIVES"
                          ? "Executives Only"
                          : "Members Only"}
                    </div>
                  </div>

                  {selectedPlan && (
                    <>
                      <Separator />
                      <div className="space-y-1">
                        <div className="text-xs font-medium text-muted-foreground uppercase">
                          Assignees Count
                        </div>
                        <div className="text-sm">
                          {selectedPlan.assigned_users_count || 0} users
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="border-t border-border/20 px-6 py-4">
              {isEditing || isAddingPlan ? (
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 rounded-xl"
                    onClick={() => {
                      if (isAddingPlan) {
                        handleCloseDrawer();
                      } else {
                        setIsEditing(false);
                        if (selectedPlan) {
                          setForm({
                            name: selectedPlan.name,
                            description: selectedPlan.description,
                            amount: selectedPlan.amount,
                            start_date: selectedPlan.start_date,
                            end_date: selectedPlan.end_date,
                            assignees_category: selectedPlan.assignees_category as
                              | "EXECUTIVES"
                              | "MEMBERS"
                              | "BOTH",
                            is_active: selectedPlan.is_active,
                          });
                        }
                      }
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 rounded-xl"
                    onClick={handleSave}
                    disabled={saveStatus === "saving"}
                  >
                    {saveStatus === "saving" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : saveStatus === "success" ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Saved!
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        {isAddingPlan ? "Create Plan" : "Save Changes"}
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 rounded-xl"
                    onClick={() => setIsEditing(true)}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    className="rounded-xl"
                    onClick={handleDelete}
                    disabled={deleteStatus === "deleting"}
                  >
                    {deleteStatus === "deleting" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : deleteStatus === "confirm" ? (
                      "Confirm Delete?"
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}