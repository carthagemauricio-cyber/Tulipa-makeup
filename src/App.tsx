import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { AppProvider } from './store/AppContext';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import SchedulingPage from './pages/public/SchedulingPage';
import SuccessPage from './pages/public/SuccessPage';
import ClientPanelPage from './pages/public/ClientPanelPage';

// Admin Pages
import DashboardPage from './pages/admin/DashboardPage';
import ProfessionalsPage from './pages/admin/ProfessionalsPage';
import ServicesPage from './pages/admin/ServicesPage';
import CalendarPage from './pages/admin/CalendarPage';
import BookingsPage from './pages/admin/BookingsPage';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<SchedulingPage />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/track" element={<ClientPanelPage />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="bookings" element={<BookingsPage />} />
            <Route path="professionals" element={<ProfessionalsPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="calendar" element={<CalendarPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
