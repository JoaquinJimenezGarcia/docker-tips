import { GoogleGenerativeAI } from '@google/generative-ai'
import { promises as fs } from 'fs'
import path from 'path'

interface DockerTip {
  command: string
  description: string
  explanation: string
}

interface TipData {
  tip: DockerTip
  date: string
  generatedAt: string
}

interface TipHistory {
  currentTip: TipData
  history: TipData[]
}

const DATA_DIR = path.join(process.cwd(), 'data')
const TIP_FILE = path.join(DATA_DIR, 'daily-tip.json')
const HISTORY_FILE = path.join(DATA_DIR, 'tip-history.json')

export class DailyTipService {
  private static instance: DailyTipService
  private isGenerating = false

  private constructor() {}

  static getInstance(): DailyTipService {
    if (!DailyTipService.instance) {
      DailyTipService.instance = new DailyTipService()
    }
    return DailyTipService.instance
  }

  /**
   * Obtiene el tip del día, generándolo si es necesario
   */
  async getDailyTip(): Promise<DockerTip> {
    try {
      // Verificar si ya existe un tip para hoy
      const existingTip = await this.getExistingTip()
      if (existingTip) {
        return existingTip.tip
      }

      // Si no hay tip para hoy, generar uno nuevo
      return await this.generateNewTip()
    } catch (error) {
      console.error('Error getting daily tip:', error)
      return this.getFallbackTip()
    }
  }

  /**
   * Obtiene un tip aleatorio del historial
   */
  async getRandomPreviousTip(): Promise<DockerTip> {
    try {
      const history = await this.getTipHistory()
      
      if (history.history.length === 0) {
        // Si no hay historial, devolver el tip actual
        return history.currentTip.tip
      }

      // Seleccionar un tip aleatorio del historial
      const randomIndex = Math.floor(Math.random() * history.history.length)
      return history.history[randomIndex].tip
    } catch (error) {
      console.error('Error getting random previous tip:', error)
      return this.getFallbackTip()
    }
  }

  /**
   * Verifica si es hora de generar un nuevo tip (8 AM)
   */
  private shouldGenerateNewTip(): boolean {
    const now = new Date()
    const hour = now.getHours()
    const minute = now.getMinutes()
    
    // Generar entre 8:00 AM y 8:59 AM
    return hour === 8 && minute < 60
  }

  /**
   * Obtiene el tip existente del archivo
   */
  private async getExistingTip(): Promise<TipData | null> {
    try {
      const data = await fs.readFile(TIP_FILE, 'utf-8')
      const tipData: TipData = JSON.parse(data)
      
      const today = new Date().toISOString().split('T')[0]
      
      // Si el tip es de hoy, devolverlo
      if (tipData.date === today) {
        return tipData
      }
      
      return null
    } catch (error) {
      // Si no existe el archivo o hay error, devolver null
      return null
    }
  }

  /**
   * Obtiene el historial completo de tips
   */
  private async getTipHistory(): Promise<TipHistory> {
    try {
      const data = await fs.readFile(HISTORY_FILE, 'utf-8')
      return JSON.parse(data)
    } catch (error) {
      // Si no existe el archivo, crear uno nuevo
      const fallbackTip = this.getFallbackTip()
      const today = new Date().toISOString().split('T')[0]
      const now = new Date().toISOString()
      
      const newHistory: TipHistory = {
        currentTip: {
          tip: fallbackTip,
          date: today,
          generatedAt: now
        },
        history: []
      }
      
      await this.saveTipHistory(newHistory)
      return newHistory
    }
  }

