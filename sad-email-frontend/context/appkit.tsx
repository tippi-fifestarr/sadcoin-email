'use client'

import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { sepolia, avalancheFuji } from '@reown/appkit/networks'
import { walletConnect, coinbaseWallet, injected } from 'wagmi/connectors'
import { http, WagmiProvider, cookieToInitialState } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { type ReactNode } from 'react'

export const projectId = "fe55eee8f74c6e7996b8e0f1b96d6895";

if (!projectId) {
  throw new Error('Project ID is not defined')
}

const metadata = {
  name: 'SadCoin Email Frontend',
  description: 'SadCoin Email Frontend',
  url: 'http://localhost:3000', // Update this to match your domain
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

const connectors = [
  walletConnect({ projectId, metadata, showQrModal: false }),
  injected({ shimDisconnect: true }),
  coinbaseWallet({ appName: metadata.name, appLogoUrl: metadata.icons[0] })
]

const networks = [avalancheFuji, sepolia]

const wagmiAdapter = new WagmiAdapter({
  transports: {
    [avalancheFuji.id]: http('https://api.avax-test.network/ext/bc/C/rpc'),
    [sepolia.id]: http('https://sepolia.drpc.org')
  },
  connectors,
  projectId,
  networks
})

const config = wagmiAdapter.wagmiConfig

// Create the modal
createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [avalancheFuji, sepolia],
  metadata,
  features: {
    email: false,
    socials: ['google', 'discord', 'github'],
    emailShowWallets: false
  },
  allWallets: 'HIDE'
})

function ContextProvider({ children, cookies }: { children: ReactNode; cookies: string | null }) {
  const queryClient = new QueryClient()
  const initialState = cookieToInitialState(config, cookies)

  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}

export default ContextProvider 