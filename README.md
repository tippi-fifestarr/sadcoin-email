# 🎮 SADCOIN Presents: Let's Write An Email

> *A productivity tool disguised as a retro terminal game where writing emails becomes an adventure through corporate absurdity*

[![Chainlink](https://img.shields.io/badge/Powered%20by-Chainlink-375BD2?style=for-the-badge)](https://chain.link)
[![Avalanche Fuji](https://img.shields.io/badge/Primary-Avalanche%20Fuji-E84142?style=for-the-badge)](https://testnet.snowtrace.io)
[![Sepolia](https://img.shields.io/badge/Fallback-Sepolia-green?style=for-the-badge)](https://sepolia.etherscan.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

## 🎯 Overview

**Let's Write An Email** is a Web3-enabled productivity game that tricks you into writing emails while you think you're procrastinating. Navigate through four corporate archetypes (Officer, Agent, Monkey, Intern), play intentionally frustrating mini-games, and watch as AI transforms your gameplay into actual emails.

### 🔗 Live Demo
[letswritean.email](https://www.letswritean.email) - Coming Soon (We had build issues)

### 📹 Demo Video
[Hackathon Submission Video](https://youtu.be/rPY2-gUEAUU) - The classic last minute adventure

## 🏗️ Architecture

```
sadcoin-email-game/
├── sad-email-frontend/                    # Next.js React application
│   └── README.md                         # Frontend-specific documentation
├── contracts-immense-pool-of-sadness/    # Solidity smart contracts
│   └── README.md                         # Contract-specific documentation
└── docs/                                 # Additional documentation
```

## 🔗 Chainlink Integration

### **Price Feeds** 
Used for ETH/USD conversion when purchasing SAD tokens
- [Implementation](./contracts-immense-pool-of-sadness/src/ConversionContract.sol)
- Real-time pricing at $0.01 per SAD token

### **VRF (Verifiable Random Function)**
Powers random reward multipliers in mini-games
- [GameRewards Contract](./contracts-immense-pool-of-sadness/src/GameRewards.sol)
- [ConversionContract Daily Rates](./contracts-immense-pool-of-sadness/src/ConversionContract.sol)

### **Automation**
Scheduled tasks for reward distribution
- [StakingContract](./contracts-immense-pool-of-sadness/src/StakingContract.sol)
- Automated FEELS generation at 42/hour per staked SAD

### **Functions** 
Email verification for NFT achievements
- [NFTClaim Contract](./contracts-immense-pool-of-sadness/src/NFTClaim.sol)
- [Coming Soon: Email verification integration]

## 🎮 Web3 Features

### **Smart Contracts**
- **SADCoin**: ERC-20 token tracking sadness levels
- **FEELS**: Emotional rewards token with damage tracking
- **Staking**: Earn FEELS by staking SAD tokens
- **GameRewards**: VRF-powered random rewards
- **ConversionContract**: Token swaps with daily random rates
- **NFTClaim**: Achievement NFTs for email milestones

### **On-Chain Mechanics**
- Purchase SAD tokens with ETH
- Stake SAD to earn FEELS (42/hour)
- Convert FEELS back to SAD at random daily rates
- Claim achievement NFTs for email accomplishments

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MetaMask or Web3 wallet
- Avalanche Fuji testnet AVAX (primary network)
- Sepolia testnet ETH (fallback network)

### Quick Start
```bash
# Clone the repository
git clone https://github.com/yourusername/sadcoin-email-game
cd sadcoin-email-game

# Install frontend dependencies
cd sad-email-frontend
npm install
npm run dev

# In another terminal, work with contracts
cd ../contracts-immense-pool-of-sadness
forge build
forge test
```

## 🤖 AI Integration

### **AWS Bedrock** 
[Coming Soon - Placeholder]
- Multiple LLM personalities for each archetype
- Dynamic email generation based on gameplay

### **ElizaOS Integration**
[Coming Soon - Placeholder]
- Conversational AI for character interactions
- Email coaching and suggestions

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React, TypeScript, TailwindCSS
- **Smart Contracts**: Solidity 0.8.26, Foundry
- **Blockchain**: Multi-network (Avalanche Fuji, Ethereum Sepolia), Wagmi, Viem
- **Oracles**: Chainlink (VRF, Price Feeds, Automation, Functions)
- **AI**: AWS Bedrock, ElizaOS [Coming Soon]

## 📊 Contract Addresses

### Avalanche Fuji (Primary Network)

| Contract | Address |
|----------|---------|
| SADCoin | `0x5FbDB2315678afecb367f032d93F642f64180aa3` |
| FEELS | `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512` |
| StakingContract | `0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0` |
| GameRewards | `0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9` |
| ConversionContract | `0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9` |
| NFTClaim | `0x5FC8d32690cc91D4c39d9d3abcBD16989F875707` |

### Sepolia (Fallback Network)

| Contract | Address |
|----------|---------|
| SADCoin | `0xace84066b7e68f636dac3c3438975de22cf4af20` |
| FEELS | `0xe5180fa5acaf05717d49bf2ec4f6fd0261db92b2` |
| StakingContract | `0xf62ab5625521f4a9883565b72ddc4f86098f1062` |
| GameRewards | `0x47bea96317ddcc926696f83db55389898493dbcd` |
| ConversionContract | `0x2dbfae1ff52735a145bbdfc0822085143bd462e3` |
| NFTClaim | `0x037feb654b637226b5503a237361d1c3b4de7b30` |

## 🌐 Multi-Network Support

The SADCOIN email game now supports multiple blockchain networks with automatic fallback:

### **Primary Network: Avalanche Fuji**
- **Chain ID**: 43113
- **Native Token**: AVAX
- **RPC**: `https://api.avax-test.network/ext/bc/C/rpc`
- **Explorer**: [Snowtrace Testnet](https://testnet.snowtrace.io)

### **Fallback Network: Ethereum Sepolia**
- **Chain ID**: 11155111
- **Native Token**: ETH
- **RPC**: `https://sepolia.drpc.org`
- **Explorer**: [Sepolia Etherscan](https://sepolia.etherscan.io)

### **Network Features**
- **Automatic Detection**: Frontend automatically detects your current network
- **Smart Contract Mapping**: Same contracts deployed on both networks
- **Seamless Switching**: Switch between networks without losing progress
- **Network Status Display**: Real-time network information in the UI

## � Game Features

- **4 Corporate Archetypes**: Each with unique personality and mini-game
- **Dynamic Story Generation**: AI adapts based on your choices
- **Intentionally Buggy Mini-games**: Frustration drives productivity
- **Real Email Output**: Actually sends usable emails to your inbox
- **Blockchain Rewards**: Earn tokens for being productively sad
- **Multi-Network Support**: Play on Avalanche Fuji or Ethereum Sepolia

## 👥 Team

- **Tippi Fifestarr** - Product Lead & "Whatever It Takes"
- **Jason** - Creative Director & Game Design
- **Wil** - Frontend Developer
- **Chrome/Vasiliy** - Smart Contract Developer

## 🏆 Hackathon Submission

Built for **Chainlink Chromion Hackathon 2025**

### Key Innovations
- First gamified email writer on blockchain
- Novel use of Chainlink VRF for "productive randomness"
- Emotional damage tracking as on-chain reputation
- Procrastination-to-productivity conversion mechanism
- Multi-network blockchain support with automatic fallback

## 🔄 Migration Notes

### Avalanche Fuji Migration (January 2025)
The SADCOIN email game has been migrated from Sepolia-only to multi-network support:

- **Primary Network**: Avalanche Fuji (Chain ID: 43113)
- **Fallback Network**: Ethereum Sepolia (Chain ID: 11155111)
- **Smart Contracts**: Deployed on both networks with identical functionality
- **Frontend**: Updated with network-aware contract management
- **Wallet Integration**: Prioritizes Avalanche Fuji, falls back to Sepolia

### Technical Implementation
- Network-aware contract address mapping
- Dynamic RPC endpoint selection
- Automatic network detection and switching
- Real-time network status display
- Cross-network compatibility maintained

## 📄 License

This project is proprietary software owned by SADCOIN. All rights reserved.

No permission is granted to use, copy, modify, or distribute this software without explicit written permission from SADCOIN.

## 🔗 Links

- [Frontend Documentation](./sad-email-frontend/README.md)
- [Smart Contract Documentation](./contracts-immense-pool-of-sadness/README.md)
- [Live Application](https://letswritean.email)
- [Game Design Document](https://docs.google.com/presentation/d/1MeTqPrfJGQR_Uc70N27OEhlDWeDzmbjMLyvjaQyDbAo/edit?usp=sharing)

---

*Remember: In the SADCOIN ecosystem, being sad is actually good. The sadder you are, the more productive you become!* 😢
