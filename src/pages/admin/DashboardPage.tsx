import React from 'react';
import { useAppStore } from '../../store/AppContext';
import { Card, AnimatedCard } from '../../components/ui/Card';
import { Users, Scissors, CalendarCheck, TrendingUp } from 'lucide-react';
import { format, isToday, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '../../lib/utils';

export default function DashboardPage() {
  const { professionals, services, appointments } = useAppStore();

  const todayAppointments = appointments.filter(a => {
    try {
      const date = parse(a.date, 'yyyy-MM-dd', new Date());
      return isToday(date) && a.status === 'confirmed';
    } catch {
      return false;
    }
  });

  const stats = [
    { label: 'Hoje', value: todayAppointments.length, icon: CalendarCheck },
    { label: 'Tot. Profissionais', value: professionals.length, icon: Users },
    { label: 'Tot. Serviços', value: services.length, icon: Scissors },
    { label: 'Agendamentos', value: appointments.filter(a => a.status === 'confirmed').length, icon: TrendingUp },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <p className="text-sm text-text-muted mb-1">Bem-vinda de volta,</p>
          <h1 className="text-[42px] leading-none font-serif font-bold text-deep-purple">Painel de Controle</h1>
        </div>

        <div className="flex gap-6">
          {stats.map((stat, i) => (
            <div key={stat.label} className="text-right">
              <span className="block text-[24px] font-bold text-accent-pink">{stat.value}</span>
              <span className="text-[11px] uppercase tracking-[0.1em] text-text-muted">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8">
          <div>
            <div className="font-serif italic text-[20px] mb-5 text-deep-purple">Agenda de Hoje</div>
            <Card className="p-0 overflow-hidden">
              {todayAppointments.length === 0 ? (
                <div className="p-8 text-center text-text-muted">
                  Nenhum agendamento confirmado para hoje.
                </div>
              ) : (
                <div className="p-6 flex flex-col gap-4">
                  {todayAppointments.map((appt, i) => {
                    const service = services.find(s => s.id === appt.serviceId);
                    const prof = professionals.find(p => p.id === appt.professionalId);
                    
                    return (
                      <div key={appt.id} className={cn(
                        "flex items-center p-3 rounded-[16px]",
                        i % 2 === 0 ? "bg-soft-lilac border-l-4 border-l-accent-pink" : "bg-white border border-border-theme"
                      )}>
                        <div className="w-[70px] font-bold text-[14px] text-deep-purple">
                          {appt.time}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-[15px]">{appt.clientName}</div>
                          <div className="text-[12px] text-text-muted">{service?.name}</div>
                        </div>
                        <div className="text-[12px] italic text-accent-pink">
                          {prof?.name}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>
        </div>

        <div className="w-full lg:w-[340px] space-y-8">
          <div>
            <div className="font-serif italic text-[20px] mb-5 text-deep-purple">Nossas Especialistas</div>
            <Card className="bg-white">
               <div className="grid grid-cols-2 gap-4">
                 {professionals.map(p => (
                   <div key={p.id} className="flex items-center gap-2.5 p-2 bg-pastel-pink rounded-[50px] text-[13px] text-text-main">
                     <div className="w-8 h-8 rounded-full bg-accent-pink flex items-center justify-center text-white font-bold text-[12px] overflow-hidden shrink-0">
                       <img src={p.photoUrl} alt={p.name} className="w-full h-full object-cover" />
                     </div>
                     <span className="truncate leading-tight font-medium">{p.name.split(' ')[0]}</span>
                   </div>
                 ))}
               </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
