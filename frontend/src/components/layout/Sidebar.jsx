import {
  BarChart3,
  FileText,
  Home,
  LayoutDashboard,
  MessageSquareText,
  Settings,
  Sparkles
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Overview', icon: Home, to: '/' },
  { label: 'Files', icon: FileText, to: '/files' },
  { label: 'AI Chat', icon: MessageSquareText, to: '/chat' },
  { label: 'Charts', icon: BarChart3, to: '/charts' },
  { label: 'Dashboards', icon: LayoutDashboard, to: '/dashboards' },
  { label: 'Settings', icon: Settings, to: '/settings' }
];

export default function Sidebar() {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white px-4 py-5 dark:border-slate-800 dark:bg-slate-950 lg:block">
      <div className="flex items-center gap-3 px-2">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-600 text-white">
          <Sparkles size={20} aria-hidden="true" />
        </div>
        <div>
          <p className="text-base font-semibold text-slate-950 dark:text-white">DataStory AI</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Analytics workspace</p>
        </div>
      </div>

      <nav className="mt-8 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            className={({ isActive }) =>
              `flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium transition ${
                isActive
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900'
              }`
            }
            to={item.to}
          >
            <item.icon size={18} aria-hidden="true" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
