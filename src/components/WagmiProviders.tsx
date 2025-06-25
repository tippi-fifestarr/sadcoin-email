"use client"
import { WagmiProvider, createConfig, http } from "wagmi"
import { mainnet, polygon, optimism, arbitrum, base, zora } from "wagmi/chains"
import { metaMask, walletConnect } from "wagmi/connectors"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || ""

const chains = [
  { ...mainnet, transport: http() },
  { ...polygon, transport: http() },
  { ...optimism, transport: http() },
  { ...arbitrum, transport: http() },
  { ...base, transport: http() },
  { ...zora, transport: http() },
]

const wagmiConfig = createConfig({
  connectors: [
    metaMask(),
    walletConnect({ projectId })
  ],
  chains,
})

export default function WagmiProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
    </QueryClientProvider>
  )
} 