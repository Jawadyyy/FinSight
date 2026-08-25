import { Wallet } from 'lucide-react';
import { BRAND } from './landing-data';

export function LandingFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Wallet className="h-4 w-4" style={{ color: BRAND }} />
          <span className="font-medium text-foreground">FinSight</span>
        </div>
        <p>Personal finance, without the spreadsheet.</p>
      </div>
    </footer>
  );
}
