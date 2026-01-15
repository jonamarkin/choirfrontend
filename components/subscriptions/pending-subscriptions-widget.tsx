"use client";

import * as React from "react";
import { motion } from "motion/react";
import { CreditCard, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

import { cn } from "@/components/ui/utils";
import { SubscriptionCard } from "./subscription-card";
import { usePendingSubscriptions } from "@/hooks/useSubscriptions";

export function PendingSubscriptionsWidget() {
    const { pendingSubscriptions, isLoading, error, mutate } =
        usePendingSubscriptions();

    // Don't render if loading
    if (isLoading) {
        return (
            <div className="rounded-xl border border-border/40 bg-card p-4">
                <div className="flex items-center justify-center gap-2 py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                        Loading subscriptions...
                    </span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
                <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="h-5 w-5" />
                    <span className="text-sm">Failed to load subscriptions</span>
                </div>
            </div>
        );
    }

    if (pendingSubscriptions.length === 0) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-border/40 bg-card p-5"
        >
            {/* Header - Clean and simple */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <h2 className="text-sm font-medium text-foreground">
                        Pending Payments
                    </h2>
                </div>
                <span className="text-xs text-muted-foreground">
                    {pendingSubscriptions.length} item{pendingSubscriptions.length !== 1 ? "s" : ""}
                </span>
            </div>

            {/* Subscription Cards */}
            <div className="space-y-3">
                {pendingSubscriptions.slice(0, 3).map((subscription) => (
                    <SubscriptionCard
                        key={subscription.id}
                        subscription={subscription}
                        showPayButton
                        onPaymentInitiated={() => mutate()}
                    />
                ))}
            </div>

            {/* Show more link */}
            {pendingSubscriptions.length > 3 && (
                <div className="mt-4 pt-3 border-t border-border/40">
                    <Link
                        href="/subscriptions"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        View all {pendingSubscriptions.length} subscriptions →
                    </Link>
                </div>
            )}
        </motion.div>
    );
}
