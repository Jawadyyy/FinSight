import { createApiClient } from '@/lib/apiClient';

const http = createApiClient('/reports');

/** Pulls the filename the server chose out of Content-Disposition. */
function filenameFrom(header: string | undefined, fallback: string): string {
  const match = header?.match(/filename="?([^"]+)"?/);
  return match?.[1] ?? fallback;
}

/**
 * Saves a response body to the user's disk.
 *
 * The API is behind a bearer token held in memory, so a plain link would arrive
 * unauthenticated — the file has to be fetched first, then handed to the
 * browser as an object URL.
 */
function save(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Release the object URL once the download has been handed off.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export interface CsvFilters {
  from?: string;
  to?: string;
  category?: string;
  type?: string;
}

export async function downloadTransactionsCsv(filters: CsvFilters = {}) {
  const params = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== undefined && v !== ''),
  );
  const res = await http.get('/transactions.csv', { params, responseType: 'blob' });
  save(
    res.data as Blob,
    filenameFrom(res.headers['content-disposition'], 'finsight-transactions.csv'),
  );
}

export async function downloadTransactionsXlsx(filters: CsvFilters = {}) {
  const params = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== undefined && v !== ''),
  );
  const res = await http.get('/transactions.xlsx', { params, responseType: 'blob' });
  save(
    res.data as Blob,
    filenameFrom(res.headers['content-disposition'], 'finsight-transactions.xlsx'),
  );
}

export async function downloadMonthlyPdf(month: string) {
  const res = await http.get('/monthly.pdf', {
    params: { month },
    responseType: 'blob',
  });
  save(
    res.data as Blob,
    filenameFrom(res.headers['content-disposition'], `finsight-report-${month}.pdf`),
  );
}
