"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DebugPanel } from "./DebugPanel"
import { SimpleTest } from "./SimpleTest"
import { PriceCalculator } from "./PriceCalculator"

interface DebugModalProps {
  debugInfo?: {
    chainId?: number
    sadBalance?: string
    directSadBalance?: string
    sadLoading?: boolean
    directSadLoading?: boolean
    sadError?: Error | null
    directSadError?: Error | null
    address?: string
    isOnSepolia?: boolean
    feelsBalance?: string
    feelsLoading?: boolean
    isConnected?: boolean
  }
  gameState?: string
}

export function DebugModal({ debugInfo, gameState }: DebugModalProps) {
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
          {/* Debug Information */}
          {debugInfo && (
            <div className="bg-black border border-green-400 p-3 rounded text-xs text-green-400 font-mono">
              <div className="font-bold mb-2 text-green-300 border-b border-green-400 pb-1">DEBUG INFO</div>
              
              {/* Game State */}
              {gameState && (
                <div className="mb-2">
                  <div className="flex justify-between items-center">
                    <span className="text-green-300">State:</span>
                    <span className="text-green-400">{gameState}</span>
                  </div>
                </div>
              )}
              
              {/* Wallet and Chain Group */}
              {(debugInfo.address || debugInfo.chainId) && (
                <div className="mb-2">
                  <div className="flex justify-between items-center">
                    <span className="text-green-300">Wallet:</span>
                    <span className="text-green-400">
                      {debugInfo.address ? `${debugInfo.address.slice(0, 6)}...${debugInfo.address.slice(-4)}` : 'Not Connected'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-green-300">Chain:</span>
                    <span className="text-green-400">
                      {debugInfo.chainId} {debugInfo.isOnSepolia ? '(Sepolia)' : ''}
                    </span>
                  </div>
                </div>
              )}

              {/* SAD and Direct Balance Group */}
              {(debugInfo.sadBalance || debugInfo.directSadBalance) && (
                <div className="mb-2">
                  <div className="flex justify-between items-center">
                    <span className="text-green-300">SAD:</span>
                    <span className="text-green-400">
                      {debugInfo.sadLoading ? "..." : debugInfo.sadBalance || "0.0"}
                    </span>
                  </div>
                  {debugInfo.directSadBalance && (
                    <div className="flex justify-between items-center">
                      <span className="text-green-300">Direct:</span>
                      <span className="text-green-400">
                        {debugInfo.directSadLoading ? "..." : debugInfo.directSadBalance}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* FEELS Balance */}
              {debugInfo.feelsBalance && (
                <div className="mb-2">
                  <div className="flex justify-between items-center">
                    <span className="text-green-300">FEELS:</span>
                    <span className="text-green-400">
                      {debugInfo.feelsLoading ? "..." : debugInfo.feelsBalance}
                    </span>
                  </div>
                </div>
              )}

              {/* Connection Status */}
              <div className="flex justify-between items-center">
                <span className="text-green-300">Status:</span>
                <span className={`${debugInfo.isConnected ? 'text-green-400' : 'text-red-400'}`}>
                  {debugInfo.isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>
          )}
          
          <PriceCalculator />
          <SimpleTest />
          <DebugPanel />
        </div>
      </div>
    </div>
  )
}