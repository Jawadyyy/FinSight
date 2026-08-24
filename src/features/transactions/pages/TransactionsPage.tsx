import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TableSkeleton } from '@/components/TableSkeleton';
import { Plus, Sparkles, Upload } from 'lucide-react';
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  categorizeTransactions,
} from '../api/transactionsApi';
import TransactionTable from '../components/TransactionTable';
import TransactionDialog from '../components/TransactionDialog';
import TransactionDetailDialog from '../components/TransactionDetailDialog';
import TransactionFilters from '../components/TransactionFilters';
import UploadDialog from '../components/UploadDialog';
import Pagination from '../components/Pagination';
import { invalidateCache } from '@/hooks/useCachedResource';
import type { Transaction, TransactionFilters as Filters, TransactionsResponse } from '@/types/transaction';

export default function TransactionsPage() {
  const [data, setData] = useState<TransactionsResponse | null>(null);
  const [filters, setFilters] = useState<Filters>({ page: 1, limit: 20 });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [viewing, setViewing] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [categorizing, setCategorizing] = useState(false);
  const [categorizeNote, setCategorizeNote] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getTransactions(filters);
      setData(res);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { load(); }, [load]);

  const handleSubmit = async (formData: {
    amount: number;
    description: string;
    category: string;
    type: string;
    date: string;
  }) => {
    const payload = formData as Parameters<typeof createTransaction>[0];
    if (editing) {
      await updateTransaction(editing.id, payload);
    } else {
      await createTransaction(payload);
    }
    setEditing(null);
    await reload();
  };

  const handleEdit = (tx: Transaction) => {
    setEditing(tx);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteTransaction(id);
    await reload();
  };

  // Any change to transactions moves the figures on the cached dashboard tabs
  // (overview, analytics, insights, budgets), so clear those and reload the list.
  const reload = async () => {
    invalidateCache();
    await load();
  };

  const handleCategorize = async () => {
    setCategorizing(true);
    setCategorizeNote('');
    try {
      const result = await categorizeTransactions();
      await reload();

      if (result.categorized === 0) {
        setCategorizeNote(
          result.aiEnabled
            ? 'Everything is already categorized.'
            : 'Nothing matched a rule. Add GEMINI_API_KEY to categorize the rest with AI.',
        );
      } else {
        const parts = [`Categorized ${result.categorized}`];
        if (result.byAi) parts.push(`${result.byAi} by AI`);
        if (result.byRule) parts.push(`${result.byRule} by rules`);
        setCategorizeNote(`${parts.join(' — ')}.`);
      }
    } catch {
      setCategorizeNote('Categorization failed. Your transactions were left unchanged.');
    } finally {
      setCategorizing(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Three actions do not fit beside the heading on a phone, so the row
          wraps and the buttons share the width below it. */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold">Transactions</h2>
        <div className="flex flex-1 flex-wrap gap-2 sm:flex-none">
          <Button variant="outline" onClick={handleCategorize} disabled={categorizing}>
            <Sparkles className="mr-2 h-4 w-4" />
            {categorizing ? 'Categorizing...' : 'Categorize'}
          </Button>
          <Button variant="outline" onClick={() => setUploadOpen(true)}>
            <Upload className="mr-2 h-4 w-4" /> Upload Statement
          </Button>
          <Button onClick={() => { setEditing(null); setDialogOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" /> Add Transaction
          </Button>
        </div>
      </div>

      {categorizeNote && (
        <Alert>
          <Sparkles className="h-4 w-4" />
          <AlertDescription>{categorizeNote}</AlertDescription>
        </Alert>
      )}

      <TransactionFilters filters={filters} onChange={setFilters} />

      {loading ? (
        <TableSkeleton />
      ) : data ? (
        <>
          <TransactionTable
            transactions={data.data}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSelect={setViewing}
          />
          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            onPageChange={(p) => setFilters((f) => ({ ...f, page: p }))}
          />
        </>
      ) : null}

      <TransactionDialog
        open={dialogOpen}
        onClose={() => { setDialogOpen(false); setEditing(null); }}
        onSubmit={handleSubmit}
        transaction={editing}
      />

      <TransactionDetailDialog
        transaction={viewing}
        onClose={() => setViewing(null)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <UploadDialog
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onSuccess={reload}
      />
    </div>
  );
}
