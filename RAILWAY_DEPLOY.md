# Guía de Deployment en Railway

## Pasos para desplegar en Railway

### 1. Crear cuenta en Railway

Ve a [railway.app](https://railway.app) y crea una cuenta o inicia sesión.

### 2. Crear nuevo proyecto

1. Click en "New Project"
2. Selecciona "Deploy from GitHub repo"
3. Conecta tu repositorio de GitHub
4. Selecciona el repositorio `BE-velabarberia`

### 3. Agregar PostgreSQL

1. En tu proyecto de Railway, click en "+ New"
2. Selecciona "Database" → "Add PostgreSQL"
3. Railway creará automáticamente la base de datos

### 4. Configurar Variables de Entorno

En el servicio de tu aplicación (no en la base de datos):

1. Ve a la pestaña "Variables"
2. Agrega las siguientes variables:

```
DATABASE_URL=${{Postgres.DATABASE_URL}}
PORT=3000
NODE_ENV=production
ALLOWED_ORIGINS=https://tudominio.com,https://www.tudominio.com
```

**Importante**: 
- `DATABASE_URL` se vincula automáticamente con la base de datos PostgreSQL

### 5. Deploy Automático

Railway detectará automáticamente:
- `package.json` para instalar dependencias
- `nixpacks.toml` para configuración de build
- `railway.json` para comandos de deploy

El deploy se iniciará automáticamente.

### 6. Verificar el Deploy

1. Espera a que termine el build (status: Success)
2. Railway te dará una URL pública (ej: `https://tu-app.up.railway.app`)
3. Prueba el health check: `https://tu-app.up.railway.app/health`

### 7. Generar el Schema de Base de Datos

Una vez desplegado:

1. En Railway, ve a tu servicio → pestaña "Settings"
2. Scroll hasta "Deploy triggers"
3. Copia la "Public URL"
4. Abre una terminal y ejecuta:

```bash
# Opción 1: Usando npx directamente en Railway
# Ve a: Proyecto → Tu Servicio → Pestaña "Settings" → "Deploy" 
# O usa el CLI de Railway

# Opción 2: Desde tu máquina local (con la DATABASE_URL de Railway)
# Copia el DATABASE_URL desde Railway → Variables
# Ejecuta:
DATABASE_URL="<pega-aqui-la-url>" npx prisma db push
```

**Forma más fácil**: Usar el CLI de Railway

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Linkear tu proyecto
railway link

# Push schema a la base de datos
railway run npx prisma db push
```

### 8. Crear datos manualmente

Usa los endpoints de la API para crear profesionales, servicios, horarios y configuraciones según tus necesidades.

### 9. Verificar que todo funciona

```bash
# Health check
curl https://tu-app.up.railway.app/health

# Listar barberos
curl https://tu-app.up.railway.app/api/barbers

# Listar servicios
curl https://tu-app.up.railway.app/api/services
```

## 🔧 Troubleshooting

### Error: Cannot find module '@prisma/client'

Esto significa que el cliente de Prisma no se generó. Verifica:

1. Que `nixpacks.toml` existe en la raíz
2. Que contiene el comando `npx prisma generate` en la fase de build
3. Re-deploya el proyecto

### Error de conexión a la base de datos

1. Verifica que `DATABASE_URL` esté configurada correctamente
2. En Railway: Proyecto → Base de datos PostgreSQL → Connect → Copia la variable
3. Asegúrate de que el servicio de tu app tenga acceso a la variable

### El schema no se aplicó a la base de datos

Si las tablas no existen:

```bash
# Desde tu local (con DATABASE_URL de Railway)
DATABASE_URL="<railway-database-url>" npx prisma db push

# O usando Railway CLI
railway run npx prisma db push
```


## 🚀 Updates y Re-deploys

Railway hace auto-deploy en cada push a la rama principal:

1. Haz cambios en tu código
2. Commit y push a GitHub
3. Railway detectará el cambio y re-desplegará automáticamente

Si necesitas re-generar el cliente de Prisma después de cambios en el schema:

```bash
railway run npx prisma generate
railway run npx prisma db push
```

## 📊 Monitoreo

En Railway puedes ver:

- **Logs**: Pestaña "Deployments" → Click en el deployment → Ver logs
- **Metrics**: CPU, RAM, Network usage
- **Variables**: Todas las variables de entorno configuradas

## 💰 Costos

Railway ofrece:
- **Trial**: $5 de crédito gratis al registrarte
- **Hobby Plan**: $5/mes por servicio después del trial
- PostgreSQL se factura por uso (generalmente muy económico para apps pequeñas)

## 🔐 Seguridad

Para producción:

1. ✅ No compartas las variables de entorno públicamente
2. ✅ Usa HTTPS (Railway lo provee automáticamente)
3. ✅ Considera agregar autenticación JWT para los endpoints sensibles
4. ✅ Configura CORS adecuadamente mediante `ALLOWED_ORIGINS`

## 📱 Conexión con Frontend

Una vez desplegado, tu frontend puede conectarse usando:

```javascript
const API_URL = 'https://tu-app.up.railway.app/api';

// Ejemplo: Obtener barberos
fetch(`${API_URL}/barbers`)
  .then(res => res.json())
  .then(data => console.log(data));
```

---

¿Problemas? Revisa los logs en Railway o abre un issue en el repositorio.

