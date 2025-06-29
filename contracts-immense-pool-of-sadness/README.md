# 😢 SadCoin - The Saddest DeFi Project on Ethereum

A comprehensive smart contract ecosystem for "Let's Write an E-Mail - The Game" where sadness is actually good and happiness is discouraged.

## 🎭 Project Overview

SadCoin is a satirical productivity RPG that mimics corporate tools while secretly being an RPG. Players write fake emails, complete absurd mini-games, and receive AI feedback, all while earning increasingly sad tokens and achievements.

## 🏗️ Architecture

### Core Tokens

- **SADCoin ($SAD)** - Primary currency used to play the game and stake for rewards (because making money from sadness is peak capitalism)
- **FEELS** - Emotional token earned through staking or completing minigames (the more you feel, the sadder you get)

### Smart Contracts

1. **SADCoin.sol** - ERC-20 token with sad-themed functions
2. **FEELS.sol** - ERC-20 token for emotional rewards with damage tracking
3. **StakingContract.sol** - Stake SADCoin to earn FEELS with Chainlink Automation
4. **GameRewards.sol** - Complete games to earn FEELS with Chainlink VRF randomness
5. **ConversionContract.sol** - Convert between tokens with Chainlink Price Feeds
6. **NFTClaim.sol** - Claim achievement NFTs based on email interactions

## 😭 Detailed Contract Guide for Frontend Developers

*"The only thing sadder than reading documentation is not reading it and breaking everything"*

### 📧 SADCoin Contract - The Foundation of Sadness

