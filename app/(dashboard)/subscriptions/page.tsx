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

interface Subscription {
  id: string;
  memberId: string;
  memberName: string;
  memberEmail: string;
  memberPhone: string;
  status: "Fully Paid" | "Partially Paid" | "Not Paid" | "Overdue" | "Refunded";
  startDate: string;
  endDate: string;
  amount: number;
  paidAmount?: number;
  paymentMethod: string;
  transactionRef?: string;
  paymentDate?: string;
  autoRenewal: boolean;
}

const mockSubscriptions: Subscription[] = [
  {
    id: "SUB001",
    memberId: "1",
    memberName: "Sarah Johnson",
    memberEmail: "sarah.j@vocalessence.org",
    memberPhone: "+1 (555) 123-4567",
    status: "Fully Paid",
    startDate: "2025-01-15",
    endDate: "2026-01-14",
    amount: 150.00,
    paidAmount: 150.00,
    paymentMethod: "Mobile Money",
    transactionRef: "HUB-2025011501234",
    paymentDate: "2025-01-15",
    autoRenewal: true,
  },
  {
    id: "SUB002",
    memberId: "2",
    memberName: "Michael Chen",
    memberEmail: "m.chen@email.com",
    memberPhone: "+1 (555) 234-5678",
    status: "Fully Paid",
    startDate: "2025-02-01",
    endDate: "2026-01-31",
    amount: 150.00,
    paidAmount: 150.00,
    paymentMethod: "Card",
    transactionRef: "HUB-2025020112345",
    paymentDate: "2025-02-01",
    autoRenewal: false,
  },
  {
    id: "SUB003",
    memberId: "3",
    memberName: "Emily Rodriguez",
    memberEmail: "emily.r@vocalessence.org",
    memberPhone: "+1 (555) 345-6789",
    status: "Overdue",
    startDate: "2024-03-10",
    endDate: "2025-03-09",
    amount: 120.00,
    paidAmount: 0.00,
    paymentMethod: "Mobile Money",
    transactionRef: "HUB-2024031023456",
    paymentDate: "2024-03-10",
    autoRenewal: false,
  },
  {
    id: "SUB004",
    memberId: "4",
    memberName: "David Martinez",
    memberEmail: "d.martinez@email.com",
    memberPhone: "+1 (555) 456-7890",
    status: "Partially Paid",
    startDate: "2025-01-20",
    endDate: "2026-01-19",
    amount: 150.00,
    paidAmount: 75.00,
    paymentMethod: "Mobile Money",
    autoRenewal: true,
  },
  {
    id: "SUB005",
    memberId: "5",
    memberName: "Jessica Thompson",
    memberEmail: "jessica.t@vocalessence.org",
    memberPhone: "+1 (555) 567-8901",
    status: "Fully Paid",
    startDate: "2025-01-05",
    endDate: "2026-01-04",
    amount: 150.00,
    paidAmount: 150.00,
    paymentMethod: "Card",
    transactionRef: "HUB-2025010534567",
    paymentDate: "2025-01-05",
    autoRenewal: true,
  },
  {
    id: "SUB006",
    memberId: "6",
    memberName: "James Wilson",
    memberEmail: "j.wilson@email.com",
    memberPhone: "+1 (555) 678-9012",
    status: "Fully Paid",
    startDate: "2024-12-20",
    endDate: "2025-12-19",
    amount: 150.00,
    paidAmount: 150.00,
    paymentMethod: "Mobile Money",
    transactionRef: "HUB-2024122045678",
    paymentDate: "2024-12-20",
    autoRenewal: false,
  },
  {
    id: "SUB007",
    memberId: "7",
    memberName: "Olivia Anderson",
    memberEmail: "olivia.a@vocalessence.org",
    memberPhone: "+1 (555) 789-0123",
    status: "Refunded",
    startDate: "2023-11-15",
    endDate: "2024-11-14",
    amount: 100.00,
    paidAmount: 100.00,
    paymentMethod: "Card",
    transactionRef: "HUB-2023111556789",
    paymentDate: "2023-11-15",
    autoRenewal: false,
  },
  {
    id: "SUB008",
    memberId: "8",
    memberName: "Daniel Taylor",
    memberEmail: "d.taylor@email.com",
    memberPhone: "+1 (555) 890-1234",
    status: "Not Paid",
    startDate: "2024-08-01",
    endDate: "2025-07-31",
    amount: 150.00,
    paidAmount: 0.00,
    paymentMethod: "Mobile Money",
    transactionRef: "HUB-2024080167890",
    paymentDate: "2024-08-01",
    autoRenewal: false,
  },
];

