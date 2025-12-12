import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Manejar desconexión graceful
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

// Manejar errores de conexión
prisma.$connect().catch((error) => {
  console.error('❌ Error connecting to database:', error.message);
  console.log('⚠️ Server will continue but database operations may fail');
});

export default prisma;

