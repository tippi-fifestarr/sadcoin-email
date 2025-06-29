"use client"
import { useReadContract, useWriteContract, useWatchContractEvent, useContractWrite, useSimulateContract } from "wagmi"
import { parseEther, formatEther } from "viem"
import { SEPOLIA_CONTRACTS, SADCoin_ABI, FEELS_ABI, ConversionContract_ABI, GameRewards_ABI, StakingContract_ABI, NFTClaim_ABI } from "@/lib/contracts"

// SADCoin contract hooks
export function useSADCoinBalance(address?: `0x${string}`) {
  const result = useReadContract({
    address: SEPOLIA_CONTRACTS.SADCoin,
    abi: [
      {
        "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
      }
    ],
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { 
      enabled: !!address,
      refetchInterval: 5000, // Refresh every 5 seconds
      retry: 1,
      retryDelay: 1000
    }
  });

  // Debug logging
  if (result.error) {
    console.error("SADCoin balance error:", {
      error: result.error.message,
      address: SEPOLIA_CONTRACTS.SADCoin,
      userAddress: address,
      fullError: result.error
    });
  }

  return result;
}

export function useSadnessLevel(address?: `0x${string}`) {
  return useReadContract({
    address: SEPOLIA_CONTRACTS.SADCoin,
    abi: SADCoin_ABI,
    functionName: 'getSadnessLevel',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  });
}

export function useSADAllowance(owner?: `0x${string}`, spender?: `0x${string}`) {
  return useReadContract({
    address: SEPOLIA_CONTRACTS.SADCoin,
    abi: SADCoin_ABI,
    functionName: 'allowance',
    args: owner && spender ? [owner, spender] : undefined,
    query: { enabled: !!(owner && spender) }
  });
}

export function useApproveSAD() {
  return useWriteContract();
}

export function useSADCoinInfo() {
  const name = useReadContract({
    address: SEPOLIA_CONTRACTS.SADCoin,
    abi: SADCoin_ABI,
    functionName: 'name'
  });

  const symbol = useReadContract({
    address: SEPOLIA_CONTRACTS.SADCoin,
    abi: SADCoin_ABI,
    functionName: 'symbol'
  });

  const totalSupply = useReadContract({
    address: SEPOLIA_CONTRACTS.SADCoin,
    abi: SADCoin_ABI,
    functionName: 'totalSupply'
  });

  return { name, symbol, totalSupply };
}

// FEELS contract hooks
export function useFEELSBalance(address?: `0x${string}`) {
  const result = useReadContract({
    address: SEPOLIA_CONTRACTS.FEELS,
    abi: [
      {
        "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
      }
    ],
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { 
      enabled: !!address,
      refetchInterval: 5000,
      retry: 1,
      retryDelay: 1000
    }
  });

  // Debug logging
  if (result.error) {
    console.error("FEELS balance error:", {
      error: result.error.message,
      address: SEPOLIA_CONTRACTS.FEELS,
      userAddress: address,
      fullError: result.error
    });
  }

  return result;
}

export function useEmotionalDamage(address?: `0x${string}`) {
  return useReadContract({
    address: SEPOLIA_CONTRACTS.FEELS,
    abi: FEELS_ABI,
    functionName: 'getEmotionalDamage',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  });
}

export function useFeelingIntensity(address?: `0x${string}`) {
  return useReadContract({
    address: SEPOLIA_CONTRACTS.FEELS,
    abi: FEELS_ABI,
    functionName: 'calculateFeelingIntensity',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  });
}

// ConversionContract hooks
export function useConversionRate() {
  return useReadContract({
    address: SEPOLIA_CONTRACTS.ConversionContract,
    abi: ConversionContract_ABI,
    functionName: 'currentConversionRate',
    query: { refetchInterval: 10000 } // Check every 10 seconds
  });
}

export function useConversionInfo() {
  return useReadContract({
    address: SEPOLIA_CONTRACTS.ConversionContract,
    abi: ConversionContract_ABI,
    functionName: 'getConversionInfo'
  });
}

export function usePurchaseCalculation(ethAmount: string) {
  const ethWei = ethAmount ? parseEther(ethAmount) : BigInt(0);
  
  return useReadContract({
    address: SEPOLIA_CONTRACTS.ConversionContract,
    abi: ConversionContract_ABI,
    functionName: 'calculatePurchaseAmount',
    args: [ethWei],
    query: { 
      enabled: ethAmount !== "" && Number(ethAmount) > 0,
      refetchInterval: 5000
    }
  });
}

export function useLastPurchaseTime(address?: `0x${string}`) {
  return useReadContract({
    address: SEPOLIA_CONTRACTS.ConversionContract,
    abi: ConversionContract_ABI,
    functionName: 'lastPurchaseTime',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  });
}

