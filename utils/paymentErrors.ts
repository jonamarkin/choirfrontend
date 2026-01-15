/**
 * Payment error handler
 * Centralizes user-friendly error messages for payment-related errors
 */

const errorMessages: Record<string, string> = {
    "Subscription is already fully paid": "This subscription is already fully paid.",
    "A payment is already in progress":
        "A payment is already in progress. Please wait 5 minutes before trying again.",
    "No outstanding amount to pay": "There is no outstanding balance to pay.",
    "Amount exceeds outstanding amount": "The amount entered exceeds what is owed.",
    "Payment not found": "Payment transaction not found.",
    "Subscription not found": "Subscription not found.",
    "User subscription not found": "User subscription not found.",
    "Cannot make payment": "You are not allowed to make payments at this time.",
};

/**
 * Get a user-friendly error message for payment errors
 */
export function getPaymentErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        // Check if we have a specific message for this error
        const specificMessage = errorMessages[error.message];
        if (specificMessage) {
            return specificMessage;
        }
        // Return the error message if it's not too technical
        if (error.message && !error.message.includes("API Error:")) {
            return error.message;
        }
    }
    return "Payment failed. Please try again later.";
}

/**
 * Poll payment status with exponential backoff
 */
export async function pollPaymentStatus<T>(
    checkFn: () => Promise<T>,
    isDone: (result: T) => boolean,
    maxAttempts: number = 10,
    initialDelayMs: number = 2000
): Promise<T> {
    let attempts = 0;

    while (attempts < maxAttempts) {
        const result = await checkFn();

        if (isDone(result)) {
            return result;
        }

        attempts++;
        // Exponential backoff: 2s, 4s, 6s... capped at 15s
        const delay = Math.min(initialDelayMs * attempts, 15000);
        await new Promise((resolve) => setTimeout(resolve, delay));
    }

    throw new Error("Payment verification timed out. Please check your payment history.");
}
