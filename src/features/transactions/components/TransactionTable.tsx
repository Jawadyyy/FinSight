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
import type { Transaction, TransactionType } from '@/types/transaction';

interface Props {
  transactions: Transaction[];
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
}

const categoryColor: Record<string, string> = {
  Food: 'bg-orange-100 text-orange-800',
  Shopping: 'bg-purple-100 text-purple-800',
  Transport: 'bg-blue-100 text-blue-800',
  Bills: 'bg-red-100 text-red-800',
  Entertainment: 'bg-pink-100 text-pink-800',
  Other: 'bg-gray-100 text-gray-800',
};

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

export default function TransactionTable({ transactions, onEdit, onDelete }: Props) {
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
      <div className="overflow-x-auto rounded-md border">
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
              <TableRow key={tx.id} className={tx.needsReview ? 'bg-yellow-50' : undefined}>
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
                  <Badge variant="secondary" className={categoryColor[tx.category]}>
                    {tx.category}
                  </Badge>
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
                  <div className="flex justify-end gap-1">
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
