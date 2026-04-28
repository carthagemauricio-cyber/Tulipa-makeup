import { useAppStore } from '../../store/AppContext';
import { Card } from '../../components/ui/Card';
import { Appointment } from '../../types';
import { format, parseISO, isToday } from 'date-fns';

export default function DashboardPage() {
  const { appointments, services, professionals } = useAppStore();

  const todayAppointments = appointments.filter(a => isToday(parseISO(a.date)));

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-serif font-bold text-white mb-6">Painel de Controle</h1>
      <div className="grid sm:grid-cols-3 gap-6">
        <Card>
          <h3 className="text-text-muted text-sm uppercase font-bold tracking-wider mb-2">Reservas Hoje</h3>
          <p className="text-4xl font-serif font-bold text-accent-pink">{todayAppointments.length}</p>
        </Card>
        <Card>
          <h3 className="text-text-muted text-sm uppercase font-bold tracking-wider mb-2">Total Serviços</h3>
          <p className="text-4xl font-serif font-bold text-accent-pink">{services.length}</p>
        </Card>
        <Card>
          <h3 className="text-text-muted text-sm uppercase font-bold tracking-wider mb-2">Membros Equipe</h3>
          <p className="text-4xl font-serif font-bold text-accent-pink">{professionals.length}</p>
        </Card>
      </div>
      <Card>
        <h2 className="text-xl font-serif font-bold text-white mb-4">Agenda de Hoje</h2>
        {todayAppointments.length === 0 ? (
          <p className="text-text-muted">Nenhuma reserva para hoje.</p>
        ) : (
          <div className="space-y-4">
            {todayAppointments.map(appt => {
              const service = services.find(s => s.id === appt.serviceId);
              return (
                <div key={appt.id} className="flex justify-between items-center p-4 bg-[#2a1d35] rounded-xl border border-border-theme">
                  <div>
                    <h4 className="font-bold text-white">{appt.clientName}</h4>
                    <p className="text-sm text-text-muted">{service?.name || 'Serviço removido'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-accent-pink">{appt.time}</p>
                    <p className="text-xs uppercase px-2 py-1 bg-[#1c1524] rounded-full inline-block mt-1">{appt.status}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
