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
    <aside
      className="hidden w-72 shrink-0 border-r px-4 py-6 lg:block"
      style={{
        backgroundColor: '#0a0a0e',
        borderColor: '#1e293b',
      }}
    >
      <div className="flex items-center gap-3 px-2">
        <div
          className="grid h-10 w-10 place-items-center rounded-lg text-white font-bold"
          style={{
            backgroundColor: '#06B6D4',
          }}
        >
          <Sparkles size={20} aria-hidden="true" />
        </div>
        <div>
          <p className="text-base font-bold text-white" style={{ letterSpacing: '-0.01em' }}>
            DataStory AI
          </p>
          <p className="text-xs" style={{ color: '#94A3B8' }}>
            Analytics workspace
          </p>
        </div>
      </div>

      <nav className="mt-8 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            className={({ isActive }) =>
              `flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all duration-300 ${
                isActive ? 'text-white' : ''
              }`
            }
            style={({ isActive }) => ({
              backgroundColor: isActive ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
              color: isActive ? '#06B6D4' : '#94A3B8',
              borderLeft: isActive ? '2px solid #06B6D4' : '2px solid transparent',
              paddingLeft: isActive ? '12px' : '12px',
            })}
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
