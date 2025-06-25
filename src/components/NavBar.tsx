import React, { useState } from "react"
import { useAccount, useConnect, useDisconnect } from "wagmi"
import { metaMask, walletConnect } from "wagmi/connectors"

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

export default function NavBar() {
  const { address, isConnected } = useAccount()
  const { connect, status, variables } = useConnect()
  const { disconnect } = useDisconnect()
  const [showWalletOptions, setShowWalletOptions] = useState(false)

  const handleConnectMetaMask = () => {
    connect({ connector: metaMask() })
    setShowWalletOptions(false)
  }
  const handleConnectWalletConnect = () => {
    connect({ connector: walletConnect({ projectId }) })
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
      }}
    >
      <div style={{ fontWeight: "bold", fontSize: "1.2rem", letterSpacing: "2px" }}>
        SADCOIN TERMINAL
      </div>
      <div style={{ position: "relative" }}>
        {!isConnected ? (
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
                  disabled={status === "pending" && variables?.connector?.name === "WalletConnect"}
                >
                  {status === "pending" && variables?.connector?.name === "WalletConnect" ? "Connecting..." : "WalletConnect"}
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