import { Link, Outlet, useLocation } from 'react-router-dom';
import { Calendar, Users, Scissors, LayoutDashboard, Search } from 'lucide-react';
import { cn } from '../lib/utils';

export default function AdminLayout() {
  const location = useLocation();
  const links = [
    { to: '/admin', icon: LayoutDashboard, label: 'Painel' },
    { to: '/admin/bookings', icon: Calendar, label: 'Reservas' },
    { to: '/admin/services', icon: Scissors, label: 'Serviços' },
    { to: '/admin/professionals', icon: Users, label: 'Equipe' },
  ];

  return (
    <div className="min-h-screen bg-bg-base text-text-main flex font-sans">
      <aside className="w-64 bg-sidebar-grad border-r border-border-theme p-6 hidden md:flex flex-col h-screen sticky top-0">
        <Link to="/" className="flex items-center gap-2 mb-12">
          <span className="font-serif text-2xl font-bold italic tracking-tight text-accent-pink">Tulipa Admin</span>
        </Link>
        <nav className="space-y-2 flex-1">
          {links.map((l) => {
            const Icon = l.icon;
            const isActive = location.pathname === l.to;
            return (
              <Link key={l.to} to={l.to} className={cn("flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors", isActive ? "bg-[#2a1d35] text-accent-pink shadow-sm" : "hover:bg-[#2a1d35]/50")}>
                <Icon className="w-5 h-5" /> {l.label}
              </Link>
            )
          })}
        </nav>
      </aside>

      <main className="flex-1 overflow-x-hidden min-h-screen">
        <header className="md:hidden p-4 border-b border-border-theme flex items-center justify-between bg-bg-card">
          <span className="font-serif text-xl font-bold italic text-accent-pink">Tulipa Admin</span>
        </header>
        <div className="p-4 md:p-8 max-w-6xl mx-auto"><Outlet /></div>
      </main>

      {/* Mobile nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-bg-card border-t border-border-theme flex justify-around p-3 z-50">
        {links.map((l) => {
          const Icon = l.icon;
          const isActive = location.pathname === l.to;
          return (
            <Link key={l.to} to={l.to} className={cn("flex flex-col items-center gap-1", isActive ? "text-accent-pink" : "text-text-muted")}>
              <Icon className="w-5 h-5" />
              <span className="text-[10px]">{l.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  );
}
