# Instructivo Frontend - App de Reservas Vela Barbería

**URL Base API**: `https://be-barberia-production.up.railway.app`

---

## 📱 Funcionalidades de la App

Esta app permite a los clientes:
1. ✅ **Ver turnos disponibles**
2. ✅ **Crear una reserva**
3. ✅ **Consultar sus reservas**

---

## 🎯 Flujo de Reserva

### 1️⃣ Obtener Barberos Disponibles

```javascript
const barberos = await fetch('https://be-barberia-production.up.railway.app/api/barbers')
  .then(res => res.json());
```

**Respuesta:**
```json
[
  {
    "id": "barber-uuid-1",
    "name": "Carlos Martínez",
    "phone": "+54 9 11 1234-5678",
    "isActive": true
  },
  {
    "id": "barber-uuid-2",
    "name": "Javier López",
    "phone": "+54 9 11 8765-4321",
    "isActive": true
  }
]
```

**Uso:** Mostrar lista de barberos para que el usuario elija uno.

---

### 2️⃣ Obtener Servicios Disponibles

```javascript
const servicios = await fetch('https://be-barberia-production.up.railway.app/api/services')
  .then(res => res.json());
```

**Respuesta:**
```json
[
  {
    "id": "service-uuid-1",
    "name": "Corte de Cabello",
    "description": "Corte de cabello clásico con máquina y tijera",
    "duration": 30,
    "price": 5000
  },
  {
    "id": "service-uuid-2",
    "name": "Corte + Barba",
    "description": "Corte de cabello y arreglo de barba",
    "duration": 45,
    "price": 7500
  },
  {
    "id": "service-uuid-3",
    "name": "Afeitado Clásico",
    "description": "Afeitado tradicional con navaja",
    "duration": 30,
    "price": 4000
  }
]
```

**Uso:** Mostrar servicios con precio y duración. Usuario selecciona el que quiere.

**Campos importantes:**
- `price` - Precio en pesos (ej: 5000 = $5000)
- `duration` - Duración en minutos
- `name` - Nombre del servicio
- `description` - Descripción del servicio

---

### 3️⃣ Obtener Precios y Configuración 💰

#### Precios de Servicios

Los precios están incluidos en el endpoint de servicios (paso 2), pero si solo necesitas los precios:

```javascript
const servicios = await fetch('https://be-barberia-production.up.railway.app/api/services')
  .then(res => res.json());

// Extraer solo precios
servicios.forEach(servicio => {
  console.log(`${servicio.name}: $${servicio.price}`);
});
```

**Ejemplo de visualización:**
```
Corte de Cabello: $5000 (30 min)
Corte + Barba: $7500 (45 min)
Afeitado Clásico: $4000 (30 min)
Corte Niño: $3500 (20 min)
Corte Premium: $9000 (60 min)
```

#### Información del Negocio

```javascript
const config = await fetch('https://be-barberia-production.up.railway.app/api/config')
  .then(res => res.json());

console.log('Nombre:', config.business_name.value);
console.log('Teléfono:', config.business_phone.value);
console.log('Email:', config.business_email.value);
console.log('Dirección:', config.business_address.value);
```

**Respuesta:**
```json
{
  "business_name": {
    "value": "Vela Barbería",
    "description": "Nombre del negocio"
  },
  "business_phone": {
    "value": "+54 9 11 5555-5555",
    "description": "Teléfono de contacto"
  },
  "business_email": {
    "value": "info@velabarberia.com",
    "description": "Email de contacto"
  },
  "business_address": {
    "value": "Av. Corrientes 1234, CABA, Argentina",
    "description": "Dirección del local"
  }
}
```

**Uso:** Mostrar información de contacto y ubicación en la app.

---

### 4️⃣ Consultar Horarios Disponibles ⭐

**Este es el endpoint más importante para mostrar disponibilidad**

```javascript
const barberId = "barber-uuid-1";  // Del paso 1
const serviceId = "service-uuid-1"; // Del paso 2
const fecha = "2024-12-15";         // Fecha seleccionada por el usuario

const disponibilidad = await fetch(
  `https://be-barberia-production.up.railway.app/api/appointments/available-slots/${barberId}?date=${fecha}&serviceId=${serviceId}`
).then(res => res.json());
```

**Respuesta:**
```json
{
  "barberId": "barber-uuid-1",
  "date": "2024-12-15T00:00:00.000Z",
  "serviceDuration": 30,
  "availableSlots": [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00"
  ]
}
```

**Uso:** Mostrar los horarios disponibles como botones o lista para que el usuario seleccione uno.

**Si no hay horarios disponibles:**
```json
{
  "barberId": "barber-uuid-1",
  "date": "2024-12-15T00:00:00.000Z",
  "serviceDuration": 30,
  "availableSlots": []
}
```

---

### 5️⃣ Crear la Reserva ⭐

```javascript
const reserva = await fetch('https://be-barberia-production.up.railway.app/api/appointments', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    barberId: "barber-uuid-1",        // Barbero seleccionado
    serviceId: "service-uuid-1",      // Servicio seleccionado
    clientName: "Juan Pérez",         // Nombre del cliente
    clientPhone: "+54 9 11 1111-2222", // Teléfono del cliente
    clientEmail: "juan@email.com",    // Email (opcional)
    date: "2024-12-15",               // Fecha seleccionada
    startTime: "10:00",               // Horario seleccionado
    notes: "Primera vez"              // Notas (opcional)
  })
});

