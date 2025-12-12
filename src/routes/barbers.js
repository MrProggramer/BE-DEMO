import express from 'express';
import prisma from '../lib/prisma.js';

const router = express.Router();

// GET todos los barberos
router.get('/', async (req, res, next) => {
  try {
    const barbers = await prisma.barber.findMany({
      where: { isActive: true },
      include: {
        workingHours: {
          where: { isActive: true },
          orderBy: { dayOfWeek: 'asc' }
        },
        _count: {
          select: { appointments: true }
        }
      },
      orderBy: { name: 'asc' }
    });
    res.json(barbers);
  } catch (error) {
    next(error);
  }
});

// GET un barbero por ID
router.get('/:id', async (req, res, next) => {
  try {
    const barber = await prisma.barber.findUnique({
      where: { id: req.params.id },
      include: {
        workingHours: {
          where: { isActive: true },
          orderBy: { dayOfWeek: 'asc' }
        },
        nonWorkingDays: {
          where: {
            date: { gte: new Date() }
          },
          orderBy: { date: 'asc' }
        }
      }
    });
    
    if (!barber) {
      return res.status(404).json({ error: 'Barbero no encontrado' });
    }
    
    res.json(barber);
  } catch (error) {
    next(error);
  }
});

// POST crear un barbero
router.post('/', async (req, res, next) => {
  try {
    const { name, email, phone, isActive } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Nombre es requerido' });
    }
    
    const barber = await prisma.barber.create({
      data: { 
        name, 
        email: email || null, 
        phone: phone || null, 
        isActive 
      }
    });
    
    res.status(201).json(barber);
  } catch (error) {
    next(error);
  }
});

// PUT actualizar un barbero
router.put('/:id', async (req, res, next) => {
  try {
    const { name, email, phone, isActive } = req.body;
    
    const data = {};
    if (name !== undefined) data.name = name;
    if (email !== undefined) data.email = email || null;
    if (phone !== undefined) data.phone = phone || null;
    if (isActive !== undefined) data.isActive = isActive;
    
    const barber = await prisma.barber.update({
      where: { id: req.params.id },
      data
    });
    
    res.json(barber);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Barbero no encontrado' });
    }
    next(error);
  }
});

// DELETE desactivar un barbero
router.delete('/:id', async (req, res, next) => {
  try {
    const barber = await prisma.barber.update({
      where: { id: req.params.id },
      data: { isActive: false }
    });
    
    res.json({ message: 'Barbero desactivado', barber });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Barbero no encontrado' });
    }
    next(error);
  }
});

export default router;

