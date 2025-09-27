# Docker Deployment Guide

Esta guía te ayudará a desplegar la aplicación Docker Tips usando Docker.

## 🚀 Despliegue Rápido

### 1. Configurar Variables de Entorno

```bash
# Copiar el archivo de ejemplo
cp env.example .env

# Editar el archivo .env y agregar tu API key de Gemini
nano .env
```

### 2. Desplegar con Docker Compose

```bash
# Ejecutar el script de despliegue
./deploy.sh
```

O manualmente:

```bash
# Construir y ejecutar
docker-compose up --build -d

# Verificar que esté funcionando
curl http://localhost:3030/api/docker-tip
```

## 📋 Comandos Útiles

### Gestión del Contenedor

```bash
# Ver logs en tiempo real
docker-compose logs -f

# Detener la aplicación
docker-compose down

# Reiniciar la aplicación
docker-compose restart

# Ver estado de los contenedores
docker-compose ps
```

### Gestión de Volúmenes

```bash
# Ver volúmenes
docker volume ls

# Inspeccionar volumen de datos
docker volume inspect docker-terminal-tips_docker-tips-data

# Hacer backup de los datos
docker run --rm -v docker-terminal-tips_docker-tips-data:/data -v $(pwd):/backup alpine tar czf /backup/data-backup.tar.gz -C /data .
```

## 🔧 Configuración Avanzada

### Variables de Entorno

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `GEMINI_API_KEY` | API key de Gemini AI | Requerido |
| `NODE_ENV` | Entorno de Node.js | `production` |
| `PORT` | Puerto de la aplicación | `3030` |

### Volúmenes

- **`docker-tips-data`**: Almacena los tips diarios y el historial
- **`docker-tips-logs`**: Almacena los logs del cron job

### Cron Job

El contenedor ejecuta automáticamente un cron job que:
- Se ejecuta todos los días a las 8:00 AM
- Genera un nuevo tip usando Gemini AI
- Guarda el tip en el volumen persistente

## 🐛 Solución de Problemas

### La aplicación no inicia

```bash
# Ver logs detallados
docker-compose logs

# Verificar que el puerto 3030 esté libre
netstat -tulpn | grep 3030
```

### El cron job no funciona

```bash
# Verificar logs del cron
docker-compose exec docker-tips cat /app/logs/cron.log

# Verificar que el cron esté corriendo
docker-compose exec docker-tips ps aux | grep cron
```

### Problemas con la API de Gemini

```bash
# Verificar que la API key esté configurada
docker-compose exec docker-tips env | grep GEMINI_API_KEY

# Probar la API manualmente
docker-compose exec docker-tips node scripts/generate-daily-tip.js
```

## 🔄 Actualización

Para actualizar la aplicación:

```bash
# Detener la aplicación actual
docker-compose down

# Actualizar el código
git pull

# Reconstruir y ejecutar
./deploy.sh
```

## 📊 Monitoreo

### Health Check

La aplicación incluye un health check que verifica:
- Que la aplicación responda en el puerto 3030
- Que la API `/api/docker-tip` funcione correctamente

### Logs

```bash
# Ver logs de la aplicación
docker-compose logs -f docker-tips

# Ver logs del cron job
docker-compose exec docker-tips tail -f /app/logs/cron.log
```

## 🔒 Seguridad

### Recomendaciones

1. **API Key**: Nunca commitees tu API key al repositorio
2. **Puerto**: Considera usar un proxy reverso (nginx) para producción
3. **Volúmenes**: Los datos se almacenan localmente, haz backups regulares

### Firewall

Si usas un firewall, asegúrate de abrir el puerto 3030:

```bash
# UFW (Ubuntu)
sudo ufw allow 3030

# iptables
sudo iptables -A INPUT -p tcp --dport 3030 -j ACCEPT
```

## 📈 Escalabilidad

Para producción, considera:

1. **Proxy Reverso**: Usar nginx o traefik
2. **SSL/TLS**: Configurar HTTPS
3. **Monitoreo**: Integrar con sistemas de monitoreo
4. **Backups**: Automatizar backups de los volúmenes

