import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appointment, Professional, Service } from '../types';

interface AppContextType {
  services: Service[];
  professionals: Professional[];
  appointments: Appointment[];
  addService: (s: Omit<Service, 'id'>) => void;
  updateService: (id: string, s: Partial<Service>) => void;
  deleteService: (id: string) => void;
  addProfessional: (p: Omit<Professional, 'id'>) => void;
  updateProfessional: (id: string, p: Partial<Professional>) => void;
  deleteProfessional: (id: string) => void;
  addAppointment: (a: Omit<Appointment, 'id' | 'bookingCode'>) => Appointment;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultServices: Service[] = [
  { id: '1', name: 'Corte Clássico', durationMinutes: 45, price: 1500, description: 'Corte de cabelo simples' },
  { id: '2', name: 'Coloração', durationMinutes: 120, price: 4000, description: 'Tingimento completo' },
  { id: '3', name: 'Tratamento Capilar', durationMinutes: 60, price: 2500, description: 'Hidratação profunda' }
];

const defaultProfessionals: Professional[] = [
  { id: '1', name: 'Ana Silva', photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop', serviceIds: ['1', '2'], schedule: [1,2,3,4,5,6].map(d => ({dayOfWeek: d, isAvailable: true})) },
  { id: '2', name: 'Carlos Santos', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop', serviceIds: ['1', '3'], schedule: [1,2,3,4,5].map(d => ({dayOfWeek: d, isAvailable: true})) }
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [services, setServices] = useState<Service[]>(defaultServices);
  const [professionals, setProfessionals] = useState<Professional[]>(defaultProfessionals);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('tulipaAppData');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.services) setServices(parsed.services);
        if (parsed.professionals) setProfessionals(parsed.professionals);
        if (parsed.appointments) setAppointments(parsed.appointments);
      }
    } catch(e) {}
  }, []);

  useEffect(() => {
    localStorage.setItem('tulipaAppData', JSON.stringify({ services, professionals, appointments }));
  }, [services, professionals, appointments]);

  const addService = (s: Omit<Service, 'id'>) => setServices(prev => [...prev, { ...s, id: Math.random().toString(36).substring(7) }]);
  const updateService = (id: string, s: Partial<Service>) => setServices(prev => prev.map(x => x.id === id ? { ...x, ...s } : x));
  const deleteService = (id: string) => setServices(prev => prev.filter(x => x.id !== id));

  const addProfessional = (p: Omit<Professional, 'id'>) => setProfessionals(prev => [...prev, { ...p, id: Math.random().toString(36).substring(7) }]);
  const updateProfessional = (id: string, p: Partial<Professional>) => setProfessionals(prev => prev.map(x => x.id === id ? { ...x, ...p } : x));
  const deleteProfessional = (id: string) => setProfessionals(prev => prev.filter(x => x.id !== id));

  const addAppointment = (a: Omit<Appointment, 'id' | 'bookingCode'>) => {
    const newA: Appointment = {
      ...a,
      id: Math.random().toString(36).substring(7),
      bookingCode: Math.random().toString(36).substring(2, 8).toUpperCase()
    };
    setAppointments(prev => [...prev, newA]);
    return newA;
  };
  
  const updateAppointmentStatus = (id: string, status: Appointment['status']) => setAppointments(prev => prev.map(x => x.id === id ? { ...x, status } : x));

  return (
    <AppContext.Provider value={{ services, professionals, appointments, addService, updateService, deleteService, addProfessional, updateProfessional, deleteProfessional, addAppointment, updateAppointmentStatus }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppStore must be used within AppProvider');
  return context;
};
