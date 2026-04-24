import React, { useState } from 'react';
import { useAppStore } from '../../store/AppContext';
import { Card } from '../../components/ui/Card';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Clock } from 'lucide-react';

export default function CalendarPage() {
  const { appointments, professionals, services } = useAppStore();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Week view dates
  const startDate = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Start on Monday
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));

  // Get appointments for the selected date
  const dayAppointments = appointments.filter(a => a.date === format(selectedDate, 'yyyy-MM-dd') && a.status === 'confirmed')
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-medium text-gray-900">Calendário</h1>
        <p className="text-gray-500 mt-1">Visualize seus horários agendados.</p>
      </div>

      <Card className="mb-6 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-800 capitalize">
            {format(selectedDate, "MMMM 'de' yyyy", { locale: ptBR })}
          </h2>
          <div className="flex gap-2">
            <button 
              onClick={() => setSelectedDate(addDays(selectedDate, -7))}
              className="px-3 py-1 rounded border border-lilac-200 text-sm hover:bg-lilac-50"
            >
              Semana Ant.
            </button>
            <button 
              onClick={() => setSelectedDate(new Date())}
              className="px-3 py-1 rounded bg-lilac-100 text-lilac-700 text-sm hover:bg-lilac-200"
            >
              Hoje
            </button>
            <button 
              onClick={() => setSelectedDate(addDays(selectedDate, 7))}
              className="px-3 py-1 rounded border border-lilac-200 text-sm hover:bg-lilac-50"
            >
              Próx Semana
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((date) => {
            const isSelected = isSameDay(date, selectedDate);
            const isToday = isSameDay(date, new Date());
            return (
              <button
                key={date.toISOString()}
                onClick={() => setSelectedDate(date)}
                className={`flex flex-col items-center p-2 rounded-xl border-2 transition-all ${
                  isSelected ? 'border-lilac-500 bg-lilac-50' : 
                  isToday ? 'border-pink-200 bg-pink-50' : 'border-transparent hover:border-lilac-100'
                }`}
              >
                <span className="text-xs font-medium text-gray-500 uppercase">
                  {format(date, 'E', { locale: ptBR }).replace('.', '')}
                </span>
                <span className={`text-xl font-serif mt-1 ${isSelected ? 'text-lilac-700' : 'text-gray-900'}`}>
                  {format(date, 'd')}
                </span>
              </button>
            );
          })}
        </div>
      </Card>

      <div className="space-y-4">
        <h3 className="font-serif text-xl flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-lilac-500" />
          Agendamentos do Dia
        </h3>
        
        {dayAppointments.length === 0 ? (
          <Card className="py-12 text-center border-dashed">
            <p className="text-gray-500">Nenhum agendamento para este dia.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {dayAppointments.map(appt => {
              const service = services.find(s => s.id === appt.serviceId);
              const prof = professionals.find(p => p.id === appt.professionalId);
              
              return (
                <Card key={appt.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border-l-4 border-l-lilac-400">
                  <div className="flex gap-4">
                    <div className="bg-lilac-50 rounded-xl p-3 flex flex-col items-center justify-center min-w-[80px]">
                      <Clock className="w-4 h-4 text-lilac-400 mb-1" />
                      <span className="font-bold text-lilac-700">{appt.time}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-lg text-gray-900">{appt.clientName}</h4>
                      <p className="text-sm text-gray-500">{appt.clientPhone}</p>
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-0 sm:text-right">
                    <span className="inline-block px-3 py-1 bg-pink-50 text-pink-700 rounded-full text-sm font-medium mb-1">
                      {service?.name} ({service?.durationMinutes}m)
                    </span>
                    <p className="text-sm text-gray-500">com {prof?.name}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
