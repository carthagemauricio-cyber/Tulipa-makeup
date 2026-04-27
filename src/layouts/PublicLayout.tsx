import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Flower2, Settings, Search } from 'lucide-react';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-main-grad text-text-main">
      <header className="bg-sidebar-grad sticky top-0 z-10 border-b border-border-theme shadow-sm">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-deep-purple hover:opacity-80 transition-opacity">
            <Flower2 className="w-8 h-8" />
            <span className="font-serif text-3xl font-bold tracking-tight italic hidden sm:inline">Tulipa Hair</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/track" className="text-sm font-medium text-white bg-accent-pink hover:bg-accent-pink/80 px-4 py-2 rounded-full transition-colors flex items-center gap-1.5 shadow-[0_4px_15px_rgba(217,70,239,0.3)]">
              <Search className="w-4 h-4" />
              <span>Acompanhar</span>
            </Link>
            <Link to="/admin" className="text-sm font-medium text-accent-pink hover:bg-[#2a1d35] px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          </div>
        </div>
      </header>
      
      <main className="flex-grow">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <Outlet />
        </div>
      </main>

      <footer className="bg-soft-lilac py-8 text-center text-sm text-text-muted mt-auto border-t border-border-theme">
        <p>© {new Date().getFullYear()} Tulipa Hair. Todos os direitos reservados.</p>
        <p className="mt-1">Rua das Flores, 123, Maputo, Moçambique</p>
      </footer>
    </div>
  );
}
