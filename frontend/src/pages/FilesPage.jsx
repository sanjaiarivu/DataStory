import { useEffect, useMemo, useState } from 'react';
import { Database, FileSpreadsheet, FileText, Loader2, RefreshCw, Trash2, UploadCloud } from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import FileUploadPanel from '../components/upload/FileUploadPanel';
import StatCard from '../components/common/StatCard';
import { deleteFile, getFiles } from '../api/fileApi';

const formatBytes = (bytes = 0) => {
  if (bytes === 0) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** index;

  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[index]}`;
};

const formatDate = (value) => {
  if (!value) {
    return 'Not available';
  }

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value));
};

const getFileIcon = (fileType) => {
  if (fileType === 'PDF') {
    return FileText;
  }

  return FileSpreadsheet;
};

export default function FilesPage() {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState('');

  const stats = useMemo(() => {
    const totalSize = files.reduce((sum, file) => sum + (file.sizeInBytes || 0), 0);
    const pdfCount = files.filter((file) => file.fileType === 'PDF').length;
    const dataFileCount = files.filter((file) => file.fileType === 'CSV' || file.fileType === 'EXCEL').length;

    return {
      totalFiles: files.length,
      totalSize,
      pdfCount,
      dataFileCount
    };
  }, [files]);

  const fetchFiles = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await getFiles();
      setFiles(response);
    } catch (fileError) {
      setError(fileError.response?.data?.message || 'Could not load your files.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleDelete = async (fileId) => {
    setDeletingId(fileId);
    setError('');

    try {
      await deleteFile(fileId);
      setFiles((current) => current.filter((file) => file.id !== fileId));
    } catch (deleteError) {
      setError(deleteError.response?.data?.message || 'Could not delete the file.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AppShell>
      <header className="border-b border-slate-700 bg-slate-900 px-4 py-4 dark:border-slate-700 dark:bg-slate-900 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-400 dark:text-emerald-400">File library</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-normal text-white dark:text-white">
              Uploaded Files
            </h1>
          </div>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-200 shadow-sm hover:bg-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            onClick={fetchFiles}
            type="button"
          >
            <RefreshCw size={18} aria-hidden="true" />
            Refresh
          </button>
        </div>
      </header>

      <div className="flex-1 space-y-6 px-4 py-6 sm:px-6 lg:px-8 bg-slate-950">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={Database} label="Total Files" value={stats.totalFiles} helper="Files owned by your account" />
          <StatCard icon={UploadCloud} label="Storage Used" value={formatBytes(stats.totalSize)} helper="Local backend storage" />
          <StatCard icon={FileText} label="PDF Files" value={stats.pdfCount} helper="Ready for summary and RAG" />
          <StatCard icon={FileSpreadsheet} label="Data Files" value={stats.dataFileCount} helper="CSV and Excel datasets" />
        </section>

        <FileUploadPanel onUploadComplete={fetchFiles} />

        <section className="rounded-lg border border-slate-700 bg-slate-900 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="flex flex-col gap-2 border-b border-slate-700 p-5 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-white dark:text-white">My Files</h2>
              <p className="text-sm text-slate-400 dark:text-slate-400">Files uploaded from your account.</p>
            </div>
          </div>

          {error ? <p className="mx-5 mt-5 rounded-md bg-red-900 px-3 py-2 text-sm text-red-300">{error}</p> : null}

          {isLoading ? (
            <div className="flex min-h-56 items-center justify-center gap-2 text-sm text-slate-400 dark:text-slate-400">
              <Loader2 className="animate-spin" size={18} aria-hidden="true" />
              Loading files
            </div>
          ) : files.length === 0 ? (
            <div className="flex min-h-56 flex-col items-center justify-center px-5 text-center">
              <UploadCloud className="text-slate-500" size={34} aria-hidden="true" />
              <p className="mt-3 text-sm font-semibold text-slate-200 dark:text-slate-200">No files uploaded yet</p>
              <p className="mt-1 max-w-sm text-sm text-slate-400 dark:text-slate-400">
                Upload CSV, Excel, or PDF files to begin building charts, summaries, and dashboards.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-700 dark:divide-slate-700">
                <thead className="bg-slate-800 dark:bg-slate-800">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">File</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">Type</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">Size</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">Uploaded</th>
                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700 dark:divide-slate-700">
                  {files.map((file) => {
                    const Icon = getFileIcon(file.fileType);

                    return (
                      <tr className="hover:bg-slate-800 dark:hover:bg-slate-800" key={file.id}>
                        <td className="max-w-xs px-5 py-4">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-emerald-900 text-emerald-400 dark:bg-emerald-900 dark:text-emerald-300">
                              <Icon size={18} aria-hidden="true" />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-white dark:text-white">
                                {file.originalFileName}
                              </p>
                              <p className="truncate text-xs text-slate-400 dark:text-slate-400">{file.storedFileName}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-300 dark:text-slate-300">{file.fileType}</td>
                        <td className="px-5 py-4 text-sm text-slate-300 dark:text-slate-300">{formatBytes(file.sizeInBytes)}</td>
                        <td className="px-5 py-4 text-sm text-slate-300 dark:text-slate-300">{formatDate(file.uploadedAt)}</td>
                        <td className="px-5 py-4 text-right">
                          <button
                            aria-label={`Delete ${file.originalFileName}`}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-400 hover:bg-red-900 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-red-900 dark:hover:text-red-300"
                            disabled={deletingId === file.id}
                            onClick={() => handleDelete(file.id)}
                            type="button"
                          >
                            {deletingId === file.id ? <Loader2 className="animate-spin" size={17} aria-hidden="true" /> : <Trash2 size={17} aria-hidden="true" />}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