export function useDailyConversionStatus(address?: `0x${string}`) {
  return useReadContract({
    address: SEPOLIA_CONTRACTS.ConversionContract,
    abi: ConversionContract_ABI,
    functionName: 'getDailyConversionStatus',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  });
}

// Write contract hooks
export function usePurchaseSadness() {
  return useWriteContract();
}

export function useConvertFeelsToSad() {
  return useWriteContract();
}

// Event watching hooks
export function useWatchSADTransfers(address?: `0x${string}`, onTransfer?: () => void) {
  useWatchContractEvent({
    address: SEPOLIA_CONTRACTS.SADCoin,
    abi: SADCoin_ABI,
    eventName: 'Transfer',
    args: { to: address },
    onLogs: () => {
      if (onTransfer) onTransfer();
    },
    enabled: !!address
  });
}

export function useWatchSadnessPurchases(address?: `0x${string}`, onPurchase?: () => void) {
  useWatchContractEvent({
    address: SEPOLIA_CONTRACTS.ConversionContract,
    abi: ConversionContract_ABI,
    eventName: 'SadCoinPurchased',
    args: { buyer: address },
    onLogs: () => {
      if (onPurchase) onPurchase();
    },
    enabled: !!address
  });
}

// Utility functions for formatting
export function formatSADBalance(balance?: bigint): string {
  try {
    if (!balance) return "0.0";
    return parseFloat(formatEther(balance)).toFixed(2);
  } catch (error) {
    console.error("Error formatting SAD balance:", error, balance);
    return "0.0";
  }
}

export function formatFEELSBalance(balance?: bigint): string {
  try {
    if (!balance) return "0.0";
    return parseFloat(formatEther(balance)).toFixed(2);
  } catch (error) {
    console.error("Error formatting FEELS balance:", error, balance);
    return "0.0";
  }
}

export function calculateCooldownRemaining(lastPurchaseTime?: bigint): number {
  if (!lastPurchaseTime || lastPurchaseTime === BigInt(0)) return 0;
  
  const now = Math.floor(Date.now() / 1000);
  const lastPurchase = Number(lastPurchaseTime);
  const cooldownEnd = lastPurchase + 3600; // 1 hour cooldown
  
  return Math.max(0, cooldownEnd - now);
}

