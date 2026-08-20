import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  AlertTriangle,
  CircleAlert,
  Info,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { getInsights } from '../api/insightsApi';
import type { InsightFact, InsightSeverity, Insights } from '@/types/insights';

const BRAND = '#644fef';

const SEVERITY: Record<
  InsightSeverity,
  { icon: typeof Info; dot: string; text: string }
> = {
  critical: { icon: CircleAlert, dot: 'bg-destructive', text: 'text-destructive' },
  warning: { icon: AlertTriangle, dot: 'bg-amber-500', text: 'text-amber-700' },
  positive: { icon: TrendingUp, dot: 'bg-emerald-500', text: 'text-emerald-700' },
  info: { icon: Info, dot: 'bg-muted-foreground', text: 'text-muted-foreground' },
};

function FactRow({ fact }: { fact: InsightFact }) {
  const style = SEVERITY[fact.severity];
  const Icon = style.icon;

  return (
    <li className="flex items-start gap-2.5 text-sm">
      <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${style.text}`} />
      <span>{fact.message}</span>
    </li>
  );
}

export default function InsightsCard({ month }: { month?: string }) {
  const [data, setData] = useState<Insights | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setFailed(false);
      try {
        const result = await getInsights(month);
        if (!cancelled) setData(result);
      } catch {
        if (!cancelled) setFailed(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [month]);

  if (loading) {
    return (
      <Card className="shadow-none">
        <CardContent className="space-y-3 p-5">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </CardContent>
      </Card>
    );
  }

  // Insights are a bonus on top of the dashboard, so a failure stays silent
  // rather than pushing an error at someone who came to see their spending.
  if (failed || !data || data.facts.length === 0) return null;

  return (
    <Card className="shadow-none">
      <CardHeader className="flex flex-row items-start justify-between pb-3">
        <div className="flex items-start gap-3">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${BRAND}1a`, color: BRAND }}
          >
            <Sparkles className="h-4 w-4" />
          </span>
          <div>
            <CardTitle className="text-base font-semibold">{data.headline}</CardTitle>
            <p className="text-xs text-muted-foreground">Insights for {data.month}</p>
          </div>
        </div>

        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="secondary" className="cursor-default">
                {data.aiGenerated ? 'AI' : 'Rules'}
              </Badge>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              {data.aiGenerated
                ? 'Figures are calculated from your transactions; AI only writes the wording.'
                : 'AI was unavailable, so this is written from templates. The figures are unchanged.'}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm leading-relaxed">{data.summary}</p>

        <ul className="space-y-2 border-t pt-4">
          {data.facts.slice(0, 5).map((fact, i) => (
            <FactRow key={`${fact.type}-${i}`} fact={fact} />
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
