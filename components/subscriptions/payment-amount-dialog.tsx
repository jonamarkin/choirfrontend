"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserSubscription } from "@/types/subscription";
import { subscriptionService } from "@/services/subscription.service";
import { getPaymentErrorMessage } from "@/utils/paymentErrors";

interface PaymentAmountDialogProps {
    subscription: UserSubscription;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onPaymentInitiated?: () => void;
}

export function PaymentAmountDialog({
    subscription,
    open,
    onOpenChange,
    onPaymentInitiated,
}: PaymentAmountDialogProps) {
    const [amount, setAmount] = React.useState<string>("");
    const [isLoading, setIsLoading] = React.useState(false);

    // Initialize amount with outstanding amount when dialog opens
    React.useEffect(() => {
        if (open) {
            setAmount(subscription.outstanding_amount.toFixed(2));
        }
    }, [open, subscription.outstanding_amount]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const amountNum = parseFloat(amount);
        if (isNaN(amountNum) || amountNum <= 0) {
            toast.error("Please enter a valid amount greater than 0");
            return;
        }

        if (amountNum > subscription.outstanding_amount) {
            toast.error(
                `Amount cannot exceed outstanding balance of GH₵ ${subscription.outstanding_amount.toFixed(
                    2
                )}`
            );
            return;
        }

        try {
            setIsLoading(true);

            const payment = await subscriptionService.initiatePayment(
                subscription.id,
                amountNum
            );

            // Store transaction ID for status checking after return
            if (typeof window !== "undefined") {
                sessionStorage.setItem("pending_transaction_id", payment.transaction_id);
                sessionStorage.setItem(
                    "pending_subscription_name",
                    subscription.subscription_name
                );
            }

            onPaymentInitiated?.();
            onOpenChange(false);

            // Redirect to Hubtel checkout
            window.location.href = payment.checkout_url;
        } catch (error) {
            const message = getPaymentErrorMessage(error);
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Make a Payment</DialogTitle>
                    <DialogDescription>
                        Enter the amount you would like to pay towards{" "}
                        <span className="font-medium text-foreground">
                            {subscription.subscription_name}
                        </span>
                        .
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                                Outstanding Balance
                            </Label>
                            <div className="text-2xl font-bold text-foreground">
                                GH₵ {subscription.outstanding_amount.toFixed(2)}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount to Pay (GH₵)</Label>
                            <Input
                                id="amount"
                                type="number"
                                step="0.01"
                                min="0.01"
                                max={subscription.outstanding_amount}
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="text-lg"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading} className="min-w-[100px]">
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing
                                </>
                            ) : (
                                "Pay Now"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
