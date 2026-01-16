"use client";

import * as React from "react";
import { format } from "date-fns";
import { RefreshCw, CheckCircle2, XCircle, AlertCircle, Clock } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"; // Ensure you have this or standard tooltip
import { subscriptionService } from "@/services/subscription.service";
import { PaymentTransaction, PaymentTransactionStatus } from "@/types/subscription";

interface TransactionHistoryListProps {
    userSubscriptionId: string;
}

const statusConfig: Record<
    PaymentTransactionStatus,
    { label: string; icon: React.ElementType; className: string }
> = {
    success: {
        label: "Success",
        icon: CheckCircle2,
        className: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
    },
    failed: {
        label: "Failed",
        icon: XCircle,
        className: "text-red-600 bg-red-500/10 border-red-500/20",
    },
    pending: {
        label: "Pending",
        icon: Clock,
        className: "text-amber-600 bg-amber-500/10 border-amber-500/20",
    },
    initiated: {
        label: "Initiated",
        icon: Clock,
        className: "text-blue-600 bg-blue-500/10 border-blue-500/20",
    },
    expired: {
        label: "Expired",
        icon: AlertCircle,
        className: "text-gray-600 bg-gray-500/10 border-gray-500/20",
    },
    cancelled: {
        label: "Cancelled",
        icon: XCircle,
        className: "text-gray-600 bg-gray-500/10 border-gray-500/20",
    },
    refunded: {
        label: "Refunded",
        icon: RefreshCw,
        className: "text-purple-600 bg-purple-500/10 border-purple-500/20",
    },
};

export function TransactionHistoryList({ userSubscriptionId }: TransactionHistoryListProps) {
    const [transactions, setTransactions] = React.useState<PaymentTransaction[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [checkingIds, setCheckingIds] = React.useState<Set<string>>(new Set());

    const fetchTransactions = React.useCallback(async () => {
        try {
            setLoading(true);
            const data = await subscriptionService.fetchPaymentHistory({
                user_subscription_id: userSubscriptionId,
            });
            setTransactions(data);
        } catch (error) {
            console.error("Failed to fetch transactions:", error);
            toast.error("Failed to load payment history");
        } finally {
            setLoading(false);
        }
    }, [userSubscriptionId]);

    React.useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const handleCheckStatus = async (transactionId: string) => {
        try {
            setCheckingIds((prev) => new Set(prev).add(transactionId));
            const statusResponse = await subscriptionService.checkPaymentStatus(transactionId);

            // Update the plain transaction list with the new status
            setTransactions((prev) =>
                prev.map((t) =>
                    t.id === transactionId
                        ? { ...t, status: statusResponse.status as PaymentTransactionStatus }
                        : t
                )
            );

            toast.success(`Status updated: ${statusResponse.status}`);
        } catch (error) {
            console.error("Failed to check status:", error);
            toast.error("Failed to check transaction status");
        } finally {
            setCheckingIds((prev) => {
                const next = new Set(prev);
                next.delete(transactionId);
                return next;
            });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8 text-muted-foreground text-sm">
                Loading history...
            </div>
        );
    }

    if (transactions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-muted-foreground text-sm bg-muted/30 rounded-lg border border-border/50">
                <Clock className="w-8 h-8 mb-2 opacity-50" />
                <p>No payment history found</p>
            </div>
        );
    }

    return (
        <div className="rounded-lg border border-border/40 overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                        <TableHead className="w-[100px] text-xs">Date</TableHead>
                        <TableHead className="text-xs">Reference</TableHead>
                        <TableHead className="text-right text-xs">Amount</TableHead>
                        <TableHead className="w-[100px] text-xs">Status</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.map((tx) => {
                        const status = statusConfig[tx.status] || statusConfig.initiated;
                        const Amount = parseFloat(tx.amount);
                        const isPending = tx.status === 'pending' || tx.status === 'initiated';
                        const isChecking = checkingIds.has(tx.id);

                        return (
                            <TableRow key={tx.id} className="text-sm">
                                <TableCell className="text-xs text-muted-foreground">
                                    {format(new Date(tx.created_at), "MMM d, yyyy")}
                                    <div className="text-[10px] opacity-70">
                                        {format(new Date(tx.created_at), "h:mm a")}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="font-mono text-xs">{tx.client_reference}</div>
                                    <div className="text-[10px] text-muted-foreground truncate max-w-[120px]">
                                        {tx.payment_type || tx.payment_channel}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right font-medium">
                                    {tx.currency} {Amount.toFixed(2)}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={cn("text-[10px] items-center gap-1 font-normal py-0.5", status.className)}>
                                        <status.icon className="w-3 h-3" />
                                        {status.label}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {isPending && (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6"
                                                    onClick={() => handleCheckStatus(tx.id)}
                                                    disabled={isChecking}
                                                >
                                                    <RefreshCw className={cn("h-3 w-3", isChecking && "animate-spin")} />
                                                    <span className="sr-only">Check Status</span>
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>Check Status</TooltipContent>
                                        </Tooltip>
                                    )}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
