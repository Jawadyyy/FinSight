import {
  Pagination as UiPagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface Props {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/**
 * Page numbers around the current page, with ellipses standing in for the
 * stretches we skip: 1 … 4 5 6 … 20.
 */
function pageWindow(page: number, totalPages: number): (number | 'gap')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const items: (number | 'gap')[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);

  if (start > 2) items.push('gap');
  for (let i = start; i <= end; i++) items.push(i);
  if (end < totalPages - 1) items.push('gap');

  items.push(totalPages);
  return items;
}

export default function Pagination({ page, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  const go = (target: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (target >= 1 && target <= totalPages && target !== page) onPageChange(target);
  };

  return (
    <UiPagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={go(page - 1)}
            aria-disabled={page <= 1}
            className={page <= 1 ? 'pointer-events-none opacity-50' : undefined}
          />
        </PaginationItem>

        {pageWindow(page, totalPages).map((item, i) =>
          item === 'gap' ? (
            <PaginationItem key={`gap-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationLink href="#" isActive={item === page} onClick={go(item)}>
                {item}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={go(page + 1)}
            aria-disabled={page >= totalPages}
            className={page >= totalPages ? 'pointer-events-none opacity-50' : undefined}
          />
        </PaginationItem>
      </PaginationContent>
    </UiPagination>
  );
}