  /**
   * Genera un nuevo tip usando Gemini AI
   */
  private async generateNewTip(): Promise<DockerTip> {
    // Evitar múltiples generaciones simultáneas
    if (this.isGenerating) {
      // Esperar un poco y volver a intentar
      await new Promise(resolve => setTimeout(resolve, 1000))
      const existingTip = await this.getExistingTip()
      if (existingTip) {
        return existingTip.tip
      }
    }

    this.isGenerating = true

    try {
      const apiKey = process.env.GEMINI_API_KEY
      
      if (!apiKey || apiKey === 'your_gemini_api_key_here') {
        console.log('No valid API key, using fallback tip')
        return this.getFallbackTip()
      }

      // Inicializar Gemini
      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

      // Prompt para obtener un tip de Docker
      const prompt = `
Generate a useful Docker command tip for today. Return ONLY a JSON object with this exact structure:
{
  "command": "docker command here",
  "description": "Brief description of what the command does",
  "explanation": "Detailed explanation of when and why to use this command"
}

Make sure the command is practical and useful for Docker users. Choose from common Docker operations like:
- Container management (run, stop, start, remove)
- Image operations (build, pull, push, tag)
- Volume and network management
- Docker Compose operations
- System maintenance and cleanup
- Debugging and monitoring

The command should be real and functional. Do not include any markdown formatting or additional text.
`

      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      // Parsear la respuesta JSON
      let tip: DockerTip
      try {
        // Limpiar la respuesta por si tiene markdown
        const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
        tip = JSON.parse(cleanText)
      } catch (parseError) {
        console.error('Error parsing Gemini response:', parseError)
        console.error('Raw response:', text)
        tip = this.getFallbackTip()
      }

      // Validar estructura del tip
      if (!tip.command || !tip.description || !tip.explanation) {
        throw new Error('Invalid tip structure from Gemini')
      }

      // Guardar el tip en el archivo y actualizar historial
      await this.saveTip(tip)

      console.log(`Generated new daily tip: ${tip.command}`)
      return tip

    } catch (error) {
      console.error('Error generating tip with Gemini:', error)
      return this.getFallbackTip()
    } finally {
      this.isGenerating = false
    }
  }

  /**
   * Guarda el tip en el archivo y actualiza el historial
   */
  private async saveTip(tip: DockerTip): Promise<void> {
    const today = new Date().toISOString().split('T')[0]
    const now = new Date().toISOString()
    
    const tipData: TipData = {
      tip,
      date: today,
      generatedAt: now
    }

    // Asegurar que el directorio existe
    await fs.mkdir(DATA_DIR, { recursive: true })
    
    // Guardar el archivo del tip actual
    await fs.writeFile(TIP_FILE, JSON.stringify(tipData, null, 2))

    // Actualizar el historial
    await this.updateTipHistory(tipData)
  }

  /**
   * Actualiza el historial de tips
   */
  private async updateTipHistory(newTip: TipData): Promise<void> {
    try {
      const history = await this.getTipHistory()
      
      // Si el tip actual es diferente al nuevo, mover el actual al historial
      if (history.currentTip.date !== newTip.date) {
        history.history.push(history.currentTip)
      }
      
      // Actualizar el tip actual
      history.currentTip = newTip
      
      // Guardar el historial actualizado
      await this.saveTipHistory(history)
    } catch (error) {
      console.error('Error updating tip history:', error)
    }
  }

  /**
   * Guarda el historial de tips
   */
  private async saveTipHistory(history: TipHistory): Promise<void> {
    await fs.writeFile(HISTORY_FILE, JSON.stringify(history, null, 2))
  }

  /**
   * Tip de fallback en caso de error
   */
  private getFallbackTip(): DockerTip {
    const fallbackTips = [
      {
        command: "docker ps -a",
        description: "List all containers (running and stopped)",
        explanation: "This command shows all containers in your system, both running and stopped. Use -a flag to see stopped containers too. Essential for container management and debugging."
      },
      {
        command: "docker system prune -a",
        description: "Clean up all unused containers, networks, images and cache",
        explanation: "This command is perfect for freeing up disk space when Docker has accumulated many unused resources. Use with caution as it removes all unused data."
      },
      {
        command: "docker logs --follow <container>",
        description: "Follow container logs in real time",
        explanation: "Useful for debugging and monitoring. The --follow flag keeps the connection open to see new logs as they appear."
      },
      {
        command: "docker exec -it <container> /bin/bash",
        description: "Access container shell interactively",
        explanation: "Allows you to run commands inside the container as if it were a virtual machine. Essential for debugging and troubleshooting."
      },
      {
        command: "docker stats",
        description: "Show real-time resource usage statistics",
        explanation: "Perfect for monitoring CPU, memory, network and I/O of all active containers. Great for performance analysis."
      }
    ]

    // Seleccionar un tip de fallback basado en el día de la semana
    const dayOfWeek = new Date().getDay()
    return fallbackTips[dayOfWeek % fallbackTips.length]
  }

  /**
   * Fuerza la generación de un nuevo tip (útil para testing)
   */
  async forceGenerateNewTip(): Promise<DockerTip> {
    // Eliminar el archivo existente para forzar nueva generación
    try {
      await fs.unlink(TIP_FILE)
    } catch (error) {
      // El archivo no existe, no hay problema
    }
    
    return await this.generateNewTip()
  }
}
