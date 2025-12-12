import express from 'express';
import prisma from '../lib/prisma.js';

const router = express.Router();

// GET todas las configuraciones
router.get('/', async (req, res, next) => {
  try {
    const configs = await prisma.config.findMany({
      orderBy: { key: 'asc' }
    });
    
    // Convertir a objeto key-value para facilitar el uso
    const configObj = configs.reduce((acc, config) => {
      acc[config.key] = {
        value: config.value,
        description: config.description
      };
      return acc;
    }, {});
    
    res.json(configObj);
  } catch (error) {
    next(error);
  }
});

// GET configuración por key
router.get('/:key', async (req, res, next) => {
  try {
    const config = await prisma.config.findUnique({
      where: { key: req.params.key }
    });
    
    if (!config) {
      return res.status(404).json({ error: 'Configuración no encontrada' });
    }
    
    res.json(config);
  } catch (error) {
    next(error);
  }
});

// POST crear o actualizar configuración
router.post('/', async (req, res, next) => {
  try {
    const { key, value, description } = req.body;
    
    if (!key || value === undefined) {
      return res.status(400).json({ error: 'Key y value son requeridos' });
    }
    
    const config = await prisma.config.upsert({
      where: { key },
      update: { value, description },
      create: { key, value, description }
    });
    
    res.json(config);
  } catch (error) {
    next(error);
  }
});

// PUT actualizar configuración
router.put('/:key', async (req, res, next) => {
  try {
    const { value, description } = req.body;
    
    if (value === undefined) {
      return res.status(400).json({ error: 'Value es requerido' });
    }
    
    const config = await prisma.config.update({
      where: { key: req.params.key },
      data: { value, description }
    });
    
    res.json(config);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Configuración no encontrada' });
    }
    next(error);
  }
});

// DELETE eliminar configuración
router.delete('/:key', async (req, res, next) => {
  try {
    await prisma.config.delete({
      where: { key: req.params.key }
    });
    
    res.json({ message: 'Configuración eliminada' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Configuración no encontrada' });
    }
    next(error);
  }
});

export default router;

