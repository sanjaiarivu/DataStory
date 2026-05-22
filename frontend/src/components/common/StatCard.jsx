export default function StatCard({ label, value, helper, icon: Icon }) {
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-900 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-400 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-normal text-white dark:text-white">
            {value}
          </p>
        </div>
        {Icon ? (
          <div className="grid h-10 w-10 place-items-center rounded-md bg-emerald-900 text-emerald-400 dark:bg-emerald-900 dark:text-emerald-300">
            <Icon size={20} aria-hidden="true" />
          </div>
        ) : null}
      </div>
      <p className="mt-4 text-sm text-slate-400 dark:text-slate-400">{helper}</p>
    </div>
  );
}
