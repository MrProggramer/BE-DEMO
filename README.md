# Vela Barbería - Backend API

Backend para sistema de reservas de turnos de barbería, construido con Node.js, Express, Prisma y PostgreSQL.

## 🚀 Características

- **Gestión de Barberos**: CRUD completo con información de contacto
- **Horarios de Trabajo**: Configuración flexible por día de la semana
- **Días No Laborables**: Gestión de vacaciones, feriados y días especiales
- **Servicios**: Catálogo de servicios con precios y duraciones
- **Sistema de Reservas**: 
  - Validación automática de disponibilidad
  - Prevención de sobreposición de turnos
  - Consulta de slots disponibles
  - Estados de cita (pendiente, confirmada, cancelada, completada)
- **Configuración General**: Sistema de key-value para configuraciones del negocio
- **Escalabilidad**: Preparado para hasta 4 barberos

## 📋 Requisitos Previos

- Node.js 18+ 
- PostgreSQL 14+
- npm o yarn

## 🛠️ Instalación Local

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd BE-velabarberia
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/velabarberia?schema=public"
PORT=3000
NODE_ENV=development
INIT_SECRET=tu_secreto_seguro_aqui
```

### 4. Configurar base de datos

```bash
# Generar el cliente Prisma
npm run prisma:generate

# Crear las tablas en la base de datos
npm run prisma:push

# O si prefieres usar migraciones
npm run prisma:migrate
```

### 5. Inicializar datos de ejemplo

Hacer una petición POST al endpoint de inicialización:

```bash
curl -X POST http://localhost:3000/api/init/seed \
  -H "Content-Type: application/json" \
  -d '{"secret": "tu_secreto_seguro_aqui"}'
```

⚠️ **Nota**: Este endpoint solo puede usarse UNA VEZ y quedará bloqueado después.

### 6. Iniciar el servidor

```bash
# Desarrollo (con hot-reload)
npm run dev

# Producción
npm start
```

El servidor estará disponible en `http://localhost:3000`

## 🗄️ Estructura de la Base de Datos

### Modelos Principales

- **Barber**: Información de barberos
- **WorkingHour**: Horarios de trabajo por día de la semana
- **NonWorkingDay**: Días no laborables (feriados, vacaciones)
- **Service**: Servicios ofrecidos con precios y duración
- **Appointment**: Reservas/turnos
- **Config**: Configuraciones generales del sistema

## 🔌 Endpoints de la API

### Health Check

```
GET /              - Información de la API
GET /health        - Health check
```

### Barberos

```
GET    /api/barbers           - Listar barberos activos
GET    /api/barbers/:id       - Obtener un barbero
POST   /api/barbers           - Crear barbero
PUT    /api/barbers/:id       - Actualizar barbero
DELETE /api/barbers/:id       - Desactivar barbero
```

### Servicios

```
GET    /api/services          - Listar servicios activos
GET    /api/services/:id      - Obtener un servicio
POST   /api/services          - Crear servicio
PUT    /api/services/:id      - Actualizar servicio
DELETE /api/services/:id      - Desactivar servicio
```

### Horarios de Trabajo

```
GET    /api/working-hours                    - Listar horarios (filtro: ?barberId=xxx)
GET    /api/working-hours/barber/:barberId   - Horarios de un barbero
POST   /api/working-hours                    - Crear horario
PUT    /api/working-hours/:id                - Actualizar horario
DELETE /api/working-hours/:id                - Eliminar horario
```

### Días No Laborables

```
GET    /api/non-working-days     - Listar días (filtros: ?barberId=xxx&from=date&to=date)
POST   /api/non-working-days     - Crear día no laborable
PUT    /api/non-working-days/:id - Actualizar día
DELETE /api/non-working-days/:id - Eliminar día
```

### Reservas/Turnos

```
GET    /api/appointments                        - Listar citas (filtros: barberId, date, status, from, to)
GET    /api/appointments/:id                    - Obtener una cita
GET    /api/appointments/available-slots/:barberId  - Slots disponibles (?date=YYYY-MM-DD&serviceId=xxx)
POST   /api/appointments                        - Crear cita
PUT    /api/appointments/:id                    - Actualizar cita
PATCH  /api/appointments/:id/status             - Cambiar solo el estado
DELETE /api/appointments/:id                    - Eliminar cita
```

