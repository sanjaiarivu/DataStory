import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

const revenueData = [
  { month: 'Jan', revenue: 42000, users: 240 },
  { month: 'Feb', revenue: 51000, users: 310 },
  { month: 'Mar', revenue: 47000, users: 290 },
  { month: 'Apr', revenue: 63000, users: 410 },
  { month: 'May', revenue: 78000, users: 520 },
  { month: 'Jun', revenue: 84000, users: 570 }
];

export default function DashboardChart() {
  return (
    <section className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-slate-950 dark:text-white">Revenue Trend</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Sample chart until uploads are parsed.</p>
          </div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revenueFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis dataKey="month" stroke="#64748B" tickLine={false} axisLine={false} />
              <YAxis stroke="#64748B" tickLine={false} axisLine={false} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#059669"
                strokeWidth={3}
                fill="url(#revenueFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-base font-semibold text-slate-950 dark:text-white">Uploads by Type</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">CSV, Excel, and PDF support.</p>
        <div className="mt-5 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[
              { type: 'CSV', files: 12 },
              { type: 'Excel', files: 8 },
              { type: 'PDF', files: 6 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis dataKey="type" stroke="#64748B" tickLine={false} axisLine={false} />
              <YAxis stroke="#64748B" tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="files" fill="#2563EB" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
