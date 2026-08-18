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
import { Pencil, Trash2 } from 'lucide-react';
import type { Transaction } from '@/types/transaction';

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

export default function TransactionTable({ transactions, onEdit, onDelete }: Props) {
  if (transactions.length === 0) {
    return <p className="py-8 text-center text-muted-foreground">No transactions found.</p>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => (
            <TableRow key={tx.id}>
              <TableCell className="whitespace-nowrap">{tx.date}</TableCell>
              <TableCell>{tx.description}</TableCell>
              <TableCell>
                <Badge variant="secondary" className={categoryColor[tx.category]}>
                  {tx.category}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={tx.type === 'income' ? 'default' : 'destructive'}>
                  {tx.type}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-mono">
                {tx.type === 'income' ? '+' : '-'}${Number(tx.amount).toFixed(2)}
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
  );
}
