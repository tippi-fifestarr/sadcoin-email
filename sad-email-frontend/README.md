# SADCOIN presents: Let's Write An Email

A Next.js frontend for the satirical email-writing experience by the SADCOIN Foundation, featuring real-time blockchain integration with Ethereum smart contracts on Sepolia testnet.

## 🎮 Game Overview

"Let's Write An Email" is a semi-fictional, totally-satirical experience by the SADCOIN Foundation where players:
- Purchase SADCoin tokens with ETH at $0.01 each (using Chainlink price feeds)
- Earn FEELS tokens through emotional interactions
- Convert FEELS to additional SADCoin tokens
- Track sadness levels and emotional damage on-chain

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MetaMask or compatible Web3 wallet
- Sepolia testnet ETH for transactions

### Installation
```bash
# Clone and install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your WalletConnect Project ID to .env.local

# Start development server
npm run dev
```

### Environment Setup
Create `.env.local` with:
```
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

Get a free Project ID from [WalletConnect Cloud](https://cloud.walletconnect.com/).

## 🔗 Blockchain Integration

### Smart Contracts (Sepolia Testnet)
- **SADCoin Token**: `0xace84066b7e68f636dac3c3438975de22cf4af20`
- **FEELS Token**: `0xe5180fa5acaf05717d49bf2ec4f6fd0261db92b2`
- **StakingContract**: `0xf62ab5625521f4a9883565b72ddc4f86098f1062`
- **GameRewards**: `0x47bea96317ddcc926696f83db55389898493dbcd`
- **ConversionContract**: `0x2dbfae1ff52735a145bbdfc0822085143bd462e3`
- **NFTClaim**: `0x037feb654b637226b5503a237361d1c3b4de7b30`

### Key Features
- **Auto-Network Switching**: Automatically switches to Sepolia on wallet connection
- **Real-time Price Feeds**: Uses Chainlink ETH/USD oracle for accurate pricing
- **Live Balance Updates**: Real-time token balance monitoring via event watching
- **Purchase Cooldowns**: 24-hour cooldown between SADCoin purchases
- **Debug Interface**: Comprehensive testing tools for developers

## 🛠️ Technical Architecture

### Core Technologies
- **Next.js 14**: React framework with App Router
- **Wagmi v2**: React hooks for Ethereum interactions
- **Viem**: TypeScript Ethereum library
- **TailwindCSS**: Utility-first styling
- **TypeScript**: Type-safe development

### Key Components

#### Contract Integration (`src/lib/contracts.ts`)
- Contract addresses and ABIs
- Network configuration (Sepolia-only)
- Type-safe contract constants

#### React Hooks (`src/hooks/useContracts.ts`)
- `useSADCoinBalance()` - Real-time SAD token balance
- `useFEELSBalance()` - Real-time FEELS token balance
- `usePurchaseCalculation()` - ETH to SAD conversion preview
- `usePurchaseSadness()` - Execute SAD token purchases
- `useConvertFeelsToSad()` - Convert FEELS to SAD tokens
- Event watchers for real-time updates

#### UI Components
- **DebugModal**: Developer testing interface
- **PriceCalculator**: Real-time price calculations
- **NetworkSwitcher**: Automatic Sepolia switching
- **DebugPanel**: Comprehensive blockchain debugging

## 🎯 Game Mechanics

### SADCoin Purchase
1. Connect wallet (auto-switches to Sepolia)
2. Enter ETH amount or desired SAD tokens
3. Preview conversion using real-time ETH/USD price
4. Execute purchase (24-hour cooldown applies)
5. Receive SAD tokens and FEELS tokens

### FEELS to SAD Conversion
- Earn FEELS through game interactions
- Convert FEELS to additional SAD tokens
- Dynamic conversion rate based on contract logic

### Emotional Tracking
- **Sadness Level**: Increases with purchases
- **Emotional Damage**: Accumulates over time
- **Purchase History**: On-chain transaction tracking

## 🔧 Development Tools

### Debug Interface
Access via "🔧 DEBUG" button in navigation:

1. **Price Calculator**
   - Real-time ETH/USD pricing
   - Purchase amount calculations
   - Conversion rate display

2. **Simple Test**
   - Basic contract interaction testing
   - Balance verification
   - Network status checks

3. **Debug Panel**
   - Complete blockchain state monitoring
   - Transaction testing with MetaMask
   - Event watching and status tracking
   - Purchase and conversion testing

### Testing Workflow
1. Connect MetaMask to Sepolia testnet
2. Ensure sufficient Sepolia ETH balance
3. Open debug modal for testing tools
4. Test purchases with small ETH amounts (0.001+ ETH)
5. Monitor real-time balance updates
6. Verify cooldown mechanics

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                 # Shadcn/ui components
│   ├── DebugModal.tsx      # Developer testing interface
│   ├── DebugPanel.tsx      # Blockchain debugging tools
│   ├── PriceCalculator.tsx # Real-time price calculations
│   ├── SimpleTest.tsx      # Basic contract testing
│   ├── NetworkSwitcher.tsx # Network management
│   ├── NavBar.tsx          # Navigation with wallet connection
│   └── WagmiProviders.tsx  # Blockchain provider setup
├── hooks/
│   └── useContracts.ts     # Contract interaction hooks
├── lib/
│   └── contracts.ts        # Contract constants and ABIs
└── email-game.tsx          # Main game interface
```

## 🚨 Troubleshooting

### Common Issues

**MetaMask not triggering for purchases:**
- Ensure sufficient ETH balance (minimum 0.001 ETH recommended)
- Check Sepolia network connection
- Verify contract addresses are correct
- Use debug panel to test with larger ETH amounts

**Network switching issues:**
- Manually add Sepolia to MetaMask if auto-switch fails
- Check WalletConnect Project ID configuration
- Ensure wallet supports programmatic network switching

**Balance not updating:**
- Wait for transaction confirmation (1-2 blocks)
- Check transaction status on Sepolia Etherscan
- Use debug panel refresh functionality

### Debug Steps
1. Open browser console for detailed error logs
2. Use debug modal for step-by-step testing
3. Verify wallet connection and network
4. Check contract interaction logs
5. Monitor transaction status on Etherscan

## 🔮 Future Enhancements

- [ ] Mainnet deployment preparation
- [ ] Enhanced emotional interaction mechanics
- [ ] Leaderboard and social features
- [ ] Mobile wallet optimization
- [ ] Advanced analytics dashboard
- [ ] Multi-chain support

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

*Built with 💔 for the blockchain gaming community*
