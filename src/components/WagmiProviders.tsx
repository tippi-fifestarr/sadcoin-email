"use client"
import { WagmiProvider, createConfig, http } from "wagmi"
import { sepolia } from "wagmi/chains"
import { metaMask, walletConnect } from "wagmi/connectors"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || ""

// Sepolia testnet only for development and testing
const wagmiConfig = createConfig({
  chains: [sepolia],
  connectors: [
    metaMask(),
    walletConnect({ projectId })
  ],
  transports: {
    [sepolia.id]: http()
  }
})

export default function WagmiProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
    </QueryClientProvider>
  )
} 