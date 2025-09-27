#!/usr/bin/env node

/**
 * Script para generar el tip diario de Docker
 * Este script se ejecuta diariamente a las 8 AM
 */

const { DailyTipService } = require('../lib/daily-tip-service')

async function generateDailyTip() {
  try {
    console.log('Starting daily tip generation...')
    
    const dailyTipService = DailyTipService.getInstance()
    const tip = await dailyTipService.getDailyTip()
    
    console.log('Daily tip generated successfully:')
    console.log(`Command: ${tip.command}`)
    console.log(`Description: ${tip.description}`)
    console.log('Tip saved to data/daily-tip.json')
    
  } catch (error) {
    console.error('Error generating daily tip:', error)
    process.exit(1)
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  generateDailyTip()
}

module.exports = { generateDailyTip }

