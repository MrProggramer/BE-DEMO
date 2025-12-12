import prisma from '../lib/prisma.js';
import { 
  getDayOfWeek, 
  isSameDay, 
  timeToMinutes, 
  timesOverlap 
} from './timeUtils.js';

/**
 * Valida si un barbero está disponible en una fecha y hora específica
 * @param {string} barberId - ID del barbero
 * @param {Date} date - Fecha de la cita
 * @param {string} startTime - Hora de inicio
 * @param {string} endTime - Hora de fin
 * @param {string} excludeAppointmentId - ID de cita a excluir (para ediciones)
 * @returns {Promise<{valid: boolean, error?: string}>}
 */
export async function validateBarberAvailability(
  barberId, 
  date, 
  startTime, 
  endTime, 
  excludeAppointmentId = null
) {
  // 1. Verificar que el barbero existe y está activo
  const barber = await prisma.barber.findUnique({
    where: { id: barberId }
  });
  
  if (!barber) {
    return { valid: false, error: 'Barbero no encontrado' };
  }
  
  if (!barber.isActive) {
    return { valid: false, error: 'Barbero no está activo' };
  }
  
  // 2. Verificar que no es un día no laborable
  const nonWorkingDays = await prisma.nonWorkingDay.findMany({
    where: {
      OR: [
        { barberId: barberId },
        { barberId: null } // Días no laborables globales
      ],
      date: {
        gte: new Date(date.setHours(0, 0, 0, 0)),
        lte: new Date(date.setHours(23, 59, 59, 999))
      }
    }
  });
  
  if (nonWorkingDays.length > 0) {
    const reason = nonWorkingDays[0].reason || 'Día no laborable';
    return { valid: false, error: `No disponible: ${reason}` };
  }
  
  // 3. Verificar que está dentro del horario de trabajo
  const dayOfWeek = getDayOfWeek(date);
  const workingHours = await prisma.workingHour.findMany({
    where: {
      barberId,
      dayOfWeek,
      isActive: true
    }
  });
  
  if (workingHours.length === 0) {
    return { valid: false, error: 'El barbero no trabaja este día' };
  }
  
  // Verificar que el horario de la cita está dentro de algún horario de trabajo
  const isWithinWorkingHours = workingHours.some(wh => {
    const whStartMinutes = timeToMinutes(wh.startTime);
    const whEndMinutes = timeToMinutes(wh.endTime);
    const appointmentStartMinutes = timeToMinutes(startTime);
    const appointmentEndMinutes = timeToMinutes(endTime);
    
    return appointmentStartMinutes >= whStartMinutes && 
           appointmentEndMinutes <= whEndMinutes;
  });
  
  if (!isWithinWorkingHours) {
    return { 
      valid: false, 
      error: `Fuera del horario de trabajo. Horarios disponibles: ${
        workingHours.map(wh => `${wh.startTime}-${wh.endTime}`).join(', ')
      }` 
    };
  }
  
  // 4. Verificar que no hay superposición con otras citas
  const existingAppointments = await prisma.appointment.findMany({
    where: {
      barberId,
      date: {
        gte: new Date(date.setHours(0, 0, 0, 0)),
        lte: new Date(date.setHours(23, 59, 59, 999))
      },
      status: {
        in: ['PENDING', 'CONFIRMED']
      },
      ...(excludeAppointmentId && { id: { not: excludeAppointmentId } })
    }
  });
  
  const hasOverlap = existingAppointments.some(appointment => 
    timesOverlap(startTime, endTime, appointment.startTime, appointment.endTime)
  );
  
  if (hasOverlap) {
    return { valid: false, error: 'El horario ya está ocupado' };
  }
  
  return { valid: true };
}

/**
 * Obtiene los slots disponibles para un barbero en una fecha específica
 * @param {string} barberId - ID del barbero
 * @param {Date} date - Fecha
 * @param {number} serviceDuration - Duración del servicio en minutos
 * @returns {Promise<string[]>} Array de horarios disponibles
 */
export async function getAvailableSlots(barberId, date, serviceDuration = 30) {
  const dayOfWeek = getDayOfWeek(date);
  
  // Obtener horarios de trabajo
  const workingHours = await prisma.workingHour.findMany({
    where: {
      barberId,
      dayOfWeek,
      isActive: true
    }
  });
  
  if (workingHours.length === 0) {
    return [];
  }
  
  // Verificar días no laborables
  const nonWorkingDays = await prisma.nonWorkingDay.findMany({
    where: {
      OR: [
        { barberId: barberId },
        { barberId: null }
      ],
      date: {
        gte: new Date(date.setHours(0, 0, 0, 0)),
        lte: new Date(date.setHours(23, 59, 59, 999))
      }
    }
  });
  
  if (nonWorkingDays.length > 0) {
    return [];
  }
  
  // Obtener citas existentes
  const existingAppointments = await prisma.appointment.findMany({
    where: {
      barberId,
      date: {
        gte: new Date(date.setHours(0, 0, 0, 0)),
        lte: new Date(date.setHours(23, 59, 59, 999))
      },
      status: {
        in: ['PENDING', 'CONFIRMED']
      }
    },
    orderBy: { startTime: 'asc' }
  });
  
  // Generar todos los slots posibles
  const availableSlots = [];
  
  for (const wh of workingHours) {
    let currentMinutes = timeToMinutes(wh.startTime);
    const endMinutes = timeToMinutes(wh.endTime);
    
    while (currentMinutes + serviceDuration <= endMinutes) {
      const slotStart = minutesToTime(currentMinutes);
      const slotEnd = minutesToTime(currentMinutes + serviceDuration);
      
      // Verificar si el slot no se superpone con citas existentes
      const hasConflict = existingAppointments.some(appointment =>
        timesOverlap(slotStart, slotEnd, appointment.startTime, appointment.endTime)
      );
      
      if (!hasConflict) {
        availableSlots.push(slotStart);
      }
      
      // Avanzar 30 minutos
      currentMinutes += 30;
    }
  }
  
  return availableSlots;
}

function minutesToTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