### Configuración

```
GET    /api/config           - Todas las configuraciones
GET    /api/config/:key      - Obtener una configuración
POST   /api/config           - Crear/actualizar configuración
PUT    /api/config/:key      - Actualizar configuración
DELETE /api/config/:key      - Eliminar configuración
```

### Inicialización (Un solo uso)

```
GET    /api/init/status      - Ver estado de inicialización
POST   /api/init/seed        - Inicializar datos (requiere secret)
```

## 🎯 Validaciones Automáticas

El sistema valida automáticamente:

1. ✅ El barbero existe y está activo
2. ✅ No es un día no laborable (feriado/vacación)
3. ✅ El horario está dentro de las horas de trabajo del barbero
4. ✅ No hay superposición con otras citas
5. ✅ El servicio existe y está activo

## 📊 Datos Iniciales

Al inicializar, se crean:

- **2 Barberos**: Carlos Martínez y Javier López
- **Horarios**: Lunes a Viernes 9:00-18:00, Sábados 9:00-14:00
- **5 Servicios**: 
  - Corte de Cabello ($5000, 30min)
  - Corte + Barba ($7500, 45min)
  - Afeitado Clásico ($4000, 30min)
  - Corte Niño ($3500, 20min)
  - Corte Premium ($9000, 60min)
- **Configuraciones**: Información del negocio y parámetros de reserva
- **Feriados**: Principales feriados argentinos

## 🚂 Deploy en Railway

### 1. Crear proyecto en Railway

1. Ir a [railway.app](https://railway.app)
2. Crear nuevo proyecto
3. Agregar PostgreSQL database

### 2. Configurar variables de entorno

En el panel de Railway, agregar:

```
DATABASE_URL=<se genera automáticamente al agregar PostgreSQL>
PORT=3000
NODE_ENV=production
INIT_SECRET=<tu_secreto_seguro>
```

### 3. Conectar repositorio

1. Conectar el repositorio de GitHub
2. Railway detectará automáticamente la configuración
3. El deploy se realizará automáticamente

### 4. Generar esquema de BD

Después del primer deploy, ejecutar en la terminal de Railway:

```bash
npx prisma db push
```

### 5. Inicializar datos

Hacer una petición POST al endpoint de inicialización usando la URL de Railway.

## 🛠️ Comandos Útiles

```bash
# Desarrollo
npm run dev                 # Iniciar con hot-reload

# Prisma
npm run prisma:generate     # Generar cliente Prisma
npm run prisma:push         # Sincronizar BD con schema
npm run prisma:migrate      # Crear migración
npm run prisma:studio       # Abrir Prisma Studio (GUI)

# Producción
npm start                   # Iniciar servidor
```

## 📝 Ejemplos de Uso

### Crear una Reserva

```bash
curl -X POST http://localhost:3000/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "barberId": "<barber-uuid>",
    "serviceId": "<service-uuid>",
    "clientName": "Juan Pérez",
    "clientPhone": "+54 9 11 1234-5678",
    "clientEmail": "juan@example.com",
    "date": "2024-12-15",
    "startTime": "10:00",
    "notes": "Primera vez"
  }'
```

### Consultar Slots Disponibles

```bash
curl "http://localhost:3000/api/appointments/available-slots/<barber-uuid>?date=2024-12-15&serviceId=<service-uuid>"
```

### Actualizar Estado de Cita

```bash
curl -X PATCH http://localhost:3000/api/appointments/<appointment-uuid>/status \
  -H "Content-Type: application/json" \
  -d '{"status": "CONFIRMED"}'
```

## 🔐 Seguridad

- El endpoint de inicialización está protegido con un secret
- Solo puede ejecutarse una vez
- En producción, usar variables de entorno seguras
- Validar todos los inputs en el frontend

## 🤝 Contribuir

1. Fork el proyecto
2. Crear una rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit los cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

MIT License - ver archivo LICENSE para más detalles

## 👥 Contacto

Vela Barbería - info@velabarberia.com

---

Desarrollado con ❤️ para Vela Barbería

