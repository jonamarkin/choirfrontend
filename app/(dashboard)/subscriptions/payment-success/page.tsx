"use client";

import * as React from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import {
    CheckCircle,
    XCircle,
    Clock,
    Loader2,
    ArrowRight,
    RefreshCw,
} from "lucide-react";

import { cn } from "@/components/ui/utils";
import { Button } from "@/components/ui/button";
import { cardBaseStyle } from "@/utils/premium-styles";
import { subscriptionService } from "@/services/subscription.service";
import { PaymentStatus } from "@/types/subscription";
import { pollPaymentStatus } from "@/utils/paymentErrors";

type PageStatus = "loading" | "success" | "failed" | "pending" | "expired";

export default function PaymentSuccessPage() {
    const router = useRouter();
    const [status, setStatus] = React.useState<PageStatus>("loading");
    const [payment, setPayment] = React.useState<PaymentStatus | null>(null);
    const [subscriptionName, setSubscriptionName] = React.useState<string>("");
    const [error, setError] = React.useState<string>("");

    React.useEffect(() => {
        async function verifyPayment() {
            const transactionId = sessionStorage.getItem("pending_transaction_id");
            const subName = sessionStorage.getItem("pending_subscription_name");

            if (subName) {
                setSubscriptionName(subName);
            }

            if (!transactionId) {
                setStatus("failed");
                setError("No transaction found. Please check your payment history.");
                return;
            }

            try {
                // Poll for payment status with exponential backoff
                const result = await pollPaymentStatus(
                    () => subscriptionService.checkPaymentStatus(transactionId),
                    (status) =>
                        ["success", "failed", "expired", "cancelled", "refunded"].includes(
                            status.status
                        ),
                    10, // max attempts
                    2000 // initial delay
                );

                setPayment(result);

                if (result.status === "success") {
                    setStatus("success");
                    // Clear session storage on success
                    sessionStorage.removeItem("pending_transaction_id");
                    sessionStorage.removeItem("pending_subscription_name");
                } else if (result.status === "failed" || result.status === "cancelled") {
                    setStatus("failed");
                    setError(result.error_message || "Payment was not successful.");
                } else if (result.status === "expired") {
                    setStatus("expired");
                } else {
                    setStatus("pending");
                }
            } catch (err) {
                // Timeout or error during polling
                setStatus("pending");
                setError(
                    err instanceof Error ? err.message : "Failed to verify payment status."
                );
            }
        }

        verifyPayment();
    }, []);

    const handleGoToDashboard = () => {
        router.push("/home");
    };

    const handleGoToSubscriptions = () => {
        router.push("/subscriptions");
    };

    const handleRetry = () => {
        router.push("/subscriptions");
    };

    return (
        <div className="min-h-[60vh] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={cn(cardBaseStyle, "max-w-md w-full text-center space-y-6")}
            >
                {status === "loading" && (
                    <>
                        <div className="flex justify-center">
                            <div className="p-4 rounded-full bg-[#5A1E6E]/10">
                                <Loader2 className="h-12 w-12 text-[#5A1E6E] animate-spin" />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold mb-2">
                                Verifying Payment...
                            </h1>
                            <p className="text-muted-foreground">
                                Please wait while we confirm your payment.
                            </p>
                        </div>
                    </>
                )}

                {status === "success" && (
                    <>
                        <div className="flex justify-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", delay: 0.1 }}
                                className="p-4 rounded-full bg-emerald-500/10"
                            >
                                <CheckCircle className="h-12 w-12 text-emerald-500" />
                            </motion.div>
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold text-emerald-600 mb-2">
                                Payment Successful!
                            </h1>
                            {subscriptionName && (
                                <p className="text-muted-foreground mb-1">
                                    Your payment for <strong>{subscriptionName}</strong> has been
                                    confirmed.
                                </p>
                            )}
                            {payment && (
                                <p className="text-sm text-muted-foreground">
                                    Amount: GH₵ {parseFloat(payment.amount).toFixed(2)}
                                </p>
                            )}
                        </div>
                        <div className="flex flex-col gap-2">
                            <Button
                                onClick={handleGoToDashboard}
                                className="gap-2 bg-[#5A1E6E] hover:bg-[#5A1E6E]/90"
                            >
                                Go to Dashboard
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" onClick={handleGoToSubscriptions}>
                                View Subscriptions
                            </Button>
                        </div>
                    </>
                )}

                {status === "failed" && (
                    <>
                        <div className="flex justify-center">
                            <div className="p-4 rounded-full bg-red-500/10">
                                <XCircle className="h-12 w-12 text-red-500" />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold text-red-600 mb-2">
                                Payment Failed
                            </h1>
                            <p className="text-muted-foreground">
                                {error || "Your payment could not be processed."}
                            </p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Button
                                onClick={handleRetry}
                                className="gap-2 bg-[#F36A21] hover:bg-[#F36A21]/90"
                            >
                                <RefreshCw className="h-4 w-4" />
                                Try Again
                            </Button>
                            <Button variant="outline" onClick={handleGoToDashboard}>
                                Go to Dashboard
                            </Button>
                        </div>
                    </>
                )}

                {status === "pending" && (
                    <>
                        <div className="flex justify-center">
                            <div className="p-4 rounded-full bg-[#F2B705]/10">
                                <Clock className="h-12 w-12 text-[#F2B705]" />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold text-[#F2B705] mb-2">
                                Payment Pending
                            </h1>
                            <p className="text-muted-foreground">
                                Your payment is still being processed. This may take a few
                                minutes.
                            </p>
                            {error && (
                                <p className="text-sm text-muted-foreground mt-2">{error}</p>
                            )}
                        </div>
                        <div className="flex flex-col gap-2">
                            <Button
                                onClick={handleGoToSubscriptions}
                                className="gap-2 bg-[#5A1E6E] hover:bg-[#5A1E6E]/90"
                            >
                                Check Payment History
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" onClick={handleGoToDashboard}>
                                Go to Dashboard
                            </Button>
                        </div>
                    </>
                )}

                {status === "expired" && (
                    <>
                        <div className="flex justify-center">
                            <div className="p-4 rounded-full bg-[#F2B705]/10">
                                <Clock className="h-12 w-12 text-[#F2B705]" />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold text-[#F2B705] mb-2">
                                Payment Session Expired
                            </h1>
                            <p className="text-muted-foreground">
                                Your payment session has expired. Please try again.
                            </p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Button
                                onClick={handleRetry}
                                className="gap-2 bg-[#F36A21] hover:bg-[#F36A21]/90"
                            >
                                <RefreshCw className="h-4 w-4" />
                                Try Again
                            </Button>
                            <Button variant="outline" onClick={handleGoToDashboard}>
                                Go to Dashboard
                            </Button>
                        </div>
                    </>
                )}
            </motion.div>
        </div>
    );
}
