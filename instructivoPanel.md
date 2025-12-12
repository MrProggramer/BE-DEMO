# Instructivo Panel de Administración - Vela Barbería

**URL Base API**: `https://be-barberia-production.up.railway.app`

**Panel**: `https://administra-t.vercel.app`

---

## 📋 Índice

1. [Gestión de Barberos](#-gestión-de-barberos)
2. [Gestión de Servicios](#-gestión-de-servicios)
3. [Horarios de Trabajo](#-horarios-de-trabajo)
4. [Días No Laborables](#-días-no-laborables)
5. [Gestión de Reservas](#-gestión-de-reservas)
6. [Configuración General](#%EF%B8%8F-configuración-general)
7. [Dashboard y Estadísticas](#-dashboard-y-estadísticas)

---

## 👨‍💼 Gestión de Barberos

### 📋 Listar todos los barberos

```http
GET /api/barbers
```

```javascript
const barberos = await fetch('https://be-barberia-production.up.railway.app/api/barbers')
  .then(res => res.json());
```

**Response:**
```json
[
  {
    "id": "barber-uuid-1",
    "name": "Carlos Martínez",
    "email": "carlos@velabarberia.com",
    "phone": "+54 9 11 1234-5678",
    "isActive": true,
    "createdAt": "2024-12-10T10:00:00.000Z",
    "updatedAt": "2024-12-10T10:00:00.000Z",
    "workingHours": [...],
    "_count": {
      "appointments": 15
    }
  }
]
```

### ➕ Crear un barbero

```http
POST /api/barbers
Content-Type: application/json
```

```javascript
const nuevoBarbero = await fetch('https://be-barberia-production.up.railway.app/api/barbers', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: "Roberto Gómez",
    email: "roberto@velabarberia.com",
    phone: "+54 9 11 9999-8888",
    isActive: true
  })
});

const resultado = await nuevoBarbero.json();
```

**Campos:**
- ✅ `name` - Nombre completo (requerido)
- ✅ `email` - Email único (requerido)
- `phone` - Teléfono de contacto (opcional)
- `isActive` - Estado activo/inactivo (default: true)

**Response exitoso:**
```json
{
  "id": "barber-uuid-nuevo",
  "name": "Roberto Gómez",
  "email": "roberto@velabarberia.com",
  "phone": "+54 9 11 9999-8888",
  "isActive": true,
  "createdAt": "2024-12-10T15:30:00.000Z",
  "updatedAt": "2024-12-10T15:30:00.000Z"
}
```

**Errores posibles:**
```json
// Email duplicado
{
  "error": "El email ya está registrado"
}

// Datos faltantes
{
  "error": "Nombre y email son requeridos"
}
```

### ✏️ Actualizar un barbero

```http
PUT /api/barbers/{id}
Content-Type: application/json
```

```javascript
const actualizarBarbero = await fetch('https://be-barberia-production.up.railway.app/api/barbers/barber-uuid-1', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: "Carlos Martínez",
    phone: "+54 9 11 1234-5679",
    isActive: true
  })
});

const resultado = await actualizarBarbero.json();
```

**Nota:** Solo envía los campos que quieres actualizar.

### 🔴 Desactivar un barbero

```http
DELETE /api/barbers/{id}
```

```javascript
const desactivar = await fetch('https://be-barberia-production.up.railway.app/api/barbers/barber-uuid-1', {
  method: 'DELETE'
});

const resultado = await desactivar.json();
// { "message": "Barbero desactivado", "barber": {...} }
```

**Nota:** No elimina el barbero, solo lo marca como inactivo.

### 👁️ Ver detalles de un barbero

```http
GET /api/barbers/{id}
```

```javascript
const barbero = await fetch('https://be-barberia-production.up.railway.app/api/barbers/barber-uuid-1')
  .then(res => res.json());

// Incluye horarios de trabajo y días no laborables futuros
```

---

## 💇 Gestión de Servicios

### 📋 Listar todos los servicios

```http
GET /api/services
```

```javascript
const servicios = await fetch('https://be-barberia-production.up.railway.app/api/services')
  .then(res => res.json());
```

### ➕ Crear un servicio

```http
POST /api/services
Content-Type: application/json
```

```javascript
const nuevoServicio = await fetch('https://be-barberia-production.up.railway.app/api/services', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: "Coloración",
    description: "Coloración completa de cabello",
    duration: 90,
    price: 12000,
    isActive: true
  })
});
```

**Campos:**
- ✅ `name` - Nombre del servicio (requerido)
- ✅ `duration` - Duración en minutos (requerido)
- ✅ `price` - Precio en pesos (requerido)
- `description` - Descripción del servicio (opcional)
- `isActive` - Estado activo/inactivo (default: true)

### ✏️ Actualizar un servicio

```http
PUT /api/services/{id}
Content-Type: application/json
```

```javascript
const actualizar = await fetch('https://be-barberia-production.up.railway.app/api/services/service-uuid-1', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    price: 5500,
    description: "Corte de cabello premium"
  })
});
```

### 🔴 Desactivar un servicio

```http
DELETE /api/services/{id}
```

```javascript
const desactivar = await fetch('https://be-barberia-production.up.railway.app/api/services/service-uuid-1', {
  method: 'DELETE'
});
```

---

## ⏰ Horarios de Trabajo

### 📋 Listar horarios

```http
GET /api/working-hours
```

**Con filtro por barbero:**
```http
GET /api/working-hours?barberId={barberId}
```

```javascript
// Todos los horarios
const horarios = await fetch('https://be-barberia-production.up.railway.app/api/working-hours')
  .then(res => res.json());

// Horarios de un barbero específico
const horariosBarber = await fetch('https://be-barberia-production.up.railway.app/api/working-hours?barberId=barber-uuid-1')
  .then(res => res.json());
```

### ➕ Crear horario de trabajo

```http
POST /api/working-hours
Content-Type: application/json
```

```javascript
const nuevoHorario = await fetch('https://be-barberia-production.up.railway.app/api/working-hours', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    barberId: "barber-uuid-1",
    dayOfWeek: 1,        // 0=Domingo, 1=Lunes, ..., 6=Sábado
    startTime: "09:00",
    endTime: "18:00",
    isActive: true
  })
});
```

**Días de la semana:**
- `0` = Domingo
- `1` = Lunes
- `2` = Martes
- `3` = Miércoles
- `4` = Jueves
- `5` = Viernes
- `6` = Sábado

**Campos:**
- ✅ `barberId` - ID del barbero (requerido)
- ✅ `dayOfWeek` - Día de la semana 0-6 (requerido)
- ✅ `startTime` - Hora de inicio HH:MM (requerido)
- ✅ `endTime` - Hora de fin HH:MM (requerido)
- `isActive` - Estado activo/inactivo (default: true)

### ✏️ Actualizar horario

```http
PUT /api/working-hours/{id}
Content-Type: application/json
```

```javascript
const actualizar = await fetch('https://be-barberia-production.up.railway.app/api/working-hours/wh-uuid-1', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    startTime: "10:00",
    endTime: "19:00"
  })
});
```

### ❌ Eliminar horario

```http
DELETE /api/working-hours/{id}
```

```javascript
const eliminar = await fetch('https://be-barberia-production.up.railway.app/api/working-hours/wh-uuid-1', {
  method: 'DELETE'
});
```

### 💡 Ejemplo: Configurar semana completa

```javascript
async function configurarSemanaCompleta(barberId) {
  // Lunes a Viernes: 9:00-18:00
  for (let dia = 1; dia <= 5; dia++) {
    await fetch('https://be-barberia-production.up.railway.app/api/working-hours', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        barberId: barberId,
        dayOfWeek: dia,
        startTime: "09:00",
        endTime: "18:00",
        isActive: true
      })
    });
  }
  
  // Sábado: 9:00-14:00
  await fetch('https://be-barberia-production.up.railway.app/api/working-hours', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      barberId: barberId,
      dayOfWeek: 6,
      startTime: "09:00",
      endTime: "14:00",
      isActive: true
    })
  });
}
```

---

## 🚫 Días No Laborables

### 📋 Listar días no laborables

```http
GET /api/non-working-days
```

**Con filtros:**
```http
GET /api/non-working-days?barberId={barberId}
GET /api/non-working-days?from=2024-12-01&to=2024-12-31
```

```javascript
// Todos los días no laborables futuros
const diasNoLaborables = await fetch('https://be-barberia-production.up.railway.app/api/non-working-days')
  .then(res => res.json());

// De un barbero específico
const diasBarber = await fetch('https://be-barberia-production.up.railway.app/api/non-working-days?barberId=barber-uuid-1')
  .then(res => res.json());

// En un rango de fechas
const diasRango = await fetch('https://be-barberia-production.up.railway.app/api/non-working-days?from=2024-12-01&to=2024-12-31')
  .then(res => res.json());
```

### ➕ Crear día no laborable

**Para todos los barberos (feriado):**

```javascript
const feriado = await fetch('https://be-barberia-production.up.railway.app/api/non-working-days', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    date: "2025-01-01",
    reason: "Año Nuevo"
  })
});
```

**Para un barbero específico (vacaciones):**

```javascript
const vacaciones = await fetch('https://be-barberia-production.up.railway.app/api/non-working-days', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    barberId: "barber-uuid-1",
    date: "2024-12-20",
    reason: "Vacaciones personales"
  })
});
```

**Campos:**
- ✅ `date` - Fecha YYYY-MM-DD (requerido)
- `barberId` - ID del barbero (null = todos los barberos)
- `reason` - Motivo (opcional)

### ✏️ Actualizar día no laborable

```javascript
const actualizar = await fetch('https://be-barberia-production.up.railway.app/api/non-working-days/nwd-uuid-1', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    date: "2025-01-02",
    reason: "Feriado puente"
  })
});
```

### ❌ Eliminar día no laborable

```javascript
const eliminar = await fetch('https://be-barberia-production.up.railway.app/api/non-working-days/nwd-uuid-1', {
  method: 'DELETE'
});
```

---

## 📅 Gestión de Reservas

### 📋 Listar todas las reservas

```http
GET /api/appointments
```

**Con filtros:**
```http
GET /api/appointments?barberId={barberId}
GET /api/appointments?date=2024-12-15
GET /api/appointments?status=CONFIRMED
GET /api/appointments?from=2024-12-01&to=2024-12-31
```

```javascript
// Todas las reservas
const reservas = await fetch('https://be-barberia-production.up.railway.app/api/appointments')
  .then(res => res.json());

// Reservas de hoy
const hoy = new Date().toISOString().split('T')[0];
const reservasHoy = await fetch(`https://be-barberia-production.up.railway.app/api/appointments?date=${hoy}`)
  .then(res => res.json());

// Reservas de un barbero
const reservasBarber = await fetch('https://be-barberia-production.up.railway.app/api/appointments?barberId=barber-uuid-1')
  .then(res => res.json());

// Reservas confirmadas
const confirmadas = await fetch('https://be-barberia-production.up.railway.app/api/appointments?status=CONFIRMED')
  .then(res => res.json());
```

### 👁️ Ver detalles de una reserva

```http
GET /api/appointments/{id}
```

```javascript
const reserva = await fetch('https://be-barberia-production.up.railway.app/api/appointments/appointment-uuid-1')
  .then(res => res.json());
```

### ✏️ Actualizar una reserva

```http
PUT /api/appointments/{id}
Content-Type: application/json
```

```javascript
const actualizar = await fetch('https://be-barberia-production.up.railway.app/api/appointments/appointment-uuid-1', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    date: "2024-12-16",
    startTime: "11:00",
    notes: "Cambio de horario solicitado por el cliente"
  })
});
```

**Nota:** Si cambias barbero, servicio, fecha u hora, se revalida la disponibilidad automáticamente.

### 🔄 Cambiar estado de una reserva ⭐

```http
PATCH /api/appointments/{id}/status
Content-Type: application/json
```

```javascript
// Confirmar reserva
const confirmar = await fetch('https://be-barberia-production.up.railway.app/api/appointments/appointment-uuid-1/status', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    status: "CONFIRMED"
  })
});

// Marcar como completada
const completar = await fetch('https://be-barberia-production.up.railway.app/api/appointments/appointment-uuid-1/status', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    status: "COMPLETED"
  })
});

