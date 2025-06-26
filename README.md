# 😢 SadCoin - The Saddest DeFi Project on Ethereum

A comprehensive smart contract ecosystem for "Let's Write an E-Mail - The Game" where sadness is actually good and happiness is discouraged.

## 🎭 Project Overview

SadCoin is a satirical productivity RPG that mimics corporate tools while secretly being an RPG. Players write fake emails, complete absurd mini-games, and receive AI feedback, all while earning increasingly sad tokens and achievements.

## 🏗️ Architecture

### Core Tokens

- **SADCoin ($SAD)** - Primary currency used to play the game and stake for rewards
- **FEELS** - Emotional token earned through staking or completing minigames

### Smart Contracts

1. **SADCoin.sol** - ERC-20 token with sad-themed functions
2. **FEELS.sol** - ERC-20 token for emotional rewards with damage tracking
3. **StakingContract.sol** - Stake SADCoin to earn FEELS with Chainlink Automation
4. **GameRewards.sol** - Complete games to earn FEELS with Chainlink VRF randomness
5. **ConversionContract.sol** - Convert between tokens with Chainlink Price Feeds
6. **NFTClaim.sol** - Claim achievement NFTs based on email interactions

### Chainlink Integrations

- **VRF v2.5 (Verifiable Random Function)** - Used in GameRewards and ConversionContract for random outcomes with subscription model
- **Price Feeds** - Used in ConversionContract for ETH/USD or AVAX/USD pricing to purchase SADCoin
- **Automation** - Used in StakingContract and ConversionContract for automated operations
- **Functions** - Used in NFTClaim for off-chain email verification

## 🚀 Getting Started

### Prerequisites

