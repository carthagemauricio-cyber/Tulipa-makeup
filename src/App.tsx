import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import SchedulingPage from './pages/public/SchedulingPage';
import ClientPanelPage from './pages/public/ClientPanelPage';
import SuccessPage from './pages/public/SuccessPage';
import DashboardPage from './pages/admin/DashboardPage';
import ServicesPage from './pages/admin/ServicesPage';
import ProfessionalsPage from './pages/admin/ProfessionalsPage';
import BookingsPage from './pages/admin/BookingsPage';
import CalendarPage from './pages/admin/CalendarPage';
import { AppProvider } from './store/AppContext';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<SchedulingPage />} />
            <Route path="/track" element={<ClientPanelPage />} />
            <Route path="/success" element={<SuccessPage />} />
          </Route>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="professionals" element={<ProfessionalsPage />} />
            <Route path="bookings" element={<BookingsPage />} />
            <Route path="calendar" element={<CalendarPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
