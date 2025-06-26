// Contract addresses deployed on Sepolia testnet
export const SEPOLIA_CONTRACTS = {
  SADCoin: "0x7845B4894F2b2D2475314215163D797D4395d8Fb",
  FEELS: "0x1C25c8e0855952CaDF85898239D53B62719Fb2ab", 
  StakingContract: "0x0f03aBf42014798fA0742befedf404100e07060D",
  GameRewards: "0xdf8D2B48FC3007726d80cEf15c5CC41C6eEaDaE8",
  ConversionContract: "0x61fBE2CDa9d2a41c7A09843106eBD55A43790F54",
  NFTClaim: "0x9E23590b10AD7fb256ce7BBAEc1D2d1B39bD1f2F"
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
      http: ["https://sepolia.infura.io/v3/"],
    },
    public: {
      http: ["https://sepolia.infura.io/v3/"],
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