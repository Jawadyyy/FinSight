import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { TransactionCategory } from '@/types/transaction';
import type { Budget } from '@/types/budget';

const categories: TransactionCategory[] = [
  'Food', 'Shopping', 'Transport', 'Bills', 'Entertainment', 'Other',
];

const schema = z.object({
  category: z.enum(['Food', 'Shopping', 'Transport', 'Bills', 'Entertainment', 'Other']),
  month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Must be YYYY-MM'),
  limit: z.number().min(0.01, 'Must be > 0'),
});

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<void>;
  budget?: Budget | null;
  currentMonth: string;
}

export default function BudgetDialog({ open, onClose, onSubmit, budget, currentMonth }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      category: 'Food',
      month: currentMonth,
      limit: 0,
    },
  });

  useEffect(() => {
    if (budget) {
      reset({
        category: budget.category,
        month: budget.month,
        limit: Number(budget.limit),
      });
    } else {
      reset({
        category: 'Food',
        month: currentMonth,
        limit: 0,
      });
    }
  }, [budget, reset, currentMonth]);

  const handle = async (data: FormData) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{budget ? 'Edit Budget' : 'Set Budget'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handle)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Category</Label>
              <Select
                value={watch('category')}
                onValueChange={(v) => setValue('category', v as TransactionCategory)}
                disabled={!!budget}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="month">Month</Label>
              <Input
                id="month"
                type="month"
                {...register('month')}
                disabled={!!budget}
              />
              {errors.month && <p className="text-sm text-destructive">{errors.month.message}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="limit">Budget Limit ($)</Label>
            <Input
              id="limit"
              type="number"
              step="0.01"
              {...register('limit', { valueAsNumber: true })}
            />
            {errors.limit && <p className="text-sm text-destructive">{errors.limit.message}</p>}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : budget ? 'Update' : 'Set Budget'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
