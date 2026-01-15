/**
 * Subscription-related TypeScript interfaces
 * Based on the backend API schema from Swagger
 */

// Subscription status types
export type SubscriptionStatus =
    | "fully_paid"
    | "partially_paid"
    | "overdue"
    | "not_paid"
    | "refunded";

export type PaymentTransactionStatus =
    | "initiated"
    | "pending"
    | "success"
    | "failed"
    | "expired"
    | "cancelled"
    | "refunded";

// Assignee categories for subscriptions
// Assignee categories for subscriptions
export type AssigneesCategory =
    | "EXECUTIVES"
    | "MEMBERS"
    | "BOTH";

/**
 * Subscription definition (admin view)
 */
export interface Subscription {
    id: string;
    organization: string;
    organization_name: string;
    name: string;
    description: string;
    amount: string;
    start_date: string;
    end_date: string;
    assignees_category: AssigneesCategory;
    is_active: boolean;
    assigned_users_count: string;
    created_at: string;
    updated_at: string;
}

/**
 * Payment history item within a user subscription
 */
export interface PaymentHistoryItem {
    amount: number;
    date: string;
    reference: string;
    channel: string;
    type: string;
}

/**
 * User subscription with payment status (from /my-subscriptions or /assignees)
 */
export interface UserSubscription {
    id: string;
    user: string;
    user_email: string;
    user_name: string;
    subscription: string;
    subscription_name: string;
    subscription_description: string;
    subscription_amount: string;
    status: SubscriptionStatus;
    amount_paid: string;
    outstanding_amount: string;
    payment_count: string;
    payment_date: string | null;
    payment_reference: string;
    payment_history: PaymentHistoryItem[] | string;
    can_make_payment: {
        allowed: boolean;
        message: string;
    } | string | boolean;
    payment_progress_percentage: string;
    start_date: string;
    end_date: string;
    notes: string;
    created_at: string;
    updated_at: string;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

/**
 * Payment initiation request
 */
export interface PaymentInitiateRequest {
    user_subscription_id: string;
    amount?: string;
    metadata?: string;
}

/**
 * Payment initiation response
 */
export interface PaymentInitiateResponse {
    transaction_id: string;
    client_reference: string;
    checkout_url: string;
    amount: string;
    currency: string;
    expires_at: string;
    description: string;
}

/**
 * Payment status response
 */
export interface PaymentStatus {
    transaction_id: string;
    client_reference: string;
    status: string;
    amount: string;
    currency: string;
    payment_channel: string;
    payment_type: string;
    confirmed_at: string | null;
    error_message: string;
}

/**
 * Full payment transaction details
 */
export interface PaymentTransaction {
    id: string;
    client_reference: string;
    checkout_id: string;
    hubtel_transaction_id: string;
    network_transaction_id: string;
    sales_invoice_id: string;
    user: string;
    user_email: string;
    user_name: string;
    user_subscription: string;
    subscription_name: string;
    organization: string;
    amount: string;
    currency: string;
    status: PaymentTransactionStatus;
    checkout_url: string;
    description: string;
    payment_channel: string;
    payment_type: string;
    customer_mobile_number: string;
    customer_name: string;
    charges: string;
    amount_after_charges: string;
    initiated_at: string;
    confirmed_at: string | null;
    expires_at: string;
    callback_received_at: string | null;
    error_message: string;
    retry_count: number;
    notes: string;
    created_at: string;
    updated_at: string;
    outstanding_amount: string;
}

/**
 * Helper to parse can_make_payment which can be string or object
 */
export function parseCanMakePayment(
    value: { allowed: boolean; message: string } | string | boolean
): { allowed: boolean; message: string } {
    if (typeof value === "boolean") {
        return value
            ? { allowed: true, message: "" }
            : { allowed: false, message: "Payment currently unavailable" };
    }
    if (typeof value === "string") {
        try {
            return JSON.parse(value);
        } catch {
            return { allowed: false, message: value };
        }
    }
    return value;
}

/**
 * Helper to parse payment_history which can be string or array
 */
export function parsePaymentHistory(
    value: PaymentHistoryItem[] | string
): PaymentHistoryItem[] {
    if (typeof value === "string") {
        try {
            return JSON.parse(value);
        } catch {
            return [];
        }
    }
    return value;
}
