import express from 'express';
import prisma from '../lib/prisma.js';

const router = express.Router();

// GET todos los servicios
router.get('/', async (req, res, next) => {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });
    res.json(services);
  } catch (error) {
    next(error);
  }
});

// GET un servicio por ID
router.get('/:id', async (req, res, next) => {
  try {
    const service = await prisma.service.findUnique({
      where: { id: req.params.id }
    });
    
    if (!service) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    
    res.json(service);
  } catch (error) {
    next(error);
  }
});

// POST crear un servicio
router.post('/', async (req, res, next) => {
  try {
    const { name, description, duration, price, isActive } = req.body;
    
    if (!name || !duration || price === undefined) {
      return res.status(400).json({ 
        error: 'Nombre, duración y precio son requeridos' 
      });
    }
    
    const service = await prisma.service.create({
      data: { name, description, duration, price, isActive }
    });
    
    res.status(201).json(service);
  } catch (error) {
    next(error);
  }
});

// PUT actualizar un servicio
router.put('/:id', async (req, res, next) => {
  try {
    const { name, description, duration, price, isActive } = req.body;
    
    const service = await prisma.service.update({
      where: { id: req.params.id },
      data: { name, description, duration, price, isActive }
    });
    
    res.json(service);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    next(error);
  }
});

// DELETE desactivar un servicio
router.delete('/:id', async (req, res, next) => {
  try {
    const service = await prisma.service.update({
      where: { id: req.params.id },
      data: { isActive: false }
    });
    
    res.json({ message: 'Servicio desactivado', service });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    next(error);
  }
});

export default router;