const resultado = await reserva.json();
```

**Campos obligatorios:**
- ✅ `barberId` - ID del barbero
- ✅ `serviceId` - ID del servicio
- ✅ `clientName` - Nombre del cliente
- ✅ `clientPhone` - Teléfono del cliente
- ✅ `date` - Fecha (formato: `YYYY-MM-DD`)
- ✅ `startTime` - Hora de inicio (formato: `HH:MM`)

**Campos opcionales:**
- `clientEmail` - Email del cliente
- `notes` - Notas adicionales

**Respuesta exitosa:**
```json
{
  "id": "appointment-uuid-nuevo",
  "barberId": "barber-uuid-1",
  "serviceId": "service-uuid-1",
  "clientName": "Juan Pérez",
  "clientPhone": "+54 9 11 1111-2222",
  "clientEmail": "juan@email.com",
  "date": "2024-12-15T00:00:00.000Z",
  "startTime": "10:00",
  "endTime": "10:30",
  "status": "PENDING",
  "notes": "Primera vez",
  "createdAt": "2024-12-10T15:30:00.000Z",
  "barber": {
    "id": "barber-uuid-1",
    "name": "Carlos Martínez"
  },
  "service": {
    "id": "service-uuid-1",
    "name": "Corte de Cabello",
    "duration": 30,
    "price": 5000
  }
}
```

**Errores posibles:**
```json
// Si el horario ya fue tomado
{
  "error": "El horario ya está ocupado"
}

// Si es día no laborable
{
  "error": "No disponible: Día del Trabajador"
}

// Si el barbero no trabaja ese día
{
  "error": "El barbero no trabaja este día"
}

// Si faltan datos
{
  "error": "BarberId, serviceId, clientName, clientPhone, date y startTime son requeridos"
}
```

---

## 📋 Consultar Reservas del Cliente

### Buscar por teléfono (recomendado)

Para que un cliente vea sus reservas, puedes buscar por su teléfono:

```javascript
const telefono = "+54 9 11 1111-2222";

// Obtener todas las citas y filtrar por teléfono en el frontend
const todasLasCitas = await fetch('https://be-barberia-production.up.railway.app/api/appointments')
  .then(res => res.json());

const misReservas = todasLasCitas.filter(cita => cita.clientPhone === telefono);
```

### Ver reservas de una fecha específica

```javascript
const fecha = "2024-12-15";

const reservasDelDia = await fetch(
  `https://be-barberia-production.up.railway.app/api/appointments?date=${fecha}`
).then(res => res.json());
```

### Ver reservas futuras

```javascript
const hoy = new Date().toISOString().split('T')[0];
const enUnMes = new Date();
enUnMes.setMonth(enUnMes.getMonth() + 1);
const fechaFin = enUnMes.toISOString().split('T')[0];

const reservasFuturas = await fetch(
  `https://be-barberia-production.up.railway.app/api/appointments?from=${hoy}&to=${fechaFin}`
).then(res => res.json());
```

**Respuesta:**
```json
[
  {
    "id": "appointment-uuid-1",
    "clientName": "Juan Pérez",
    "clientPhone": "+54 9 11 1111-2222",
    "date": "2024-12-15T00:00:00.000Z",
    "startTime": "10:00",
    "endTime": "10:30",
    "status": "PENDING",
    "barber": {
      "name": "Carlos Martínez"
    },
    "service": {
      "name": "Corte de Cabello",
      "price": 5000
    }
  }
]
```

**Estados de reserva:**
- `PENDING` - Pendiente de confirmación
- `CONFIRMED` - Confirmada
- `CANCELLED` - Cancelada
- `COMPLETED` - Completada
- `NO_SHOW` - Cliente no se presentó

---

## 💻 Ejemplo Completo - Flujo de Reserva

```javascript
// ============================================
// FLUJO COMPLETO DE RESERVA
// ============================================

