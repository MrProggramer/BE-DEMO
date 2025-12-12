/**
 * Convierte una hora en formato "HH:MM" a minutos desde medianoche
 * @param {string} time - Hora en formato "HH:MM"
 * @returns {number} Minutos desde medianoche
 */
export function timeToMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Convierte minutos desde medianoche a formato "HH:MM"
 * @param {number} minutes - Minutos desde medianoche
 * @returns {string} Hora en formato "HH:MM"
 */
export function minutesToTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

/**
 * Suma minutos a una hora
 * @param {string} time - Hora en formato "HH:MM"
 * @param {number} minutesToAdd - Minutos a sumar
 * @returns {string} Nueva hora en formato "HH:MM"
 */
export function addMinutesToTime(time, minutesToAdd) {
  const totalMinutes = timeToMinutes(time) + minutesToAdd;
  return minutesToTime(totalMinutes);
}

/**
 * Verifica si dos rangos de tiempo se superponen
 * @param {string} start1 - Inicio del primer rango
 * @param {string} end1 - Fin del primer rango
 * @param {string} start2 - Inicio del segundo rango
 * @param {string} end2 - Fin del segundo rango
 * @returns {boolean} True si se superponen
 */
export function timesOverlap(start1, end1, start2, end2) {
  const start1Minutes = timeToMinutes(start1);
  const end1Minutes = timeToMinutes(end1);
  const start2Minutes = timeToMinutes(start2);
  const end2Minutes = timeToMinutes(end2);
  
  return start1Minutes < end2Minutes && end1Minutes > start2Minutes;
}

/**
 * Obtiene el día de la semana de una fecha (0=Domingo, 6=Sábado)
 * @param {Date} date - Fecha
 * @returns {number} Día de la semana
 */
export function getDayOfWeek(date) {
  return date.getDay();
}

/**
 * Compara dos fechas solo por día (ignora hora)
 * @param {Date} date1 
 * @param {Date} date2 
 * @returns {boolean} True si son el mismo día
 */
export function isSameDay(date1, date2) {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
}

