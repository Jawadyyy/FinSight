import axios from 'axios';
import { api } from '@/lib/api';

const http = axios.create({
  baseURL: '/reports',
  withCredentials: true,
});

http.interceptors.request.use((config) => {
  const token = api.defaults.headers.common.Authorization;
  if (token) config.headers.Authorization = token;
  return config;
});

http.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const { data } = await api.post<{ accessToken: string }>('/refresh');
        const bearer = `Bearer ${data.accessToken}`;
        api.defaults.headers.common.Authorization = bearer;
        http.defaults.headers.common.Authorization = bearer;
        original.headers.Authorization = bearer;
        return http(original);
      } catch { /* let 401 bubble */ }
    }
    return Promise.reject(error);
  },
);

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
