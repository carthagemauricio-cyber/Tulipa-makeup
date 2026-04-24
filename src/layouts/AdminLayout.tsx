import React, { useState } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { Flower2, LayoutDashboard, Users, Scissors, CalendarDays, Menu, X, ArrowLeft } from 'lucide-react';
import { cn } from '../lib/utils';
import { AnimatePresence, motion } from 'motion/react';

const navItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { path: '/admin/calendar', icon: CalendarDays, label: 'Calendário' },
  { path: '/admin/professionals', icon: Users, label: 'Profissionais' },
  { path: '/admin/services', icon: Scissors, label: 'Serviços' },
];

export default function AdminLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMenu = () => setMobileMenuOpen(false);

  const sidebarContent = (
    <div className="flex flex-col h-full bg-sidebar-grad border-r border-border-theme">
      <div className="p-6 flex items-center justify-between">
        <Link to="/admin" className="flex items-center gap-2 text-deep-purple">
          <Flower2 className="w-8 h-8" />
          <span className="font-serif text-3xl font-bold tracking-tight italic">Tulipa Hair</span>
        </Link>
        <button className="md:hidden text-text-muted" onClick={closeMenu}>
          <X className="w-6 h-6" />
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto mt-8">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            onClick={closeMenu}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
              isActive 
                ? "bg-white text-accent-pink shadow-[0_4px_12px_rgba(217,70,239,0.1)]" 
                : "text-text-main hover:bg-white/50"
            )}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4">
        <Link 
          to="/" 
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-accent-pink hover:bg-white/50 transition-all duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
          Ver Site
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-main-grad flex font-sans text-text-main">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 fixed inset-y-0 z-20">
        {sidebarContent}
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-sidebar-grad border-b border-border-theme z-20 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 text-deep-purple">
          <Flower2 className="w-6 h-6" />
          <span className="font-serif text-2xl font-bold italic">Tulipa Hair</span>
        </div>
        <button onClick={toggleMenu} className="text-text-muted p-2">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
              className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="md:hidden fixed inset-y-0 left-0 w-64 bg-surface z-40 shadow-xl"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 pt-16 md:pt-0">
        <div className="p-4 md:p-8 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
