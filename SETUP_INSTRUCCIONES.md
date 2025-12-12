# 🚀 Guía de Setup - Tu Nuevo Proyecto

## ✅ Respuestas a tus Preguntas

### ¿`npm i` afectará la base de datos?
**NO, `npm i` es completamente seguro.** Solo instala las dependencias de Node.js en la carpeta `node_modules`. **NO toca la base de datos en absoluto.**

La base de datos solo se conecta cuando:
1. Ejecutas el servidor (`npm start` o `npm run dev`)
2. Y tienes configurado el archivo `.env` con tu propia `DATABASE_URL`

### ¿Cómo asegurarme de no afectar el proyecto original?
✅ **Ya estás seguro porque:**
- Borraste el `.git` (no hay conexión con el repo original)
- Cambiaste el nombre de la carpeta
- Este proyecto ahora es completamente independiente

**IMPORTANTE:** Solo afectarás algo si:
- Usas la misma `DATABASE_URL` del proyecto original (NO lo hagas)
- O si compartes el mismo servidor/deploy

## 📋 Pasos para Configurar tu Proyecto

### 1. Instalar Dependencias (SEGURO - No toca la BD)
```bash
npm install
```

### 2. Crear tu archivo `.env`
Crea un archivo `.env` en la raíz del proyecto con tu propia configuración:

```env
# ⚠️ IMPORTANTE: Usa tu propia base de datos
DATABASE_URL="postgresql://usuario:password@localhost:5432/tu_base_de_datos?schema=public"

# Puerto del servidor
PORT=3000

# Entorno
NODE_ENV=development

# CORS - Tus dominios permitidos (separados por comas)
ALLOWED_ORIGINS=http://localhost:3000,https://tudominio.com,https://www.tudominio.com
```

**⚠️ CRÍTICO:** 
- **NO uses** la `DATABASE_URL` del proyecto original
- Crea tu propia base de datos PostgreSQL
- O usa una base de datos diferente en tu servidor

### 3. Generar el Cliente Prisma
```bash
npm run prisma:generate
```

### 4. Crear las Tablas en tu Base de Datos
```bash
# Opción 1: Push directo (recomendado para empezar)
npm run prisma:push

# Opción 2: Migraciones (más controlado)
npm run prisma:migrate
```

### 5. Iniciar el Servidor
```bash
# Desarrollo (con hot-reload)
npm run dev

# Producción
npm start
```

## 🔒 Seguridad y Aislamiento

### Lo que está configurado para protegerte:

1. **CORS Configurable**: 
   - Puedes configurar tus propios dominios mediante `ALLOWED_ORIGINS` en el `.env`
   - Los dominios del proyecto original ya no están hardcodeados como únicos

2. **Base de Datos Independiente**:
   - Cada proyecto usa su propia `DATABASE_URL`
   - No hay riesgo de conflicto si usas bases de datos diferentes

3. **Variables de Entorno**:
   - Todo está configurado mediante `.env`
   - El `.env` está en `.gitignore` (no se sube al repo)

## 🎯 Cambios Realizados para tu Proyecto

1. ✅ **CORS configurable**: Ahora puedes definir tus dominios en `.env`
2. ✅ **Mensaje genérico**: El endpoint raíz ya no menciona "Vela Barbería"
3. ✅ **Documentación**: Esta guía de setup

## 📝 Próximos Pasos

1. Crea tu archivo `.env` con tu propia configuración
2. Crea tu propia base de datos PostgreSQL (o usa una existente diferente)
3. Ejecuta `npm install` (seguro, no toca nada)
4. Ejecuta `npm run prisma:push` para crear las tablas
5. Inicia el servidor con `npm run dev`

## ❓ Preguntas Frecuentes

**P: ¿Puedo usar la misma base de datos del proyecto original?**
R: Técnicamente sí, pero NO es recomendable. Mejor crea una nueva base de datos para evitar conflictos.

**P: ¿Qué pasa si ejecuto `npm start` sin `.env`?**
R: El servidor intentará conectarse pero fallará porque no hay `DATABASE_URL`. Crea el `.env` primero.

**P: ¿Los cambios que haga aquí afectarán el proyecto original?**
R: **NO**, son proyectos completamente independientes ahora.

## 🆘 Si algo sale mal

- Verifica que tu `.env` tenga la `DATABASE_URL` correcta
- Asegúrate de que PostgreSQL esté corriendo
- Revisa los logs del servidor para ver errores específicos
- Verifica que el puerto no esté en uso: `netstat -ano | findstr :3000` (Windows)

---

**¡Listo! Tu proyecto está aislado y listo para usar.** 🎉

