import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../store/AppContext';
import { Card, AnimatedCard } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Search, Filter, CheckCircle2, XCircle, Trash2, Calendar, Phone, Clock } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AppointmentStatus } from '../../types';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function BookingsPage() {
  const { appointments, services, professionals, updateAppointmentStatus, deleteAppointment } = useAppStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'all'>('all');

  const filteredAppointments = useMemo(() => {
    let filtered = appointments;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(a => a.status === statusFilter);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(a => 
        a.clientName.toLowerCase().includes(term) ||
        a.date.includes(term) ||
        (services.find(s => s.id === a.serviceId)?.name.toLowerCase().includes(term))
      );
    }

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [appointments, searchTerm, statusFilter, services]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <span className="px-2 py-1 bg-yellow-500/10 text-yellow-500 rounded text-[10px] font-bold uppercase tracking-widest">Pendente</span>;
      case 'confirmed': return <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded text-[10px] font-bold uppercase tracking-widest">Confirmado</span>;
      case 'completed': return <span className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded text-[10px] font-bold uppercase tracking-widest">Concluído</span>;
      case 'cancelled': return <span className="px-2 py-1 bg-red-500/10 text-red-500 rounded text-[10px] font-bold uppercase tracking-widest">Cancelado</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-deep-purple">Gestão de Reservas</h1>
          <p className="text-text-muted mt-1">Gerencie todos os agendamentos registrados.</p>
        </div>
      </div>

      <Card className="bg-[#1e293b] p-4 flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Buscar por Nome, Data ou Serviço..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-[#334155] text-white border-border-theme h-11"
          />
        </div>
        <div className="w-full md:w-48 text-white">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            options={[
              { value: 'all', label: 'Todos os Status' },
              { value: 'pending', label: '⏳ Pendentes' },
              { value: 'confirmed', label: '✅ Confirmados' },
              { value: 'completed', label: '✔️ Concluídos' },
              { value: 'cancelled', label: '❌ Cancelados' },
            ]}
            className="bg-[#334155] text-white h-11 border-border-theme"
          />
        </div>
      </Card>

      <div className="grid gap-4">
        {filteredAppointments.length === 0 ? (
          <div className="p-12 text-center bg-[#1e293b] border border-border-theme rounded-3xl">
            <Filter className="w-12 h-12 text-text-muted mx-auto mb-4 opacity-30" />
            <h3 className="text-lg font-bold text-white mb-2">Nenhuma reserva encontrada</h3>
            <p className="text-text-muted text-sm">Tente ajustar os filtros ou termo de busca.</p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredAppointments.map((appt, i) => {
              const service = services.find(s => s.id === appt.serviceId);
              const prof = professionals.find(p => p.id === appt.professionalId);
              const paramDate = parseISO(appt.date);

              return (
                <motion.div
                  key={appt.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0, overflow: 'hidden' }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-[#1e293b] p-0 overflow-hidden">
                    <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex-1 flex flex-col md:flex-row gap-6">
                        {/* ID e Cliente */}
                        <div className="w-full md:w-1/3">
                          <div className="flex items-center gap-2 mb-1">
                            {getStatusBadge(appt.status)}
                            <span className="text-text-muted text-[11px] font-mono tracking-widest">{appt.bookingCode}</span>
                          </div>
                          <h3 className="font-bold text-white text-lg">{appt.clientName}</h3>
                          <div className="flex items-center text-text-muted text-sm mt-1 gap-1.5">
                            <Phone className="w-3.5 h-3.5" />
                            {appt.clientPhone}
                          </div>
                        </div>

                        {/* Detalhes do Serviço */}
                        <div className="w-full md:w-1/3 space-y-2 border-l-0 md:border-l border-t md:border-t-0 border-border-theme pt-4 md:pt-0 md:pl-6">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded bg-[#334155] flex items-center justify-center shrink-0">
                              ✂️
                            </span>
                            <span className="text-sm font-medium text-white">{service?.name || "Removido"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded bg-[#334155] flex items-center justify-center shrink-0">
                              👩
                            </span>
                            <span className="text-sm text-text-muted">{prof?.name || "Removido"}</span>
                          </div>
                        </div>

                        {/* Data e Hora */}
                        <div className="w-full md:w-1/4 space-y-2 border-l-0 md:border-l border-t md:border-t-0 border-border-theme pt-4 md:pt-0 md:pl-6 text-sm text-white">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-accent-pink" />
                            {format(paramDate, "dd/MM/yyyy")}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-accent-pink" />
                            {appt.time}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-row md:flex-col gap-2 shrink-0 border-t md:border-t-0 border-border-theme pt-4 md:pt-0 w-full md:w-auto">
                        {appt.status === 'pending' && (
                          <Button 
                            size="sm" 
                            variant="primary" 
                            className="flex-1 w-full md:w-36 bg-green-500 hover:bg-green-600 shadow-[0_4px_15px_rgba(34,197,94,0.3)] focus:ring-green-500"
                            onClick={() => updateAppointmentStatus(appt.id, 'confirmed')}
                          >
                            <CheckCircle2 className="w-4 h-4 mr-1.5" /> Confirmar
                          </Button>
                        )}
                        {appt.status === 'confirmed' && (
                          <Button 
                            size="sm" 
                            variant="primary" 
                            className="flex-1 w-full md:w-36 bg-blue-500 hover:bg-blue-600 shadow-[0_4px_15px_rgba(59,130,246,0.3)] focus:ring-blue-500"
                            onClick={() => updateAppointmentStatus(appt.id, 'completed')}
                          >
                            <CheckCircle2 className="w-4 h-4 mr-1.5" /> Concluir
                          </Button>
                        )}
                        {(appt.status === 'pending' || appt.status === 'confirmed') && (
                          <Button 
                            size="sm" 
                            variant="danger" 
                            className="flex-1 w-full md:w-36 bg-[rgba(239,68,68,0.15)] text-red-500 hover:bg-[rgba(239,68,68,0.25)]"
                            onClick={() => updateAppointmentStatus(appt.id, 'cancelled')}
                          >
                            <XCircle className="w-4 h-4 mr-1.5" /> Cancelar
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="flex-1 w-full md:w-36 text-text-muted hover:text-red-500 hover:bg-[rgba(239,68,68,0.1)]"
                          onClick={() => {
                            if (window.confirm("Deseja deletar este agendamento permanentemente?")) {
                              deleteAppointment(appt.id);
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4 mr-1.5" /> Excluir
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
