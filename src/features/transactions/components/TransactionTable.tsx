import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { AlertTriangle, Pencil, Trash2 } from 'lucide-react';
import { formatMoney, formatSignedMoney } from '@/lib/currency';
import {
  categoryColor,
  describeCategory,
  isCategoryUncertain,
} from './transaction-display';
import type { Transaction, TransactionType } from '@/types/transaction';

interface Props {
  transactions: Transaction[];
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
  onSelect: (tx: Transaction) => void;
}

const typeVariant: Record<TransactionType, 'default' | 'destructive' | 'secondary'> = {
  income: 'default',
  expense: 'destructive',
  transfer: 'secondary',
};

const amountColor: Record<TransactionType, string> = {
  income: 'text-green-700',
  expense: '',
  transfer: 'text-muted-foreground',
};

export default function TransactionTable({
  transactions,
  onEdit,
  onDelete,
  onSelect,
}: Props) {
  if (transactions.length === 0) {
    return <p className="py-8 text-center text-muted-foreground">No transactions found.</p>;
  }

  // Only statements with foreign-currency rows earn the extra column; on a
  // single-currency statement it would be nothing but dashes.
  const hasForeign = transactions.some(
    (tx) => tx.originalAmount != null && tx.originalCurrency,
  );

  return (
    <TooltipProvider delayDuration={200}>
      {/* Eight columns cannot shrink to phone width — they can only be scrolled
          sideways, which is not a usable table. Below the width the table needs
          the same rows are stacked as cards instead. Measured against the
          content column, not the window, because the sidebar eats 16rem of it. */}
      <div className="space-y-2 @4xl:hidden">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            role="button"
            tabIndex={0}
            aria-label={`View details for ${tx.merchant ?? tx.description}`}
            onClick={() => onSelect(tx)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect(tx);
              }
            }}
            className={`cursor-pointer rounded-lg border p-3 ${
              tx.needsReview ? 'bg-yellow-50' : 'bg-card'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  {tx.needsReview && (
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-yellow-600" />
                  )}
                  <span className="truncate font-medium">
                    {tx.merchant ?? tx.description}
                  </span>
                </div>
                {tx.merchant && (
                  <p className="truncate text-xs text-muted-foreground">
                    {tx.description}
                  </p>
                )}
              </div>

              <span
                className={`shrink-0 whitespace-nowrap font-mono text-sm font-medium ${amountColor[tx.type]}`}
              >
                {formatSignedMoney(tx.amount, tx.currency, tx.type)}
              </span>
            </div>

            <div className="mt-2.5 flex items-center justify-between gap-2">
              <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                <span className="text-xs text-muted-foreground">{tx.date}</span>
                <Badge
                  variant="secondary"
                  className={`${categoryColor[tx.category]} ${
                    isCategoryUncertain(tx) ? 'border border-dashed border-current' : ''
                  }`}
                >
                  {tx.category}
                </Badge>
              </div>

              <div className="flex shrink-0" onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" onClick={() => onEdit(tx)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(tx.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden overflow-x-auto rounded-md border @4xl:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              {hasForeign && <TableHead className="text-right">Original</TableHead>}
              <TableHead className="text-right">Balance</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow
                key={tx.id}
                className={`cursor-pointer ${tx.needsReview ? 'bg-yellow-50' : ''}`}
                onClick={() => onSelect(tx)}
                // Reachable without a mouse: the row is the only way into the
                // detail view, so it has to answer Enter and Space too.
                tabIndex={0}
                role="button"
                aria-label={`View details for ${tx.merchant ?? tx.description}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelect(tx);
                  }
                }}
              >
                <TableCell className="whitespace-nowrap">{tx.date}</TableCell>

                <TableCell className="max-w-xs">
                  <div className="flex items-start gap-1.5">
                    {tx.needsReview && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-yellow-600" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>
                            Parsed with low confidence (
                            {Math.round(Number(tx.confidence) * 100)}%). Check the amount
                            and date.
                          </p>
                          {tx.rawText && (
                            <p className="mt-1 font-mono text-xs opacity-80">{tx.rawText}</p>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    )}
                    <div className="min-w-0">
                      <div className="truncate font-medium">
                        {tx.merchant ?? tx.description}
                      </div>
                      {tx.merchant && (
                        <div className="truncate text-xs text-muted-foreground">
                          {tx.description}
                        </div>
                      )}
                      {tx.reference && (
                        <div className="truncate font-mono text-xs text-muted-foreground">
                          Ref {tx.reference}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge
                        variant="secondary"
                        className={`${categoryColor[tx.category]} ${
                          isCategoryUncertain(tx) ? 'border border-dashed border-current' : ''
                        }`}
                      >
                        {tx.category}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>{describeCategory(tx)}</TooltipContent>
                  </Tooltip>
                </TableCell>

                <TableCell>
                  <Badge variant={typeVariant[tx.type]}>{tx.type}</Badge>
                </TableCell>

                <TableCell
                  className={`whitespace-nowrap text-right font-mono ${amountColor[tx.type]}`}
                >
                  {formatSignedMoney(tx.amount, tx.currency, tx.type)}
                </TableCell>

                {hasForeign && (
                  <TableCell className="whitespace-nowrap text-right font-mono text-xs text-muted-foreground">
                    {tx.originalAmount != null && tx.originalCurrency
                      ? formatMoney(tx.originalAmount, tx.originalCurrency)
                      : '—'}
                  </TableCell>
                )}

                <TableCell className="text-right font-mono text-xs text-muted-foreground">
                  {tx.balanceAfter != null
                    ? formatMoney(tx.balanceAfter, tx.currency)
                    : '—'}
                </TableCell>

                <TableCell className="text-right">
                  {/* Edit and delete are their own actions — they must not also
                      open the detail dialog behind them. */}
                  <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" onClick={() => onEdit(tx)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(tx.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  );
}
