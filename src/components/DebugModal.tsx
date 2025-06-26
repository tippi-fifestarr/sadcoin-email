"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DebugPanel } from "./DebugPanel"
import { SimpleTest } from "./SimpleTest"
import { PriceCalculator } from "./PriceCalculator"

export function DebugModal() {
  const [isOpen, setIsOpen] = useState(false)

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-cyan-600 hover:bg-cyan-700 text-black text-sm px-3 py-1 h-auto"
      >
        🔧 DEBUG
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-black border-2 border-green-400 max-w-4xl max-h-[90vh] overflow-auto m-4">
        <div className="flex justify-between items-center p-4 border-b border-green-400">
          <h2 className="text-green-400 font-mono text-lg">BLOCKCHAIN DEBUG CONSOLE</h2>
          <Button
            onClick={() => setIsOpen(false)}
            className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 h-auto"
          >
            ✕ CLOSE
          </Button>
        </div>
        <div className="p-4 space-y-6">
          <PriceCalculator />
          <SimpleTest />
          <DebugPanel />
        </div>
      </div>
    </div>
  )
}