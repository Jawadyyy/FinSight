import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Pencil, Trash2 } from 'lucide-react';
import { formatMoney, formatSignedMoney } from '@/lib/currency';
import { categoryColor, describeCategory } from './transaction-display';
import type { Transaction } from '@/types/transaction';

interface Props {
  transaction: Transaction | null;
  onClose: () => void;
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
}

const sourceLabel: Record<Transaction['source'], string> = {
  manual: 'Added by hand',
  csv: 'Imported from CSV',
  pdf: 'Parsed from PDF',
  scan: 'Read from a scan by AI',
};

const amountColor: Record<Transaction['type'], string> = {
  income: 'text-green-700',
  expense: 'text-foreground',
  transfer: 'text-muted-foreground',
};

/** One label/value line. Rows with nothing to show are skipped by the caller. */
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-1.5">
      <span className="shrink-0 text-sm text-muted-foreground">{label}</span>
      <span className="min-w-0 break-words text-right text-sm font-medium">{children}</span>
    </div>
  );
}

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? iso : d.toLocaleString();
}

export default function TransactionDetailDialog({
  transaction: tx,
  onClose,
  onEdit,
  onDelete,
}: Props) {
  return (
    <Dialog open={tx !== null} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg">
        {tx && (
          <>
            <DialogHeader>
              <DialogTitle className="pr-6 leading-snug">
                {tx.merchant ?? tx.description}
              </DialogTitle>
              <DialogDescription>
                {tx.date} · {sourceLabel[tx.source]}
              </DialogDescription>
            </DialogHeader>

            <div className={`font-mono text-3xl font-semibold ${amountColor[tx.type]}`}>
              {formatSignedMoney(tx.amount, tx.currency, tx.type)}
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className={categoryColor[tx.category]}>
                {tx.category}
              </Badge>
              <Badge variant="outline">{tx.type}</Badge>
              {tx.needsReview && (
                <Badge variant="outline" className="border-yellow-500 text-yellow-700">
                  <AlertTriangle className="mr-1 h-3 w-3" /> Needs review
                </Badge>
              )}
            </div>

            <Separator />

            <div className="max-h-[45vh] divide-y overflow-y-auto">
              {tx.merchant && <Row label="Description">{tx.description}</Row>}
              {tx.reference && (
                <Row label="Reference">
                  <span className="font-mono">{tx.reference}</span>
                </Row>
              )}
              {tx.originalAmount != null && tx.originalCurrency && (
                <Row label="Original amount">
                  <span className="font-mono">
                    {formatMoney(tx.originalAmount, tx.originalCurrency)}
                  </span>
                </Row>
              )}
              {tx.balanceAfter != null && (
                <Row label="Balance after">
                  <span className="font-mono">
                    {formatMoney(tx.balanceAfter, tx.currency)}
                  </span>
                </Row>
              )}
              <Row label="Category set by">{describeCategory(tx)}</Row>
              {tx.source !== 'manual' && (
                <Row label="Parse confidence">
                  {Math.round(Number(tx.confidence) * 100)}%
                </Row>
              )}
              <Row label="Added">{formatTimestamp(tx.createdAt)}</Row>
              {tx.updatedAt !== tx.createdAt && (
                <Row label="Last edited">{formatTimestamp(tx.updatedAt)}</Row>
              )}
              {tx.rawText && (
                <div className="py-2">
                  <p className="mb-1 text-sm text-muted-foreground">Original text</p>
                  <p className="rounded bg-muted p-2 font-mono text-xs break-words">
                    {tx.rawText}
                  </p>
                </div>
              )}
            </div>

            <DialogFooter className="gap-2 sm:justify-between">
              <Button
                variant="ghost"
                className="text-destructive hover:text-destructive"
                onClick={() => {
                  onClose();
                  onDelete(tx.id);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
              <Button
                onClick={() => {
                  onClose();
                  onEdit(tx);
                }}
              >
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
