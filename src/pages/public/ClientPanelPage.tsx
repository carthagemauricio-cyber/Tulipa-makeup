import React, { useState } from 'react';
import { useAppStore } from '../../store/AppContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Search } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function ClientPanelPage() {
  const { appointments, services, professionals } = useAppStore();
  const [searchCode, setSearchCode] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const foundAppts = appointments.filter(a => a.bookingCode.toLowerCase() === searchCode.toLowerCase() || a.clientName.toLowerCase().includes(searchCode.toLowerCase()));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if(searchCode.trim()) setHasSearched(true);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">Acompanhe sua Reserva</h1>
        <p className="text-text-muted text-lg">Use o código da reserva ou seu nome para buscar.</p>
      </div>

      <Card className="mb-12 border-accent-pink/20 shadow-[0_4px_30px_rgba(217,70,239,0.1)]">
        <form onSubmit={handleSearch} className="flex gap-4">
          <Input 
            className="flex-1" 
            placeholder="Ex: A1B2C3 ou João Silva" 
            value={searchCode} 
            onChange={e => { setSearchCode(e.target.value); setHasSearched(false); }} 
          />
          <Button type="submit" className="shrink-0 pt-[10px] pb-[10px]">
             Buscar <Search className="w-4 h-4 ml-2 inline-block"/>
          </Button>
        </form>
      </Card>

      {hasSearched ? (
        <div className="space-y-4">
          <h2 className="text-2xl font-serif text-white mb-6">Resultados</h2>
          {foundAppts.length === 0 ? (
            <div className="text-center bg-[#1c1524] p-12 rounded-2xl border border-border-theme">
              <p className="text-text-muted text-lg">Nenhuma reserva encontrada com este código ou nome.</p>
            </div>
          ) : (
             foundAppts.map(appt => {
              const service = services.find(s => s.id === appt.serviceId);
              const prof = professionals.find(p => p.id === appt.professionalId);
              return (
                <Card key={appt.id} className="flex flex-col md:flex-row justify-between gap-6 border-l-4 border-l-accent-pink">
                  <div>
                    <h3 className="font-bold text-xl text-white mb-1">{service?.name || 'Serviço Removido'}</h3>
                    <p className="text-text-muted mb-4">com {prof?.name || 'Profissional Removido'}</p>
                    <p className="inline-block bg-[#2a1d35] px-3 py-1 rounded text-accent-pink font-mono tracking-wider font-bold">{appt.bookingCode}</p>
                  </div>
                  <div className="md:text-right">
                    <p className="text-2xl font-bold text-white mb-1"><span className="text-sm font-normal text-text-muted mr-2">Data:</span>{appt.date ? format(parseISO(appt.date), 'dd/MM/yyyy') : ''}</p>
                    <p className="text-xl font-bold text-white mb-4"><span className="text-sm font-normal text-text-muted mr-2">Hora:</span>{appt.time}</p>
                    <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-white">
                      Status: {appt.status === 'pending' ? 'Pendente' : appt.status === 'confirmed' ? 'Confirmado' : appt.status === 'completed' ? 'Concluído' : 'Cancelado'}
                    </span>
                  </div>
                </Card>
              )
            })
          )}
        </div>
      ) : (
        <div className="mt-20">
          <h2 className="text-2xl font-serif text-white text-center mb-8">Nossa Equipe de Especialistas</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {professionals.map(p => (
              <Card key={p.id} className="text-center overflow-hidden hover:border-accent-pink/30 transition-colors p-0">
                <img src={p.photoUrl} alt={p.name} className="w-full h-48 object-cover object-top" />
                <div className="p-6">
                  <h3 className="font-bold text-lg text-white mb-2">{p.name}</h3>
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {p.serviceIds.slice(0,3).map(sid => (
                      <span key={sid} className="text-[10px] uppercase tracking-wider bg-[#2a1d35] text-text-muted px-2 py-1 rounded">{services.find(s=>s.id===sid)?.name}</span>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
