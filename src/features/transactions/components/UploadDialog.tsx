import { useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { uploadTransactions } from '../api/transactionsApi';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UploadDialog({ open, onClose, onSuccess }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{ imported: number; skipped: number } | null>(null);
  const [error, setError] = useState('');

  const reset = () => {
    setFile(null);
    setResult(null);
    setError('');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setResult(null);
    setError('');
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const res = await uploadTransactions(file);
      setResult(res);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Bank Statement</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div
            className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors hover:border-primary"
            onClick={() => inputRef.current?.click()}
          >
            <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-medium">
              {file ? file.name : 'Click to select CSV or PDF'}
            </p>
            <p className="text-xs text-muted-foreground">Max 5MB</p>
            <input
              ref={inputRef}
              type="file"
              accept=".csv,.pdf"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          {result && (
            <div className="rounded-md bg-green-50 p-3 text-sm text-green-800">
              Imported {result.imported} transactions.
              {result.skipped > 0 && ` Skipped ${result.skipped} rows.`}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>
              {result ? 'Done' : 'Cancel'}
            </Button>
            {!result && (
              <Button onClick={handleUpload} disabled={!file || uploading}>
                {uploading ? 'Uploading...' : 'Upload'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
