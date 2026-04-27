import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/AppContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { AnimatedCard } from '../../components/ui/Card';
import { generateTimeSlots, filterAvailableTimeSlots } from '../../lib/scheduling';
import { format, addDays, startOfToday, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale'; // Using ptBR as closest to pt-MZ for date formatting
import { motion, AnimatePresence } from 'motion/react';
import { Calendar as CalendarIcon, Clock, User, Scissors, CheckCircle2 } from 'lucide-react';

export default function SchedulingPage() {
  const navigate = useNavigate();
  const { services, professionals, appointments, addAppointment } = useAppStore();

  const [step, setStep] = useState(1);
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [selectedProfId, setSelectedProfId] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [error, setError] = useState('');

  const selectedService = services.find(s => s.id === selectedServiceId);
  const selectedProf = professionals.find(p => p.id === selectedProfId);

  // Available professionals for the selected service
  const availableProfessionals = useMemo(() => {
    if (!selectedServiceId) return [];
    return professionals.filter(p => p.specialties.includes(selectedServiceId));
  }, [professionals, selectedServiceId]);

  // Generate 14 days from today
  const upcomingDays = useMemo(() => {
    const days = [];
    const today = startOfToday();
    for (let i = 0; i < 14; i++) {
        days.push(addDays(today, i));
    }
    return days;
  }, []);

  // Generate and filter time slots
  const availableSlots = useMemo(() => {
    if (!selectedProf || !selectedService || !selectedDate) return [];
    const allSlots = generateTimeSlots(selectedProf, selectedService, selectedDate, appointments);
    return filterAvailableTimeSlots(allSlots, selectedDate, selectedService, selectedProf.id, appointments, services);
  }, [selectedProf, selectedService, selectedDate, appointments, services]);

  const handleNext = () => {
    setError('');
    if (step === 1 && !selectedServiceId) { setError('Por favor, selecione um serviço.'); return; }
    if (step === 2 && !selectedProfId) { setError('Por favor, selecione uma profissional.'); return; }
    if (step === 3 && (!selectedDate || !selectedTime)) { setError('Por favor, selecione a data e o horário.'); return; }
    if (step === 4 && (!clientName || !clientPhone)) { setError('Por favor, preencha seus dados.'); return; }
    
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Submit
      const newAppt = addAppointment({
        clientName,
        clientPhone,
        serviceId: selectedServiceId,
        professionalId: selectedProfId,
        date: format(selectedDate!, 'yyyy-MM-dd'),
        time: selectedTime,
      });
      navigate(`/success?code=${newAppt.bookingCode}`);
    }
  };

  const handleBack = () => {
    setError('');
    setStep(step - 1);
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-serif font-medium text-lilac-600 mb-3">Agende seu horário</h1>
        <p className="text-gray-500">Realce sua beleza no Tulipa Hair.</p>
      </div>

      {/* Progress Bar */}
      <div className="flex gap-2 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-1.5 flex-1 rounded-full bg-lilac-100 overflow-hidden">
            <motion.div 
              className="h-full bg-lilac-500"
              initial={{ width: '0%' }}
              animate={{ width: step >= i ? '100%' : '0%' }}
              transition={{ duration: 0.3 }}
            />
          </div>
        ))}
      </div>

      <AnimatedCard className="overflow-hidden min-h-[400px] flex flex-col">
        <AnimatePresence mode="wait">
          
          {/* Step 1: Service */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1">
              <h2 className="text-xl font-serif text-gray-800 mb-6 flex items-center gap-2">
                <Scissors className="w-5 h-5 text-lilac-500" /> Qual serviço você deseja?
              </h2>
              <div className="grid gap-3">
                {services.map(service => (
                  <button
                    key={service.id}
                    onClick={() => {
                      setSelectedServiceId(service.id);
                      setSelectedProfId('');
                      setSelectedDate(null);
                      setSelectedTime('');
                    }}
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                      selectedServiceId === service.id 
                        ? 'border-lilac-500 bg-lilac-50/50' 
                        : 'border-lilac-100 hover:border-lilac-300 hover:bg-lilac-50/30'
                    }`}
                  >
                    <div>
                      <h3 className="font-medium text-gray-900 text-left">{service.name}</h3>
                      <p className="text-sm text-gray-500 text-left">{service.durationMinutes} min</p>
                    </div>
                    <span className="font-medium text-lilac-600">
                      {(service.price).toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Professional */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1">
              <h2 className="text-xl font-serif text-gray-800 mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-lilac-500" /> Escolha a profissional
              </h2>
              <div className="grid gap-4">
                {availableProfessionals.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Nenhuma profissional disponível para este serviço no momento.</p>
                ) : (
                  availableProfessionals.map(prof => (
                    <button
                      key={prof.id}
                      onClick={() => {
                        setSelectedProfId(prof.id);
                        setSelectedDate(null);
                        setSelectedTime('');
                      }}
                      className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                        selectedProfId === prof.id 
                          ? 'border-lilac-500 bg-lilac-50/50' 
                          : 'border-lilac-100 hover:border-lilac-300 hover:bg-lilac-50/30'
                      }`}
                    >
                      <img src={prof.photoUrl} alt={prof.name} className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm" />
                      <div>
                        <h3 className="font-medium text-gray-900 text-left text-lg">{prof.name}</h3>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {/* Step 3: Date & Time */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1">
              <h2 className="text-xl font-serif text-gray-800 mb-6 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-lilac-500" /> Quando você quer vir?
              </h2>
              
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Data</label>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {upcomingDays.map(date => {
                    const isAvailable = selectedProf?.availability.days.includes(date.getDay());
                    const isSelected = selectedDate && isSameDay(date, selectedDate);
                    
                    return (
                      <button
                        key={date.toISOString()}
                        disabled={!isAvailable}
                        onClick={() => { setSelectedDate(date); setSelectedTime(''); }}
                        className={`flex flex-col items-center justify-center min-w-[72px] h-[88px] rounded-2xl border-2 transition-all ${
                          !isAvailable ? 'opacity-40 cursor-not-allowed border-gray-100' :
                          isSelected ? 'border-lilac-500 bg-lilac-500 text-white shadow-md shadow-lilac-200' : 'border-lilac-100 hover:border-lilac-300 text-gray-700'
                        }`}
                      >
                        <span className={`text-xs uppercase font-medium ${isSelected ? 'text-lilac-100' : 'text-gray-500'}`}>
                          {format(date, 'E', { locale: ptBR }).replace('.', '')}
                        </span>
                        <span className="text-2xl font-serif mt-1">{format(date, 'd')}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {selectedDate && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Horário</label>
                  {availableSlots.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {availableSlots.map(slot => (
                        <button
                          key={slot}
                          onClick={() => setSelectedTime(slot)}
                          className={`py-2 px-3 rounded-xl border-2 font-medium text-sm transition-all ${
                            selectedTime === slot
                              ? 'border-lilac-500 bg-lilac-50 text-lilac-700'
                              : 'border-lilac-100 text-gray-600 hover:border-lilac-300 hover:bg-lilac-50/50'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-red-500 bg-red-50 p-4 rounded-2xl">
                      Nenhum horário disponível para esta data. Por favor, selecione outro dia.
                    </p>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Step 4: Details */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1">
              <h2 className="text-xl font-serif text-gray-800 mb-6 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-lilac-500" /> Praticamente pronto
              </h2>
              
              <div className="bg-lilac-50/50 rounded-2xl p-4 mb-6">
                <h3 className="font-medium text-lilac-900 mb-2">Resumo do Agendamento</h3>
                <div className="space-y-1 text-sm text-lilac-700">
                  <p><strong>Serviço:</strong> {selectedService?.name} ({(selectedService?.price || 0).toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })})</p>
                  <p><strong>Profissional:</strong> {selectedProf?.name}</p>
                  <p><strong>Data:</strong> {selectedDate ? format(selectedDate, "dd 'de' MMMM", { locale: ptBR }) : ''} às {selectedTime}</p>
                </div>
              </div>

              <div className="space-y-4">
                <Input 
                  label="Seu Nome Completo" 
                  placeholder="Maria Silva"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
                <Input 
                  label="Número de Telefone" 
                  placeholder="+258 84 123 4567"
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}

        <div className="mt-8 flex gap-3 pt-6 border-t border-lilac-50 mt-auto">
          {step > 1 && (
            <Button variant="outline" onClick={handleBack} className="block w-24">
              Voltar
            </Button>
          )}
          <Button fullWidth onClick={handleNext}>
            {step === 4 ? 'Confirmar Agendamento' : 'Continuar'}
          </Button>
        </div>
      </AnimatedCard>
    </div>
  );
}
