import { BarChart3, FileText, MessageSquareText, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import StatCard from '../components/common/StatCard';
import FileUploadPanel from '../components/upload/FileUploadPanel';
import DashboardChart from '../components/dashboard/DashboardChart';

export default function DashboardPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('datastory_user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('datastory_token');
    localStorage.removeItem('datastory_user');
    navigate('/login');
  };

  return (
    <AppShell>
      <header className="border-b border-slate-200 bg-white px-4 py-4 dark:border-slate-800 dark:bg-slate-950 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Phase 1 workspace</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-normal text-slate-950 dark:text-white">
              DataStory AI Analytics
            </h1>
            {user ? (
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Signed in as {user.fullName}</p>
            ) : null}
          </div>
          <div className="flex items-center gap-3">
            <button
              className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              type="button"
            >
              <MessageSquareText size={18} aria-hidden="true" />
              Ask AI
            </button>
            <button
              className="inline-flex items-center justify-center gap-2 rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 dark:bg-white dark:text-slate-950"
              type="button"
            >
              <Sparkles size={18} aria-hidden="true" />
              Generate Insight
            </button>
            <button
              className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              onClick={handleLogout}
              type="button"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={FileText} label="Uploaded Files" value="26" helper="CSV, Excel, and PDF documents" />
          <StatCard icon={BarChart3} label="Charts Created" value="14" helper="Ready for dashboard widgets" />
          <StatCard icon={MessageSquareText} label="AI Questions" value="82" helper="Chat history arrives in Phase 2" />
          <StatCard icon={Sparkles} label="Insights" value="31" helper="AI-generated findings preview" />
        </section>

        <div className="grid gap-6 2xl:grid-cols-[0.95fr_1.55fr]">
          <FileUploadPanel />
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-base font-semibold text-slate-950 dark:text-white">AI Insight Preview</h2>
            <div className="mt-5 space-y-4">
              {[
                'Monthly revenue is trending upward in the sample data.',
                'PDF summaries and dataset insights will use GPT-4.1-mini in a later phase.',
                'Semantic search will use text-embedding-3-small after parsing is added.'
              ].map((insight) => (
                <div className="rounded-md border border-slate-200 p-4 dark:border-slate-800" key={insight}>
                  <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{insight}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DashboardChart />
      </div>
    </AppShell>
  );
}
