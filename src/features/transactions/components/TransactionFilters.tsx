import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { TransactionFilters as Filters } from '@/types/transaction';

const categories = ['All', 'Food', 'Shopping', 'Transport', 'Bills', 'Entertainment', 'Other'] as const;
const types = ['All', 'income', 'expense'] as const;

interface Props {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export default function TransactionFilters({ filters, onChange }: Props) {
  const set = (patch: Partial<Filters>) => onChange({ ...filters, ...patch, page: 1 });

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Input
        placeholder="Search..."
        className="w-48"
        value={filters.search ?? ''}
        onChange={(e) => set({ search: e.target.value || undefined })}
      />
      <Select
        value={filters.category ?? 'All'}
        onValueChange={(v) => set({ category: v === 'All' ? undefined : v as Filters['category'] })}
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select
        value={filters.type ?? 'All'}
        onValueChange={(v) => set({ type: v === 'All' ? undefined : v as Filters['type'] })}
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          {types.map((t) => <SelectItem key={t} value={t}>{t === 'All' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}</SelectItem>)}
        </SelectContent>
      </Select>
      <Input
        type="date"
        className="w-40"
        value={filters.from ?? ''}
        onChange={(e) => set({ from: e.target.value || undefined })}
      />
      <span className="text-muted-foreground">to</span>
      <Input
        type="date"
        className="w-40"
        value={filters.to ?? ''}
        onChange={(e) => set({ to: e.target.value || undefined })}
      />
    </div>
  );
}
