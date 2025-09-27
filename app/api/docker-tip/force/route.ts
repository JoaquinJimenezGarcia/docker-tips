import { NextRequest, NextResponse } from 'next/server'
import { DailyTipService } from '@/lib/daily-tip-service'

export async function POST(request: NextRequest) {
  try {
    const dailyTipService = DailyTipService.getInstance()
    const tip = await dailyTipService.forceGenerateNewTip()
    
    return NextResponse.json({
      success: true,
      tip,
      message: 'New tip generated successfully'
    })
  } catch (error) {
    console.error('Error forcing new tip generation:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate new tip',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

