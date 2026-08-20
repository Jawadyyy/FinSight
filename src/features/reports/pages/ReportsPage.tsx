import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Download, FileSpreadsheet, FileText, Loader2 } from 'lucide-react';
import { TRANSACTION_CATEGORIES } from '@/types/transaction';
import { downloadMonthlyPdf, downloadTransactionsCsv } from '../api/reportsApi';

const BRAND = '#644fef';
const ALL = 'all';

export default function ReportsPage() {
  const thisMonth = new Date().toISOString().slice(0, 7);

  const [month, setMonth] = useState(thisMonth);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [category, setCategory] = useState(ALL);
  const [type, setType] = useState(ALL);

  const [busy, setBusy] = useState<'pdf' | 'csv' | null>(null);
  const [error, setError] = useState('');

  const run = async (kind: 'pdf' | 'csv', task: () => Promise<void>) => {
    setBusy(kind);
    setError('');
    try {
      await task();
    } catch {
      setError('That export failed. Check you are still signed in and try again.');
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-2xl font-bold">Reports</h2>
        <p className="text-sm text-muted-foreground">
          Download your month as a formatted report, or your transactions as a spreadsheet.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {/* ---------- PDF ---------- */}
        <Card className="shadow-none">
          <CardHeader className="flex flex-row items-start gap-3 pb-3">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${BRAND}1a`, color: BRAND }}
            >
              <FileText className="h-5 w-5" />
            </span>
            <div>
              <CardTitle className="text-base font-semibold">Monthly report</CardTitle>
              <p className="text-sm text-muted-foreground">
                Summary, insights, category breakdown, budgets and every transaction.
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="report-month">Month</Label>
              <Input
                id="report-month"
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              />
            </div>

            <Button
              className="w-full text-white"
              style={{ backgroundColor: BRAND }}
              disabled={busy !== null || !month}
              onClick={() => run('pdf', () => downloadMonthlyPdf(month))}
            >
              {busy === 'pdf' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Building your report...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </>
              )}
            </Button>

            {busy === 'pdf' && (
              <p className="text-center text-xs text-muted-foreground">
                Writing the insights section. This usually takes a second.
              </p>
            )}
          </CardContent>
        </Card>

        {/* ---------- CSV ---------- */}
        <Card className="shadow-none">
          <CardHeader className="flex flex-row items-start gap-3 pb-3">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${BRAND}1a`, color: BRAND }}
            >
              <FileSpreadsheet className="h-5 w-5" />
            </span>
            <div>
              <CardTitle className="text-base font-semibold">Transactions export</CardTitle>
              <p className="text-sm text-muted-foreground">
                Every field, including references and running balance. Opens in Excel.
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="csv-from">From</Label>
                <Input
                  id="csv-from"
                  type="date"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="csv-to">To</Label>
                <Input
                  id="csv-to"
                  type="date"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL}>All categories</SelectItem>
                    {TRANSACTION_CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL}>All types</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="transfer">Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full"
              disabled={busy !== null}
              onClick={() =>
                run('csv', () =>
                  downloadTransactionsCsv({
                    from: from || undefined,
                    to: to || undefined,
                    category: category === ALL ? undefined : category,
                    type: type === ALL ? undefined : type,
                  }),
                )
              }
            >
              {busy === 'csv' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Preparing CSV...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground">
              Leave the dates empty to export everything.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
