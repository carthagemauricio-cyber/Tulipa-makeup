import { useAppStore } from '../../store/AppContext';
import { Card } from '../../components/ui/Card';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import { useState } from 'react';

export default function CalendarPage() {
  const { appointments, services, professionals } = useAppStore();
  const [currentDate, setCurrentDate] = useState(new Date());

  const firstDay = startOfMonth(currentDate);
  const lastDay = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: firstDay, end: lastDay });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-serif font-bold text-white mb-6">Calendário</h1>
      <Card>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">{format(currentDate, 'MMMM yyyy')}</h2>
          <div className="flex gap-2">
            <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))} className="px-3 py-1 bg-[#2a1d35] text-white rounded hover:bg-accent-pink">&lt;</button>
            <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1 bg-[#2a1d35] text-white rounded hover:bg-accent-pink">Hoje</button>
            <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))} className="px-3 py-1 bg-[#2a1d35] text-white rounded hover:bg-accent-pink">&gt;</button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => <div key={d} className="text-center text-text-muted font-bold text-sm py-2">{d}</div>)}
          {Array.from({length: firstDay.getDay()}).map((_, i) => <div key={`empty-${i}`} />)}
          {days.map(day => {
            const dayAppts = appointments.filter(a => a.date && isSameDay(parseISO(a.date), day));
            return (
              <div key={day.toISOString()} className={`min-h-[80px] p-2 border border-border-theme rounded-xl ${isSameMonth(day, currentDate) ? 'bg-[#2a1d35]' : 'bg-[#1c1524] opacity-50'}`}>
                <p className="text-right text-xs font-bold text-text-muted mb-1">{format(day, 'd')}</p>
                <div className="space-y-1">
                  {dayAppts.map(a => (
                    <div key={a.id} className="text-[10px] bg-accent-pink text-white px-1.5 py-0.5 rounded truncate" title={`${a.time} - ${a.clientName}`}>
                      {a.time} {a.clientName.split(' ')[0]}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  );
}
