import express from 'express';
import prisma from '../lib/prisma.js';

const router = express.Router();

// Variable para rastrear si ya se inicializó (en memoria)
// En producción, esto se puede verificar consultando la BD
let isInitialized = null;

// Función para verificar si ya está inicializado
async function checkInitialized() {
  if (isInitialized !== null) {
    return isInitialized;
  }
  
  try {
    const barberCount = await prisma.barber.count();
    const serviceCount = await prisma.service.count();
    const configCount = await prisma.config.count();
    
    // Si hay datos, asumimos que ya está inicializado
    isInitialized = barberCount > 0 || serviceCount > 0 || configCount > 0;
    return isInitialized;
  } catch (error) {
    console.error('Error checking initialization status:', error);
    return false;
  }
}

// GET estado de inicialización
router.get('/status', async (req, res, next) => {
  try {
    const initialized = await checkInitialized();
    
    if (initialized) {
      const counts = {
        barbers: await prisma.barber.count(),
        services: await prisma.service.count(),
        workingHours: await prisma.workingHour.count(),
        configs: await prisma.config.count(),
        nonWorkingDays: await prisma.nonWorkingDay.count(),
        appointments: await prisma.appointment.count(),
      };
      
      res.json({
        isInitialized: true,
        counts,
        message: 'Base de datos ya inicializada'
      });
    } else {
      res.json({
        isInitialized: false,
        message: 'Base de datos no inicializada. Usa POST /api/init/seed para inicializar.'
      });
    }
  } catch (error) {
    next(error);
  }
});

// POST inicializar base de datos (solo una vez)
router.post('/seed', async (req, res, next) => {
  try {
    // Verificar si ya está inicializado
    const initialized = await checkInitialized();
    if (initialized) {
      return res.status(403).json({
        error: 'La base de datos ya fue inicializada. Este endpoint solo puede usarse una vez.',
        message: 'Si necesitas reinicializar, debes limpiar la base de datos manualmente.'
      });
    }

    // Verificar el secret
    const { secret } = req.body;
    const expectedSecret = process.env.INIT_SECRET;

    if (!expectedSecret) {
      return res.status(500).json({
        error: 'INIT_SECRET no está configurado en las variables de entorno'
      });
    }

    if (!secret || secret !== expectedSecret) {
      return res.status(403).json({
        error: 'No autorizado. Secret incorrecto.'
      });
    }

    // Inicializar datos de ejemplo
    console.log('🌱 Iniciando seed de base de datos...');

    // 1. Crear profesionales
    const barber1 = await prisma.barber.create({
      data: {
        name: 'Profesional 1',
        email: 'profesional1@example.com',
        phone: '+54 9 11 1234-5678',
        isActive: true
      }
    });

    const barber2 = await prisma.barber.create({
      data: {
        name: 'Profesional 2',
        email: 'profesional2@example.com',
        phone: '+54 9 11 9876-5432',
        isActive: true
      }
    });

    console.log('✅ Profesionales creados');

    // 2. Crear horarios de trabajo (Lunes a Viernes 9:00-18:00, Sábados 9:00-14:00)
    const workingHoursData = [];
    
    for (const barber of [barber1, barber2]) {
      // Lunes a Viernes (1-5)
      for (let day = 1; day <= 5; day++) {
        workingHoursData.push({
          barberId: barber.id,
          dayOfWeek: day,
          startTime: '09:00',
          endTime: '18:00',
          isActive: true
        });
      }
      // Sábado (6)
      workingHoursData.push({
        barberId: barber.id,
        dayOfWeek: 6,
        startTime: '09:00',
        endTime: '14:00',
        isActive: true
      });
    }

    await prisma.workingHour.createMany({
      data: workingHoursData
    });

    console.log('✅ Horarios de trabajo creados');

    // 3. Crear servicios
    const services = await prisma.service.createMany({
      data: [
        {
          name: 'Servicio Básico',
          description: 'Servicio estándar',
          duration: 30,
          price: 5000,
          isActive: true
        },
        {
          name: 'Servicio Completo',
          description: 'Servicio completo con extras',
          duration: 45,
          price: 7500,
          isActive: true
        },
        {
          name: 'Servicio Express',
          description: 'Servicio rápido',
          duration: 20,
          price: 3500,
          isActive: true
        },
        {
          name: 'Servicio Premium',
          description: 'Servicio premium con atención especial',
          duration: 60,
          price: 9000,
          isActive: true
        },
        {
          name: 'Servicio Especial',
          description: 'Servicio especializado',
          duration: 30,
          price: 4000,
          isActive: true
        }
      ]
    });

    const createdServices = await prisma.service.findMany();
    console.log('✅ Servicios creados');

    // 4. Crear configuraciones
    await prisma.config.createMany({
      data: [
        {
          key: 'business_name',
          value: 'Mi Negocio',
          description: 'Nombre del negocio'
        },
        {
          key: 'business_email',
          value: 'contacto@example.com',
          description: 'Email de contacto'
        },
        {
          key: 'business_phone',
          value: '+54 9 11 0000-0000',
          description: 'Teléfono de contacto'
        },
        {
          key: 'business_address',
          value: 'Dirección de ejemplo 123',
          description: 'Dirección del negocio'
        },
        {
          key: 'slot_interval',
          value: '30',
          description: 'Intervalo de tiempo para slots (en minutos)'
        },
        {
          key: 'advance_booking_days',
          value: '30',
          description: 'Días de anticipación para reservas'
        },
        {
          key: 'cancellation_hours',
          value: '24',
          description: 'Horas mínimas para cancelar una cita'
        },
        {
          key: 'timezone',
          value: 'America/Argentina/Buenos_Aires',
          description: 'Zona horaria del negocio'
        }
      ]
    });

    console.log('✅ Configuraciones creadas');

    // 5. Crear días no laborables (feriados de ejemplo para 2024-2025)
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;

    const holidays = [
      { date: `${currentYear}-01-01`, reason: 'Año Nuevo' },
      { date: `${currentYear}-05-01`, reason: 'Día del Trabajador' },
      { date: `${currentYear}-05-25`, reason: 'Día de la Revolución de Mayo' },
      { date: `${currentYear}-07-09`, reason: 'Día de la Independencia' },
      { date: `${currentYear}-12-25`, reason: 'Navidad' },
      { date: `${nextYear}-01-01`, reason: 'Año Nuevo' }
    ];

    await prisma.nonWorkingDay.createMany({
      data: holidays.map(holiday => ({
        barberId: null, // Aplica a todos los profesionales
        date: new Date(holiday.date),
        reason: holiday.reason
      }))
    });

    console.log('✅ Días no laborables creados');

    // Marcar como inicializado
    isInitialized = true;

    const summary = {
      barbers: 2,
      workingHours: workingHoursData.length,
      services: createdServices.length,
      configs: 8,
      nonWorkingDays: holidays.length,
      appointments: 0
    };

    console.log('🎉 Base de datos inicializada correctamente');

    res.status(201).json({
      message: '✅ Base de datos inicializada correctamente',
      summary,
      warning: '⚠️ Este endpoint ahora está bloqueado y no puede volver a usarse'
    });

  } catch (error) {
    console.error('❌ Error durante la inicialización:', error);
    next(error);
  }
});

export default router;

