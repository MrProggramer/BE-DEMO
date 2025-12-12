import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import barbersRouter from './routes/barbers.js';
import servicesRouter from './routes/services.js';
import appointmentsRouter from './routes/appointments.js';
import configRouter from './routes/config.js';
import workingHoursRouter from './routes/workingHours.js';
import nonWorkingDaysRouter from './routes/nonWorkingDays.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de CORS - Dominios permitidos
// Puedes configurar tus propios dominios mediante la variable de entorno ALLOWED_ORIGINS
// Formato: ALLOWED_ORIGINS=http://localhost:3000,https://tudominio.com
const defaultOrigins = [
  'http://localhost:3000',  // Para desarrollo local
  'http://localhost:5173',  // Para Vite en desarrollo
  'http://localhost:5174',  // Para Vite en desarrollo (puerto alternativo)
  'http://localhost:4200',  // Para Angular en desarrollo
];

// Dominios del proyecto original (solo para referencia, puedes eliminarlos)
const originalOrigins = [
  'https://administra-t.vercel.app',
  'https://vela-barberia.vercel.app',
  'https://velabarberia.com',
  'https://www.velabarberia.com',
];

// Combinar dominios: primero los del .env, luego los por defecto
const envOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : [];

const allowedOrigins = [...envOrigins, ...defaultOrigins];

const corsOptions = {
  origin: function (origin, callback) {
    // Permitir requests sin origin (como Postman o Thunder Client)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('🚫 CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Barbería API - Sistema de Reservas',
    status: 'running',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/barbers', barbersRouter);
app.use('/api/services', servicesRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/config', configRouter);
app.use('/api/working-hours', workingHoursRouter);
app.use('/api/non-working-days', nonWorkingDaysRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});


