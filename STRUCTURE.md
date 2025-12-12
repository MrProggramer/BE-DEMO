# Estructura del Proyecto

```
BE-velabarberia/
│
├── prisma/
│   └── schema.prisma              # Schema de base de datos (Barbers, Services, Appointments, etc.)
│
├── src/
│   ├── lib/
│   │   └── prisma.js              # Cliente de Prisma configurado
│   │
│   ├── routes/
│   │   ├── appointments.js        # Endpoints de reservas/turnos
│   │   ├── barbers.js             # Endpoints de barberos
│   │   ├── config.js              # Endpoints de configuración
│   │   ├── nonWorkingDays.js      # Endpoints de días no laborables
│   │   ├── services.js            # Endpoints de servicios
│   │   └── workingHours.js        # Endpoints de horarios de trabajo
│   │
│   ├── utils/
│   │   ├── appointmentValidation.js   # Validación de disponibilidad de turnos
│   │   └── timeUtils.js               # Utilidades para manejo de horarios
│   │
│   └── index.js                   # Servidor Express principal
│
├── .dockerignore                  # Archivos ignorados por Docker
├── .gitignore                     # Archivos ignorados por Git
├── nixpacks.toml                  # Configuración de build para Railway
├── package.json                   # Dependencias y scripts
├── railway.json                   # Configuración de Railway
├── README.md                      # Documentación principal
├── RAILWAY_DEPLOY.md              # Guía de deployment en Railway
└── STRUCTURE.md                   # Este archivo
```

## 📦 Módulos y Responsabilidades

### Prisma Schema (`prisma/schema.prisma`)

Define 6 modelos principales:

1. **Barber** - Información de barberos
2. **WorkingHour** - Horarios de trabajo por día
3. **NonWorkingDay** - Días no laborables
4. **Service** - Servicios con precios
5. **Appointment** - Reservas/turnos
6. **Config** - Configuración key-value

### Rutas de la API

Cada router maneja un recurso específico con operaciones CRUD:

- `appointments.js` - Gestión de turnos + validaciones + slots disponibles
- `barbers.js` - Gestión de barberos
- `config.js` - Configuración general
- `nonWorkingDays.js` - Días de cierre
- `services.js` - Catálogo de servicios
- `workingHours.js` - Horarios por barbero

### Utilidades

- `timeUtils.js` - Conversión de horarios, cálculo de superposiciones
- `appointmentValidation.js` - Lógica de validación de disponibilidad

## 🔄 Flujo de una Reserva

```
Cliente → POST /api/appointments
    ↓
appointmentValidation.validateBarberAvailability()
    ↓
Verifica:
  1. Barbero existe y está activo
  2. No es día no laborable
  3. Está dentro del horario de trabajo
  4. No hay superposición con otras citas
    ↓
Si válido → Crea Appointment en BD
    ↓
Retorna cita creada
```

## 🗂️ Base de Datos

### Relaciones

```
Barber (1) ──→ (N) WorkingHour
Barber (1) ──→ (N) NonWorkingDay
Barber (1) ──→ (N) Appointment
Service (1) ──→ (N) Appointment
```

### Índices para Performance

- `workingHours`: `(barberId, dayOfWeek)`
- `nonWorkingDays`: `(barberId, date)`
- `appointments`: `(barberId, date)`, `(date, startTime)`

## 🚀 Scripts Disponibles

```bash
npm run dev              # Servidor con hot-reload (nodemon)
npm start                # Servidor de producción
npm run prisma:generate  # Generar cliente Prisma
npm run prisma:push      # Sync schema con BD (sin migraciones)
npm run prisma:migrate   # Crear migración
npm run prisma:studio    # UI visual de la BD
```

## 🌐 API Endpoints

### Resumen de Endpoints

| Recurso | GET | POST | PUT | PATCH | DELETE |
|---------|-----|------|-----|-------|--------|
| `/api/barbers` | ✅ | ✅ | ✅ | ❌ | ✅ |
| `/api/services` | ✅ | ✅ | ✅ | ❌ | ✅ |
| `/api/working-hours` | ✅ | ✅ | ✅ | ❌ | ✅ |
| `/api/non-working-days` | ✅ | ✅ | ✅ | ❌ | ✅ |
| `/api/appointments` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/api/config` | ✅ | ✅ | ✅ | ❌ | ✅ |

## 🔐 Seguridad Implementada

- Validación de entrada en todos los endpoints
- Prevención de conflictos en turnos
- Uso de prepared statements (Prisma previene SQL injection)
- CORS configurado

## 📈 Escalabilidad

El sistema está preparado para:

- ✅ Hasta 4 barberos (escalable a más)
- ✅ Múltiples horarios por barbero/día
- ✅ Días no laborables individuales o globales
- ✅ Servicios con duraciones variables
- ✅ Slots de 30 minutos configurables

## 🔄 Próximas Mejoras Sugeridas

1. **Autenticación JWT** - Para barberos y administradores
2. **Notificaciones** - Email/SMS de confirmación
3. **Recordatorios** - Sistema de recordatorios automáticos
4. **Historial** - Tracking de cambios en citas
5. **Reportes** - Estadísticas de uso y ganancias
6. **Multi-tenant** - Soporte para múltiples barberías
7. **Sistema de pagos** - Integración con Mercado Pago
8. **Rating** - Sistema de calificación de servicios

---

Mantener esta estructura ayuda a:
- 📖 Fácil mantenimiento
- 🧩 Separación de responsabilidades
- 🚀 Escalabilidad
- 🔍 Debugging más simple