**What it does**: SADCoin is our primary ERC-20 token that tracks not just your balance, but your "sadness level" - because in this ecosystem, the more you spend and transfer, the sadder you become (and that's actually good!).

**Key Functions for Frontend:**

#### Core Token Operations
```solidity
// Standard ERC-20 functions (but with extra sadness tracking)
function transfer(address to, uint256 amount) // Transfers tokens and increases sadness
function approve(address spender, uint256 amount) // Approve spending
function balanceOf(address account) // Check SAD balance
```

#### Sadness Tracking (Unique to SADCoin)
```solidity
function getSadnessLevel(address account) // Returns cumulative transfers/burns
function burnWithSadReason(uint256 amount, string reason) // Burn with explanation
```

**Frontend Integration:**
- **Wallet Display**: Show both SAD balance and sadness level (higher = more prestigious)
- **Transfer Interface**: Include the sadness tracker as a "score" that increases with activity
- **Burn Feature**: Allow users to burn tokens with custom sad reasons for achievements
- **Transaction History**: Display both transfers and sadness progression over time

**Events to Monitor:**
- `SadnessIncreased` - Track when users get sadder (celebrate this!)
- `VerySadBurn` - Show dramatic burn events with reasons
- `Transfer` - Standard transfers but with sadness implications

---

### 💔 FEELS Contract - The Currency of Emotions

**What it does**: FEELS is earned through gameplay and staking. It tracks "emotional damage" (total burned FEELS) and "feeling intensity" based on how recently you've interacted with the contract. The more emotional damage you accumulate, the more respect you earn in the sad community.

**Key Functions for Frontend:**

#### Emotional State Management
```solidity
function getEmotionalDamage(address account) // Total FEELS burned (badge of honor)
function getLastFeelTime(address account) // Last interaction timestamp
function calculateFeelingIntensity(address account) // Current emotional intensity
function balanceOf(address account) // Current FEELS balance
```

#### Self-Inflicted Sadness
```solidity
function sufferVoluntarily(uint256 amount, string reason) // Burn your own FEELS
```

**Frontend Integration:**
- **Emotional Dashboard**: Display current FEELS, emotional damage score, and feeling intensity
- **Suffering Interface**: Let users voluntarily burn FEELS with custom reasons (therapy simulator)
- **Emotional Timeline**: Show feeling intensity changes over time
- **Damage Leaderboard**: Rank users by total emotional damage (most damaged = most respected)

**Events to Monitor:**
- `FeelingsGenerated` - New FEELS earned
- `EmotionalDamageInflicted` - Someone got hurt (show sympathy)
- `FeelingsDestroyed` - FEELS burned (moment of silence)

---

### 🥺 StakingContract - Sadness Compound Interest

**What it does**: Users stake SAD tokens to earn FEELS over time at a rate of 42 FEELS per hour per SAD staked. There's a minimum stake of 69 SAD (nice and sad) and a 420-minute unstaking delay (because leaving sadness behind should be difficult).

**Key Functions for Frontend:**

#### Staking Operations
```solidity
function stakeSadness(uint256 amount) // Stake SAD (min 69 SAD)
function requestUnstake() // Start 420-minute countdown
function unstakeSadness() // Complete unstaking after delay
function harvestFeelings() // Claim pending FEELS rewards
```

#### Staking Information
```solidity
function pendingRewards(address staker) // Calculate claimable FEELS
function getStakerCount() // Total number of sad stakers
// Check user's staking status through events/state
```

**Frontend Integration:**
- **Staking Dashboard**: Show staked amount, pending rewards, and time until next harvest
- **Unstaking Timer**: Display 420-minute countdown with sad messages ("Leaving sadness behind...")
- **Rewards Calculator**: Real-time calculation of earnings (42 FEELS/hour/SAD)
- **Staker Leaderboard**: Show top stakers and total community staking stats

**Events to Monitor:**
- `SadnessStaked` - Someone committed to being sad
- `FeelingsHarvested` - Rewards claimed
- `UnstakeRequested` - Someone wants to leave sadness (countdown begins)
- `SadnessUnstaked` - Successfully escaped sadness (temporarily)

**Timing Constants:**
- Reward Rate: 42 FEELS per hour per staked SAD
- Minimum Stake: 69 SAD (nice)
- Unstake Delay: 420 minutes (7 hours of reconsideration)

---

### 🎮 GameRewards Contract - Random Sadness Generator

**What it does**: Users play email-writing minigames and earn FEELS based on their performance. Paradoxically, LOWER scores often yield HIGHER rewards (because failure is more authentic). Uses Chainlink VRF for random multipliers because even sadness needs some unpredictability.

**Key Functions for Frontend:**

#### Game Session Management
```solidity
function startGameSession() // Begin new game (returns sessionId)
function completeGame(uint256 sessionId, uint256 score) // Submit score for rewards
function getPlayerSessions(address player) // Get user's game history
function getSessionDetails(uint256 sessionId) // Get specific session info
function getStats() // Global game statistics
```

**Frontend Integration:**
- **Game Launcher**: Start sessions and track active games
- **Score Submission**: Submit scores and wait for VRF randomness to determine final rewards
- **Game History**: Show past sessions, scores, and rewards earned
- **Leaderboard**: Display top players (but remember, lower scores might earn more!)
- **Statistics Dashboard**: Show global game stats and trends

**Events to Monitor:**
- `GameSessionStarted` - New game began
- `GameCompleted` - Score submitted, waiting for VRF
- `SadRewardCalculated` - VRF responded with final reward calculation
- `EmotionalDamageInflicted` - Extra sadness added for particularly bad performance

**Game Economics:**
- Base Reward: 111 FEELS (a sad number)
- Random Multiplier: 0.5x to 4.2x (via Chainlink VRF)
- Inverse Score Relationship: Lower scores can yield higher base multipliers
- VRF Delay: Rewards aren't instant (adds suspense and sadness)

---

### 💰 ConversionContract - The Saddest Exchange

**What it does**: This contract handles two main functions: 1) Purchasing SAD with ETH at $0.01 per token, and 2) Converting FEELS to SAD at daily-changing rates determined by Chainlink VRF. It's designed to be the most frustrating exchange experience possible.

**Key Functions for Frontend:**

#### SAD Purchase (ETH → SAD)
```solidity
function purchaseSadness() payable // Buy SAD with ETH ($0.01 per SAD)
function calculatePurchaseAmount(uint256 ethAmount) // Preview purchase
// Built-in 1-hour cooldown between purchases
```

