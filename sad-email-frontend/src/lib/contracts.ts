// Contract addresses deployed on Sepolia testnet
export const SEPOLIA_CONTRACTS = {
  SADCoin: "0xace84066b7e68f636dac3c3438975de22cf4af20",
  FEELS: "0xe5180fa5acaf05717d49bf2ec4f6fd0261db92b2",
  StakingContract: "0xf62ab5625521f4a9883565b72ddc4f86098f1062",
  GameRewards: "0x47bea96317ddcc926696f83db55389898493dbcd",
  ConversionContract: "0x2dbfae1ff52735a145bbdfc0822085143bd462e3",
  NFTClaim: "0x037feb654b637226b5503a237361d1c3b4de7b30"
} as const;

// Minimal ABIs for immediate testing - extracted from contract interfaces
export const SADCoin_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function getSadnessLevel(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function totalSupply() view returns (uint256)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event SadnessIncreased(address indexed account, uint256 amount)"
] as const;

export const FEELS_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function getEmotionalDamage(address) view returns (uint256)",
  "function getLastFeelTime(address) view returns (uint256)",
  "function calculateFeelingIntensity(address) view returns (uint256)",
  "function sufferVoluntarily(uint256 amount, string reason)",
  "function totalSupply() view returns (uint256)",
  "event FeelingsGenerated(address indexed recipient, uint256 amount, string source)",
  "event FeelingsDestroyed(address indexed account, uint256 amount, string reason)"
] as const;

export const ConversionContract_ABI = [
  "function purchaseSadness() payable",
  "function currentConversionRate() view returns (uint256)",
  "function calculatePurchaseAmount(uint256) view returns (uint256, uint256)",
  "function lastPurchaseTime(address) view returns (uint256)",
  "function convertFeelsToSad(uint256 feelsAmount)",
  "function getConversionInfo() view returns (uint256 rate, uint256 lastUpdate, uint256 nextUpdateIn)",
  "function getDailyConversionStatus(address user) view returns (uint256 usedToday, uint256 remainingToday)",
  "function calculateConversion(uint256 feelsAmount) view returns (uint256 sadAmount)",
  "function getAllConversionRates() view returns (uint256[5])",
  "event SadCoinPurchased(address indexed buyer, uint256 sadAmount, uint256 ethPaid, uint256 ethPrice)",
  "event FeelsConvertedToSad(address indexed converter, uint256 feelsAmount, uint256 sadAmount, uint256 rate)"
] as const;

export const GameRewards_ABI = [
  "function startGameSession() returns (uint256)",
  "function completeGame(uint256 sessionId, uint256 score)",
  "function getPlayerSessions(address player) view returns (uint256[])",
  "function getSessionDetails(uint256 sessionId) view returns (address player, uint256 score, uint256 timestamp, bool rewarded, uint256 vrfRequestId)",
  "function isPendingReward(uint256 requestId) view returns (bool)",
  "function getStats() view returns (uint256 totalGamesPlayed, uint256 totalFeelsDistributed, uint256 activeSessions)",
  "event GameSessionStarted(address indexed player, uint256 sessionId)",
  "event GameCompleted(address indexed player, uint256 sessionId, uint256 score)",
  "event SadRewardCalculated(address indexed player, uint256 baseReward, uint256 multiplier, uint256 finalReward)"
] as const;

export const StakingContract_ABI = [
  "function stakeSadness(uint256 amount)",
  "function requestUnstake()",
  "function unstakeSadness()",
  "function harvestFeelings()",
  "function pendingRewards(address staker) view returns (uint256)",
  "function stakes(address) view returns (uint256 amount, uint256 rewardDebt, uint256 lastRewardTime, uint256 unstakeRequestTime, bool unstakeRequested)",
  "function totalStaked() view returns (uint256)",
  "function getStakerCount() view returns (uint256)",
  "function REWARD_RATE() view returns (uint256)",
  "function MINIMUM_STAKE() view returns (uint256)",
  "function UNSTAKE_DELAY() view returns (uint256)",
  "event SadnessStaked(address indexed staker, uint256 amount)",
  "event FeelingsHarvested(address indexed staker, uint256 amount)",
  "event UnstakeRequested(address indexed staker, uint256 amount)",
  "event SadnessUnstaked(address indexed staker, uint256 amount)"
] as const;

export const NFTClaim_ABI = [
  "function requestClaim(uint8 achievement, string emailHash, string verificationData)",
  "function getAchievementInfo(uint8 achievement) view returns (string name, string description, uint256 sadnessLevel)",
  "function hasAchievement(address user, uint8 achievement) view returns (bool)",
  "function getUserTotalSadness(address user) view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
  "function getTokenMetadata(uint256 tokenId) view returns (tuple(uint8 achievement, uint256 timestamp, string emailHash, uint256 sadnessLevel, bool verified))",
  "function nextTokenId() view returns (uint256)",
  "function MAX_SUPPLY() view returns (uint256)",
  "event ClaimRequested(address indexed claimer, bytes32 requestId, uint8 achievement)",
  "event NFTClaimed(address indexed claimer, uint256 tokenId, uint8 achievement)"
] as const;

// Network configuration
export const SEPOLIA_CONFIG = {
  chainId: 11155111,
  name: "Sepolia",
  nativeCurrency: {
    name: "Sepolia Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://sepolia.drpc.org"],
    },
    public: {
      http: ["https://sepolia.drpc.org"],
    },
  },
  blockExplorers: {
    default: {
      name: "Sepolia Etherscan",
      url: "https://sepolia.etherscan.io",
    },
  },
  testnet: true,
} as const;

// Constants for calculations
export const CONSTANTS = {
  SAD_PRICE_CENTS: 1, // $0.01 per SADCoin
  PURCHASE_COOLDOWN: 3600, // 1 hour in seconds
  MAX_DAILY_CONVERSION: BigInt("1000000000000000000000"), // 1000 SAD in wei
  CONVERSION_RATES: [11, 42, 69, 111, 420] as const,
} as const;