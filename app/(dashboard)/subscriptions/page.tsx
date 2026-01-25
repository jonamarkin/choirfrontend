"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Eye,
  CreditCard,
  Mail,
  Phone,
  Calendar,
  User,
  CircleCheck,
  CircleAlert,
  Clock,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Search,
  Filter,
  X,
  Link2,
  Send,
  Copy,
  ToggleLeft,
  ToggleRight,
  Wallet,
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
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PremiumStatCard } from "@/components/premium-stat-card";
import {
  tableContainerStyle,
  tableHeaderRowStyle,
  tableHeaderCellStyle,
  paginationActiveStyle,
  paginationInactiveStyle,
} from "@/utils/premium-styles";
import { Badge } from "@/components/ui/badge";
import { subscriptionsService } from "@/services/subscriptions.service";
import { UserSubscription, SubscriptionStatus } from "@/types/subscriptions";

function StatusBadge({ status }: { status: SubscriptionStatus }) {
  const colors: Record<SubscriptionStatus, string> = {
    fully_paid: "text-[#16a34a]",
    partially_paid: "text-[#F2B705]",
    not_paid: "text-[#dc2626]",
    overdue: "text-[#F2B705]",
    refunded: "text-[#3490dc]",
  };

  const labels: Record<SubscriptionStatus, string> = {
    fully_paid: "Fully Paid",
    partially_paid: "Partially Paid",
    not_paid: "Not Paid",
    overdue: "Overdue",
    refunded: "Refunded",
  };

  return (
    <span className={cn("text-sm font-medium", colors[status])}>
      {labels[status]}
    </span>
  );
}

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = React.useState<UserSubscription[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedSubscription, setSelectedSubscription] = React.useState<UserSubscription | null>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [addSubscriptionOpen, setAddSubscriptionOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);

  // Fetch subscriptions on mount
  React.useEffect(() => {
    async function fetchSubscriptions() {
      try {
        setLoading(true);
        const data = await subscriptionsService.getMySubscriptions();
        setSubscriptions(data);
      } catch (error) {
        console.error("Failed to fetch subscriptions:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSubscriptions();
  }, []);

  const handleViewDetails = (subscription: UserSubscription) => {
    setSelectedSubscription(subscription);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => setSelectedSubscription(null), 300);
  };

  const handleOpenAddSubscription = () => {
    setAddSubscriptionOpen(true);
  };

  const handleCloseAddSubscription = () => {
    setAddSubscriptionOpen(false);
  };

  // Filter subscriptions
  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesSearch =
      sub.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.user_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.subscription_name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || sub.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredSubscriptions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSubscriptions = filteredSubscriptions.slice(startIndex, endIndex);

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
          <h1 className="tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            Subscriptions
          </h1>
        </div>
        <motion.div whileTap={{ scale: 0.96 }}>
          <Button
            onClick={handleOpenAddSubscription}
            className="gap-2 rounded-xl shadow-lg shadow-primary/10 bg-gradient-to-br from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
          >
            <Link2 className="h-4 w-4" />
            Generate Widget
          </Button>
        </motion.div>
      </div>

      {/* Stats Cards - Ultra Minimal */}
      <div className="grid gap-6 md:grid-cols-4">
        <PremiumStatCard
          value={filteredSubscriptions.length}
          label="Total"
          variant="primary"
        />
        <PremiumStatCard
          value={filteredSubscriptions.filter((s) => s.status === "fully_paid").length}
          label="Fully Paid"
          variant="green"
        />
        <PremiumStatCard
          value={filteredSubscriptions.filter((s) => s.status === "overdue").length}
          label="Overdue"
          variant="pink"
        />
        <PremiumStatCard
          value={filteredSubscriptions.filter((s) => s.status === "partially_paid").length}
          label="Partially Paid"
          variant="gold"
        />
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by member name, email, or subscription..."
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
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[200px] h-11 rounded-xl border-border/40 bg-background/40 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Filter by status" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="fully_paid">Fully Paid</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="partially_paid">Partially Paid</SelectItem>
            <SelectItem value="not_paid">Not Paid</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>
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
                <TableHead className="h-10 px-3 md:px-6 text-[13px] font-semibold uppercase tracking-wider text-muted-foreground/90 w-[200px]">
                    Subscription
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
                <TableHead className="h-10 px-3 md:px-6 text-center text-[13px] font-semibold uppercase tracking-wider text-muted-foreground/90 w-[140px]">
                    Actions
                </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody style={{ minHeight: `${itemsPerPage * 40}px` }}>
                {loading ? (
                    <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            Loading subscriptions...
                        </TableCell>
                    </TableRow>
                ) : currentSubscriptions.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            No subscriptions found.
                        </TableCell>
                    </TableRow>
                ) : (
                    currentSubscriptions.map((subscription, index) => (
                    <TableRow 
                        key={subscription.id}
                        className={cn(
                        "border-border/20 transition-all duration-200",
                        "hover:bg-accent/30",
                        index === currentSubscriptions.length - 1 && "border-0"
                        )}
                    >
                        <TableCell className="py-1.5 px-3 md:px-6 w-[200px]">
                        <div className="font-medium text-[15px] text-foreground">
                            {subscription.subscription_name}
                        </div>
                        <div className="text-xs text-muted-foreground/60 hidden sm:block">
                            {subscription.subscription}
                        </div>
                        </TableCell>
                        <TableCell className="py-1.5 px-3 md:px-6 w-[120px]">
                        <StatusBadge status={subscription.status} />
                        </TableCell>
                        <TableCell className="hidden sm:table-cell py-1.5 px-3 md:px-6 w-[140px]">
                        <div className="text-[14px] text-muted-foreground">
                            {new Date(subscription.start_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                            })}
                        </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell py-1.5 px-3 md:px-6 w-[140px]">
                        <div className="text-[14px] text-muted-foreground">
                            {new Date(subscription.end_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                            })}
                        </div>
                        </TableCell>
                        <TableCell className="py-1.5 px-3 md:px-6 w-[120px]">
                        <div className="font-semibold text-[15px] text-foreground">
                            GH₵ {parseFloat(subscription.subscription_amount).toFixed(2)}
                        </div>
                        </TableCell>
                        <TableCell className="py-1.5 px-3 md:px-6 text-center w-[140px]">
                        <motion.div
                            whileTap={{ scale: 0.96 }}
                            className="inline-block"
                        >
                            <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(subscription)}
                            className="h-8 gap-2 rounded-lg hover:bg-accent/50 px-3"
                            >
                            <Eye className="h-4 w-4" />
                            <span className="hidden sm:inline">View</span>
                            </Button>
                        </motion.div>
                        </TableCell>
                    </TableRow>
                    ))
                )}
            </TableBody>
            </Table>
        </div>

        {/* Premium Pagination */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-border/20 px-8 py-2 bg-background/20">
          <div className="flex items-center gap-4">
            <div className="text-[13px] text-muted-foreground">
              Showing{" "}
              <span className="font-medium text-foreground">
                {filteredSubscriptions.length === 0 ? 0 : startIndex + 1}-{Math.min(endIndex, filteredSubscriptions.length)}
              </span>{" "}
              of <span className="font-medium text-foreground">{filteredSubscriptions.length}</span>
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

      {/* View Details Drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="sm:max-w-[380px] p-0 flex flex-col">
          {/* Visually hidden but accessible title and description */}
          <SheetTitle className="sr-only">
            Subscription Details
          </SheetTitle>
          <SheetDescription className="sr-only">
            View detailed information about this subscription
          </SheetDescription>

          {selectedSubscription && (
            <div className="flex flex-col h-full overflow-y-auto">
              {/* Header Section */}
              <div className="px-6 pt-8 pb-6 border-b border-border/20">
                {/* Member Name and Role */}
                <div className="space-y-1 mb-4">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    {selectedSubscription.subscription_name}
                  </h2>
                  <p className="text-sm text-muted-foreground font-mono">
                    {selectedSubscription.id}
                  </p>
                </div>

                {/* Status Badge */}
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="secondary"
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium",
                      selectedSubscription.status === "fully_paid" &&
                        "bg-gradient-to-br from-emerald-500/15 to-emerald-600/25 text-emerald-700 dark:text-emerald-400 shadow-sm shadow-emerald-500/10",
                      selectedSubscription.status === "overdue" &&
                        "bg-gradient-to-br from-[#F2B705]/15 to-[#F2B705]/25 text-[#F2B705] shadow-sm shadow-[#F2B705]/10",
                      selectedSubscription.status === "partially_paid" &&
                        "bg-gradient-to-br from-[#F2B705]/15 to-[#F2B705]/25 text-[#F2B705] shadow-sm shadow-[#F2B705]/10",
                      selectedSubscription.status === "not_paid" &&
                        "bg-gradient-to-br from-red-500/15 to-red-600/25 text-red-700 dark:text-red-400 shadow-sm shadow-red-500/10",
                      selectedSubscription.status === "refunded" &&
                        "bg-gradient-to-br from-blue-500/15 to-blue-600/25 text-blue-700 dark:text-blue-400 shadow-sm shadow-blue-500/10"
                    )}
                  >
                    <StatusBadge status={selectedSubscription.status} />
                  </Badge>
                  {selectedSubscription.is_currently_active && (
                    <Badge
                      variant="secondary"
                      className="rounded-full px-3 py-1 text-xs font-medium bg-gradient-to-br from-[#5A1E6E]/15 to-[#5A1E6E]/25 text-[#5A1E6E] shadow-sm shadow-[#5A1E6E]/10"
                    >
                      Active
                    </Badge>
                  )}
                </div>
              </div>

              {/* Content Section */}
              <div className="flex-1 overflow-y-auto px-6 py-6">
                <div className="space-y-6">
                  {/* Contact Details */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Contact Information
                    </h3>

                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          <User className="h-3.5 w-3.5" />
                          Name
                        </div>
                        <div className="text-sm text-foreground pl-5.5">
                          {selectedSubscription.user_name}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          <Mail className="h-3.5 w-3.5" />
                          Email
                        </div>
                        <div className="text-sm text-foreground pl-5.5">
                          {selectedSubscription.user_email}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-gradient-to-r from-transparent via-border/60 to-transparent" />

                  {/* Subscription Details */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Subscription Details
                    </h3>

                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          <Calendar className="h-3.5 w-3.5" />
                          Start Date
                        </div>
                        <div className="text-sm text-foreground pl-5.5">
                          {new Date(selectedSubscription.start_date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          <Calendar className="h-3.5 w-3.5" />
                          End Date
                        </div>
                        <div className="text-sm text-foreground pl-5.5">
                          {new Date(selectedSubscription.end_date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          <DollarSign className="h-3.5 w-3.5" />
                          Subscription Amount
                        </div>
                        <div className="text-sm text-foreground pl-5.5">
                          GH₵ {parseFloat(selectedSubscription.subscription_amount).toFixed(2)}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            <Wallet className="h-3.5 w-3.5" />
                            Amount Paid
                          </div>
                          <div className="text-sm text-foreground pl-5.5">
                            GH₵ {parseFloat(selectedSubscription.amount_paid).toFixed(2)}
                          </div>
                        </div>
                    </div>
                  </div>

                  <Separator className="bg-gradient-to-r from-transparent via-border/60 to-transparent" />

                  {/* Payment Details */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Payment Details
                    </h3>

                    <div className="space-y-4">
                      {selectedSubscription.payment_reference && (
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            <CreditCard className="h-3.5 w-3.5" />
                            Transaction Reference
                          </div>
                          <div className="text-sm text-foreground pl-5.5 font-mono break-all">
                            {selectedSubscription.payment_reference}
                          </div>
                        </div>
                      )}

                      {selectedSubscription.payment_date && (
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            <Calendar className="h-3.5 w-3.5" />
                            Payment Date
                          </div>
                          <div className="text-sm text-foreground pl-5.5">
                            {new Date(selectedSubscription.payment_date).toLocaleDateString("en-US", {
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
              </div>

              {/* Footer Actions */}
              <div className="border-t border-border/20 px-6 py-4">
                <motion.div whileTap={{ scale: 0.96 }} className="w-full">
                  <Button
                    onClick={handleCloseDrawer}
                    variant="outline"
                    className="w-full gap-2 rounded-xl"
                  >
                    Close
                  </Button>
                </motion.div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Add Subscription Drawer - Placeholder for now */}
      <Sheet open={addSubscriptionOpen} onOpenChange={setAddSubscriptionOpen}>
        <SheetContent className="sm:max-w-[380px] p-0 flex flex-col">
          {/* Header Section */}
          <div className="px-6 pt-8 pb-6 border-b border-border/20">
            <h2 className="text-2xl font-semibold tracking-tight">Generate Subscription Widget</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Create a widget link for members to self-subscribe and pay
            </p>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Link2 className="h-6 w-6" />
            </div>
            <div className="space-y-2">
                <h3 className="font-semibold text-lg">Coming Soon</h3>
                <p className="text-sm text-muted-foreground">
                    This feature is currently under development. You'll be able to generate payment links for your subscriptions soon.
                </p>
            </div>
          </div>

          <div className="border-t border-border/20 px-6 py-4">
            <Button
                onClick={handleCloseAddSubscription}
                className="w-full rounded-xl"
            >
                Got it
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}