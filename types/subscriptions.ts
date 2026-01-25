export type SubscriptionStatus = 
  | 'fully_paid'
  | 'partially_paid'
  | 'overdue'
  | 'not_paid'
  | 'refunded';

export type AssigneesCategory = 'EXECUTIVES' | 'MEMBERS' | 'BOTH';

export interface Subscription {
  id: string;
  organization: string; // UUID
  organization_name: string;
  name: string;
  description: string;
  amount: string; // Decimal string from backend
  start_date: string;
  end_date: string;
  assignees_category: AssigneesCategory;
  is_active: boolean;
  assigned_users_count: number;
  created_at: string;
  updated_at: string;
}

export interface UserSubscription {
  id: string;
  user: string; // UUID
  user_email: string;
  user_name: string;
  subscription: string; // UUID
  subscription_name: string;
  subscription_amount: string; // Decimal string
  status: SubscriptionStatus;
  amount_paid: string; // Decimal string
  payment_date: string | null;
  payment_reference: string;
  start_date: string;
  end_date: string;
  is_currently_active: boolean;
  notes: string;
  created_at: string;
  updated_at: string;
}
