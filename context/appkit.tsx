'use client'

import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet } from '@reown/appkit/networks'
import { walletConnect, coinbaseWallet, injected } from 'wagmi/connectors'
import { http, WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID
const metadata = {
  name: 'My Website',
  description: 'My Website description',
  url: 'https://mywebsite.com', // must match your domain
  icons: ['https://avatars.mywebsite.com/']
}

const connectors = [
  walletConnect({ projectId, metadata, showQrModal: false }),
  injected({ shimDisconnect: true }),
  coinbaseWallet({ appName: metadata.name, appLogoUrl: metadata.icons[0] })
]

const networks = [mainnet]

const wagmiAdapter = new WagmiAdapter({
  transports: { [mainnet.id]: http() },
  connectors,
  projectId,
  networks
})

const config = wagmiAdapter.wagmiConfig

createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks,
  features: {
    email: true,
    socials: ['google', 'discord'],
    emailShowWallets: false
  },
  allWallets: 'HIDE'
})

export function ContextProvider({ children }) {
  const queryClient = new QueryClient()
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
} 