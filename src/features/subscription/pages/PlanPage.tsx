import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Check, Infinity as InfinityIcon, Loader2, Sparkles, Upload } from 'lucide-react';
import { getPlans, getSubscription } from '../api/subscriptionApi';
import { getBillingStatus, openBillingPortal, startCheckout } from '../api/billingApi';
import type { Plan, SubscriptionStatus } from '@/types/subscription';

const BRAND = '#644fef';

export default function PlanPage() {
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [billingEnabled, setBillingEnabled] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [s, p, b] = await Promise.all([
          getSubscription(),
          getPlans(),
          // Payments being unconfigured is not an error, just a disabled button.
          getBillingStatus().catch(() => ({ enabled: false })),
        ]);
        if (cancelled) return;
        setStatus(s);
        setPlans(p);
        setBillingEnabled(b.enabled);
      } catch {
        if (!cancelled) setError('Could not load your plan.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Stripe sends the browser back here after checkout. The webhook is what
  // actually grants Pro, so it can land a moment before the tier updates.
  useEffect(() => {
    const outcome = new URLSearchParams(window.location.search).get('checkout');
    if (!outcome) return;

    setNotice(
      outcome === 'success'
        ? 'Payment received. Your plan updates as soon as Stripe confirms it — refresh in a moment if it still shows Free.'
        : 'Checkout was cancelled. You have not been charged.',
    );
    window.history.replaceState({}, '', window.location.pathname);
  }, []);

  const run = async (task: () => Promise<void>) => {
    setBusy(true);
    setError('');
    try {
      await task();
    } catch {
      setError('Could not reach Stripe. Please try again.');
      setBusy(false);
    }
  };

  const upgrade = () => run(startCheckout);
  const manage = () => run(openBillingPortal);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-28 w-full rounded-xl" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-80 w-full rounded-xl" />
          <Skeleton className="h-80 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !status) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error || 'No plan information.'}</AlertDescription>
      </Alert>
    );
  }

  const { uploads } = status;
  const unlimited = uploads.limit === null;
  const usedPct = unlimited ? 0 : Math.min((uploads.used / (uploads.limit || 1)) * 100, 100);
  const exhausted = !unlimited && (uploads.remaining ?? 0) === 0;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-2xl font-bold">Plan</h2>
        <p className="text-sm text-muted-foreground">
          You are on the {status.plan.name} plan.
        </p>
      </div>

      {notice && (
        <Alert>
          <AlertDescription>{notice}</AlertDescription>
        </Alert>
      )}

      {/* Usage first: the number that decides whether you need to upgrade. */}
      <Card className="shadow-none">
        <CardContent className="space-y-3 p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${BRAND}1a`, color: BRAND }}
              >
                <Upload className="h-4 w-4" />
              </span>
              <div>
                <p className="font-semibold">Statement uploads</p>
                <p className="text-xs text-muted-foreground">
                  Resets at the start of each month · {uploads.period}
                </p>
              </div>
            </div>

            <p className="text-sm font-medium tabular-nums">
              {unlimited ? (
                <span className="flex items-center gap-1.5 text-emerald-700">
                  <InfinityIcon className="h-4 w-4" /> Unlimited
                </span>
              ) : (
                `${uploads.used} of ${uploads.limit} used`
              )}
            </p>
          </div>

          {!unlimited && (
            <>
              <Progress
                value={usedPct}
                className={`h-2 ${exhausted ? '[&>[data-slot=progress-indicator]]:bg-destructive' : ''}`}
              />
              <p className="text-xs text-muted-foreground">
                {exhausted
                  ? 'You have used every upload this month. Upgrade for unlimited uploads.'
                  : `${uploads.remaining} upload${uploads.remaining === 1 ? '' : 's'} left this month.`}
              </p>
            </>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {plans.map((plan) => {
          const current = plan.tier === status.tier;
          const isPro = plan.tier === 'pro';

          return (
            <Card
              key={plan.tier}
              className="relative overflow-hidden shadow-none"
              // The Pro card is the only accented one, so the upgrade path is
              // obvious without shouting.
              style={isPro ? { borderColor: BRAND, borderWidth: 2 } : undefined}
            >
              {isPro && <div className="h-1 w-full" style={{ backgroundColor: BRAND }} />}

              <CardContent className="space-y-4 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-lg font-bold">{plan.name}</h3>
                    {isPro && <Sparkles className="h-4 w-4" style={{ color: BRAND }} />}
                  </div>
                  {current && <Badge variant="secondary">Current plan</Badge>}
                </div>

                <p className="text-sm text-muted-foreground">
                  {isPro
                    ? 'Everything in Free, plus unlimited uploads and AI analysis of your spending.'
                    : 'Everything you need to track spending, budgets and analytics.'}
                </p>

                <ul className="space-y-2">
                  {plan.highlights.map((line) => (
                    <li key={line} className="flex items-start gap-2 text-sm">
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0"
                        style={{ color: isPro ? BRAND : '#1baf7a' }}
                      />
                      <span>{line}</span>
                    </li>
                  ))}
                  {!plan.aiInsights && (
                    <li className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-0.5 h-4 w-4 shrink-0 text-center">—</span>
                      <span>No AI insights</span>
                    </li>
                  )}
                </ul>

                {isPro && !current && (
                  <>
                    <Button
                      className="w-full text-white"
                      style={{ backgroundColor: BRAND }}
                      disabled={!billingEnabled || busy}
                      onClick={upgrade}
                    >
                      {busy ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Opening checkout...
                        </>
                      ) : (
                        'Upgrade to Pro'
                      )}
                    </Button>
                    <p className="text-center text-xs text-muted-foreground">
                      {billingEnabled
                        ? 'You will be taken to Stripe to pay. Cancel any time.'
                        : 'Card payments are not configured on this server.'}
                    </p>
                  </>
                )}

                {isPro && current && (
                  <Button
                    variant="outline"
                    className="w-full"
                    disabled={!billingEnabled || busy}
                    onClick={manage}
                  >
                    Manage billing
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
