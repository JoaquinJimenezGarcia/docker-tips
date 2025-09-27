"use client"

import type { ReactNode } from "react"

interface TerminalWindowProps {
  children: ReactNode
}

export function TerminalWindow({ children }: TerminalWindowProps) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-2xl">
      {/* Terminal header */}
      <div className="bg-secondary px-4 py-3 flex items-center gap-2 border-b border-border">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-destructive"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-primary"></div>
        </div>
        <div className="flex-1 text-center">
          <span className="text-sm text-muted-foreground font-mono">docker-tips-terminal</span>
        </div>
      </div>

      {/* Terminal content */}
      <div className="p-6 min-h-[400px] bg-card">{children}</div>
    </div>
  )
}
