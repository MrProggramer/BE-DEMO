# Ejemplos de Uso de la API

Ejemplos prácticos de cómo usar cada endpoint de la API.

## 🏥 Health Check

```bash
# Verificar que la API está funcionando
curl http://localhost:3000/health

# Response:
{
  "status": "ok",
  "timestamp": "2024-12-10T15:30:00.000Z"
}
```

## 👨‍💼 Barberos

### Listar todos los barberos

```bash
curl http://localhost:3000/api/barbers

# Response:
[
  {
    "id": "uuid-1",
    "name": "Carlos Martínez",
    "email": "carlos@velabarberia.com",
    "phone": "+54 9 11 1234-5678",
    "isActive": true,
    "workingHours": [...],
    "_count": {
      "appointments": 5
    }
  }
]
```

### Obtener un barbero específico

```bash
curl http://localhost:3000/api/barbers/uuid-1
```

### Crear un nuevo barbero

```bash
curl -X POST http://localhost:3000/api/barbers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Roberto Gómez",
    "email": "roberto@velabarberia.com",
    "phone": "+54 9 11 9999-8888",
    "isActive": true
  }'
```

### Actualizar un barbero

```bash
curl -X PUT http://localhost:3000/api/barbers/uuid-1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Carlos Martínez",
    "phone": "+54 9 11 1234-5679"
  }'
```

### Desactivar un barbero

```bash
curl -X DELETE http://localhost:3000/api/barbers/uuid-1
```

## 💇 Servicios

### Listar todos los servicios

```bash
curl http://localhost:3000/api/services

# Response:
[
  {
    "id": "uuid-service-1",
    "name": "Corte de Cabello",
    "description": "Corte de cabello clásico con máquina y tijera",
    "duration": 30,
    "price": 5000,
    "isActive": true
  }
]
```

### Crear un nuevo servicio

```bash
curl -X POST http://localhost:3000/api/services \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Coloración",
    "description": "Coloración completa de cabello",
    "duration": 90,
    "price": 12000,
    "isActive": true
  }'
```

### Actualizar precio de un servicio

```bash
curl -X PUT http://localhost:3000/api/services/uuid-service-1 \
  -H "Content-Type: application/json" \
  -d '{
    "price": 5500
  }'
```

## ⏰ Horarios de Trabajo

### Listar horarios de un barbero

```bash
curl "http://localhost:3000/api/working-hours?barberId=uuid-1"

# Response:
[
  {
    "id": "uuid-wh-1",
    "barberId": "uuid-1",
    "dayOfWeek": 1,  // Lunes
    "startTime": "09:00",
    "endTime": "18:00",
    "isActive": true,
    "barber": {
      "id": "uuid-1",
      "name": "Carlos Martínez"
    }
  }
]
```

### Crear horario de trabajo

```bash
curl -X POST http://localhost:3000/api/working-hours \
  -H "Content-Type: application/json" \
  -d '{
    "barberId": "uuid-1",
    "dayOfWeek": 1,
    "startTime": "09:00",
    "endTime": "18:00",
    "isActive": true
  }'
```

### Días de la semana

- 0 = Domingo
- 1 = Lunes
- 2 = Martes
- 3 = Miércoles
- 4 = Jueves
- 5 = Viernes
- 6 = Sábado

## 🚫 Días No Laborables

### Listar días no laborables futuros

```bash
curl http://localhost:3000/api/non-working-days

# Con filtros:
curl "http://localhost:3000/api/non-working-days?barberId=uuid-1&from=2024-12-01&to=2024-12-31"
```

### Crear día no laborable (para todos los barberos)

```bash
curl -X POST http://localhost:3000/api/non-working-days \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-12-25",
    "reason": "Navidad"
  }'
```

### Crear día no laborable (para un barbero específico)

```bash
curl -X POST http://localhost:3000/api/non-working-days \
  -H "Content-Type: application/json" \
  -d '{
    "barberId": "uuid-1",
    "date": "2024-12-20",
    "reason": "Vacaciones personales"
  }'
```

## 📅 Reservas/Turnos

### Consultar slots disponibles

```bash
# Para un barbero en una fecha específica
curl "http://localhost:3000/api/appointments/available-slots/uuid-1?date=2024-12-15&serviceId=uuid-service-1"

# Response:
{
  "barberId": "uuid-1",
  "date": "2024-12-15T00:00:00.000Z",
  "serviceDuration": 30,
  "availableSlots": [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "14:00",
    "14:30"
  ]
}
```

### Crear una reserva

