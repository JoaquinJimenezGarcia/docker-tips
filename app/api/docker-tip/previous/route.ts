import { NextRequest, NextResponse } from 'next/server'
import { DailyTipService } from '@/lib/daily-tip-service'

export async function GET(request: NextRequest) {
  try {
    const dailyTipService = DailyTipService.getInstance()
    const tip = await dailyTipService.getRandomPreviousTip()
    
    return NextResponse.json(tip)
  } catch (error) {
    console.error('Error getting previous tip:', error)
    
    // Fallback tip en caso de error
    const fallbackTip = {
      command: "docker ps -a",
      description: "List all containers (running and stopped)",
      explanation: "This command shows all containers in your system, both running and stopped. Use -a flag to see stopped containers too. Essential for container management and debugging."
    }

    return NextResponse.json(fallbackTip)
  }
}

