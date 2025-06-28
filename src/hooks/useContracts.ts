"use client"
import { useReadContract, useWriteContract, useWatchContractEvent, useContractWrite, useSimulateContract } from "wagmi"
import { parseEther, formatEther } from "viem"
import { SEPOLIA_CONTRACTS, SADCoin_ABI, FEELS_ABI, ConversionContract_ABI } from "@/lib/contracts"

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
/**
 * usePurchaseSadness - Wagmi v2+ hook for payable purchaseSadness function.
 * @param ethAmount - ETH amount to send (string or bigint, in ETH units)
 * @param args - Arguments for purchaseSadness (if any)
 * @returns Wagmi writeContract function, simulation status, and error
 *
 * Usage:
 *   const { write, isSimulating, isSimulated, error } = usePurchaseSadness(testEthAmount, [arg1, arg2])
 *   write?.()
 */
export function usePurchaseSadness(ethAmount?: string | bigint, args: any[] = []) {
  const value = ethAmount ? parseEther(ethAmount.toString()) : undefined;
  const simulate = useSimulateContract({
    address: SEPOLIA_CONTRACTS.ConversionContract,
    abi: ConversionContract_ABI,
    functionName: 'purchaseSadness',
    args,
    value,
    query: { enabled: value !== undefined && (typeof value === 'bigint' ? value > BigInt(0) : Number(value) > 0) },
  });
  const { writeContract, isPending, data, error: writeError } = useWriteContract();
  const write = simulate.data?.request
    ? () => writeContract(simulate.data.request)
    : undefined;
  return {
    write,
    isSimulating: simulate.isPending,
    isSimulated: simulate.isSuccess,
    simulationError: simulate.error,
    isPending,
    data,
    writeError,
  };
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