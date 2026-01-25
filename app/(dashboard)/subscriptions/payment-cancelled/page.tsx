"use client";

import * as React from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { XCircle, ArrowRight, RefreshCw } from "lucide-react";

import { cn } from "@/components/ui/utils";
import { Button } from "@/components/ui/button";
import { cardBaseStyle } from "@/utils/premium-styles";

export default function PaymentCancelledPage() {
    const router = useRouter();
    const [subscriptionName, setSubscriptionName] = React.useState<string>("");

    React.useEffect(() => {
        const subName = sessionStorage.getItem("pending_subscription_name");
        if (subName) {
            setSubscriptionName(subName);
        }
        // Clear the pending transaction since it was cancelled
        sessionStorage.removeItem("pending_transaction_id");
    }, []);

    const handleRetry = () => {
        router.push("/subscriptions");
    };

    const handleGoToDashboard = () => {
        router.push("/home");
    };

    return (
        <div className="min-h-[60vh] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={cn(cardBaseStyle, "max-w-md w-full text-center space-y-6")}
            >
                <div className="flex justify-center">
                    <div className="p-4 rounded-full bg-muted/50">
                        <XCircle className="h-12 w-12 text-muted-foreground" />
                    </div>
                </div>

                <div>
                    <h1 className="text-xl font-semibold mb-2">Payment Cancelled</h1>
                    <p className="text-muted-foreground">
                        {subscriptionName
                            ? `Your payment for ${subscriptionName} was cancelled.`
                            : "Your payment was cancelled."}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                        No charges have been made to your account.
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
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}