#### FEELS Conversion (FEELS → SAD)
```solidity
function convertFeelsToSad(uint256 feelsAmount) // Convert at current daily rate
function getConversionInfo() // Get current rate and next rate change time
function getDailyConversionStatus(address user) // Check daily limits
function calculateConversion(uint256 feelsAmount) // Preview conversion
```

**Frontend Integration:**
- **Purchase Interface**: ETH input with real-time SAD calculation and cooldown timer
- **Conversion Dashboard**: Show current FEELS→SAD rate and countdown to next rate change
- **Rate History**: Display past conversion rates and patterns
- **Daily Limits Tracker**: Show remaining daily conversion allowance (1000 SAD max)
- **Price Alerts**: Notify users when favorable conversion rates are active

**Events to Monitor:**
- `SadCoinPurchased` - ETH successfully converted to SAD
- `FeelsConvertedToSad` - FEELS converted to SAD
- `ConversionRateUpdated` - New daily rate set by VRF

**Economic Constants:**
- SAD Price: $0.01 USD (uses Chainlink ETH/USD price feed)
- Purchase Cooldown: 1 hour (prevents spam, increases frustration)
- Daily Conversion Limit: 1000 SAD per user (resets at midnight UTC)
- Conversion Rates: [11, 42, 69, 111, 420] FEELS per SAD (one chosen daily by VRF)

---

### 🏆 NFTClaim Contract - Achievement Badges of Sadness

**What it does**: Awards NFT achievements based on email interactions verified through Chainlink Functions. Each achievement has a sadness level (1-10), and collecting them increases your total sadness score - which is actually a good thing in our ecosystem!

**Key Functions for Frontend:**

#### Achievement Management
```solidity
function requestClaim(SadAchievement achievement, string emailHash, string verificationData)
function hasAchievement(address user, SadAchievement achievement) // Check ownership
function getAchievementInfo(SadAchievement achievement) // Get details
function getUserTotalSadness(address user) // Get total sadness score from NFTs
function getTokenMetadata(uint256 tokenId) // Get NFT metadata
```

**Available Achievements:**
1. **FIRST_EMAIL** (Sadness: 3) - "Sent your first corporate email"
2. **PROCRASTINATION_MASTER** (Sadness: 8) - "Took over 24 hours to reply"
3. **EMOTIONAL_DAMAGE** (Sadness: 9) - "Received a harsh email"
4. **CORPORATE_DRONE** (Sadness: 10) - "Sent 100+ emails"
5. **WEEKEND_WARRIOR** (Sadness: 7) - "Sent email on weekend"
6. **MIDNIGHT_OIL** (Sadness: 6) - "Sent email after midnight"
7. **REPLY_ALL_DISASTER** (Sadness: 8) - "Used reply-all incorrectly"
8. **AUTOCORRECT_VICTIM** (Sadness: 5) - "Autocorrect made you look like a fool"
9. **MEETING_SCHEDULER** (Sadness: 9) - "Scheduled 50+ meetings"
10. **OUT_OF_OFFICE_MASTER** (Sadness: 2) - "Crafted the perfect OOO message"

**Frontend Integration:**
- **Achievement Gallery**: Display all achievements with claim status and sadness levels
- **Claim Interface**: Allow users to submit email verification data for achievements
- **Progress Tracking**: Show progress towards achievements (emails sent, meeting scheduled, etc.)
- **Sadness Leaderboard**: Rank users by total achievement sadness score
- **NFT Showcase**: Display owned achievements as collectible NFTs

**Events to Monitor:**
- `ClaimRequested` - Achievement claim submitted (waiting for Chainlink Functions)
- `NFTClaimed` - Achievement successfully verified and minted
- `VerificationFailed` - Claim rejected (show sad error message)

## 🎲 Chainlink VRF - The Randomness That Makes Everything Sadder

*"In a world of predictable sadness, sometimes you need random sadness to keep things interesting"*

