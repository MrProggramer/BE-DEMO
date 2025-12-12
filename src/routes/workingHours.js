import express from 'express';
import prisma from '../lib/prisma.js';

const router = express.Router();

// GET todos los horarios de trabajo
router.get('/', async (req, res, next) => {
  try {
    const { barberId } = req.query;
    
    const where = barberId ? { barberId, isActive: true } : { isActive: true };
    
    const workingHours = await prisma.workingHour.findMany({
      where,
      include: {
        barber: {
          select: { id: true, name: true }
        }
      },
      orderBy: [
        { barberId: 'asc' },
        { dayOfWeek: 'asc' }
      ]
    });
    
    res.json(workingHours);
  } catch (error) {
    next(error);
  }
});

// GET horarios de trabajo por barbero
router.get('/barber/:barberId', async (req, res, next) => {
  try {
    const workingHours = await prisma.workingHour.findMany({
      where: { 
        barberId: req.params.barberId,
        isActive: true
      },
      orderBy: { dayOfWeek: 'asc' }
    });
    
    res.json(workingHours);
  } catch (error) {
    next(error);
  }
});

// POST crear horario de trabajo
router.post('/', async (req, res, next) => {
  try {
    const { barberId, dayOfWeek, startTime, endTime, isActive } = req.body;
    
    if (!barberId || dayOfWeek === undefined || !startTime || !endTime) {
      return res.status(400).json({ 
        error: 'BarberId, dayOfWeek, startTime y endTime son requeridos' 
      });
    }
    
    if (dayOfWeek < 0 || dayOfWeek > 6) {
      return res.status(400).json({ 
        error: 'dayOfWeek debe estar entre 0 (Domingo) y 6 (Sábado)' 
      });
    }
    
    const workingHour = await prisma.workingHour.create({
      data: { barberId, dayOfWeek, startTime, endTime, isActive },
      include: {
        barber: {
          select: { id: true, name: true }
        }
      }
    });
    
    res.status(201).json(workingHour);
  } catch (error) {
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Barbero no encontrado' });
    }
    next(error);
  }
});

// POST crear múltiples horarios (batch) - Para horarios cortados
router.post('/batch', async (req, res, next) => {
  try {
    const { barberId, dayOfWeek, schedules } = req.body;
    
    if (!barberId || dayOfWeek === undefined || !schedules || !Array.isArray(schedules)) {
      return res.status(400).json({ 
        error: 'BarberId, dayOfWeek y schedules (array) son requeridos' 
      });
    }
    
    if (dayOfWeek < 0 || dayOfWeek > 6) {
      return res.status(400).json({ 
        error: 'dayOfWeek debe estar entre 0 (Domingo) y 6 (Sábado)' 
      });
    }
    
    // Validar que todos los schedules tengan startTime y endTime
    for (const schedule of schedules) {
      if (!schedule.startTime || !schedule.endTime) {
        return res.status(400).json({ 
          error: 'Cada schedule debe tener startTime y endTime' 
        });
      }
    }
    
    // Primero, eliminar horarios existentes para este barbero y día
    await prisma.workingHour.deleteMany({
      where: {
        barberId,
        dayOfWeek
      }
    });
    
    // Crear los nuevos horarios
    const workingHours = await Promise.all(
      schedules.map(schedule => 
        prisma.workingHour.create({
          data: {
            barberId,
            dayOfWeek,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
            isActive: true
          },
          include: {
            barber: {
              select: { id: true, name: true }
            }
          }
        })
      )
    );
    
    res.status(201).json(workingHours);
  } catch (error) {
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Barbero no encontrado' });
    }
    next(error);
  }
});

// PUT actualizar horario de trabajo
router.put('/:id', async (req, res, next) => {
  try {
    const { dayOfWeek, startTime, endTime, isActive } = req.body;
    
    const workingHour = await prisma.workingHour.update({
      where: { id: req.params.id },
      data: { dayOfWeek, startTime, endTime, isActive }
    });
    
    res.json(workingHour);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Horario de trabajo no encontrado' });
    }
    next(error);
  }
});

// DELETE eliminar horario de trabajo
router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.workingHour.delete({
      where: { id: req.params.id }
    });
    
    res.json({ message: 'Horario de trabajo eliminado' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Horario de trabajo no encontrado' });
    }
    next(error);
  }
});

export default router;

