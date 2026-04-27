import React, { createContext, useContext, useState, useEffect } from 'react';
import { Professional, Service, Appointment } from '../types';
import { generateId } from '../lib/utils';

interface AppState {
  professionals: Professional[];
  services: Service[];
  appointments: Appointment[];
}

interface AppContextType extends AppState {
  addProfessional: (p: Omit<Professional, 'id'>) => void;
  updateProfessional: (id: string, p: Partial<Professional>) => void;
  removeProfessional: (id: string) => void;
  addService: (s: Omit<Service, 'id'>) => void;
  updateService: (id: string, s: Partial<Service>) => void;
  removeService: (id: string) => void;
  addAppointment: (a: Omit<Appointment, 'id' | 'status'>) => void;
  cancelAppointment: (id: string) => void;
}

const defaultServices: Service[] = [
  { id: 's1', name: 'Corte', durationMinutes: 60, price: 1500, icon: 'scissors' },
  { id: 's2', name: 'Tintura', durationMinutes: 120, price: 3500, icon: 'palette' },
  { id: 's3', name: 'Progressiva', durationMinutes: 180, price: 4500, icon: 'sparkles' },
  { id: 's4', name: 'Selagem', durationMinutes: 120, price: 4000, icon: 'shield' },
];

const defaultProfessionals: Professional[] = [
  {
    id: 'p1',
    name: 'Ana Souza',
    photoUrl: 'https://picsum.photos/seed/ana/200/200',
    phone: '+258 84 123 4567',
    email: 'ana.souza@tulipahair.com',
    specialties: ['s1', 's2'],
    availability: { days: [1, 2, 3, 4, 5], startHour: '09:00', endHour: '18:00' }
  },
  {
    id: 'p2',
    name: 'Júlia Mendes',
    photoUrl: 'https://picsum.photos/seed/julia/200/200',
    phone: '+258 84 987 6543',
    email: 'julia.mendes@tulipahair.com',
    specialties: ['s3', 's4', 's1'],
    availability: { days: [2, 3, 4, 5, 6], startHour: '10:00', endHour: '19:00' }
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppState>(() => {
    const saved = localStorage.getItem('tulipaData');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure legacy professionals have new fields
        parsed.professionals = parsed.professionals?.map((p: Professional) => ({
          ...p,
          phone: p.phone || '',
          email: p.email || '',
        })) || [];
        return parsed;
      } catch (e) {
        console.error("Failed to parse local storage", e);
      }
    }
    return {
      professionals: defaultProfessionals,
      services: defaultServices,
      appointments: []
    };
  });

  useEffect(() => {
    localStorage.setItem('tulipaData', JSON.stringify(data));
  }, [data]);

  const addProfessional = (p: Omit<Professional, 'id'>) => {
    setData(prev => ({ ...prev, professionals: [...prev.professionals, { ...p, id: generateId() }] }));
  };

  const updateProfessional = (id: string, p: Partial<Professional>) => {
    setData(prev => ({
      ...prev,
      professionals: prev.professionals.map(prof => prof.id === id ? { ...prof, ...p } : prof)
    }));
  };

  const removeProfessional = (id: string) => {
    setData(prev => ({ ...prev, professionals: prev.professionals.filter(p => p.id !== id) }));
  };

  const addService = (s: Omit<Service, 'id'>) => {
    setData(prev => ({ ...prev, services: [...prev.services, { ...s, id: generateId() }] }));
  };

  const updateService = (id: string, s: Partial<Service>) => {
    setData(prev => ({
      ...prev,
      services: prev.services.map(srv => srv.id === id ? { ...srv, ...s } : srv)
    }));
  };

  const removeService = (id: string) => {
    setData(prev => ({ ...prev, services: prev.services.filter(s => s.id !== id) }));
  };

  const addAppointment = (a: Omit<Appointment, 'id' | 'status'>) => {
    setData(prev => ({
      ...prev,
      appointments: [...prev.appointments, { ...a, id: generateId(), status: 'confirmed' }]
    }));
  };

  const cancelAppointment = (id: string) => {
    setData(prev => ({
      ...prev,
      appointments: prev.appointments.map(a => a.id === id ? { ...a, status: 'cancelled' } : a)
    }));
  };

  return (
    <AppContext.Provider value={{
      ...data,
      addProfessional, updateProfessional, removeProfessional,
      addService, updateService, removeService,
      addAppointment, cancelAppointment
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppStore must be used within AppProvider');
  return context;
}
