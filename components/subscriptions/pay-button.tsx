"use client";

import * as React from "react";
import { motion } from "motion/react";
import { CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { UserSubscription, parseCanMakePayment } from "@/types/subscription";
import { subscriptionService } from "@/services/subscription.service";
import { getPaymentErrorMessage } from "@/utils/paymentErrors";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/components/ui/utils";

interface PayButtonProps {
    subscription: UserSubscription;
    className?: string;
    onPaymentInitiated?: () => void;
}

export function PayButton({
    subscription,
    className,
    onPaymentInitiated,
}: PayButtonProps) {
    const [isLoading, setIsLoading] = React.useState(false);

    const canMakePayment = parseCanMakePayment(subscription.can_make_payment);

    async function handlePayment() {
        if (!canMakePayment.allowed) {
            toast.error(canMakePayment.message);
            return;
        }

        try {
            setIsLoading(true);

            const payment = await subscriptionService.initiatePayment(subscription.id);

            // Store transaction ID for status checking after return
            if (typeof window !== "undefined") {
                sessionStorage.setItem("pending_transaction_id", payment.transaction_id);
                sessionStorage.setItem(
                    "pending_subscription_name",
                    subscription.subscription_name
                );
            }

            onPaymentInitiated?.();

            // Redirect to Hubtel checkout
            window.location.href = payment.checkout_url;
        } catch (error) {
            const message = getPaymentErrorMessage(error);
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    }

    if (!canMakePayment.allowed) {
        return (
            <TooltipProvider>
                <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                        <div className={cn("inline-block", className)}>
                            <Button
                                disabled
                                size="sm"
                                className="h-8 gap-1.5 text-xs w-full"
                            >
                                <CreditCard className="h-3 w-3" />
                                Pay Now
                            </Button>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{canMakePayment.message || "Payment unavailable"}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }

    return (
        <motion.div whileTap={{ scale: 0.97 }} className={className}>
            <Button
                onClick={handlePayment}
                disabled={isLoading}
                size="sm"
                className="h-8 gap-1.5 text-xs bg-primary hover:bg-primary/90 w-full"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Processing
                    </>
                ) : (
                    <>
                        <CreditCard className="h-3 w-3" />
                        Pay Now
                    </>
                )}
            </Button>
        </motion.div>
    );
}