async function crearReserva() {
  try {
    // 1. Obtener barberos
    const barberos = await fetch('https://be-barberia-production.up.railway.app/api/barbers')
      .then(res => res.json());
    
    console.log('Barberos disponibles:', barberos);
    // Usuario selecciona barbero
    const barberoSeleccionado = barberos[0].id;
    
    // 2. Obtener servicios con precios
    const servicios = await fetch('https://be-barberia-production.up.railway.app/api/services')
      .then(res => res.json());
    
    console.log('Servicios disponibles:', servicios);
    // Mostrar servicios con precios
    servicios.forEach(s => {
      console.log(`${s.name} - $${s.price} (${s.duration} min)`);
    });
    
    // Usuario selecciona servicio
    const servicioSeleccionado = servicios[0].id;
    const precioServicio = servicios[0].price;
    
    // 3. Usuario selecciona fecha
    const fechaSeleccionada = '2024-12-15';
    
    // 4. Obtener horarios disponibles
    const disponibilidad = await fetch(
      `https://be-barberia-production.up.railway.app/api/appointments/available-slots/${barberoSeleccionado}?date=${fechaSeleccionada}&serviceId=${servicioSeleccionado}`
    ).then(res => res.json());
    
    console.log('Horarios disponibles:', disponibilidad.availableSlots);
    
    if (disponibilidad.availableSlots.length === 0) {
      alert('No hay horarios disponibles para esta fecha');
      return;
    }
    
    // Usuario selecciona horario
    const horarioSeleccionado = disponibilidad.availableSlots[0];
    
    // 5. Crear la reserva
    const response = await fetch('https://be-barberia-production.up.railway.app/api/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        barberId: barberoSeleccionado,
        serviceId: servicioSeleccionado,
        clientName: 'Juan Pérez',
        clientPhone: '+54 9 11 1111-2222',
        clientEmail: 'juan@email.com',
        date: fechaSeleccionada,
        startTime: horarioSeleccionado,
        notes: 'Primera vez en el local'
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      alert('Error: ' + error.error);
      return;
    }
    
    const reserva = await response.json();
    console.log('¡Reserva creada exitosamente!', reserva);
    
    // Mostrar confirmación al usuario con precio
    alert(`¡Reserva confirmada!
    
Barbero: ${reserva.barber.name}
Servicio: ${reserva.service.name}
Fecha: ${reserva.date.split('T')[0]}
Hora: ${reserva.startTime}
Duración: ${reserva.service.duration} minutos
💰 Precio: $${reserva.service.price}

Te esperamos!`);
    
  } catch (error) {
    console.error('Error:', error);
    alert('Ocurrió un error al crear la reserva');
  }
}

// Ejecutar
crearReserva();
```

---

## 📱 Ejemplo React Native / React

```jsx
import React, { useState, useEffect } from 'react';

const API_URL = 'https://be-barberia-production.up.railway.app';

