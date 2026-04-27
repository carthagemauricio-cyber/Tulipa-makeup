export interface Professional {
  id: string;
  name: string;
  photoUrl: string;
  phone?: string;
  email?: string;
  specialties: string[];
  availability: {
    days: number[]; // 0-6 (Sun-Sat)
    startHour: string; // "09:00"
    endHour: string; // "18:00"
  };
}

export interface Service {
  id: string;
  name: string;
  durationMinutes: number;
  price: number;
  icon?: string;
}

export interface Appointment {
  id: string;
  clientName: string;
  clientPhone: string;
  serviceId: string;
  professionalId: string;
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:mm"
  status: 'confirmed' | 'cancelled';
}
