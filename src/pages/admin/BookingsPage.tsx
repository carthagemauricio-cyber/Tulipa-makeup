import { useAppStore } from '../../store/AppContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { format, parseISO } from 'date-fns';

export default function BookingsPage() {
  const { appointments, updateAppointmentStatus, services } = useAppStore();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-serif font-bold text-white mb-6">Reservas</h1>
      <div className="space-y-4">
        {appointments.map(appt => {
          const service = services.find(s => s.id === appt.serviceId);
          return (
            <Card key={appt.id} className="flex flex-col md:flex-row justify-between gap-4">
              <div>
                <h3 className="font-bold text-lg text-white">{appt.clientName}</h3>
                <p className="text-sm text-text-muted">{appt.clientPhone}</p>
                <p className="text-sm border border-border-theme px-2 py-1 mt-2 inline-block rounded uppercase bg-[#2a1d35] text-accent-pink tracking-wider font-mono">
                  {appt.bookingCode}
                </p>
              </div>
              <div className="md:border-l border-border-theme md:pl-6">
                <p className="text-sm text-text-muted mb-1">Serviço: <span className="text-white">{service?.name || "Removido"}</span></p>
                <p className="text-sm text-text-muted mb-1">Data: <span className="text-white">{appt.date ? format(parseISO(appt.date), 'dd/MM/yyyy') : 'N/A'}</span></p>
                <p className="text-sm text-text-muted mb-1">Hora: <span className="text-white">{appt.time}</span></p>
                <p className="text-sm text-text-muted">Status: <span className="text-white uppercase">{appt.status}</span></p>
              </div>
              <div className="flex flex-col justify-center gap-2">
                {appt.status !== 'confirmed' && <Button onClick={() => updateAppointmentStatus(appt.id, 'confirmed')} className="w-full">Confirmar</Button>}
                {appt.status !== 'completed' && <Button variant="secondary" onClick={() => updateAppointmentStatus(appt.id, 'completed')} className="w-full">Concluir</Button>}
                {appt.status !== 'cancelled' && <Button variant="danger" onClick={() => updateAppointmentStatus(appt.id, 'cancelled')} className="w-full">Cancelar</Button>}
              </div>
            </Card>
          );
        })}
        {appointments.length === 0 && (
          <p className="text-center text-text-muted mt-12 py-12 border border-border-theme bg-[#1c1524] rounded-2xl">Nenhuma reserva encontrada.</p>
        )}
      </div>
    </div>
  );
}