```bash
curl -X POST http://localhost:3000/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "barberId": "uuid-1",
    "serviceId": "uuid-service-1",
    "clientName": "Juan Pérez",
    "clientPhone": "+54 9 11 1111-2222",
    "clientEmail": "juan@example.com",
    "date": "2024-12-15",
    "startTime": "10:00",
    "notes": "Primera vez en el local"
  }'

# Response:
{
  "id": "uuid-appointment-1",
  "barberId": "uuid-1",
  "serviceId": "uuid-service-1",
  "clientName": "Juan Pérez",
  "clientPhone": "+54 9 11 1111-2222",
  "clientEmail": "juan@example.com",
  "date": "2024-12-15T00:00:00.000Z",
  "startTime": "10:00",
  "endTime": "10:30",
  "status": "PENDING",
  "barber": {
    "id": "uuid-1",
    "name": "Carlos Martínez",
    "email": "carlos@velabarberia.com"
  },
  "service": {
    "id": "uuid-service-1",
    "name": "Corte de Cabello",
    "duration": 30,
    "price": 5000
  }
}
```

### Listar citas

```bash
# Todas las citas
curl http://localhost:3000/api/appointments

# Citas de un barbero
curl "http://localhost:3000/api/appointments?barberId=uuid-1"

# Citas de una fecha
curl "http://localhost:3000/api/appointments?date=2024-12-15"

# Citas con estado específico
curl "http://localhost:3000/api/appointments?status=CONFIRMED"

# Citas en un rango de fechas
curl "http://localhost:3000/api/appointments?from=2024-12-01&to=2024-12-31"
```

### Actualizar una cita

```bash
curl -X PUT http://localhost:3000/api/appointments/uuid-appointment-1 \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-12-16",
    "startTime": "11:00"
  }'
```

### Cambiar estado de una cita

```bash
# Estados válidos: PENDING, CONFIRMED, CANCELLED, COMPLETED, NO_SHOW
curl -X PATCH http://localhost:3000/api/appointments/uuid-appointment-1/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "CONFIRMED"
  }'
```

### Cancelar una cita

```bash
curl -X PATCH http://localhost:3000/api/appointments/uuid-appointment-1/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "CANCELLED"
  }'
```

### Eliminar una cita

```bash
curl -X DELETE http://localhost:3000/api/appointments/uuid-appointment-1
```

## ⚙️ Configuración

### Obtener todas las configuraciones

```bash
curl http://localhost:3000/api/config

# Response:
{
  "business_name": {
    "value": "Vela Barbería",
    "description": "Nombre del negocio"
  },
  "business_phone": {
    "value": "+54 9 11 5555-5555",
    "description": "Teléfono de contacto"
  }
}
```

### Obtener una configuración específica

```bash
curl http://localhost:3000/api/config/business_name
```

### Crear o actualizar configuración

```bash
curl -X POST http://localhost:3000/api/config \
  -H "Content-Type: application/json" \
  -d '{
    "key": "instagram_handle",
    "value": "@velabarberia",
    "description": "Handle de Instagram"
  }'
```

### Actualizar configuración existente

```bash
curl -X PUT http://localhost:3000/api/config/business_phone \
  -H "Content-Type: application/json" \
  -d '{
    "value": "+54 9 11 6666-6666"
  }'
```

## 🚨 Manejo de Errores

### Error 400 - Bad Request

```json
{
  "error": "Nombre y email son requeridos"
}
```

### Error 404 - Not Found

```json
{
  "error": "Barbero no encontrado"
}
```

### Error 403 - Forbidden

```json
{
  "error": "No autorizado. Secret incorrecto."
}
```

### Error de validación de cita

```json
{
  "error": "El horario ya está ocupado"
}
```

```json
{
  "error": "El barbero no trabaja este día"
}
```

```json
{
  "error": "No disponible: Día del Trabajador"
}
```

## 💡 Tips de Uso

### 1. Flujo típico para crear una reserva

```bash
# 1. Obtener lista de barberos
curl http://localhost:3000/api/barbers

# 2. Obtener lista de servicios
curl http://localhost:3000/api/services

# 3. Consultar slots disponibles
curl "http://localhost:3000/api/appointments/available-slots/{barberId}?date=2024-12-15&serviceId={serviceId}"

# 4. Crear la reserva
curl -X POST http://localhost:3000/api/appointments \
  -H "Content-Type: application/json" \
  -d '{...}'
```

### 2. Formatos de fecha

- **date**: `YYYY-MM-DD` (ej: `2024-12-15`)
- **startTime/endTime**: `HH:MM` (ej: `14:30`)

### 3. Usar variables de entorno

```bash
# Definir la URL base
export API_URL="http://localhost:3000"

# Usar en los comandos
curl $API_URL/api/barbers
```

### 4. Pretty print JSON con jq

```bash
curl http://localhost:3000/api/barbers | jq
```

---

Para más detalles, consulta el [README.md](README.md) principal.