export function formatCooldownTime(seconds: number): string {
  if (seconds <= 0) return "Ready";
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// GameRewards contract hooks
export function useStartGameSession() {
  return useWriteContract();
}

export function useCompleteGame() {
  return useWriteContract();
}

export function usePlayerSessions(address?: `0x${string}`) {
  return useReadContract({
    address: SEPOLIA_CONTRACTS.GameRewards,
    abi: GameRewards_ABI,
    functionName: 'getPlayerSessions',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  });
}

export function useSessionDetails(sessionId?: bigint) {
  return useReadContract({
    address: SEPOLIA_CONTRACTS.GameRewards,
    abi: GameRewards_ABI,
    functionName: 'getSessionDetails',
    args: sessionId !== undefined ? [sessionId] : undefined,
    query: { enabled: sessionId !== undefined }
  });
}

export function useGameStats() {
  return useReadContract({
    address: SEPOLIA_CONTRACTS.GameRewards,
    abi: GameRewards_ABI,
    functionName: 'getStats'
  });
}

// StakingContract hooks
export function useStakeInfo(address?: `0x${string}`) {
  return useReadContract({
    address: SEPOLIA_CONTRACTS.StakingContract,
    abi: StakingContract_ABI,
    functionName: 'stakes',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  });
}

export function usePendingRewards(address?: `0x${string}`) {
  return useReadContract({
    address: SEPOLIA_CONTRACTS.StakingContract,
    abi: StakingContract_ABI,
    functionName: 'pendingRewards',
    args: address ? [address] : undefined,
    query: { enabled: !!address, refetchInterval: 5000 }
  });
}

export function useTotalStaked() {
  return useReadContract({
    address: SEPOLIA_CONTRACTS.StakingContract,
    abi: StakingContract_ABI,
    functionName: 'totalStaked'
  });
}

export function useStakingConstants() {
  const rewardRate = useReadContract({
    address: SEPOLIA_CONTRACTS.StakingContract,
    abi: StakingContract_ABI,
    functionName: 'REWARD_RATE'
  });

  const minimumStake = useReadContract({
    address: SEPOLIA_CONTRACTS.StakingContract,
    abi: StakingContract_ABI,
    functionName: 'MINIMUM_STAKE'
  });

  const unstakeDelay = useReadContract({
    address: SEPOLIA_CONTRACTS.StakingContract,
    abi: StakingContract_ABI,
    functionName: 'UNSTAKE_DELAY'
  });

  return { rewardRate, minimumStake, unstakeDelay };
}

export function useStakeSadness() {
  return useWriteContract();
}

export function useRequestUnstake() {
  return useWriteContract();
}

export function useUnstakeSadness() {
  return useWriteContract();
}

export function useHarvestFeelings() {
  return useWriteContract();
}

// NFTClaim contract hooks
export function useNFTBalance(address?: `0x${string}`) {
  return useReadContract({
    address: SEPOLIA_CONTRACTS.NFTClaim,
    abi: NFTClaim_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  });
}

export function useUserTotalSadness(address?: `0x${string}`) {
  return useReadContract({
    address: SEPOLIA_CONTRACTS.NFTClaim,
    abi: NFTClaim_ABI,
    functionName: 'getUserTotalSadness',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  });
}

export function useHasAchievement(address?: `0x${string}`, achievement?: number) {
  return useReadContract({
    address: SEPOLIA_CONTRACTS.NFTClaim,
    abi: NFTClaim_ABI,
    functionName: 'hasAchievement',
    args: address && achievement !== undefined ? [address, achievement] : undefined,
    query: { enabled: !!address && achievement !== undefined }
  });
}

export function useAchievementInfo(achievement?: number) {
  return useReadContract({
    address: SEPOLIA_CONTRACTS.NFTClaim,
    abi: NFTClaim_ABI,
    functionName: 'getAchievementInfo',
    args: achievement !== undefined ? [achievement] : undefined,
    query: { enabled: achievement !== undefined }
  });
}

export function useNFTSupplyInfo() {
  const nextTokenId = useReadContract({
    address: SEPOLIA_CONTRACTS.NFTClaim,
    abi: NFTClaim_ABI,
    functionName: 'nextTokenId'
  });

  const maxSupply = useReadContract({
    address: SEPOLIA_CONTRACTS.NFTClaim,
    abi: NFTClaim_ABI,
    functionName: 'MAX_SUPPLY'
  });

  return { nextTokenId, maxSupply };
}

export function useRequestNFTClaim() {
  return useWriteContract();
}

// Event watching for new contracts
export function useWatchGameRewards(address?: `0x${string}`, onGameComplete?: () => void) {
  useWatchContractEvent({
    address: SEPOLIA_CONTRACTS.GameRewards,
    abi: GameRewards_ABI,
    eventName: 'SadRewardCalculated',
    args: { player: address },
    onLogs: () => {
      if (onGameComplete) onGameComplete();
    },
    enabled: !!address
  });
}

export function useWatchStakingRewards(address?: `0x${string}`, onHarvest?: () => void) {
  useWatchContractEvent({
    address: SEPOLIA_CONTRACTS.StakingContract,
    abi: StakingContract_ABI,
    eventName: 'FeelingsHarvested',
    args: { staker: address },
    onLogs: () => {
      if (onHarvest) onHarvest();
    },
    enabled: !!address
  });
}

export function useWatchNFTClaims(address?: `0x${string}`, onClaim?: () => void) {
  useWatchContractEvent({
    address: SEPOLIA_CONTRACTS.NFTClaim,
    abi: NFTClaim_ABI,
    eventName: 'NFTClaimed',
    args: { claimer: address },
    onLogs: () => {
      if (onClaim) onClaim();
    },
    enabled: !!address
  });
}

// Achievement enum for frontend use
export enum SadAchievement {
  FIRST_EMAIL = 0,
  PROCRASTINATION_MASTER = 1,
  EMOTIONAL_DAMAGE = 2,
  CORPORATE_DRONE = 3,
  WEEKEND_WARRIOR = 4,
  MIDNIGHT_OIL = 5,
  REPLY_ALL_DISASTER = 6,
  AUTOCORRECT_VICTIM = 7,
  MEETING_SCHEDULER = 8,
  OUT_OF_OFFICE_MASTER = 9
}

export const ACHIEVEMENT_NAMES = {
  [SadAchievement.FIRST_EMAIL]: "First Email Sent",
  [SadAchievement.PROCRASTINATION_MASTER]: "Procrastination Master",
  [SadAchievement.EMOTIONAL_DAMAGE]: "Emotional Damage Taken",
  [SadAchievement.CORPORATE_DRONE]: "Corporate Drone",
  [SadAchievement.WEEKEND_WARRIOR]: "Weekend Warrior",
  [SadAchievement.MIDNIGHT_OIL]: "Midnight Oil Burner",
  [SadAchievement.REPLY_ALL_DISASTER]: "Reply All Disaster",
  [SadAchievement.AUTOCORRECT_VICTIM]: "Autocorrect Victim",
  [SadAchievement.MEETING_SCHEDULER]: "Meeting Scheduler",
  [SadAchievement.OUT_OF_OFFICE_MASTER]: "Out of Office Master"
} as const;