**What is Chainlink VRF?** It's like rolling dice, but the dice are on the blockchain, cryptographically secure, and somehow even more disappointing than regular dice. VRF stands for "Verifiable Random Function" - which is a fancy way of saying "we can prove the randomness screwed you over fairly."

### 🎭 How VRF Works in Our Sad Ecosystem

**The Subscription Model** (Because even randomness has monthly fees now):
1. **Create VRF Subscription**: Like a sad Netflix subscription, but for randomness
2. **Fund with LINK**: Pay Chainlink oracles to generate your disappointment
3. **Add Consumer Contracts**: Tell the VRF which contracts are allowed to request randomness
4. **Request Random Numbers**: Contracts ask for randomness and wait (like waiting for a text back)
5. **Receive Callback**: Oracle delivers randomness via callback function (sometimes good, usually sad)

### 🎮 VRF Usage in GameRewards Contract

**The Sad Reality**: When you complete a game, you don't immediately know your reward. The contract requests randomness from Chainlink VRF, and you have to wait for the oracle to respond. It's like ordering food delivery and not knowing if you'll get pizza or sadness.

```solidity
// What happens when you complete a game:
function completeGame(uint256 sessionId, uint256 score) external {
    // Your score is submitted immediately
    // But VRF request is made for random multiplier
    bytes32 requestId = requestRandomWords();
    // Now you wait... and wait... and feel sad about waiting
}

// Later, when VRF responds (could be 30 seconds, could be 5 minutes):
function fulfillRandomWords(bytes32 requestId, uint256[] calldata randomWords) internal override {
    // Finally! The oracle has decided your fate
    uint256 multiplier = (randomWords[0] % 371) + 50; // 0.5x to 4.2x
    // Now you discover if you're getting 55 FEELS or 465 FEELS
}
```

**Why This Is Brilliantly Sad**:
- ⏰ **Delayed Gratification**: You can't instantly know your rewards (builds suspense and anxiety)
- 🎰 **Casino Vibes**: Every game completion is a gamble (very appropriate for sad people)
- ⛽ **Gas Costs**: Two transactions instead of one (more expensive, more frustrating)
- 🤔 **Uncertainty**: You never know if you'll get the minimum or maximum multiplier

### 💱 VRF Usage in ConversionContract

**The Daily Sadness Lottery**: Every 24 hours, the contract uses VRF to randomly select a new FEELS→SAD conversion rate from our array of sad numbers: [11, 42, 69, 111, 420].

```solidity
// The daily rate selection process:
uint256[5] private conversionRates = [11, 42, 69, 111, 420]; // FEELS per SAD

function requestNewConversionRate() internal {
    // Once per day, someone triggers this (usually via Chainlink Automation)
    bytes32 requestId = requestRandomWords();
    // The entire ecosystem waits to see if today will be generous (11:1) or brutal (420:1)
}

function fulfillRandomWords(bytes32 requestId, uint256[] calldata randomWords) internal override {
    uint256 rateIndex = randomWords[0] % 5; // Pick one of the 5 rates
    currentConversionRate = conversionRates[rateIndex];
    // Collective joy or despair ensues across all users
}
```

