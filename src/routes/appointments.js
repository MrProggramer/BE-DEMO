import express from 'express';
import prisma from '../lib/prisma.js';
import { validateBarberAvailability, getAvailableSlots } from '../utils/appointmentValidation.js';
import { addMinutesToTime } from '../utils/timeUtils.js';

const router = express.Router();

// GET todas las citas (con filtros opcionales)
router.get('/', async (req, res, next) => {
  try {
    const { barberId, date, status, from, to } = req.query;
    
    const where = {};
    
    if (barberId) {
      where.barberId = barberId;
    }
    
    if (status) {
      where.status = status;
    }
    
    if (date) {
      const targetDate = new Date(date);
      where.date = {
        gte: new Date(targetDate.setHours(0, 0, 0, 0)),
        lte: new Date(targetDate.setHours(23, 59, 59, 999))
      };
    } else if (from || to) {
      where.date = {};
      if (from) where.date.gte = new Date(from);
      if (to) where.date.lte = new Date(to);
    }
    
    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        barber: {
          select: { id: true, name: true, email: true }
        },
        service: {
          select: { id: true, name: true, duration: true, price: true }
        }
      },
      orderBy: [
        { date: 'asc' },
        { startTime: 'asc' }
      ]
    });
    
    res.json(appointments);
  } catch (error) {
    next(error);
  }
});

// GET cita por ID
router.get('/:id', async (req, res, next) => {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: req.params.id },
      include: {
        barber: {
          select: { id: true, name: true, email: true, phone: true }
        },
        service: true
      }
    });
    
    if (!appointment) {
      return res.status(404).json({ error: 'Cita no encontrada' });
    }
    
    res.json(appointment);
  } catch (error) {
    next(error);
  }
});

// GET slots disponibles para un barbero en una fecha
router.get('/available-slots/:barberId', async (req, res, next) => {
  try {
    const { barberId } = req.params;
    const { date, serviceId } = req.query;
    
    if (!date) {
      return res.status(400).json({ error: 'Fecha es requerida' });
    }
    
    let serviceDuration = 30; // Duración por defecto
    
    if (serviceId) {
      const service = await prisma.service.findUnique({
        where: { id: serviceId }
      });
      
      if (service) {
        serviceDuration = service.duration;
      }
    }
    
    const appointmentDate = new Date(date);
    const slots = await getAvailableSlots(barberId, appointmentDate, serviceDuration);
    
    res.json({ 
      barberId, 
      date: appointmentDate, 
      serviceDuration, 
      availableSlots: slots 
    });
  } catch (error) {
    next(error);
  }
});

// POST crear una cita
router.post('/', async (req, res, next) => {
  try {
    const { 
      barberId, 
      serviceId, 
      clientName, 
      clientEmail, 
      clientPhone, 
      date, 
      startTime, 
      notes 
    } = req.body;
    
    // Validaciones básicas
    const missingFields = [];
    
    if (!barberId || (typeof barberId === 'string' && barberId.trim() === '')) {
      missingFields.push('barberId');
    }
    if (!serviceId || (typeof serviceId === 'string' && serviceId.trim() === '')) {
      missingFields.push('serviceId');
    }
    if (!clientName || (typeof clientName === 'string' && clientName.trim() === '')) {
      missingFields.push('clientName');
    }
    if (!clientPhone || (typeof clientPhone === 'string' && clientPhone.trim() === '')) {
      missingFields.push('clientPhone');
    }
    if (!date || (typeof date === 'string' && date.trim() === '')) {
      missingFields.push('date');
    }
    if (!startTime || (typeof startTime === 'string' && startTime.trim() === '')) {
      missingFields.push('startTime');
    }
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        error: `Los siguientes campos son requeridos: ${missingFields.join(', ')}`,
        missingFields
      });
    }
    
    // Obtener servicio para calcular endTime
    const service = await prisma.service.findUnique({
      where: { id: serviceId }
    });
    
    if (!service) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    
    if (!service.isActive) {
      return res.status(400).json({ error: 'Servicio no está activo' });
    }
    
    const endTime = addMinutesToTime(startTime, service.duration);
    const appointmentDate = new Date(date);
    
    // Validar disponibilidad
    const validation = await validateBarberAvailability(
      barberId, 
      appointmentDate, 
      startTime, 
      endTime
    );
    
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }
    
    // Crear la cita
    const appointment = await prisma.appointment.create({
      data: {
        barberId,
        serviceId,
        clientName,
        clientEmail,
        clientPhone,
        date: appointmentDate,
        startTime,
        endTime,
        notes
      },
      include: {
        barber: {
          select: { id: true, name: true, email: true }
        },
        service: true
      }
    });
    
    res.status(201).json(appointment);
  } catch (error) {
    next(error);
  }
});

