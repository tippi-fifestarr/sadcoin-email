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
  {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
    "name": "getSadnessLevel",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "to", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "transfer",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "spender", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "approve",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "owner", "type": "address"},
      {"internalType": "address", "name": "spender", "type": "address"}
    ],
    "name": "allowance",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export const FEELS_ABI = [
  {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
    "name": "getEmotionalDamage",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export const ConversionContract_ABI = [
  {
    "inputs": [],
    "name": "purchaseSadness",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "currentConversionRate",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "ethAmount", "type": "uint256"}],
    "name": "calculatePurchaseAmount",
    "outputs": [
      {"internalType": "uint256", "name": "sadAmount", "type": "uint256"},
      {"internalType": "uint256", "name": "ethPriceUSD", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "", "type": "address"}],
    "name": "lastPurchaseTime",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "feelsAmount", "type": "uint256"}],
    "name": "convertFeelsToSad",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

export const GameRewards_ABI = [
  {
    "inputs": [],
    "name": "startGameSession",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "sessionId", "type": "uint256"},
      {"internalType": "uint256", "name": "score", "type": "uint256"}
    ],
    "name": "completeGame",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

export const StakingContract_ABI = [
  {
    "inputs": [{"internalType": "uint256", "name": "amount", "type": "uint256"}],
    "name": "stakeSadness",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "harvestFeelings",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "staker", "type": "address"}],
    "name": "pendingRewards",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export const NFTClaim_ABI = [
  {
    "inputs": [
      {"internalType": "uint8", "name": "achievement", "type": "uint8"},
      {"internalType": "string", "name": "emailHash", "type": "string"},
      {"internalType": "string", "name": "verificationData", "type": "string"}
    ],
    "name": "requestClaim",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
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