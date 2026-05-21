import Sidebar from './Sidebar';

export default function AppShell({ children }) {
  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: '#050508' }}>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex min-w-0 flex-1 flex-col">{children}</main>
      </div>
    </div>
  );
}
