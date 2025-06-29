import React, { useState, useEffect } from "react"
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi"
import { metaMask, walletConnect } from "wagmi/connectors"
import { sepolia } from "wagmi/chains"
import { useAppKit } from "@reown/appkit/react"
import { DebugModal } from "./DebugModal"

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

interface NavBarProps {
  gameState?: string
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
}

export default function NavBar({ gameState, debugInfo }: NavBarProps) {
  const { address, isConnected, chain } = useAccount()
  const { connect, status, variables } = useConnect()
  const { disconnect } = useDisconnect()
  const { open } = useAppKit()

  const { switchChain } = useSwitchChain()

  const [showWalletOptions, setShowWalletOptions] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Auto-switch to Sepolia when wallet connects
  useEffect(() => {
    if (isConnected && chain?.id !== sepolia.id) {
      switchChain({ chainId: sepolia.id })
    }
  }, [isConnected, chain?.id, switchChain])

  const handleConnectMetaMask = () => {
    connect({ connector: metaMask() })
    setShowWalletOptions(false)
  }

  // For WalletConnect, use the AppKit modal
  const handleConnectWalletConnect = () => {
    open()
    setShowWalletOptions(false)
  }

  return (
    <nav
      style={{
        width: "100%",
        background: "#111",
        color: "#39ff14",
        fontFamily: "monospace",
        padding: "0.75rem 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "2px solid #39ff14",
        boxShadow: "0 2px 8px #000a",
        zIndex: 10,
        gap: "2rem"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "2rem", flex: 1 }}>
        <div style={{ fontWeight: "bold", fontSize: "1.2rem", letterSpacing: "2px", flexShrink: 0 }}>
          SADCOIN TERMINAL
        </div>
        
        {/* Debug Information */}
        {debugInfo && (
          <div className="fixed top-28 right-4 bg-black/80 border border-green-400 p-3 rounded text-xs text-green-400 font-mono z-50 max-w-xs">
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
      </div>
      
      <div style={{ position: "relative", flexShrink: 0 }}>
        {!isClient ? (
          <div style={{ height: "40px", width: "120px" }}></div> // Placeholder to prevent layout shift
        ) : !isConnected ? (
          <>
            <button
              onClick={() => setShowWalletOptions((v) => !v)}
              style={{
                background: "#111",
                color: "#39ff14",
                border: "2px solid #39ff14",
                borderRadius: "6px",
                fontFamily: "monospace",
                fontWeight: "bold",
                fontSize: "1rem",
                padding: "0.5rem 1.2rem",
                cursor: "pointer",
                boxShadow: "0 0 8px #39ff14aa inset",
                transition: "background 0.2s, color 0.2s",
              }}
            >
              Connect Wallet
            </button>
            {showWalletOptions && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "110%",
                  background: "#111",
                  border: "2px solid #39ff14",
                  borderRadius: "6px",
                  minWidth: "180px",
                  boxShadow: "0 2px 8px #000a",
                  zIndex: 100,
                }}
              >
                <button
                  onClick={handleConnectMetaMask}
                  style={{
                    width: "100%",
                    background: "none",
                    color: "#39ff14",
                    border: "none",
                    fontFamily: "monospace",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    padding: "0.75rem 1.2rem",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                  disabled={status === "pending" && variables?.connector?.name === "MetaMask"}
                >
                  {status === "pending" && variables?.connector?.name === "MetaMask" ? "Connecting..." : "MetaMask"}
                </button>
                <button
                  onClick={handleConnectWalletConnect}
                  style={{
                    width: "100%",
                    background: "none",
                    color: "#39ff14",
                    border: "none",
                    fontFamily: "monospace",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    padding: "0.75rem 1.2rem",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  WalletConnect
                </button>
              </div>
            )}
          </>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span
              style={{
                background: "#222",
                color: "#39ff14",
                border: "1px solid #39ff14",
                borderRadius: "4px",
                padding: "0.3rem 0.8rem",
                fontFamily: "monospace",
                fontSize: "0.95rem",
                letterSpacing: "1px",
              }}
            >
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </span>
            <DebugModal />
            <button
              onClick={() => disconnect()}
              style={{
                background: "#111",
                color: "#39ff14",
                border: "2px solid #39ff14",
                borderRadius: "6px",
                fontFamily: "monospace",
                fontWeight: "bold",
                fontSize: "1rem",
                padding: "0.3rem 1rem",
                cursor: "pointer",
                boxShadow: "0 0 8px #39ff14aa inset",
                transition: "background 0.2s, color 0.2s",
              }}
            >
              Disconnect
            </button>
          </div>
        )}
      </div>
    </nav>
  )
} 