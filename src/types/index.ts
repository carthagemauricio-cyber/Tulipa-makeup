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
  description?: string;
  image?: string;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Appointment {
  id: string;
  bookingCode: string; // New: Unique code for tracking
  clientName: string;
  clientPhone: string;
  serviceId: string;
  professionalId: string;
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:mm"
  status: AppointmentStatus;
}
