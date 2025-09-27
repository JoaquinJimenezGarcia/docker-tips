# Configuración de la API de Gemini

## Pasos para configurar la aplicación

### 1. Obtener API Key de Gemini

1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Inicia sesión con tu cuenta de Google
3. Crea una nueva API key
4. Copia la API key generada

### 2. Configurar la variable de entorno

Edita el archivo `.env.local` y reemplaza `your_gemini_api_key_here` con tu API key real:

```bash
GEMINI_API_KEY=tu_api_key_real_aqui
```

### 3. Reiniciar la aplicación

Después de configurar la API key, reinicia la aplicación:

```bash
# Detener la aplicación (Ctrl+C)
# Luego ejecutar de nuevo:
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && export PATH="$HOME/.local/share/pnpm:$PATH" && pnpm dev
```

### 4. Verificar funcionamiento

1. Abre http://localhost:3000 en tu navegador
2. Deberías ver un tip de Docker generado por Gemini AI
3. Haz clic en "🔄 New Tip" para generar un nuevo tip

## Notas importantes

- La aplicación usa cache diario, por lo que el mismo tip se mostrará durante todo el día
- Si no hay API key configurada, se mostrará un tip de fallback
- Los tips se generan dinámicamente usando Gemini AI
- La aplicación es completamente funcional sin API key (usando tips de fallback)

## Solución de problemas

### Error: "GEMINI_API_KEY not configured"
- Verifica que el archivo `.env.local` existe
- Asegúrate de que la API key esté correctamente configurada
- Reinicia la aplicación después de cambiar la configuración

### Error de conexión a Gemini
- Verifica tu conexión a internet
- Confirma que la API key es válida
- La aplicación mostrará un tip de fallback si hay problemas