// Cancelar
const cancelar = await fetch('https://be-barberia-production.up.railway.app/api/appointments/appointment-uuid-1/status', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    status: "CANCELLED"
  })
});

// Marcar como no show
const noShow = await fetch('https://be-barberia-production.up.railway.app/api/appointments/appointment-uuid-1/status', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    status: "NO_SHOW"
  })
});
```

**Estados disponibles:**
- `PENDING` - Pendiente de confirmación
- `CONFIRMED` - Confirmada
- `CANCELLED` - Cancelada
- `COMPLETED` - Completada
- `NO_SHOW` - Cliente no se presentó

### ❌ Eliminar una reserva

```http
DELETE /api/appointments/{id}
```

```javascript
const eliminar = await fetch('https://be-barberia-production.up.railway.app/api/appointments/appointment-uuid-1', {
  method: 'DELETE'
});
```

### 📅 Ver agenda del día

```javascript
async function verAgendaDelDia(fecha) {
  const reservas = await fetch(`https://be-barberia-production.up.railway.app/api/appointments?date=${fecha}&status=CONFIRMED`)
    .then(res => res.json());
  
  // Agrupar por barbero
  const porBarbero = {};
  reservas.forEach(r => {
    if (!porBarbero[r.barber.name]) {
      porBarbero[r.barber.name] = [];
    }
    porBarbero[r.barber.name].push(r);
  });
  
  console.log('Agenda del día:', porBarbero);
  return porBarbero;
}