function ReservaScreen() {
  const [barberos, setBarberos] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [slots, setSlots] = useState([]);
  
  const [barberoSeleccionado, setBarberoSeleccionado] = useState(null);
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
  const [fecha, setFecha] = useState('2024-12-15');
  const [hora, setHora] = useState(null);
  
  // Cargar barberos al iniciar
  useEffect(() => {
    fetch(`${API_URL}/api/barbers`)
      .then(res => res.json())
      .then(data => setBarberos(data));
  }, []);
  
  // Cargar servicios con precios al iniciar
  useEffect(() => {
    fetch(`${API_URL}/api/services`)
      .then(res => res.json())
      .then(data => setServicios(data));
  }, []);
  
  // Cargar slots cuando se selecciona barbero, servicio y fecha
  useEffect(() => {
    if (barberoSeleccionado && servicioSeleccionado && fecha) {
      fetch(`${API_URL}/api/appointments/available-slots/${barberoSeleccionado}?date=${fecha}&serviceId=${servicioSeleccionado}`)
        .then(res => res.json())
        .then(data => setSlots(data.availableSlots));
    }
  }, [barberoSeleccionado, servicioSeleccionado, fecha]);
  
  const crearReserva = async () => {
    const response = await fetch(`${API_URL}/api/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        barberId: barberoSeleccionado,
        serviceId: servicioSeleccionado,
        clientName: 'Juan Pérez',
        clientPhone: '+54 9 11 1111-2222',
        date: fecha,
        startTime: hora
      })
    });
    
    const resultado = await response.json();
    
    if (response.ok) {
      alert('¡Reserva creada con éxito!');
    } else {
      alert('Error: ' + resultado.error);
    }
  };
  
  return (
    <div>
      <h2>Reservar Turno</h2>
      
      {/* Seleccionar Barbero */}
      <select onChange={(e) => setBarberoSeleccionado(e.target.value)}>
        <option>Selecciona un barbero</option>
        {barberos.map(b => (
          <option key={b.id} value={b.id}>{b.name}</option>
        ))}
      </select>
      
      {/* Seleccionar Servicio */}
      <select onChange={(e) => setServicioSeleccionado(e.target.value)}>
        <option>Selecciona un servicio</option>
        {servicios.map(s => (
          <option key={s.id} value={s.id}>
            {s.name} - ${s.price} ({s.duration} min)
          </option>
        ))}
      </select>
      
      {/* Seleccionar Fecha */}
      <input 
        type="date" 
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
      />
      
      {/* Seleccionar Hora */}
      {slots.length > 0 && (
        <div>
          <h3>Horarios disponibles:</h3>
          {slots.map(slot => (
            <button 
              key={slot} 
              onClick={() => setHora(slot)}
              style={{ 
                backgroundColor: hora === slot ? 'green' : 'white' 
              }}
            >
              {slot}
            </button>
          ))}
        </div>
      )}
      
      {/* Botón de Reservar */}
      <button 
        onClick={crearReserva}
        disabled={!barberoSeleccionado || !servicioSeleccionado || !fecha || !hora}
      >
        Confirmar Reserva
      </button>
    </div>
  );
}
```

---

## 🔐 Notas Importantes

1. **No se requiere autenticación**: La API es pública para permitir que los clientes hagan reservas sin necesidad de crear cuenta.

2. **Validación automática**: La API valida automáticamente:
   - Que el barbero esté disponible
   - Que no sea día no laborable
   - Que esté dentro del horario de trabajo
   - Que no haya otra reserva en ese horario

3. **Formatos requeridos**:
   - Fecha: `YYYY-MM-DD` (ej: `2024-12-15`)
   - Hora: `HH:MM` (ej: `14:30`)
   - Teléfono: Formato libre pero recomendado: `+54 9 11 1234-5678`

4. **Recomendación**: Siempre usar el endpoint de `available-slots` antes de crear una reserva para asegurar que el horario esté disponible.

---

## 🎨 UI/UX Recomendaciones

1. **Flujo sugerido**:
   - Pantalla 1: Selección de barbero
   - Pantalla 2: Selección de servicio
   - Pantalla 3: Calendario con disponibilidad
   - Pantalla 4: Horarios disponibles del día seleccionado
   - Pantalla 5: Datos del cliente
   - Pantalla 6: Confirmación

2. **Mostrar información útil**:
   - 💰 **Precio del servicio** (campo `price` en `/api/services`)
   - ⏱️ **Duración estimada** (campo `duration` en `/api/services`)
   - 👨‍💼 **Nombre del barbero**
   - 📍 **Dirección del local** (obtener de `/api/config` - campo `business_address`)
   - 📞 **Teléfono de contacto** (obtener de `/api/config` - campo `business_phone`)

3. **Feedback al usuario**:
   - Loading mientras se cargan los datos
   - Mensajes claros de error
   - Confirmación visual después de crear la reserva
   - Opción de guardar/compartir los datos de la reserva

---

## 💡 Componente de Precios para UI

```javascript
function PreciosServicios() {
  const [servicios, setServicios] = useState([]);
  
  useEffect(() => {
    fetch('https://be-barberia-production.up.railway.app/api/services')
      .then(res => res.json())
      .then(data => setServicios(data));
  }, []);
  
  return (
    <div className="lista-precios">
      <h2>Nuestros Precios</h2>
      {servicios.map(servicio => (
        <div key={servicio.id} className="servicio-card">
          <h3>{servicio.name}</h3>
          <p>{servicio.description}</p>
          <div className="precio-duracion">
            <span className="precio">${servicio.price}</span>
            <span className="duracion">{servicio.duration} min</span>
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

## ❓ Preguntas Frecuentes

**P: ¿Los precios se actualizan automáticamente?**

R: Sí, cada vez que se carga la lista de servicios desde `/api/services`, se obtienen los precios actuales. Es recomendable cargarlos al inicio de la app y refrescarlos periódicamente.

**P: ¿Cómo muestro solo los días disponibles en el calendario?**

R: Tendrías que consultar los días no laborables y los horarios de trabajo del barbero, pero es más simple dejar que el usuario seleccione cualquier día y mostrar "No hay horarios disponibles" si no hay slots.

**P: ¿Puedo cancelar una reserva desde la app del cliente?**

R: Actualmente no está implementado en este instructivo, pero podrías agregar esa funcionalidad consultando con el equipo de desarrollo.

**P: ¿Cómo sé si una reserva fue confirmada?**

R: Verifica el campo `status` de la reserva. Inicialmente será `PENDING`, luego el personal de la barbería la cambiará a `CONFIRMED`.

---

**¿Dudas?** Contacta al equipo de desarrollo.

