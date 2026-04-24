import { addMinutes, format, isBefore, isSameDay, parse, parseISO } from 'date-fns';
import { Appointment, Professional, Service } from '../types';

export function generateTimeSlots(
  professional: Professional | undefined,
  service: Service | undefined,
  date: Date,
  appointments: Appointment[]
): string[] {
  if (!professional || !service || !date) return [];

  // Check if professional works on this day of week (0 = Sunday, 6 = Saturday)
  const dayOfWeek = date.getDay();
  if (!professional.availability.days.includes(dayOfWeek)) return [];

  const slots: string[] = [];
  const start = parse(professional.availability.startHour, 'HH:mm', date);
  const end = parse(professional.availability.endHour, 'HH:mm', date);
  const now = new Date();
  
  let currentSlot = start;

  while (isBefore(addMinutes(currentSlot, service.durationMinutes), end) || 
         addMinutes(currentSlot, service.durationMinutes).getTime() === end.getTime()) {
    
    // Check if slot is in the past
    if (isSameDay(date, now) && isBefore(currentSlot, now)) {
      currentSlot = addMinutes(currentSlot, 30);
      continue;
    }

    const slotStartFormatted = format(currentSlot, 'HH:mm');
    const slotEnd = addMinutes(currentSlot, service.durationMinutes);
    
    // Check for overlaps
    const hasOverlap = appointments.some(appt => {
      // Only care about this professional and this date, and confirmed appts
      if (appt.professionalId !== professional.id) return false;
      if (appt.date !== format(date, 'yyyy-MM-dd')) return false;
      if (appt.status !== 'confirmed') return false;

      // Need to lookup service duration... this gets tricky if we don't pass all services.
      // We will assume a fixed overlap check but better yet, calculate appt end time when saving.
      // For simplicity, let's assume we can fetch the service duration.
      // To simplify, we will just pass all services here.
      return false; // Will replace with full logic below
    });

    slots.push(slotStartFormatted);
    // Move to next 30 min slot
    currentSlot = addMinutes(currentSlot, 30);
  }

  return slots;
}

export function filterAvailableTimeSlots(
    slots: string[], 
    date: Date, 
    service: Service, 
    professionalId: string, 
    appointments: Appointment[],
    allServices: Service[]
) {
    return slots.filter(slot => {
        const slotStart = parse(slot, 'HH:mm', date);
        const slotEnd = addMinutes(slotStart, service.durationMinutes);

        const hasOverlap = appointments.some(appt => {
            if (appt.professionalId !== professionalId) return false;
            if (appt.date !== format(date, 'yyyy-MM-dd')) return false;
            if (appt.status !== 'confirmed') return false;

            const apptService = allServices.find(s => s.id === appt.serviceId);
            if (!apptService) return false;

            const apptStart = parse(appt.time, 'HH:mm', date);
            const apptEnd = addMinutes(apptStart, apptService.durationMinutes);

            // Time overlap logic: (StartA < EndB) and (EndA > StartB)
            return isBefore(slotStart, apptEnd) && isBefore(apptStart, slotEnd);
        });

        return !hasOverlap;
    });
}
