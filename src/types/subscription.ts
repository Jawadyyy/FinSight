export type SubscriptionTier = 'free' | 'pro';

export interface Plan {
  tier: SubscriptionTier;
  name: string;
  /** null means unlimited. */
  monthlyUploads: number | null;
  aiInsights: boolean;
  highlights: string[];
}

export interface SubscriptionStatus {
  tier: SubscriptionTier;
  plan: Plan;
  uploads: {
    used: number;
    limit: number | null;
    remaining: number | null;
    period: string;
  };
  features: { aiInsights: boolean };
}
