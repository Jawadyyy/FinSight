import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

/**
 * Shown when a page's first data load fails. One shared component so every page
 * fails the same way — a message and a retry — instead of some showing nothing
 * and others hanging on a skeleton forever.
 */
export function LoadError({
  onRetry,
  message = "We couldn't load this. Check your connection and try again.",
}: {
  onRetry: () => void;
  message?: string;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-3 py-20 text-center">
        <AlertTriangle className="h-8 w-8 text-muted-foreground" />
        <p className="max-w-sm text-sm text-muted-foreground">{message}</p>
        <Button variant="outline" onClick={onRetry}>
          Try again
        </Button>
      </CardContent>
    </Card>
  );
}
