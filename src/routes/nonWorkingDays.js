import express from 'express';
import prisma from '../lib/prisma.js';

const router = express.Router();

// GET todos los días no laborables
router.get('/', async (req, res, next) => {
  try {
    const { barberId, from, to } = req.query;
    
    const where = {};
    
    if (barberId) {
      where.OR = [
        { barberId },
        { barberId: null } // Días no laborables globales
      ];
    }
    
    if (from || to) {
      where.date = {};
      if (from) where.date.gte = new Date(from);
      if (to) where.date.lte = new Date(to);
    } else {
      // Por defecto, solo días futuros
      where.date = { gte: new Date() };
    }
    
    const nonWorkingDays = await prisma.nonWorkingDay.findMany({
      where,
      include: {
        barber: {
          select: { id: true, name: true }
        }
      },
      orderBy: { date: 'asc' }
    });
    
    res.json(nonWorkingDays);
  } catch (error) {
    next(error);
  }
});

// POST crear día no laborable
router.post('/', async (req, res, next) => {
  try {
    const { barberId, date, reason } = req.body;
    
    if (!date) {
      return res.status(400).json({ error: 'La fecha es requerida' });
    }
    
    const nonWorkingDay = await prisma.nonWorkingDay.create({
      data: { 
        barberId: barberId || null, 
        date: new Date(date), 
        reason 
      },
      include: {
        barber: {
          select: { id: true, name: true }
        }
      }
    });
    
    res.status(201).json(nonWorkingDay);
  } catch (error) {
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Barbero no encontrado' });
    }
    next(error);
  }
});

// PUT actualizar día no laborable
router.put('/:id', async (req, res, next) => {
  try {
    const { date, reason } = req.body;
    
    const data = {};
    if (date) data.date = new Date(date);
    if (reason !== undefined) data.reason = reason;
    
    const nonWorkingDay = await prisma.nonWorkingDay.update({
      where: { id: req.params.id },
      data
    });
    
    res.json(nonWorkingDay);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Día no laborable no encontrado' });
    }
    next(error);
  }
});

// DELETE eliminar día no laborable
router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.nonWorkingDay.delete({
      where: { id: req.params.id }
    });
    
    res.json({ message: 'Día no laborable eliminado' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Día no laborable no encontrado' });
    }
    next(error);
  }
});

export default router;

