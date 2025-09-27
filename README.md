# Docker Daily Tips Terminal

Una aplicación de Next.js que muestra tips diarios de Docker generados por Gemini AI.

## Características

- 🐳 Tips de Docker generados dinámicamente por Gemini AI
- 💻 Interfaz de terminal elegante con efecto typewriter
- 📁 Sistema de archivos para almacenar tips diarios
- ⏰ Generación automática diaria a las 8:00 AM
- 🔄 Una sola petición a Gemini por día, sin importar el número de usuarios
- 🎨 Diseño moderno con tema oscuro
- ⚡ Respuesta rápida con fallbacks en caso de error

## Configuración

### 1. Instalar dependencias

```bash
pnpm install
```

### 2. Configurar API Key de Gemini

1. Obtén tu API key de [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crea un archivo `.env.local` en la raíz del proyecto:

```bash
GEMINI_API_KEY=tu_api_key_aqui
```

### 3. Ejecutar la aplicación

```bash
pnpm dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## Funcionalidades

- **Tips Diarios**: Cada día se genera un nuevo tip de Docker usando Gemini AI
- **Generación Automática**: El tip se genera automáticamente a las 8:00 AM todos los días
- **Almacenamiento en Archivo**: Los tips se guardan en `data/daily-tip.json` para persistencia
- **Historial Completo**: Todos los tips anteriores se almacenan en `data/tip-history.json`
- **Optimización de API**: Solo una petición a Gemini por día, sin importar el número de usuarios
- **Tips Anteriores**: Acceso aleatorio a tips de días anteriores
- **Fallbacks**: Si hay problemas con la API, se muestran tips de respaldo
- **Interfaz Responsiva**: Funciona perfectamente en desktop y móvil
- **Efecto Typewriter**: Simula la escritura en terminal para mejor experiencia
- **Botón de Historial**: "Get Previous Tip" para obtener tips aleatorios del historial

## Tecnologías

- **Next.js 14** - Framework de React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos
- **Gemini AI** - Generación de contenido
- **Radix UI** - Componentes accesibles

## API

### GET /api/docker-tip

Obtiene el tip del día desde el archivo almacenado.

**Respuesta:**
```json
{
  "command": "docker ps -a",
  "description": "List all containers (running and stopped)",
  "explanation": "This command shows all containers in your system..."
}
```

### GET /api/docker-tip/previous

Obtiene un tip aleatorio del historial de tips anteriores.

**Respuesta:**
```json
{
  "command": "docker ps -a",
  "description": "List all containers (running and stopped)",
  "explanation": "This command shows all containers in your system..."
}
```

### POST /api/docker-tip/force

Fuerza la generación de un nuevo tip (útil para testing).

**Respuesta:**
```json
{
  "success": true,
  "tip": { ... },
  "message": "New tip generated successfully"
}
```

## Configuración de Cron

Para configurar la generación automática diaria a las 8:00 AM:

```bash
# Instalar el cron job
crontab crontab.txt

# Verificar que se instaló
crontab -l
```

El archivo `crontab.txt` contiene la configuración necesaria.

## Desarrollo

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature
3. Haz commit de tus cambios
4. Push a la rama
5. Abre un Pull Request

## Licencia

MIT
