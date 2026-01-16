"use client";

import * as React from "react";
import {
    ChevronsRight,
    TrendingUp,
    AlertCircle,
    Search,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

import { cn } from "@/components/ui/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    subscriptionAdminService,
} from "@/services/subscription-admin.service";
import { UserSubscription, SubscriptionStatus } from "@/types/subscription";
import { TransactionHistoryList } from "./transaction-history-list";

interface AssigneesListProps {
    subscriptionId: string;
}

const statusColors: Record<SubscriptionStatus, string> = {
    fully_paid: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    partially_paid: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    overdue: "bg-red-500/10 text-red-600 border-red-500/20",
    not_paid: "bg-muted text-muted-foreground border-border",
    refunded: "bg-purple-500/10 text-purple-600 border-purple-500/20",
};

export function AssigneesList({ subscriptionId }: AssigneesListProps) {
    const [assignees, setAssignees] = React.useState<UserSubscription[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [expandedUserId, setExpandedUserId] = React.useState<string | null>(null);

    React.useEffect(() => {
        const fetchAssignees = async () => {
            try {
                setLoading(true);
                const data = await subscriptionAdminService.getSubscriptionAssignees(
                    subscriptionId
                );
                setAssignees(data);
            } catch (error) {
                console.error("Failed to fetch assignees:", error);
                toast.error("Failed to load subscription assignees");
            } finally {
                setLoading(false);
            }
        };

        if (subscriptionId) {
            fetchAssignees();
        }
    }, [subscriptionId]);

    const filteredAssignees = assignees.filter((assignee) =>
        assignee.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assignee.user_email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleExpand = (id: string) => {
        setExpandedUserId(expandedUserId === id ? null : id);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12 text-muted-foreground">
                Loading assignees...
            </div>
        );
    }

    if (assignees.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-muted-foreground bg-muted/30 rounded-lg border border-border/50">
                <AlertCircle className="w-8 h-8 mb-2 opacity-50" />
                <p>No users assigned to this plan yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search members..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-9 rounded-lg bg-background/50"
                />
            </div>

            <div className="rounded-lg border border-border/40 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/30 hover:bg-muted/30">
                            <TableHead className="w-[30px]"></TableHead>
                            <TableHead>Member</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Paid</TableHead>
                            <TableHead className="text-right">Balance</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredAssignees.map((assignee) => {
                            const progress = assignee.payment_progress_percentage || 0;
                            const isExpanded = expandedUserId === assignee.id;

                            return (
                                <React.Fragment key={assignee.id}>
                                    <TableRow
                                        className="cursor-pointer hover:bg-muted/30 transition-colors"
                                        onClick={() => toggleExpand(assignee.id)}
                                    >
                                        <TableCell>
                                            {isExpanded ? (
                                                <ChevronUp className="h-4 w-4 text-muted-foreground" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium text-sm">
                                                {assignee.user_name}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {assignee.user_email}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    "rounded-md px-1.5 py-0 text-[10px] font-normal border",
                                                    statusColors[assignee.status]
                                                )}
                                            >
                                                {assignee.status.replace("_", " ")}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="text-sm font-medium text-emerald-600 dark:text-emerald-500">
                                                {parseFloat(assignee.amount_paid).toFixed(2)}
                                            </div>
                                            {progress > 0 && progress < 100 && (
                                                <div className="flex items-center justify-end gap-1 mt-1">
                                                    <Progress value={progress} className="h-1 w-12" />
                                                    <span className="text-[9px] text-muted-foreground">
                                                        {progress.toFixed(0)}%
                                                    </span>
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div
                                                className={cn(
                                                    "text-sm font-medium",
                                                    assignee.outstanding_amount > 0
                                                        ? "text-amber-600 dark:text-amber-500"
                                                        : "text-muted-foreground"
                                                )}
                                            >
                                                {assignee.outstanding_amount.toFixed(2)}
                                            </div>
                                        </TableCell>
                                    </TableRow>

                                    {/* Expanded Detail View */}
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <TableRow className="bg-muted/10 hover:bg-muted/10">
                                                <TableCell colSpan={5} className="p-0 border-b">
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        <div className="p-4 pl-12 space-y-2">
                                                            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                                                                Transaction History
                                                            </h4>
                                                            <TransactionHistoryList userSubscriptionId={assignee.id} />
                                                        </div>
                                                    </motion.div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </AnimatePresence>
                                </React.Fragment>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
