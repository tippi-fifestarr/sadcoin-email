"use client"
import { WagmiProvider, createConfig, http } from "wagmi"
import { sepolia, avalancheFuji } from "wagmi/chains"
import { metaMask, walletConnect } from "wagmi/connectors"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || ""

// Multi-network support: Avalanche Fuji (primary) and Sepolia (fallback)
const wagmiConfig = createConfig({
  chains: [avalancheFuji, sepolia],
  connectors: [
    metaMask(),
    walletConnect({ projectId })
  ],
  transports: {
    [avalancheFuji.id]: http('https://api.avax-test.network/ext/bc/C/rpc'),
    [sepolia.id]: http('https://sepolia.drpc.org')
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