**Frontend Implications**:
- 📊 **Rate Prediction Interface**: Let users track historical patterns (even though it's random)
- ⏰ **Countdown Timers**: Show time until next rate change (builds anticipation)
- 🎯 **Strategy Elements**: Users might hoard FEELS waiting for favorable rates
- 📈 **Market Psychology**: Rate changes affect user behavior and trading patterns

### 🔧 VRF Implementation Details for Developers

**Subscription Management**:
```javascript
// Frontend needs to help users understand VRF costs
const estimatedVRFCost = "~0.001 LINK per random request";
const averageResponseTime = "30-120 seconds";
const subscriptionBalance = await checkLINKBalance(subscriptionId);
```

**Handling VRF Delays**:
```javascript
// Show pending VRF requests in UI
const pendingGameSessions = await contract.getPendingGameSessions(userAddress);
const pendingRateUpdate = await contract.isRateUpdatePending();

// Display appropriate loading states
if (pendingGameSessions.length > 0) {
    showMessage("Waiting for Chainlink oracles to determine your sad fate...");
}
```

**VRF Event Monitoring**:
```javascript
// Listen for VRF-related events
contract.on("RandomWordsRequested", (requestId, sender) => {
    showNotification("Randomness requested! Your fate is being decided...");
    trackVRFRequest(requestId, "pending");
});

contract.on("SadRewardCalculated", (player, baseReward, multiplier, finalReward) => {
    showRewardAnimation(finalReward);
    trackVRFRequest(player.requestId, "fulfilled");
});
```

### 🎯 VRF Best Practices for Frontend

1. **Set Expectations**: Always tell users VRF responses take time (30-120 seconds typically)
2. **Show Progress**: Display pending VRF requests with appropriate sad loading messages
3. **Handle Failures**: VRF can occasionally fail - show retry options
4. **Batch Operations**: Don't spam VRF requests - they cost LINK tokens
5. **Educational Content**: Explain why randomness is verifiable and why it takes time

**Sad Loading Messages** (Use these while waiting for VRF):
- "Consulting the blockchain gods about your misfortune..."
- "Generating cryptographically secure disappointment..."
- "Please wait while we verify your random sadness..."
- "The oracles are deciding how sad you should be..."
- "Blockchain randomness: slower than your internet, more reliable than your mood"

### 🔗 Other Chainlink Integrations

- **Price Feeds** - Used in ConversionContract for ETH/USD or AVAX/USD pricing to purchase SADCoin (because even sadness needs market prices)
- **Automation** - Used in StakingContract and ConversionContract for automated operations (robots doing sad tasks so humans don't have to)
- **Functions** - Used in NFTClaim for off-chain email verification (checking if your emails are authentically sad enough for achievements)

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

### For Developers (Who Enjoy Pain)

*"Writing code is like being sad - it's better when it's shared"*

#### Interact with SADCoin (The Currency of Despair)
```solidity
// Mint sadness to an address (only authorized minters)
sadCoin.mintSadness(recipient, amount); // Making someone else rich and sad

// Burn tokens with a sad reason (therapy through destruction)
sadCoin.burnWithSadReason(amount, "My code doesn't compile, burning tokens in frustration");

// Check someone's sadness level (higher = more prestigious in our ecosystem)
uint256 sadness = sadCoin.getSadnessLevel(user); // 0 = happy noob, 1000000 = certified sad veteran
```

#### Interact with FEELS (Emotional Manipulation as a Service)
```solidity
// Generate feelings (only authorized minters)
feels.generateFeelings(user, amount, "Completed 47 emails about email completion"); 

// Voluntary suffering (because sometimes you just need to feel something)
feels.sufferVoluntarily(amount, "Watched my portfolio crash while staking for 0.001% APY");

// Check emotional damage (wear your scars proudly)
uint256 damage = feels.getEmotionalDamage(user); // Badge of honor in the sad community
```

#### Staking Operations (Commitment to Sadness)
```solidity
// Stake sadness (minimum 69 SAD because that's peak sadness efficiency)
staking.stakeSadness(amount); // Lock your tokens away like your emotions

// Request unstake (because leaving sadness behind takes time)
staking.requestUnstake(); // Starts 420-minute therapy session

// Harvest feelings (collect your emotional baggage)
staking.harvestFeelings(); // Finally, some return on your invested sadness
```

#### Frontend Integration Examples (For the Brave Souls Building UIs)

**Wallet Connection with Sadness Tracking:**
```javascript
// Display user's complete sad profile
async function displaySadProfile(userAddress) {
    const sadBalance = await sadCoinContract.balanceOf(userAddress);
    const feelsBalance = await feelsContract.balanceOf(userAddress);
    const sadnessLevel = await sadCoinContract.getSadnessLevel(userAddress);
    const emotionalDamage = await feelsContract.getEmotionalDamage(userAddress);
    
    // Calculate overall sadness score (higher = better in our world)
    const totalSadness = sadnessLevel + emotionalDamage;
    
    return {
        sadBalance: formatEther(sadBalance),
        feelsBalance: formatEther(feelsBalance),
        sadnessLevel: sadnessLevel.toString(),
        emotionalDamage: emotionalDamage.toString(),
        totalSadness: totalSadness.toString(),
        sadnessRank: getSadnessRank(totalSadness) // "Mildly Depressed" to "Existential Crisis Master"
    };
}
```

**Game Session Management with VRF Handling:**
```javascript
// Start a game session (the beginning of disappointment)
async function startSadGame() {
    try {
        const tx = await gameRewardsContract.startGameSession();
        const receipt = await tx.wait();
        const sessionId = extractSessionIdFromReceipt(receipt);
        
        showNotification("Game session started! Prepare for disappointment...", "info");
        return sessionId;
    } catch (error) {
        showNotification("Failed to start game. Even our failures are failing.", "error");
        throw error;
    }
}

// Complete game and handle VRF delay
async function completeGame(sessionId, score) {
    try {
        const tx = await gameRewardsContract.completeGame(sessionId, score);
        await tx.wait();
        
        // Show VRF waiting state (this is where the magic/sadness happens)
        showVRFWaitingModal(sessionId);
        
        // Listen for the VRF callback
        gameRewardsContract.once("SadRewardCalculated", (player, baseReward, multiplier, finalReward) => {
            if (player.toLowerCase() === userAddress.toLowerCase()) {
                hideVRFWaitingModal();
                celebrateSadReward(finalReward, multiplier);
            }
        });
        
    } catch (error) {
        showNotification("Game completion failed. Your sadness remains unrewarded.", "error");
    }
}
```

**Real-time Staking Dashboard:**
```javascript
// Update staking info every 30 seconds (because watching numbers slowly grow is peak sadness)
setInterval(async () => {
    const pendingRewards = await stakingContract.pendingRewards(userAddress);
    const displayRewards = formatEther(pendingRewards);
    
    updateElement("#pending-rewards", `${displayRewards} FEELS`);
    updateElement("#sadness-accrual-rate", "42 FEELS/hour (as predictable as your loneliness)");
    
    // Add some encouraging sad messages
    if (parseFloat(displayRewards) > 1000) {
        showTooltip("Wow, you've accumulated significant emotional rewards! Time to harvest your feelings.");
    }
}, 30000);
```

**Conversion Rate Monitoring (The Daily Lottery of Sadness):**
```javascript
// Track conversion rates and notify users of changes
async function monitorConversionRates() {
    const conversionInfo = await conversionContract.getConversionInfo();
    const currentRate = conversionInfo.currentRate;
    const nextUpdateTime = conversionInfo.nextUpdateIn;
    
    // Display current rate with appropriate emotional context
    const rateMessage = getRateEmotionalContext(currentRate);
    updateElement("#conversion-rate", `${currentRate} FEELS per SAD - ${rateMessage}`);
    
    // Countdown to next rate change
    startCountdown("#rate-countdown", nextUpdateTime, () => {
        showNotification("New conversion rate incoming! Cross your fingers (but expect disappointment)");
    });
    
    // Listen for rate updates
    conversionContract.on("ConversionRateUpdated", (oldRate, newRate) => {
        const improvement = newRate < oldRate ? "BETTER" : "WORSE";
        showNotification(`Rate changed from ${oldRate} to ${newRate} FEELS per SAD. This is ${improvement} (probably).`);
    });
}

function getRateEmotionalContext(rate) {
    switch(rate) {
        case 11: return "Suspiciously generous (enjoy it while it lasts)";
        case 42: return "The answer to life, universe, and sadness";
        case 69: return "Nice, but still sad";
        case 111: return "Triple sadness (mathematically depressing)";
        case 420: return "Ultimate sadness achieved (legendary tier depression)";
        default: return "Unknown sadness level (existential confusion)";
    }
}
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