// Uso
const hoy = new Date().toISOString().split('T')[0];
verAgendaDelDia(hoy);
```

---

## ⚙️ Configuración General

### 📋 Obtener todas las configuraciones

```http
GET /api/config
```

```javascript
const config = await fetch('https://be-barberia-production.up.railway.app/api/config')
  .then(res => res.json());

// config.business_name.value
// config.business_phone.value
// etc.
```

### ✏️ Actualizar configuración

```http
PUT /api/config/{key}
Content-Type: application/json
```

```javascript
// Actualizar teléfono del negocio
const actualizar = await fetch('https://be-barberia-production.up.railway.app/api/config/business_phone', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    value: "+54 9 11 6666-6666",
    description: "Teléfono principal de contacto"
  })
});

// Actualizar dirección
const actualizarDir = await fetch('https://be-barberia-production.up.railway.app/api/config/business_address', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    value: "Av. Santa Fe 1234, CABA"
  })
});
```

### ➕ Crear nueva configuración

```javascript
const nueva = await fetch('https://be-barberia-production.up.railway.app/api/config', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    key: "instagram_handle",
    value: "@velabarberia",
    description: "Handle de Instagram"
  })
});
```

**Configuraciones predefinidas:**
- `business_name` - Nombre del negocio
- `business_phone` - Teléfono de contacto
- `business_email` - Email de contacto
- `business_address` - Dirección del local
- `appointment_slot_duration` - Duración de slots en minutos
- `max_advance_booking_days` - Días máximos de anticipación
- `min_advance_booking_hours` - Horas mínimas de anticipación
- `cancel_appointment_hours` - Horas para cancelar sin penalización

---

## 📊 Dashboard y Estadísticas

### Resumen del día

```javascript
async function resumenDelDia() {
  const hoy = new Date().toISOString().split('T')[0];
  
  const reservas = await fetch(`https://be-barberia-production.up.railway.app/api/appointments?date=${hoy}`)
    .then(res => res.json());
  
  const stats = {
    total: reservas.length,
    confirmadas: reservas.filter(r => r.status === 'CONFIRMED').length,
    pendientes: reservas.filter(r => r.status === 'PENDING').length,
    completadas: reservas.filter(r => r.status === 'COMPLETED').length,
    canceladas: reservas.filter(r => r.status === 'CANCELLED').length,
    noShow: reservas.filter(r => r.status === 'NO_SHOW').length,
    ingresos: reservas
      .filter(r => r.status === 'COMPLETED')
      .reduce((sum, r) => sum + r.service.price, 0)
  };
  
  return stats;
}

