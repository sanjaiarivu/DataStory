import { useRef, useState } from 'react';
import { FileSpreadsheet, FileText, Loader2, UploadCloud, X } from 'lucide-react';
import { uploadFiles } from '../../api/fileApi';

const allowedTypes = [
  'text/csv',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];

const getIcon = (fileName) => {
  if (fileName.toLowerCase().endsWith('.pdf')) {
    return FileText;
  }

  return FileSpreadsheet;
};

export default function FileUploadPanel({ onUploadComplete }) {
  const inputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const addFiles = (fileList) => {
    const files = Array.from(fileList);
    const invalidFile = files.find((file) => !allowedTypes.includes(file.type));

    if (invalidFile) {
      setError('Only CSV, XLSX, and PDF files are supported in Phase 1.');
      return;
    }

    setError('');
    setSelectedFiles((current) => [...current, ...files]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    addFiles(event.dataTransfer.files);
  };

  const removeFile = (fileName) => {
    setSelectedFiles((current) => current.filter((file) => file.name !== fileName));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setError('Choose at least one file before uploading.');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const response = await uploadFiles(selectedFiles);
      setUploadedFiles(response.files || []);
      setSelectedFiles([]);
      onUploadComplete?.(response.files || []);
    } catch (uploadError) {
      setError(uploadError.response?.data?.message || 'Upload failed. Check if the backend is running.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="rounded-lg border border-slate-700 bg-slate-900 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-white dark:text-white">Upload Data</h2>
          <p className="text-sm text-slate-400 dark:text-slate-400">Add CSV, Excel, or PDF files for analysis.</p>
        </div>
        <button
          className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-600"
          disabled={isUploading}
          onClick={handleUpload}
          type="button"
        >
          {isUploading ? <Loader2 className="animate-spin" size={18} aria-hidden="true" /> : <UploadCloud size={18} aria-hidden="true" />}
          Upload
        </button>
      </div>

      <button
        className="mt-5 flex min-h-44 w-full flex-col items-center justify-center rounded-lg border border-dashed border-slate-700 bg-slate-800 px-4 py-8 text-center transition hover:border-emerald-500 hover:bg-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-emerald-500 dark:hover:bg-slate-700"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        type="button"
      >
        <UploadCloud className="text-emerald-400 dark:text-emerald-300" size={32} aria-hidden="true" />
        <span className="mt-3 text-sm font-semibold text-slate-200 dark:text-slate-100">
          Drop files here or browse from your computer
        </span>
        <span className="mt-1 text-xs text-slate-400 dark:text-slate-400">CSV, XLSX, PDF up to backend limits</span>
      </button>

      <input
        ref={inputRef}
        accept=".csv,.xlsx,.pdf"
        className="hidden"
        multiple
        onChange={(event) => addFiles(event.target.files)}
        type="file"
      />

      {error ? <p className="mt-4 rounded-md bg-red-900 px-3 py-2 text-sm text-red-300">{error}</p> : null}

      {selectedFiles.length > 0 ? (
        <div className="mt-5 space-y-2">
          {selectedFiles.map((file) => {
            const Icon = getIcon(file.name);

            return (
              <div
                className="flex items-center justify-between gap-3 rounded-md border border-slate-700 bg-slate-800 px-3 py-2 dark:border-slate-700 dark:bg-slate-800"
                key={`${file.name}-${file.lastModified}`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Icon className="shrink-0 text-slate-400" size={18} aria-hidden="true" />
                  <span className="truncate text-sm font-medium text-slate-200 dark:text-slate-200">{file.name}</span>
                </div>
                <button
                  aria-label={`Remove ${file.name}`}
                  className="grid h-8 w-8 place-items-center rounded-md text-slate-400 hover:bg-red-900 hover:text-red-300 dark:hover:bg-red-900"
                  onClick={() => removeFile(file.name)}
                  type="button"
                >
                  <X size={16} aria-hidden="true" />
                </button>
              </div>
            );
          })}
        </div>
      ) : null}

      {uploadedFiles.length > 0 ? (
        <div className="mt-5 rounded-md bg-emerald-900 px-3 py-3 dark:bg-emerald-900">
          <p className="text-sm font-semibold text-emerald-300 dark:text-emerald-300">Uploaded files</p>
          <ul className="mt-2 space-y-1 text-sm text-emerald-300 dark:text-emerald-300">
            {uploadedFiles.map((file) => (
              <li key={file.id}>{file.originalFileName}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
