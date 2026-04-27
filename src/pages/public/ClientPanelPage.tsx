import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../store/AppContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { AnimatedCard } from '../../components/ui/Card';
import { Search, Calendar, User, Clock, Scissors, Activity, Sparkles } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion, AnimatePresence } from 'motion/react';

export default function ClientPanelPage() {
  const { appointments, services } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim().length >= 3) {
      setHasSearched(true);
    }
  };

  const filteredAppointments = useMemo(() => {
    if (!hasSearched || searchTerm.trim().length < 3) return [];
    
    const termStr = searchTerm.toLowerCase().trim();
    const termWords = termStr.split(/\s+/);
    
    return appointments.filter(a => {
      const nameStr = a.clientName.toLowerCase().trim();
      const codeStr = a.bookingCode.toLowerCase().trim();
      
      const isExactCode = codeStr === termStr;
      
      // Every typed word must be an exact match to a word in the client's name
      // Example: 'Mauricio' matches 'Mauricio', 'Ma' does not match 'Mauricio'
      const nameWords = nameStr.split(/\s+/);
      const isNameMatch = termWords.every(word => nameWords.includes(word));
      
      return isExactCode || isNameMatch;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [appointments, searchTerm, hasSearched]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <span className="px-3 py-1.5 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-full text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-[0_0_10px_rgba(234,179,8,0.1)]">⏳ Pendente</span>;
      case 'confirmed': return <span className="px-3 py-1.5 bg-green-500/10 text-green-500 border border-green-500/20 rounded-full text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-[0_0_10px_rgba(34,197,94,0.1)]">✅ Confirmado</span>;
      case 'completed': return <span className="px-3 py-1.5 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-full text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-[0_0_10px_rgba(59,130,246,0.1)]">✔️ Concluído</span>;
      case 'cancelled': return <span className="px-3 py-1.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-full text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-[0_0_10px_rgba(239,68,68,0.1)]">❌ Cancelado</span>;
      default: return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 relative">
      {/* Premium Background Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-64 bg-accent-pink/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="text-center mb-12 relative z-10">
        <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-accent-pink/10 text-accent-pink text-sm font-semibold tracking-wider mb-6 border border-accent-pink/20">
          <Sparkles className="w-4 h-4" /> ÁREA EXCLUSIVA
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4 tracking-tight">Painel do Cliente</h1>
        <p className="text-text-muted text-lg max-w-lg mx-auto">Acompanhe o status do seu agendamento de forma rápida. Digite seu nome completo ou o código da reserva.</p>
      </div>

      <AnimatedCard className="mb-12 p-1.5 bg-gradient-to-br from-[#334155]/80 to-[#1e293b]/90 backdrop-blur-lg border border-[#475569] rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.3)] relative z-10 group overflow-hidden">
        {/* Subtle hover glow on the card */}
        <div className="absolute inset-0 bg-gradient-to-r from-accent-pink/0 via-accent-pink/5 to-accent-pink/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 relative z-10 m-2">
          <div className="flex-1 relative">
            <Input 
              placeholder="Ex: Maria Silva ou MZ-A1B2" 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setHasSearched(false);
              }}
              className="w-full bg-[#1e293b]/50 border-transparent hover:border-accent-pink/30 focus:border-accent-pink focus:bg-[#334155] h-[60px] text-white text-base rounded-[16px] pl-12"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted peer-focus:text-accent-pink transition-colors" />
          </div>
          <Button type="submit" className="h-[60px] px-8 shrink-0 rounded-[16px] text-base" disabled={searchTerm.trim().length < 3}>
            Buscar Reservas
          </Button>
        </form>
        {searchTerm.trim().length > 0 && searchTerm.trim().length < 3 && (
          <p className="text-xs text-text-muted text-center mt-2 pb-2">Digite pelo menos 3 caracteres para buscar.</p>
        )}
      </AnimatedCard>

      <AnimatePresence mode="wait">
        {hasSearched ? (
          <motion.div 
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6 relative z-10"
          >
            <h2 className="text-2xl font-serif text-white flex items-center gap-3 border-b border-border-theme pb-4">
              <span className="w-8 h-px bg-accent-pink/50 block" /> Result<span className="text-text-muted">ados</span>
            </h2>
            
            {filteredAppointments.length === 0 ? (
              <AnimatedCard className="bg-[#1e293b]/60 backdrop-blur-md border border-[#475569] rounded-[24px] p-12 text-center shadow-lg">
                <div className="w-20 h-20 mx-auto bg-[#334155] rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <Search className="w-8 h-8 text-text-muted opacity-50" />
                </div>
                <p className="text-xl text-white font-serif mb-2">Nenhum agendamento encontrado.</p>
                <p className="text-text-muted">Por favor, verifique se você digitou seu nome completo exatamente como na reserva, ou use o código recebido.</p>
              </AnimatedCard>
            ) : (
              filteredAppointments.map((appt, i) => {
                const service = services.find(s => s.id === appt.serviceId);
                const paramDate = parseISO(appt.date);
                
                return (
                  <AnimatedCard key={appt.id} delay={i * 0.1} className="bg-gradient-to-br from-[#334155]/60 to-[#1e293b]/80 backdrop-blur-md border border-[#475569] hover:border-accent-pink/40 shadow-[0_8px_30px_rgba(0,0,0,0.2)] rounded-[24px] overflow-hidden transition-all duration-300 group">
                    <div className="p-6 sm:p-8">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-8">
                        <div>
                          <div className="inline-flex items-center gap-2 mb-3">
                            <span className="w-2 h-2 rounded-full bg-accent-pink animate-pulse" />
                            <span className="text-xs font-mono font-bold text-accent-pink tracking-widest uppercase">Cód: {appt.bookingCode}</span>
                          </div>
                          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white group-hover:text-accent-pink transition-colors">{appt.clientName}</h3>
                        </div>
                        <div className="shrink-0">
                          {getStatusBadge(appt.status)}
                        </div>
                      </div>
                      
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-4 bg-[#1e293b]/50 rounded-[16px] p-4 border border-[#475569]/50">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#475569] to-[#334155] flex items-center justify-center shrink-0 border border-[#475569] shadow-inner">
                            <Scissors className="w-5 h-5 text-accent-pink" />
                          </div>
                          <div>
                            <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold mb-1">Serviço Agendado</p>
                            <p className="font-medium text-white text-lg">{service?.name || 'Serviço Removido / Sem Nome'}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 bg-[#1e293b]/50 rounded-[16px] p-4 border border-[#475569]/50">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#475569] to-[#334155] flex items-center justify-center shrink-0 border border-[#475569] shadow-inner">
                            <Calendar className="w-5 h-5 text-accent-pink" />
                          </div>
                          <div>
                            <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold mb-1">Data e Horário</p>
                            <p className="font-medium text-white text-lg">
                              {format(paramDate, "dd/MM/yy")} <span className="text-text-muted mx-1">•</span> {appt.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AnimatedCard>
                );
              })
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="services"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-16 relative z-10"
          >
            <div className="text-center mb-10">
              <h2 className="text-3xl font-serif text-white mb-4">Nossos Serviços</h2>
              <p className="text-text-muted">Conheça os tratamentos que oferecemos para realçar sua beleza.</p>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {services.map((service, i) => (
                <AnimatedCard key={service.id} delay={i * 0.1} className="bg-gradient-to-br from-[#334155]/60 to-[#1e293b]/80 backdrop-blur-md border border-[#475569] hover:border-accent-pink/40 shadow-[0_8px_30px_rgba(0,0,0,0.2)] rounded-[24px] p-6 group transition-all duration-300">
                  <div className="flex items-center gap-4">
                     <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#475569] to-[#334155] flex items-center justify-center shrink-0 border border-[#475569] shadow-inner group-hover:border-accent-pink/30 transition-colors">
                        <Scissors className="w-6 h-6 text-accent-pink group-hover:scale-110 transition-transform duration-300" />
                     </div>
                     <div className="flex-1">
                        <h3 className="font-bold text-white text-lg group-hover:text-accent-pink transition-colors">{service.name}</h3>
                        <p className="text-sm text-text-muted flex items-center gap-1.5 mt-1">
                          <Clock className="w-3.5 h-3.5 text-accent-pink/70" /> {service.durationMinutes} min
                        </p>
                     </div>
                     <div className="text-right shrink-0">
                        <span className="font-serif font-bold text-accent-pink block text-xl">
                           {(service.price).toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
                        </span>
                     </div>
                  </div>
                </AnimatedCard>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