// PUT actualizar una cita
router.put('/:id', async (req, res, next) => {
  try {
    const { 
      barberId, 
      serviceId, 
      clientName, 
      clientEmail, 
      clientPhone, 
      date, 
      startTime, 
      status, 
      notes 
    } = req.body;
    
    // Si se está cambiando barbero, servicio, fecha u hora, validar disponibilidad
    if (barberId || serviceId || date || startTime) {
      const currentAppointment = await prisma.appointment.findUnique({
        where: { id: req.params.id },
        include: { service: true }
      });
      
      if (!currentAppointment) {
        return res.status(404).json({ error: 'Cita no encontrada' });
      }
      
      const newBarberId = barberId || currentAppointment.barberId;
      const newServiceId = serviceId || currentAppointment.serviceId;
      const newDate = date ? new Date(date) : currentAppointment.date;
      const newStartTime = startTime || currentAppointment.startTime;
      
      // Obtener servicio para calcular duración
      let service = currentAppointment.service;
      if (serviceId && serviceId !== currentAppointment.serviceId) {
        service = await prisma.service.findUnique({
          where: { id: newServiceId }
        });
        
        if (!service) {
          return res.status(404).json({ error: 'Servicio no encontrado' });
        }
      }
      
      const newEndTime = addMinutesToTime(newStartTime, service.duration);
      
      // Validar disponibilidad (excluyendo la cita actual)
      const validation = await validateBarberAvailability(
        newBarberId, 
        newDate, 
        newStartTime, 
        newEndTime,
        req.params.id
      );
      
      if (!validation.valid) {
        return res.status(400).json({ error: validation.error });
      }
    }
    
    // Actualizar la cita
    const data = {};
    if (barberId) data.barberId = barberId;
    if (serviceId) {
      const service = await prisma.service.findUnique({
        where: { id: serviceId }
      });
      data.serviceId = serviceId;
      data.endTime = addMinutesToTime(startTime || data.startTime, service.duration);
    }
    if (clientName) data.clientName = clientName;
    if (clientEmail !== undefined) data.clientEmail = clientEmail;
    if (clientPhone) data.clientPhone = clientPhone;
    if (date) data.date = new Date(date);
    if (startTime) data.startTime = startTime;
    if (status) data.status = status;
    if (notes !== undefined) data.notes = notes;
    
    const appointment = await prisma.appointment.update({
      where: { id: req.params.id },
      data,
      include: {
        barber: {
          select: { id: true, name: true, email: true }
        },
        service: true
      }
    });
    
    res.json(appointment);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Cita no encontrada' });
    }
    next(error);
  }
});

// PATCH actualizar solo el estado de una cita
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ error: 'Status es requerido' });
    }
    
    const validStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: `Status debe ser uno de: ${validStatuses.join(', ')}` 
      });
    }
    
    const appointment = await prisma.appointment.update({
      where: { id: req.params.id },
      data: { status },
      include: {
        barber: {
          select: { id: true, name: true }
        },
        service: {
          select: { id: true, name: true }
        }
      }
    });
    
    res.json(appointment);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Cita no encontrada' });
    }
    next(error);
  }
});

// DELETE eliminar una cita
router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.appointment.delete({
      where: { id: req.params.id }
    });
    
    res.json({ message: 'Cita eliminada' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Cita no encontrada' });
    }
    next(error);
  }
});

export default router;