- [Foundry](https://getfoundry.sh/) installed
- [Git](https://git-scm.com/) installed
- Basic understanding of Solidity and smart contracts

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd sadcoind
```

2. Install dependencies:
```bash
forge install
```

3. Compile contracts:
```bash
forge build
```

4. Run tests:
```bash
forge test
```

## 📋 Deployment Guide

### Environment Setup

1. Create a `.env` file with your private key:
```env
PRIVATE_KEY=0x...
```

2. Update contract addresses in deployment scripts with actual Chainlink service addresses for your target network.

### Sepolia Testnet Deployment

```bash
forge script script/DeploySepolia.s.sol:DeploySepoliaScript --rpc-url sepolia --broadcast --verify
```

### Avalanche Mainnet Deployment

```bash
forge script script/DeployAvalanche.s.sol:DeployAvalancheScript --rpc-url avalanche --broadcast --verify
```

### Generic Deployment (Other Networks)

```bash
forge script script/Deploy.s.sol:DeployScript --rpc-url <network> --broadcast --verify
```

### Post-Deployment Setup

1. **Configure Chainlink VRF v2.5**:
   - Create subscription at [vrf.chain.link](https://vrf.chain.link/)
   - Add deployed contracts as VRF consumers
   - Fund VRF subscription with LINK tokens
   - Note: Contracts use subscription model with LINK payment

2. **Set up Chainlink Automation**:
   - Register StakingContract for reward distribution
   - Register ConversionContract for daily rate updates

3. **Configure Chainlink Functions**:
   - Set up email verification endpoints
   - Update NFTClaim contract with proper router address

### Network-Specific VRF v2.5 Addresses

**Sepolia Testnet:**
- VRF Coordinator: `0x5CE8D5A2BC84beb22a398CCA51996F7930313D61`
- Key Hash: `0x1770bdc7eec7771f7ba4ffd640f34260d7f095b79c92d34a5b2551d6f6cfd2be`
- LINK Token: `0xb1D4538B4571d411F07960EF2838Ce337FE1E80E`

**Avalanche Mainnet:**
- VRF Coordinator: `0xE40895D055bccd2053dD0638C9695E326152b1A4`
- Key Hash (500 gwei): `0x84213dcadf1f89e4097eb654e3f284d7d5d5bda2bd4748d8b7fada5b3a6eaa0d`
- LINK Token: `0x5947BB275c521040051D82396192181b413227A3`

## 🎮 How to Use

### For Players

1. **Purchase SADCoin**: Send ETH to ConversionContract to buy SAD at $0.01 each
2. **Stake for Rewards**: Stake SADCoin in StakingContract to earn FEELS over time
3. **Play Games**: Complete minigames through GameRewards to earn bonus FEELS
4. **Convert Tokens**: Convert FEELS back to SADCoin at daily random rates
5. **Claim NFTs**: Achieve email-based milestones to claim sad achievement NFTs

### For Developers

#### Interact with SADCoin
```solidity
// Mint sadness to an address (only authorized minters)
sadCoin.mintSadness(recipient, amount);

// Burn tokens with a sad reason
sadCoin.burnWithSadReason(amount, "Lost my job, very sad");

// Check someone's sadness level
uint256 sadness = sadCoin.getSadnessLevel(user);
```

#### Interact with FEELS
```solidity
// Generate feelings (only authorized minters)
feels.generateFeelings(user, amount, "Staking rewards");

// Voluntary suffering
feels.sufferVoluntarily(amount, "Self-inflicted emotional damage");

// Check emotional damage
uint256 damage = feels.getEmotionalDamage(user);
```

#### Staking Operations
```solidity
// Stake sadness
staking.stakeSadness(amount);

// Request unstake (requires waiting period)
staking.requestUnstake();

// Harvest feelings
staking.harvestFeelings();
```

## 🎯 Game Economics

### Conversion Rates
The system uses 5 predetermined "sad" conversion rates that change daily via Chainlink VRF:
- 11 FEELS = 1 SAD (least sad)
- 42 FEELS = 1 SAD (moderately sad)
- 69 FEELS = 1 SAD (quite sad)
- 111 FEELS = 1 SAD (very sad)
- 420 FEELS = 1 SAD (ultimate sadness)

### Staking Rewards
- Base rate: 42 FEELS per hour per staked SAD
- Minimum stake: 69 SAD
- Unstaking delay: 7 hours (420 minutes of sadness)

### Game Rewards
- Base reward: 111 FEELS
- Score-based multipliers (inverse relationship - lower scores get more rewards)
- Random multipliers from 0.5x to 4.2x via Chainlink VRF

## 📊 Contract Addresses

Update these addresses after deployment:

### Sepolia Testnet
- SADCoin: `TBD`
- FEELS: `TBD`
- StakingContract: `TBD`
- GameRewards: `TBD`
- ConversionContract: `TBD`
- NFTClaim: `TBD`

### Mainnet
- SADCoin: `TBD`
- FEELS: `TBD`
- StakingContract: `TBD`
- GameRewards: `TBD`
- ConversionContract: `TBD`
- NFTClaim: `TBD`

## 🧪 Testing

Run the comprehensive test suite:

```bash
# Run all tests
forge test

# Run tests with verbosity
forge test -vvv

# Run specific test file
forge test --match-path test/SADCoin.t.sol

# Run specific test function
forge test --match-test testMintSadness
```

## 📈 Gas Optimization

The contracts use Solidity 0.8.26 with:
- Optimizer enabled (200 runs)
- Via-IR compilation for complex contracts
- ReentrancyGuard for security
- Efficient storage patterns

## 🔐 Security Considerations

- All contracts use OpenZeppelin's battle-tested libraries
- Access control via Ownable and AccessControl patterns
- ReentrancyGuard protection on state-changing functions
- Chainlink services for secure randomness and data feeds
- Comprehensive test coverage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-sadness`
3. Commit your changes: `git commit -am 'Add some amazing sadness'`
4. Push to the branch: `git push origin feature/amazing-sadness`
5. Submit a pull request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎭 Acknowledgments

- Built for the Chainlink Hackathon
- Inspired by corporate email culture and the inherent sadness of productivity tools
- Special thanks to the Chainlink team for their incredible developer tools
- Powered by Foundry for the best Solidity development experience

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Review the [Foundry documentation](https://book.getfoundry.sh/)
3. Consult the [Chainlink documentation](https://docs.chain.link/)

---

*Remember: In SadCoin, being sad is actually good. The sadder you are, the more rewards you earn!* 😢

## 🏆 Achievements Available

The NFTClaim contract includes 10 different sad achievements:

1. **First Email** - Sent your first corporate email
2. **Procrastination Master** - Took over 24 hours to reply  
3. **Emotional Damage** - Received a harsh email
4. **Corporate Drone** - Sent 100+ emails
5. **Weekend Warrior** - Sent email on weekend
6. **Midnight Oil** - Sent email after midnight
7. **Reply All Disaster** - Used reply-all incorrectly
8. **Autocorrect Victim** - Autocorrect made you look like a fool
9. **Meeting Scheduler** - Scheduled 50+ meetings
10. **Out of Office Master** - Crafted the perfect OOO message

Each achievement has a sadness level from 1-10, with higher levels being more prestigious!