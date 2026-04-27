import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../store/AppContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { AnimatedCard } from '../../components/ui/Card';
import { Search, Calendar, User, Clock, Scissors, Activity } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ClientPanelPage() {
  const { appointments, services, professionals } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setHasSearched(true);
    }
  };

  const filteredAppointments = useMemo(() => {
    if (!hasSearched || !searchTerm.trim()) return [];
    
    const term = searchTerm.toLowerCase().trim();
    return appointments.filter(a => 
      a.clientName.toLowerCase().includes(term) ||
      a.bookingCode.toLowerCase() === term
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [appointments, searchTerm, hasSearched]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <span className="px-3 py-1 bg-yellow-500/20 text-yellow-500 rounded-full text-xs font-bold tracking-wider uppercase flex items-center gap-1">⏳ Pendente</span>;
      case 'confirmed': return <span className="px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-xs font-bold tracking-wider uppercase flex items-center gap-1">✅ Confirmado</span>;
      case 'completed': return <span className="px-3 py-1 bg-blue-500/20 text-blue-500 rounded-full text-xs font-bold tracking-wider uppercase flex items-center gap-1">✔️ Concluído</span>;
      case 'cancelled': return <span className="px-3 py-1 bg-red-500/20 text-red-500 rounded-full text-xs font-bold tracking-wider uppercase flex items-center gap-1">❌ Cancelado</span>;
      default: return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-serif font-medium text-white mb-3">Painel do Cliente</h1>
        <p className="text-text-muted">Acompanhe o status do seu agendamento usando seu nome completo ou código do agendamento.</p>
      </div>

      <AnimatedCard className="mb-10 p-2 bg-[#1c1524]">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <Input 
            placeholder="Ex: Maria Silva ou MZ-A1B2" 
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setHasSearched(false);
            }}
            className="flex-1 bg-[#2a1d35] border-border-theme h-12 text-white"
          />
          <Button type="submit" className="h-[48px] sm:h-auto px-8 shrink-0">
            <Search className="w-5 h-5 mr-2" /> Buscar
          </Button>
        </form>
      </AnimatedCard>

      {hasSearched && (
        <div className="space-y-6">
          <h2 className="text-xl font-serif text-deep-purple italic">Meus Agendamentos</h2>
          
          {filteredAppointments.length === 0 ? (
            <div className="bg-[#1c1524] border border-border-theme rounded-2xl p-8 text-center">
              <Search className="w-12 h-12 text-text-muted mx-auto mb-4 opacity-50" />
              <p className="text-white font-medium mb-1">Nenhum agendamento encontrado</p>
              <p className="text-sm text-text-muted">Verifique se digitou corretamente ou solicite um novo.</p>
            </div>
          ) : (
            filteredAppointments.map((appt, i) => {
              const service = services.find(s => s.id === appt.serviceId);
              const paramDate = parseISO(appt.date);
              
              return (
                <AnimatedCard key={appt.id} delay={i * 0.1} className="bg-[#1c1524] overflow-hidden">
                  <div className="border-b border-border-theme pb-4 mb-4 flex justify-between items-start">
                    <div>
                      <span className="text-xs font-mono font-bold text-text-muted tracking-widest block mb-1">CÓDIGO: {appt.bookingCode}</span>
                      <h3 className="text-xl font-bold text-white">{appt.clientName}</h3>
                    </div>
                    {getStatusBadge(appt.status)}
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 text-text-main">
                      <div className="w-10 h-10 rounded-full bg-[#2a1d35] flex items-center justify-center shrink-0">
                        <Scissors className="w-5 h-5 text-accent-pink" />
                      </div>
                      <div>
                        <p className="text-xs text-text-muted uppercase tracking-wider font-semibold">Serviço</p>
                        <p className="font-medium">{service?.name || 'Serviço Removido'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-text-main">
                      <div className="w-10 h-10 rounded-full bg-[#2a1d35] flex items-center justify-center shrink-0">
                        <Calendar className="w-5 h-5 text-accent-pink" />
                      </div>
                      <div>
                        <p className="text-xs text-text-muted uppercase tracking-wider font-semibold">Data e Hora</p>
                        <p className="font-medium">
                          {format(paramDate, "dd/MM/yyyy")} às {appt.time}
                        </p>
                      </div>
                    </div>
                  </div>
                </AnimatedCard>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
