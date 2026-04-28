export interface Service {
  id: string;
  name: string;
  durationMinutes: number;
  price: number;
  description?: string;
}

export interface Professional {
  id: string;
  name: string;
  photoUrl: string;
  serviceIds: string[];
  schedule: { dayOfWeek: number; isAvailable: boolean }[];
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Appointment {
  id: string;
  clientName: string;
  clientPhone: string;
  serviceId: string;
  professionalId: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  bookingCode: string;
}