// Uso
const stats = await resumenDelDia();
console.log('Total de reservas:', stats.total);
console.log('Ingresos del día: $', stats.ingresos);
```

### Estadísticas por barbero

```javascript
async function estadisticasPorBarbero(barberId, desde, hasta) {
  const reservas = await fetch(
    `https://be-barberia-production.up.railway.app/api/appointments?barberId=${barberId}&from=${desde}&to=${hasta}`
  ).then(res => res.json());
  
  const stats = {
    totalReservas: reservas.length,
    completadas: reservas.filter(r => r.status === 'COMPLETED').length,
    canceladas: reservas.filter(r => r.status === 'CANCELLED').length,
    noShow: reservas.filter(r => r.status === 'NO_SHOW').length,
    ingresos: reservas
      .filter(r => r.status === 'COMPLETED')
      .reduce((sum, r) => sum + r.service.price, 0)
  };
  
  return stats;
}

// Uso: estadísticas del mes
const primerDia = new Date(2024, 11, 1).toISOString().split('T')[0];
const ultimoDia = new Date(2024, 11, 31).toISOString().split('T')[0];
const stats = await estadisticasPorBarbero('barber-uuid-1', primerDia, ultimoDia);
```

### Servicios más solicitados

```javascript
async function serviciosMasSolicitados(desde, hasta) {
  const reservas = await fetch(
    `https://be-barberia-production.up.railway.app/api/appointments?from=${desde}&to=${hasta}&status=COMPLETED`
  ).then(res => res.json());
  
  const conteo = {};
  reservas.forEach(r => {
    const nombre = r.service.name;
    conteo[nombre] = (conteo[nombre] || 0) + 1;
  });
  
  // Ordenar por más solicitado
  const ranking = Object.entries(conteo)
    .sort((a, b) => b[1] - a[1])
    .map(([servicio, cantidad]) => ({ servicio, cantidad }));
  
  return ranking;
}
```

---

## 💡 Flujos Comunes del Panel

### 1. Agregar un nuevo barbero completo

```javascript
async function agregarBarberoCompleto(datos) {
  // 1. Crear el barbero
  const barbero = await fetch('https://be-barberia-production.up.railway.app/api/barbers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: datos.nombre,
      email: datos.email,
      phone: datos.telefono,
      isActive: true
    })
  }).then(res => res.json());
  
  const barberId = barbero.id;
  
  // 2. Configurar horarios (Lunes a Viernes)
  for (let dia = 1; dia <= 5; dia++) {
    await fetch('https://be-barberia-production.up.railway.app/api/working-hours', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        barberId: barberId,
        dayOfWeek: dia,
        startTime: "09:00",
        endTime: "18:00",
        isActive: true
      })
    });
  }
  
  // 3. Sábado
  await fetch('https://be-barberia-production.up.railway.app/api/working-hours', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      barberId: barberId,
      dayOfWeek: 6,
      startTime: "09:00",
      endTime: "14:00",
      isActive: true
    })
  });
  
  return barbero;
}

