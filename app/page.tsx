"use client"

import { useState, useEffect } from "react"
import { TerminalWindow } from "@/components/terminal-window"
import { DockerTip } from "@/components/docker-tip"

export default function HomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <main className="min-h-screen bg-black p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl md:text-4xl font-bold terminal-glow mb-2 font-mono">Docker Daily Tips Terminal</h1>
          <p className="terminal-text text-sm md:text-base font-mono">{">"} Improve your Docker skills every day</p>
        </div>

        <TerminalWindow>
          <DockerTip />
        </TerminalWindow>
      </div>
    </main>
  )
}
