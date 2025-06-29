"use client"
import { useState } from "react"
import { useReadContract } from "wagmi"
import { parseEther, formatEther } from "viem"
import { SEPOLIA_CONTRACTS, ConversionContract_ABI } from "@/lib/contracts"

export function PriceCalculator() {
  const [ethInput, setEthInput] = useState("0.01") // Start with more ETH
  
  // Get current ETH price and calculate purchase amount
  const { data: purchaseData, error: purchaseError } = useReadContract({
    address: SEPOLIA_CONTRACTS.ConversionContract,
    abi: ConversionContract_ABI,
    functionName: 'calculatePurchaseAmount',
    args: [parseEther(ethInput)],
    query: { 
      enabled: !!ethInput && Number(ethInput) > 0,
      refetchInterval: 10000 // Update every 10 seconds
    }
  })

  // Get current conversion rate
  const { data: conversionRate } = useReadContract({
    address: SEPOLIA_CONTRACTS.ConversionContract,
    abi: ConversionContract_ABI,
    functionName: 'currentConversionRate'
  })

  const sadAmount = purchaseData ? (purchaseData as [bigint, bigint])[0] : BigInt(0)
  const ethPriceUSD = purchaseData ? (purchaseData as [bigint, bigint])[1] : BigInt(0)

  return (
    <div className="border-2 border-blue-400 bg-black text-blue-400 p-4 font-mono text-sm mb-4">
      <h3 className="text-lg mb-3">═══ PRICE CALCULATOR ═══</h3>
      
      <div className="mb-3">
        <div className="text-yellow-400">CURRENT PRICES:</div>
        <div>ETH Price: ${ethPriceUSD ? (Number(formatEther(ethPriceUSD))).toFixed(2) : "Loading..."}</div>
        <div>SAD Price: $0.01 (fixed)</div>
        <div>Conversion Rate: {conversionRate?.toString() || "Loading..."} FEELS per SAD</div>
      </div>

      <div className="mb-3">
        <div className="text-cyan-400">PURCHASE CALCULATOR:</div>
        <div className="flex items-center gap-2 mt-1">
          <input
            type="number"
            value={ethInput}
            onChange={(e) => setEthInput(e.target.value)}
            step="0.001"
            min="0"
            className="bg-black border border-blue-400 text-blue-400 px-2 py-1 w-24 text-xs"
            placeholder="0.01"
          />
          <span>ETH →</span>
          <span>{sadAmount ? formatEther(sadAmount) : "0"} SAD</span>
        </div>
        
        {purchaseError && (
          <div className="text-red-400 text-xs mt-1">
            Error: {purchaseError.message}
          </div>
        )}
        
        <div className="text-xs text-blue-300 mt-2">
          Calculation: {ethInput} ETH × ${ethPriceUSD ? (Number(formatEther(ethPriceUSD))).toFixed(2) : "?"} ÷ $0.01 = {sadAmount ? formatEther(sadAmount) : "0"} SAD
        </div>
      </div>

      <div className="text-xs text-blue-600">
        <div className="text-yellow-400">RECOMMENDED AMOUNTS:</div>
        <div>• Minimum: 0.001 ETH (≈ {ethPriceUSD ? ((0.001 * Number(formatEther(ethPriceUSD))) / 0.01).toFixed(0) : "?"} SAD)</div>
        <div>• Small test: 0.01 ETH (≈ {ethPriceUSD ? ((0.01 * Number(formatEther(ethPriceUSD))) / 0.01).toFixed(0) : "?"} SAD)</div>
        <div>• Medium test: 0.1 ETH (≈ {ethPriceUSD ? ((0.1 * Number(formatEther(ethPriceUSD))) / 0.01).toFixed(0) : "?"} SAD)</div>
      </div>
    </div>
  )
}