// Uso
const nuevoBarbero = await agregarBarberoCompleto({
  nombre: "Roberto Gómez",
  email: "roberto@velabarberia.com",
  telefono: "+54 9 11 9999-8888"
});
```

### 2. Gestionar agenda del día

```javascript
async function gestionarAgenda() {
  const hoy = new Date().toISOString().split('T')[0];
  
  // Obtener reservas del día
  const reservas = await fetch(`https://be-barberia-production.up.railway.app/api/appointments?date=${hoy}`)
    .then(res => res.json());
  
  // Agrupar por estado
  const pendientes = reservas.filter(r => r.status === 'PENDING');
  const confirmadas = reservas.filter(r => r.status === 'CONFIRMED');
  
  console.log(`Pendientes de confirmar: ${pendientes.length}`);
  console.log(`Confirmadas: ${confirmadas.length}`);
  
  return { pendientes, confirmadas, todas: reservas };
}
```

### 3. Actualizar precios

```javascript
async function actualizarPrecio(serviceId, nuevoPrecio) {
  const actualizar = await fetch(`https://be-barberia-production.up.railway.app/api/services/${serviceId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      price: nuevoPrecio
    })
  });
  
  return await actualizar.json();
}

// Aumentar todos los precios 10%
async function aumentarPrecios(porcentaje) {
  const servicios = await fetch('https://be-barberia-production.up.railway.app/api/services')
    .then(res => res.json());
  
  for (const servicio of servicios) {
    const nuevoPrecio = Math.round(servicio.price * (1 + porcentaje / 100));
    await actualizarPrecio(servicio.id, nuevoPrecio);
  }
}
```

---

## 🎨 Componentes React para el Panel

### Formulario de Nuevo Barbero

```jsx
import React, { useState } from 'react';

function FormularioNuevoBarbero() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('https://be-barberia-production.up.railway.app/api/barbers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nombre,
          email: email,
          phone: telefono,
          isActive: true
        })
      });
      
      if (response.ok) {
        const barbero = await response.json();
        alert(`Barbero ${barbero.name} creado exitosamente`);
        // Limpiar formulario
        setNombre('');
        setEmail('');
        setTelefono('');
      } else {
        const error = await response.json();
        alert('Error: ' + error.error);
      }
    } catch (error) {
      alert('Error de conexión');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nombre completo"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="tel"
        placeholder="Teléfono"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Guardando...' : 'Crear Barbero'}
      </button>
    </form>
  );
}
```

### Lista de Reservas del Día

```jsx
import React, { useState, useEffect } from 'react';

function ReservasDelDia() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    cargarReservas();
  }, []);
  
  const cargarReservas = async () => {
    const hoy = new Date().toISOString().split('T')[0];
    const data = await fetch(`https://be-barberia-production.up.railway.app/api/appointments?date=${hoy}`)
      .then(res => res.json());
    setReservas(data);
    setLoading(false);
  };
  
  const cambiarEstado = async (appointmentId, nuevoEstado) => {
    await fetch(`https://be-barberia-production.up.railway.app/api/appointments/${appointmentId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nuevoEstado })
    });
    cargarReservas(); // Recargar lista
  };
  
  if (loading) return <p>Cargando...</p>;
  
  return (
    <div>
      <h2>Reservas de Hoy ({reservas.length})</h2>
      {reservas.map(r => (
        <div key={r.id} className="reserva-card">
          <p><strong>{r.clientName}</strong> - {r.clientPhone}</p>
          <p>{r.startTime} - {r.barber.name}</p>
          <p>{r.service.name} (${r.service.price})</p>
          <p>Estado: <span className={`status-${r.status}`}>{r.status}</span></p>
          
          {r.status === 'PENDING' && (
            <button onClick={() => cambiarEstado(r.id, 'CONFIRMED')}>
              Confirmar
            </button>
          )}
          {r.status === 'CONFIRMED' && (
            <button onClick={() => cambiarEstado(r.id, 'COMPLETED')}>
              Marcar Completada
            </button>
          )}
          <button onClick={() => cambiarEstado(r.id, 'CANCELLED')}>
            Cancelar
          </button>
        </div>
      ))}
    </div>
  );
}
```

---

## 🔐 Notas Importantes

1. **Autenticación**: Actualmente no hay autenticación implementada. Para producción, considera agregar JWT o similar.

2. **Validaciones automáticas**: Al actualizar reservas, el backend valida automáticamente disponibilidad.

3. **Soft delete**: Los barberos y servicios no se eliminan físicamente, solo se desactivan con `isActive: false`.

4. **CORS**: El panel está autorizado para acceder a todos los endpoints desde `https://administra-t.vercel.app`.

---

**¿Necesitas ayuda?** Contacta al equipo de desarrollo.