function StatusBadge({ status }: { status: Subscription["status"] }) {
  const colors = {
    "Fully Paid": "text-[#16a34a]",
    "Partially Paid": "text-[#F2B705]",
    "Not Paid": "text-[#dc2626]",
    Overdue: "text-[#F2B705]",
    Refunded: "text-[#3490dc]",
  };

  return (
    <span className={cn("text-sm font-medium", colors[status])}>
      {status}
    </span>
  );
}

export default function Subscriptions() {
  const [selectedSubscription, setSelectedSubscription] = React.useState<Subscription | null>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [addSubscriptionOpen, setAddSubscriptionOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);

  const handleViewDetails = (subscription: Subscription) => {
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
  const filteredSubscriptions = mockSubscriptions.filter((sub) => {
    const matchesSearch = 
      sub.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.memberEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.id.toLowerCase().includes(searchQuery.toLowerCase());
    
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

  // Copy to clipboard fallback
  const copyToClipboard = (text: string) => {
    // Try modern API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(() => {
        // Fallback to legacy method
        fallbackCopyToClipboard(text);
      });
    } else {
      // Use fallback directly
      fallbackCopyToClipboard(text);
    }
  };

  const fallbackCopyToClipboard = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }
    document.body.removeChild(textArea);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="ml-0 md:ml-0 pl-14 md:pl-0">
          <h1 className="tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">Subscriptions</h1>
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
          value={filteredSubscriptions.filter((s) => s.status === "Fully Paid").length}
          label="Fully Paid"
          variant="green"
        />
        <PremiumStatCard
          value={filteredSubscriptions.filter((s) => s.status === "Overdue").length}
          label="Overdue"
          variant="pink"
        />
        <PremiumStatCard
          value={filteredSubscriptions.filter((s) => s.status === "Partially Paid").length}
          label="Partially Paid"
          variant="gold"
        />
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by member name, email, or ID..."
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
            <SelectItem value="Fully Paid">Fully Paid</SelectItem>
            <SelectItem value="Overdue">Overdue</SelectItem>
            <SelectItem value="Partially Paid">Partially Paid</SelectItem>
            <SelectItem value="Not Paid">Not Paid</SelectItem>
            <SelectItem value="Refunded">Refunded</SelectItem>
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
                <TableHead className="h-10 px-3 md:px-6 text-[13px] font-semibold uppercase tracking-wider text-muted-foreground/90 w-[130px]">
                  ID
                </TableHead>
                <TableHead className="h-10 px-3 md:px-6 text-[13px] font-semibold uppercase tracking-wider text-muted-foreground/90 w-[200px]">
                  Member
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
              {currentSubscriptions.map((subscription, index) => (
                <TableRow 
                  key={subscription.id}
                  className={cn(
                    "border-border/20 transition-all duration-200",
                    "hover:bg-accent/30",
                    index === currentSubscriptions.length - 1 && "border-0"
                  )}
                >
                  <TableCell className="py-1.5 px-3 md:px-6 w-[130px]">
                    <div className="font-mono text-sm text-muted-foreground">
                      {subscription.id}
                    </div>
                  </TableCell>
                  <TableCell className="py-1.5 px-3 md:px-6 w-[200px]">
                    <div className="font-medium text-[15px] text-foreground">
                      {subscription.memberName}
                    </div>
                  </TableCell>
                  <TableCell className="py-1.5 px-3 md:px-6 w-[120px]">
                    <StatusBadge status={subscription.status} />
                  </TableCell>
                  <TableCell className="hidden sm:table-cell py-1.5 px-3 md:px-6 w-[140px]">
                    <div className="text-[14px] text-muted-foreground">
                      {new Date(subscription.startDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell py-1.5 px-3 md:px-6 w-[140px]">
                    <div className="text-[14px] text-muted-foreground">
                      {new Date(subscription.endDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                  </TableCell>
                  <TableCell className="py-1.5 px-3 md:px-6 w-[120px]">
                    <div className="font-semibold text-[15px] text-foreground">
                      GH₵ {subscription.amount.toFixed(2)}
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
                    {selectedSubscription.memberName}
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
                      selectedSubscription.status === "Fully Paid" &&
                        "bg-gradient-to-br from-emerald-500/15 to-emerald-600/25 text-emerald-700 dark:text-emerald-400 shadow-sm shadow-emerald-500/10",
                      selectedSubscription.status === "Overdue" &&
                        "bg-gradient-to-br from-[#F2B705]/15 to-[#F2B705]/25 text-[#F2B705] shadow-sm shadow-[#F2B705]/10",
                      selectedSubscription.status === "Partially Paid" &&
                        "bg-gradient-to-br from-[#F2B705]/15 to-[#F2B705]/25 text-[#F2B705] shadow-sm shadow-[#F2B705]/10",
                      selectedSubscription.status === "Not Paid" &&
                        "bg-gradient-to-br from-red-500/15 to-red-600/25 text-red-700 dark:text-red-400 shadow-sm shadow-red-500/10",
                      selectedSubscription.status === "Refunded" &&
                        "bg-gradient-to-br from-blue-500/15 to-blue-600/25 text-blue-700 dark:text-blue-400 shadow-sm shadow-blue-500/10"
                    )}
                  >
                    {selectedSubscription.status}
                  </Badge>
                  {selectedSubscription.autoRenewal && (
                    <Badge
                      variant="secondary"
                      className="rounded-full px-3 py-1 text-xs font-medium bg-gradient-to-br from-[#5A1E6E]/15 to-[#5A1E6E]/25 text-[#5A1E6E] shadow-sm shadow-[#5A1E6E]/10"
                    >
                      Auto-Renewal
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
                          <Mail className="h-3.5 w-3.5" />
                          Email
                        </div>
                        <div className="text-sm text-foreground pl-5.5">
                          {selectedSubscription.memberEmail}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          <Phone className="h-3.5 w-3.5" />
                          Phone
                        </div>
                        <div className="text-sm text-foreground pl-5.5">
                          {selectedSubscription.memberPhone}
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
                          {new Date(selectedSubscription.startDate).toLocaleDateString("en-US", {
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
                          {new Date(selectedSubscription.endDate).toLocaleDateString("en-US", {
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
                          GH₵ {selectedSubscription.amount.toFixed(2)}
                        </div>
                      </div>

                      {selectedSubscription.paidAmount !== undefined && (
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            <Wallet className="h-3.5 w-3.5" />
                            Amount Paid
                          </div>
                          <div className="text-sm text-foreground pl-5.5">
                            GH₵ {selectedSubscription.paidAmount.toFixed(2)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator className="bg-gradient-to-r from-transparent via-border/60 to-transparent" />

                  {/* Payment Details */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Payment Details
                    </h3>

                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          <CreditCard className="h-3.5 w-3.5" />
                          Payment Method
                        </div>
                        <div className="text-sm text-foreground pl-5.5">
                          {selectedSubscription.paymentMethod}
                        </div>
                      </div>

                      {selectedSubscription.transactionRef && (
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            <CreditCard className="h-3.5 w-3.5" />
                            Transaction Reference
                          </div>
                          <div className="text-sm text-foreground pl-5.5 font-mono break-all">
                            {selectedSubscription.transactionRef}
                          </div>
                        </div>
                      )}

                      {selectedSubscription.paymentDate && (
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            <Calendar className="h-3.5 w-3.5" />
                            Payment Date
                          </div>
                          <div className="text-sm text-foreground pl-5.5">
                            {new Date(selectedSubscription.paymentDate).toLocaleDateString("en-US", {
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
          <SheetTitle className="sr-only">Generate Subscription Widget</SheetTitle>
          <SheetDescription className="sr-only">
            Create a subscription widget link to share with members
          </SheetDescription>

          <div className="flex flex-col h-full overflow-y-auto">
            {/* Header Section */}
            <div className="px-6 pt-8 pb-6 border-b border-border/20">
              <h2 className="text-2xl font-semibold tracking-tight">Generate Subscription Widget</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Create a widget link for members to self-subscribe and pay
              </p>
            </div>

            {/* Content Section */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="space-y-6">
                {/* Info Banner */}
                <div className="rounded-xl bg-gradient-to-br from-[#5A1E6E]/10 to-[#5A1E6E]/5 p-4 flex items-start gap-3 border border-[#5A1E6E]/20">
                  <Link2 className="h-5 w-5 text-[#5A1E6E] shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-semibold text-sm text-foreground mb-1">
                      Self-Service Subscription
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Members can subscribe themselves using this widget link. Payments are processed securely through Hubtel.
                    </div>
                  </div>
                </div>

                <Separator className="bg-gradient-to-r from-transparent via-border/60 to-transparent" />

                {/* How It Works */}
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    How It Works
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#5A1E6E] to-[#3D123F] text-white text-xs font-semibold">
                        1
                      </div>
                      <div className="flex-1 pt-0.5">
                        <div className="text-sm font-medium text-foreground">Member Opens Link</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          Member clicks the widget link on their device
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#5A1E6E] to-[#3D123F] text-white text-xs font-semibold">
                        2
                      </div>
                      <div className="flex-1 pt-0.5">
                        <div className="text-sm font-medium text-foreground">Enter Details</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          Member enters their name, email, phone, or Member ID
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#5A1E6E] to-[#3D123F] text-white text-xs font-semibold">
                        3
                      </div>
                      <div className="flex-1 pt-0.5">
                        <div className="text-sm font-medium text-foreground">System Lookup</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          System looks up member and displays amount due
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#F36A21] to-[#F36A21]/90 text-white text-xs font-semibold">
                        4
                      </div>
                      <div className="flex-1 pt-0.5">
                        <div className="text-sm font-medium text-foreground">Pay via Hubtel</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          Member completes payment through Hubtel
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="bg-gradient-to-r from-transparent via-border/60 to-transparent" />

                {/* Widget Link */}
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Widget Link
                  </h3>

                  <div className="space-y-3">
                    <div className="relative">
                      <Input
                        readOnly
                        value="https://vocalessence.app/subscribe?widget=ve-2025"
                        className="pr-20 rounded-xl border-border/60 bg-muted/30 font-mono text-xs"
                      />
                      <Button
                        size="sm"
                        className="absolute right-1.5 top-1.5 h-7 gap-1.5 rounded-lg bg-gradient-to-br from-[#5A1E6E] to-[#3D123F] hover:from-[#5A1E6E]/90 hover:to-[#3D123F]/90"
                        onClick={() => {
                          copyToClipboard("https://vocalessence.app/subscribe?widget=ve-2025");
                        }}
                      >
                        <Copy className="h-3 w-3" />
                        <span className="text-xs">Copy</span>
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Share this link via email, SMS, or post it on your website
                    </p>
                  </div>
                </div>

                <Separator className="bg-gradient-to-r from-transparent via-border/60 to-transparent" />

                {/* Embed Code */}
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Embed Code (Optional)
                  </h3>

                  <div className="space-y-3">
                    <div className="relative">
                      <div className="rounded-xl border border-border/60 bg-muted/30 p-3 font-mono text-xs text-muted-foreground overflow-x-auto">
                        {'<iframe src="https://vocalessence.app/subscribe?widget=ve-2025" width="100%" height="600" frameborder="0"></iframe>'}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute right-2 top-2 h-7 gap-1.5 rounded-lg"
                        onClick={() => {
                          copyToClipboard('<iframe src="https://vocalessence.app/subscribe?widget=ve-2025" width="100%" height="600" frameborder="0"></iframe>');
                        }}
                      >
                        <Copy className="h-3 w-3" />
                        <span className="text-xs">Copy</span>
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Embed this code on your website to display the form directly
                    </p>
                  </div>
                </div>

                <Separator className="bg-gradient-to-r from-transparent via-border/60 to-transparent" />

                {/* Quick Actions */}
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Quick Actions
                  </h3>

                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full h-10 justify-start gap-3 rounded-xl hover:bg-accent/50 border-border/60"
                    >
                      <Mail className="h-4 w-4 text-[#5A1E6E]" />
                      <span className="text-sm">Email Link to All Members</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full h-10 justify-start gap-3 rounded-xl hover:bg-accent/50 border-border/60"
                    >
                      <Send className="h-4 w-4 text-[#F36A21]" />
                      <span className="text-sm">Send SMS to All Members</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="border-t border-border/20 px-6 py-4">
              <motion.div whileTap={{ scale: 0.96 }} className="w-full">
                <Button
                  onClick={handleCloseAddSubscription}
                  variant="outline"
                  className="w-full rounded-xl border-border/60 hover:bg-muted/50"
                >
                  Close
                </Button>
              </motion.div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}