import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/AppContext';
import { Card, AnimatedCard } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { format, addDays, parseISO } from 'date-fns';

export default function SchedulingPage() {
  const navigate = useNavigate();
  const { services, professionals, addAppointment } = useAppStore();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState('');
  const [selectedProf, setSelectedProf] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [clientData, setClientData] = useState({ name: '', phone: '' });

  const dates = Array.from({length: 7}).map((_, i) => addDays(new Date(), i));
  const times = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  const profsForService = professionals.filter(p => !selectedService || p.serviceIds.includes(selectedService));

  const handleComplete = () => {
    if (!selectedService || !selectedProf || !selectedDate || !selectedTime || !clientData.name || !clientData.phone) return;
    const a = addAppointment({
      serviceId: selectedService,
      professionalId: selectedProf,
      date: selectedDate,
      time: selectedTime,
      clientName: clientData.name,
      clientPhone: clientData.phone,
      status: 'pending'
    });
    navigate('/success', { state: { bookingCode: a.bookingCode } });
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">Agende seu Horário</h1>
        <p className="text-text-muted text-lg">Escolha o serviço e vamos cuidar da sua beleza.</p>
      </div>

      <div className="flex justify-between mb-8 relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-[#2a1d35] -translate-y-1/2 z-0" />
        {[1, 2, 3, 4].map(s => (
          <div key={s} className="relative z-10 flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${step >= s ? 'bg-accent-pink text-white shadow-[0_0_15px_rgba(217,70,239,0.5)]' : 'bg-[#2a1d35] text-text-muted border-2 border-border-theme'}`}>
              {s}
            </div>
          </div>
        ))}
      </div>

      <Card className="min-h-[400px]">
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-serif text-white mb-6">1. Escolha o Serviço</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {services.map(s => (
                <div key={s.id} onClick={() => setSelectedService(s.id)} className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedService === s.id ? 'border-accent-pink bg-accent-pink/10' : 'border-border-theme hover:border-accent-pink/50 bg-[#2a1d35]'}`}>
                  <h3 className="font-bold text-white mb-1">{s.name}</h3>
                  <p className="text-text-muted text-sm">{s.durationMinutes} min • {s.price} MZN</p>
                </div>
              ))}
            </div>
            <Button className="mt-8" fullWidth disabled={!selectedService} onClick={() => setStep(2)}>Próximo</Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-serif text-white mb-6">2. Escolha o Profissional</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {profsForService.map(p => (
                <div key={p.id} onClick={() => setSelectedProf(p.id)} className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 ${selectedProf === p.id ? 'border-accent-pink bg-accent-pink/10' : 'border-border-theme hover:border-accent-pink/50 bg-[#2a1d35]'}`}>
                  <img src={p.photoUrl} alt={p.name} className="w-12 h-12 rounded-full object-cover" />
                  <h3 className="font-bold text-white">{p.name}</h3>
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-8">
              <Button variant="outline" onClick={() => setStep(1)}>Voltar</Button>
              <Button fullWidth disabled={!selectedProf} onClick={() => setStep(3)}>Próximo</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-serif text-white mb-6">3. Data e Hora</h2>
            <div>
              <p className="mb-2 font-medium text-text-muted text-sm uppercase tracking-wider">Data</p>
              <div className="flex gap-2 overflow-x-auto pb-4">
                {dates.map((d, i) => {
                  const ds = d.toISOString().split('T')[0];
                  return (
                    <div key={i} onClick={() => { setSelectedDate(ds); setSelectedTime(''); }} className={`shrink-0 p-3 rounded-xl border-2 cursor-pointer text-center min-w-[80px] transition-all ${selectedDate === ds ? 'border-accent-pink bg-accent-pink/10 text-white' : 'border-border-theme bg-[#2a1d35] text-text-muted hover:border-accent-pink/50'}`}>
                      <p className="text-xs">{format(d, 'eee')}</p>
                      <p className="text-xl font-bold">{format(d, 'dd')}</p>
                    </div>
                  )
                })}
              </div>
            </div>
            {selectedDate && (
              <div>
                <p className="mb-2 font-medium text-text-muted text-sm uppercase tracking-wider">Hora</p>
                <div className="grid grid-cols-4 gap-2">
                  {times.map((t) => (
                    <div key={t} onClick={() => setSelectedTime(t)} className={`p-2 rounded-xl border-2 cursor-pointer text-center transition-all ${selectedTime === t ? 'border-accent-pink bg-accent-pink/10 text-white font-bold' : 'border-border-theme bg-[#2a1d35] text-text-muted hover:border-accent-pink/50'}`}>
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-4 mt-8">
              <Button variant="outline" onClick={() => setStep(2)}>Voltar</Button>
              <Button fullWidth disabled={!selectedDate || !selectedTime} onClick={() => setStep(4)}>Próximo</Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-serif text-white mb-6">4. Seus Dados</h2>
            <Input label="Seu Nome Completo" value={clientData.name} onChange={e => setClientData({...clientData, name: e.target.value})} />
            <Input label="Seu Telefone" value={clientData.phone} onChange={e => setClientData({...clientData, phone: e.target.value})} />
            
            <div className="bg-[#2a1d35] p-4 rounded-xl border border-border-theme mt-6">
              <h3 className="font-bold text-white mb-2">Resumo:</h3>
              <p className="text-sm text-text-muted">{services.find(s=>s.id===selectedService)?.name} com {professionals.find(p=>p.id===selectedProf)?.name}</p>
              <p className="text-sm text-text-muted">{selectedDate ? format(parseISO(selectedDate), 'dd/MM/yyyy') : ''} às {selectedTime}</p>
            </div>

            <div className="flex gap-4 mt-8">
              <Button variant="outline" onClick={() => setStep(3)}>Voltar</Button>
              <Button fullWidth disabled={!clientData.name || !clientData.phone} onClick={handleComplete}>Confirmar Reserva</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
