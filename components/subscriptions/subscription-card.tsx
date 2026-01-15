"use client";

import * as React from "react";
import { Calendar, TrendingUp } from "lucide-react";

import { cn } from "@/components/ui/utils";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PayButton } from "./pay-button";
import {
    UserSubscription,
    SubscriptionStatus,
    parseCanMakePayment,
} from "@/types/subscription";

interface SubscriptionCardProps {
    subscription: UserSubscription;
    showPayButton?: boolean;
    onPaymentInitiated?: () => void;
}

function StatusBadge({ status }: { status: SubscriptionStatus }) {
    const variants: Record<
        SubscriptionStatus,
        { label: string; className: string }
    > = {
        fully_paid: {
            label: "Paid",
            className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        },
        partially_paid: {
            label: "Partial",
            className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
        },
        overdue: {
            label: "Overdue",
            className: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
        },
        not_paid: {
            label: "Unpaid",
            className: "bg-muted text-muted-foreground border-border",
        },
        refunded: {
            label: "Refunded",
            className: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
        },
    };

    const variant = variants[status];

    return (
        <Badge
            variant="outline"
            className={cn("rounded-md px-2 py-0.5 text-[10px] font-medium border", variant.className)}
        >
            {variant.label}
        </Badge>
    );
}

export function SubscriptionCard({
    subscription,
    showPayButton = true,
    onPaymentInitiated,
}: SubscriptionCardProps) {
    const amount = parseFloat(subscription.subscription_amount) || 0;
    const amountPaid = parseFloat(subscription.amount_paid) || 0;
    const outstanding = subscription.outstanding_amount || 0;
    const progressPercentage = subscription.payment_progress_percentage || 0;
    const canMakePayment = parseCanMakePayment(subscription.can_make_payment);

    return (
        <div className="rounded-lg border border-border/40 bg-background/50 p-3 space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm text-foreground truncate">
                        {subscription.subscription_name}
                    </h3>
                    {subscription.subscription_description && (
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                            {subscription.subscription_description}
                        </p>
                    )}
                </div>
                <StatusBadge status={subscription.status} />
            </div>

            {/* Amount Row */}
            <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                    <div>
                        <span className="text-muted-foreground text-xs">Total</span>
                        <div className="font-medium">GH₵ {amount.toFixed(2)}</div>
                    </div>
                    {outstanding > 0 && (
                        <div>
                            <span className="text-muted-foreground text-xs">Due</span>
                            <div className="font-medium text-foreground">
                                GH₵ {outstanding.toFixed(2)}
                            </div>
                        </div>
                    )}
                </div>

                {/* Pay Button */}
                {showPayButton && outstanding > 0 && (
                    <PayButton
                        subscription={subscription}
                        onPaymentInitiated={onPaymentInitiated}
                    />
                )}
            </div>

            {/* Progress Bar - only show for partial payments */}
            {progressPercentage > 0 && progressPercentage < 100 && (
                <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            Progress
                        </span>
                        <span>{progressPercentage.toFixed(0)}%</span>
                    </div>
                    <Progress value={progressPercentage} className="h-1" />
                </div>
            )}

            {/* Date - subtle footer */}
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>
                    {subscription.start_date} — {subscription.end_date}
                </span>
            </div>
        </div>
    );
}
