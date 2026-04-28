import { Outlet, Link } from 'react-router-dom';
import { Search } from 'lucide-react';

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-bg-base text-text-main font-sans flex flex-col">
      <header className="border-b border-border-theme bg-[#1c1524]">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-serif text-2xl font-bold tracking-tight italic text-accent-pink">Tulipa Hair</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/track" className="text-sm font-medium text-white bg-accent-pink hover:opacity-90 px-4 py-2 rounded-full transition-colors flex items-center gap-1.5 shadow-md">
              <Search className="w-4 h-4" />
              <span>Acompanhar</span>
            </Link>
            <Link to="/admin" className="text-sm font-medium text-text-muted hover:text-white px-3 py-1.5 rounded-full transition-colors hidden sm:flex items-center gap-1.5">
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 relative">
        <Outlet />
      </main>
    </div>
  );
}
