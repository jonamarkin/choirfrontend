"use client";

import * as React from "react";
import { motion } from "motion/react";
import {
  Eye,
  CreditCard,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  X,
  Wallet,
  Loader2,
  TrendingUp,
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
import { Progress } from "@/components/ui/progress";
import { PremiumStatCard } from "@/components/premium-stat-card";
import { tableContainerStyle } from "@/utils/premium-styles";
import { Badge } from "@/components/ui/badge";
import { useMySubscriptions } from "@/hooks/useSubscriptions";
import {
  UserSubscription,
  SubscriptionStatus,
  parseCanMakePayment,
} from "@/types/subscription";
import { PayButton } from "@/components/subscriptions/pay-button";

// Status display labels
const statusLabels: Record<SubscriptionStatus, string> = {
  fully_paid: "Fully Paid",
  partially_paid: "Partially Paid",
  not_paid: "Not Paid",
  overdue: "Overdue",
  refunded: "Refunded",
};

function StatusBadge({ status }: { status: SubscriptionStatus }) {
  const variants: Record<SubscriptionStatus, string> = {
    fully_paid:
      "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
    partially_paid: "bg-[#F2B705]/15 text-[#F2B705]",
    not_paid: "bg-red-500/15 text-red-700 dark:text-red-400",
    overdue: "bg-red-500/15 text-red-700 dark:text-red-400",
    refunded: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  };

  return (
    <Badge
      variant="secondary"
      className={cn("rounded-full px-2 py-0.5 text-xs font-medium", variants[status])}
    >
      {statusLabels[status]}
    </Badge>
  );
}

export default function Subscriptions() {
  // Fetch user's subscriptions from API
  const { subscriptions, isLoading, error, mutate } = useMySubscriptions();

  const [selectedSubscription, setSelectedSubscription] =
    React.useState<UserSubscription | null>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage] = React.useState(10);

  const handleViewDetails = (subscription: UserSubscription) => {
    setSelectedSubscription(subscription);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => setSelectedSubscription(null), 300);
  };

  // Filter subscriptions
  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesSearch =
      sub.subscription_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || sub.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredSubscriptions.length / itemsPerPage) || 1;
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
            My Subscriptions
          </h1>
          <p className="text-muted-foreground mt-1">
            View and manage your subscription payments
          </p>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#5A1E6E]" />
          <span className="ml-2 text-muted-foreground">
            Loading subscriptions...
          </span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/20 p-4 text-red-600 dark:text-red-400">
          Failed to load subscriptions: {error.message}
        </div>
      )}

      {/* Content - only show when not loading */}
      {!isLoading && !error && (
        <>
          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-4">
            <PremiumStatCard
              value={subscriptions.length}
              label="Total"
              variant="primary"
            />
            <PremiumStatCard
              value={subscriptions.filter((s) => s.status === "fully_paid").length}
              label="Fully Paid"
              variant="green"
            />
            <PremiumStatCard
              value={
                subscriptions.filter(
                  (s) => s.status === "overdue" || s.status === "not_paid"
                ).length
              }
              label="Pending"
              variant="pink"
            />
            <PremiumStatCard
              value={
                subscriptions.filter((s) => s.status === "partially_paid").length
              }
              label="Partially Paid"
              variant="gold"
            />
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search subscriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-11 rounded-xl border-border/40 bg-background/40 backdrop-blur-sm"
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[200px] h-11 rounded-xl border-border/40 bg-background/40">
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

          {/* Empty State */}
          {filteredSubscriptions.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No subscriptions found</p>
            </div>
          )}

          {/* Table */}
          {filteredSubscriptions.length > 0 && (
            <div
              className={cn(
                "rounded-2xl bg-gradient-to-br from-background/60 to-background/30 backdrop-blur-sm overflow-hidden shadow-lg shadow-primary/5",
                tableContainerStyle
              )}
            >
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/20 hover:bg-transparent">
                      <TableHead className="h-10 px-4 text-[13px] font-semibold uppercase tracking-wider text-muted-foreground/90">
                        Subscription
                      </TableHead>
                      <TableHead className="h-10 px-4 text-[13px] font-semibold uppercase tracking-wider text-muted-foreground/90">
                        Status
                      </TableHead>
                      <TableHead className="hidden sm:table-cell h-10 px-4 text-[13px] font-semibold uppercase tracking-wider text-muted-foreground/90">
                        Amount
                      </TableHead>
                      <TableHead className="hidden md:table-cell h-10 px-4 text-[13px] font-semibold uppercase tracking-wider text-muted-foreground/90">
                        Outstanding
                      </TableHead>
                      <TableHead className="h-10 px-4 text-center text-[13px] font-semibold uppercase tracking-wider text-muted-foreground/90">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentSubscriptions.map((subscription, index) => {
                      const amount = parseFloat(subscription.subscription_amount) || 0;
                      const outstanding = parseFloat(subscription.outstanding_amount) || 0;

                      return (
                        <TableRow
                          key={subscription.id}
                          className={cn(
                            "border-border/20 transition-all duration-200",
                            "hover:bg-accent/30",
                            index === currentSubscriptions.length - 1 && "border-0"
                          )}
                        >
                          <TableCell className="py-3 px-4">
                            <div className="font-medium text-foreground">
                              {subscription.subscription_name}
                            </div>
                            {subscription.subscription_description && (
                              <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                                {subscription.subscription_description}
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="py-3 px-4">
                            <StatusBadge status={subscription.status} />
                          </TableCell>
                          <TableCell className="hidden sm:table-cell py-3 px-4">
                            <div className="font-semibold text-foreground">
                              GH₵ {amount.toFixed(2)}
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell py-3 px-4">
                            <div
                              className={cn(
                                "font-semibold",
                                outstanding > 0
                                  ? "text-[#F36A21]"
                                  : "text-muted-foreground"
                              )}
                            >
                              GH₵ {outstanding.toFixed(2)}
                            </div>
                          </TableCell>
                          <TableCell className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              {outstanding > 0 && (
                                <PayButton
                                  subscription={subscription}
                                  onPaymentInitiated={() => mutate()}
                                />
                              )}
                              <motion.div whileTap={{ scale: 0.96 }}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewDetails(subscription)}
                                  className="h-8 gap-2 rounded-lg hover:bg-accent/50"
                                >
                                  <Eye className="h-4 w-4" />
                                  <span className="hidden sm:inline">View</span>
                                </Button>
                              </motion.div>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between border-t border-border/20 px-4 py-2 bg-background/20">
                <div className="text-[13px] text-muted-foreground">
                  Showing {startIndex + 1}-
                  {Math.min(endIndex, filteredSubscriptions.length)} of{" "}
                  {filteredSubscriptions.length}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="rounded-xl gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="rounded-xl gap-2"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* View Details Drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="sm:max-w-[400px] p-0 flex flex-col">
          <SheetTitle className="sr-only">Subscription Details</SheetTitle>
          <SheetDescription className="sr-only">
            View subscription payment details
          </SheetDescription>

          {selectedSubscription && (
            <div className="flex flex-col h-full overflow-y-auto">
              {/* Header */}
              <div className="px-6 pt-8 pb-6 border-b border-border/20">
                <h2 className="text-xl font-semibold">
                  {selectedSubscription.subscription_name}
                </h2>
                {selectedSubscription.subscription_description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedSubscription.subscription_description}
                  </p>
                )}
                <div className="mt-3">
                  <StatusBadge status={selectedSubscription.status} />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 px-6 py-6 space-y-6">
                {/* Amount Details */}
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Payment Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Wallet className="h-3 w-3" />
                        Total Amount
                      </div>
                      <div className="font-semibold">
                        GH₵{" "}
                        {parseFloat(
                          selectedSubscription.subscription_amount
                        ).toFixed(2)}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <TrendingUp className="h-3 w-3" />
                        Amount Paid
                      </div>
                      <div className="font-semibold text-emerald-600">
                        GH₵{" "}
                        {parseFloat(selectedSubscription.amount_paid).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Payment Progress</span>
                      <span>
                        {parseFloat(
                          selectedSubscription.payment_progress_percentage
                        ).toFixed(0)}
                        %
                      </span>
                    </div>
                    <Progress
                      value={parseFloat(
                        selectedSubscription.payment_progress_percentage
                      )}
                      className="h-2"
                    />
                  </div>

                  {/* Outstanding */}
                  {parseFloat(selectedSubscription.outstanding_amount) > 0 && (
                    <div className="p-3 rounded-lg bg-[#F36A21]/10 border border-[#F36A21]/20">
                      <div className="text-xs text-muted-foreground mb-1">
                        Outstanding Balance
                      </div>
                      <div className="text-lg font-bold text-[#F36A21]">
                        GH₵{" "}
                        {parseFloat(
                          selectedSubscription.outstanding_amount
                        ).toFixed(2)}
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Dates */}
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Period
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        Start Date
                      </div>
                      <div className="text-sm">
                        {selectedSubscription.start_date}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        End Date
                      </div>
                      <div className="text-sm">
                        {selectedSubscription.end_date}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="border-t border-border/20 px-6 py-4 space-y-2">
                {parseFloat(selectedSubscription.outstanding_amount) > 0 &&
                  parseCanMakePayment(selectedSubscription.can_make_payment)
                    .allowed && (
                    <PayButton
                      subscription={selectedSubscription}
                      onPaymentInitiated={() => {
                        mutate();
                        handleCloseDrawer();
                      }}
                      className="w-full"
                    />
                  )}
                <Button
                  variant="outline"
                  onClick={handleCloseDrawer}
                  className="w-full rounded-xl"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}