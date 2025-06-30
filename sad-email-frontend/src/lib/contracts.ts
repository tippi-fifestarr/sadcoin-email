// Contract addresses deployed on Sepolia testnet (Fallback)
export const SEPOLIA_CONTRACTS = {
  SADCoin: "0xace84066b7e68f636dac3c3438975de22cf4af20",
  FEELS: "0xe5180fa5acaf05717d49bf2ec4f6fd0261db92b2",
  StakingContract: "0xf62ab5625521f4a9883565b72ddc4f86098f1062",
  GameRewards: "0x47bea96317ddcc926696f83db55389898493dbcd",
  ConversionContract: "0x2dbfae1ff52735a145bbdfc0822085143bd462e3",
  NFTClaim: "0x037feb654b637226b5503a237361d1c3b4de7b30"
} as const;

// Contract addresses deployed on Avalanche Fuji testnet (Primary)
export const FUJI_CONTRACTS = {
  SADCoin: "0xFA76e01fe1EC5d85809571F0021a921B8e5c3aC3",
  FEELS: "0x6c2E481697F462Fd3d6D1C60cAeD24dDDFAE3498",
  StakingContract: "0xEFDe5A8ecd393089FbABA223Dde2677D2929F67e",
  GameRewards: "0x572f9cCc98B8eDD305a9c4ede07528574CCc4dd0",
  ConversionContract: "0x920D563C7A8D0C185e78438EA7a73A9413838bE7",
  NFTClaim: "0x7845B4894F2b2D2475314215163D797D4395d8Fb"
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

// Network configurations
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

export const FUJI_CONFIG = {
  chainId: 43113,
  name: "Avalanche Fuji",
  nativeCurrency: {
    name: "Avalanche",
    symbol: "AVAX",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://api.avax-test.network/ext/bc/C/rpc"],
    },
    public: {
      http: ["https://api.avax-test.network/ext/bc/C/rpc"],
    },
  },
  blockExplorers: {
    default: {
      name: "Snowtrace",
      url: "https://testnet.snowtrace.io",
    },
  },
  testnet: true,
} as const;

// Network-aware contract getter
export function getContracts(chainId: number) {
  switch (chainId) {
    case 43113: // Avalanche Fuji
      return FUJI_CONTRACTS;
    case 11155111: // Sepolia
      return SEPOLIA_CONTRACTS;
    default:
      return FUJI_CONTRACTS; // Default to Fuji
  }
}

// Get network configuration
export function getNetworkConfig(chainId: number) {
  switch (chainId) {
    case 43113: // Avalanche Fuji
      return FUJI_CONFIG;
    case 11155111: // Sepolia
      return SEPOLIA_CONFIG;
    default:
      return FUJI_CONFIG; // Default to Fuji
  }
}

// Get network name
export function getNetworkName(chainId: number): string {
  switch (chainId) {
    case 43113:
      return "Avalanche Fuji";
    case 11155111:
      return "Sepolia";
    default:
      return "Unknown Network";
  }
}

// Constants for calculations
export const CONSTANTS = {
  SAD_PRICE_CENTS: 1, // $0.01 per SADCoin
  PURCHASE_COOLDOWN: 3600, // 1 hour in seconds
  MAX_DAILY_CONVERSION: BigInt("1000000000000000000000"), // 1000 SAD in wei
  CONVERSION_RATES: [11, 42, 69, 111, 420] as const,
} as const;