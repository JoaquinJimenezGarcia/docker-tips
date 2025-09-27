"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

interface DockerTip {
  command: string
  description: string
  explanation: string
}

export function DockerTip() {
  const [tip, setTip] = useState<DockerTip | null>(null)
  const [isTyping, setIsTyping] = useState(true)
  const [displayedCommand, setDisplayedCommand] = useState("")
  const [showCursor, setShowCursor] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch tip from API
  useEffect(() => {
    const fetchTip = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch('/api/docker-tip')
        
        if (!response.ok) {
          throw new Error('Failed to fetch Docker tip')
        }
        
        const tipData = await response.json()
        setTip(tipData)
      } catch (err) {
        console.error('Error fetching tip:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
        
        // Fallback tip
        setTip({
          command: "docker ps",
          description: "List running containers",
          explanation: "This command shows all currently running Docker containers with their details like container ID, image, status, and ports."
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTip()
  }, [])

  // Typewriter effect
  useEffect(() => {
    if (!tip || isLoading) return

    setIsTyping(true)
    setDisplayedCommand("")

    let i = 0
    const typeInterval = setInterval(() => {
      if (i < tip.command.length) {
        setDisplayedCommand(tip.command.slice(0, i + 1))
        i++
      } else {
        setIsTyping(false)
        clearInterval(typeInterval)
      }
    }, 50)

    return () => clearInterval(typeInterval)
  }, [tip, isLoading])

  // Cursor blink
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)

    return () => clearInterval(cursorInterval)
  }, [])

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const getPreviousTip = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch('/api/docker-tip/previous')
      
      if (!response.ok) {
        throw new Error('Failed to fetch previous Docker tip')
      }
      
      const tipData = await response.json()
      setTip(tipData)
    } catch (err) {
      console.error('Error fetching previous tip:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-muted-foreground text-sm">
          <span className="text-primary">docker-tips@terminal</span>
          <span className="text-foreground">:</span>
          <span className="text-blue-400">~</span>
          <span className="text-foreground">$ </span>
          <span className="text-muted-foreground"># {today}</span>
        </div>
        
        <div className="bg-secondary/50 p-4 rounded border border-border">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-primary font-bold">$</span>
            <span className="text-primary font-mono text-lg">
              Loading Docker tip...
              <span className="text-primary terminal-cursor">|</span>
            </span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-muted-foreground text-sm">
          <span className="text-primary">docker-tips@terminal</span>
          <span className="text-foreground">:</span>
          <span className="text-blue-400">~</span>
          <span className="text-foreground">$ </span>
          <span className="text-muted-foreground"># {today}</span>
        </div>
        
        <div className="bg-secondary/50 p-4 rounded border border-border">
          <div className="text-red-400 mb-3">
            Error: {error}
          </div>
          <Button onClick={getPreviousTip} variant="outline" size="sm" className="font-mono text-xs">
            Try Previous Tip
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Terminal prompt with date */}
      <div className="text-muted-foreground text-sm">
        <span className="text-primary">docker-tips@terminal</span>
        <span className="text-foreground">:</span>
        <span className="text-blue-400">~</span>
        <span className="text-foreground">$ </span>
        <span className="text-muted-foreground"># {today}</span>
      </div>

      {/* Command display with typewriter effect */}
      <div className="bg-secondary/50 p-4 rounded border border-border">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-primary font-bold">$</span>
          <span className="text-primary font-mono text-lg">
            {displayedCommand}
            {(isTyping || showCursor) && <span className="text-primary terminal-cursor">|</span>}
          </span>
        </div>

        {!isTyping && tip && (
          <div className="space-y-3 animate-in fade-in duration-500">
            <div className="text-foreground">
              <span className="text-muted-foreground"># </span>
              {tip.description}
            </div>

            <div className="text-muted-foreground text-sm leading-relaxed pl-2 border-l-2 border-primary/30">
              {tip.explanation}
            </div>
          </div>
        )}
      </div>

      {/* Navigation controls */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="text-sm text-muted-foreground">
          Daily Docker Tip
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={getPreviousTip} 
            disabled={isLoading}
            className="font-mono text-xs bg-transparent"
          >
            {isLoading ? "Loading..." : "📚 Get Previous Tip"}
          </Button>
        </div>
      </div>

      {/* Terminal footer */}
      <div className="text-xs text-muted-foreground text-center pt-4 border-t border-border">
        <span className="text-primary">docker-tips-terminal v2.0.0</span> | Powered by{" "}
        <span className="text-primary">Gemini AI</span> | Press{" "}
        <kbd className="px-1 py-0.5 bg-secondary rounded text-xs">Ctrl+C</kbd> to exit
      </div>
    </div>
  )
}
