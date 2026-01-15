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
import { PaymentAmountDialog } from "./payment-amount-dialog";

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
    const [showDialog, setShowDialog] = React.useState(false);
    const canMakePayment = parseCanMakePayment(subscription.can_make_payment);

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
        <>
            <motion.div whileTap={{ scale: 0.97 }} className={className}>
                <Button
                    onClick={() => setShowDialog(true)}
                    size="sm"
                    className="h-8 gap-1.5 text-xs bg-primary hover:bg-primary/90 w-full"
                >
                    <CreditCard className="h-3 w-3" />
                    Pay Now
                </Button>
            </motion.div>

            <PaymentAmountDialog
                subscription={subscription}
                open={showDialog}
                onOpenChange={setShowDialog}
                onPaymentInitiated={onPaymentInitiated}
            />
        </>
    );
}
