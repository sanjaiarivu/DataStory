import { MessageSquareText, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';

export default function ChatPage() {
  const navigate = useNavigate();

  return (
    <AppShell>
      <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <div className="inline-flex rounded-md bg-emerald-50 p-2 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            <MessageSquareText size={20} aria-hidden="true" />
          </div>
          <h1 className="mt-4 text-2xl font-semibold text-slate-950 dark:text-white">AI Chat</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
            Chat features are currently being finalized. You can continue uploading files now, and this space will become
            your conversation workspace for analysis, summaries, and recommendations.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              className="inline-flex items-center justify-center gap-2 rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 dark:bg-white dark:text-slate-950"
              onClick={() => navigate('/files')}
              type="button"
            >
              Go to Files
            </button>
            <button
              className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              onClick={() => navigate('/')}
              type="button"
            >
              <Sparkles size={16} aria-hidden="true" />
              Back to Landing
            </button>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
