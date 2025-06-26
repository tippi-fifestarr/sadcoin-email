"use client"
import { useReadContract, useWriteContract, useWatchContractEvent } from "wagmi"
import { parseEther, formatEther } from "viem"
import { SEPOLIA_CONTRACTS, SADCoin_ABI, FEELS_ABI, ConversionContract_ABI } from "@/lib/contracts"

// SADCoin contract hooks
export function useSADCoinBalance(address?: `0x${string}`) {
  return useReadContract({
    address: SEPOLIA_CONTRACTS.SADCoin,
    abi: SADCoin_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { 
      enabled: !!address,
      refetchInterval: 5000 // Refresh every 5 seconds
    }
  });
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
  return useReadContract({
    address: SEPOLIA_CONTRACTS.FEELS,
    abi: FEELS_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { 
      enabled: !!address,
      refetchInterval: 5000
    }
  });
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
  if (!balance) return "0.0";
  return parseFloat(formatEther(balance)).toFixed(2);
}

export function formatFEELSBalance(balance?: bigint): string {
  if (!balance) return "0.0";
  return parseFloat(formatEther(balance)).toFixed(2);
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