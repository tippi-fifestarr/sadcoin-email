"use client"
import { useState } from "react"
import { useAccount, useBalance } from "wagmi"
import { parseEther } from "viem"
import { Button } from "@/components/ui/button"
import { 
  useSADCoinBalance, 
  useFEELSBalance, 
  useSadnessLevel,
  useEmotionalDamage,
  useConversionRate,
  usePurchaseCalculation,
  useLastPurchaseTime,
  usePurchaseSadness,
  useConvertFeelsToSad,
  formatSADBalance,
  formatFEELSBalance,
  calculateCooldownRemaining,
  formatCooldownTime,
  useWatchSADTransfers,
  useWatchSadnessPurchases
} from "@/hooks/useContracts"
import { SEPOLIA_CONTRACTS, ConversionContract_ABI } from "@/lib/contracts"
import { NetworkSwitcher } from "./NetworkSwitcher"

export function DebugPanel() {
  const { address, isConnected, chain } = useAccount()
  const { data: ethBalance } = useBalance({ address })
  
  // Contract data
  const { data: sadBalance, refetch: refetchSAD } = useSADCoinBalance(address)
  const { data: feelsBalance } = useFEELSBalance(address)
  const { data: sadnessLevel } = useSadnessLevel(address)
  const { data: emotionalDamage } = useEmotionalDamage(address)
  const { data: conversionRate } = useConversionRate()
  const { data: lastPurchaseTime } = useLastPurchaseTime(address)
  
  // Purchase testing
  const [testEthAmount, setTestEthAmount] = useState("0.001")
  const { data: purchasePreview } = usePurchaseCalculation(testEthAmount)
  const { writeContract: purchaseSadness, isPending: isPurchasing } = usePurchaseSadness()
  
  // Conversion testing
  const [testFeelsAmount, setTestFeelsAmount] = useState("111")
  const { writeContract: convertFeels, isPending: isConverting } = useConvertFeelsToSad()
  
  // Status tracking
  const [status, setStatus] = useState<string>("Ready for testing")
  const [lastAction, setLastAction] = useState<string>("")
  
  // Calculate cooldown
  const cooldownSeconds = calculateCooldownRemaining(lastPurchaseTime as bigint | undefined)
  const canPurchase = cooldownSeconds === 0
  
  // Watch for events
  useWatchSADTransfers(address, () => {
    refetchSAD()
    setStatus("SAD tokens received! 😢")
    setLastAction(`Transfer detected at ${new Date().toLocaleTimeString()}`)
  })
  
  useWatchSadnessPurchases(address, () => {
    refetchSAD()
    setStatus("Purchase completed! 🎉")
    setLastAction(`Purchase confirmed at ${new Date().toLocaleTimeString()}`)
  })

  const handlePurchaseTest = async () => {
    if (!address || !canPurchase) {
      setStatus("❌ Cannot purchase: " + (!address ? "No wallet connected" : "In cooldown period"))
      return
    }
    
    try {
      setStatus("Preparing purchase transaction...")
      setLastAction("Initiating purchase...")
      
      console.log("Attempting purchase with:", {
        contract: SEPOLIA_CONTRACTS.ConversionContract,
        amount: testEthAmount,
        value: parseEther(testEthAmount).toString()
      })
      
      const result = await purchaseSadness({
        address: SEPOLIA_CONTRACTS.ConversionContract,
        abi: ConversionContract_ABI,
        functionName: 'purchaseSadness',
        value: parseEther(testEthAmount)
      })
      
      console.log("Transaction result:", result)
      setStatus("Transaction sent! Waiting for confirmation...")
      setLastAction("Transaction submitted to mempool")
      
    } catch (error: unknown) {
      console.error("Purchase error:", error)
      const errorMsg = (error as Error).message?.includes('user rejected')
        ? "Transaction cancelled by user"
        : (error as Error).message?.includes('insufficient funds')
        ? "Insufficient ETH balance"
        : (error as Error).message?.includes('execution reverted')
        ? "Contract execution failed - check requirements"
        : `Error: ${(error as Error).message}`
      
      setStatus(`❌ ${errorMsg}`)
      setLastAction(`Failed: ${errorMsg}`)
    }
  }

  const handleConversionTest = async () => {
    if (!address || !feelsBalance || parseEther(testFeelsAmount) > (feelsBalance as bigint)) return
    
    try {
      setStatus("Converting FEELS to SAD...")
      setLastAction("Initiating conversion...")
      
      await convertFeels({
        address: SEPOLIA_CONTRACTS.ConversionContract,
        abi: ConversionContract_ABI,
        functionName: 'convertFeelsToSad',
        args: [parseEther(testFeelsAmount)]
      })
      
      setStatus("Conversion transaction sent!")
      setLastAction("Conversion submitted to mempool")
      
    } catch (error: unknown) {
      const errorMsg = (error as Error).message?.includes('user rejected') 
        ? "Transaction cancelled by user"
        : `Error: ${(error as Error).message}`
      
      setStatus(`❌ ${errorMsg}`)
      setLastAction(`Conversion failed: ${errorMsg}`)
    }
  }

  if (!isConnected) {
    return (
      <div className="border-2 border-red-400 bg-black text-red-400 p-4 font-mono text-sm">
        <h3 className="text-lg mb-2">═══ BLOCKCHAIN DEBUG TERMINAL ═══</h3>
        <div className="text-red-300">⚠️ WALLET NOT CONNECTED</div>
        <div className="mt-2">Please connect your wallet to begin testing</div>
      </div>
    )
  }

  const isWrongNetwork = chain?.id !== 11155111

  return (
    <div className="border-2 border-green-400 bg-black text-green-400 p-4 font-mono text-sm mb-4">
      <h3 className="text-lg mb-3">═══ BLOCKCHAIN DEBUG TERMINAL ═══</h3>
      
      {/* Network Switcher */}
      <NetworkSwitcher />
      
      {/* Network Status */}
      <div className="mb-3">
        <div className="text-yellow-400">NETWORK STATUS:</div>
        <div>Chain: {chain?.name || "Unknown"} ({chain?.id})</div>
        <div>Wallet: {address?.slice(0, 8)}...{address?.slice(-6)}</div>
        <div>ETH Balance: {ethBalance ? parseFloat(ethBalance.formatted).toFixed(4) : "0.0000"} ETH</div>
      </div>

      {/* Token Balances */}
      <div className="mb-3">
        <div className="text-yellow-400">TOKEN BALANCES:</div>
        <div>SAD Balance: {formatSADBalance(sadBalance as bigint)} SAD</div>
        <div>FEELS Balance: {formatFEELSBalance(feelsBalance as bigint)} FEELS</div>
        <div>Sadness Level: {(sadnessLevel as bigint)?.toString() || "0"}</div>
        <div>Emotional Damage: {(emotionalDamage as bigint)?.toString() || "0"}</div>
      </div>

      {/* Conversion Info */}
      <div className="mb-3">
        <div className="text-yellow-400">CONVERSION DATA:</div>
        <div>Current Rate: {(conversionRate as bigint)?.toString() || "Loading..."} FEELS per SAD</div>
        <div>Purchase Cooldown: {formatCooldownTime(cooldownSeconds)}</div>
      </div>

      {/* Purchase Testing */}
      <div className="mb-3">
        <div className="text-cyan-400">PURCHASE TESTING:</div>
        <div className="flex items-center gap-2 mt-1">
          <input
            type="number"
            value={testEthAmount}
            onChange={(e) => setTestEthAmount(e.target.value)}
            step="0.001"
            min="0"
            className="bg-black border border-green-400 text-green-400 px-2 py-1 w-20 text-xs"
            placeholder="0.001"
          />
          <span>ETH →</span>
          <span>{purchasePreview ? formatSADBalance((purchasePreview as [bigint, bigint])[0]) : "0"} SAD</span>
        </div>
        <Button
          onClick={handlePurchaseTest}
          disabled={!canPurchase || isPurchasing || isWrongNetwork || !testEthAmount}
          className="mt-2 bg-green-600 hover:bg-green-700 text-black text-xs px-3 py-1 h-auto"
        >
          {isPurchasing ? "Purchasing..." : canPurchase ? "🧪 TEST PURCHASE" : `Cooldown: ${formatCooldownTime(cooldownSeconds)}`}
        </Button>
      </div>

      {/* Conversion Testing */}
      {feelsBalance && (feelsBalance as bigint) > 0 && (
        <div className="mb-3">
          <div className="text-cyan-400">CONVERSION TESTING:</div>
          <div className="flex items-center gap-2 mt-1">
            <input
              type="number"
              value={testFeelsAmount}
              onChange={(e) => setTestFeelsAmount(e.target.value)}
              max={formatFEELSBalance(feelsBalance as bigint)}
              className="bg-black border border-green-400 text-green-400 px-2 py-1 w-20 text-xs"
              placeholder="111"
            />
            <span>FEELS → {conversionRate ? (Number(testFeelsAmount) / Number(conversionRate)).toFixed(2) : "0"} SAD</span>
          </div>
          <Button
            onClick={handleConversionTest}
            disabled={isConverting || isWrongNetwork || !testFeelsAmount}
            className="mt-2 bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1 h-auto"
          >
            {isConverting ? "Converting..." : "🧪 TEST CONVERSION"}
          </Button>
        </div>
      )}

      {/* Status Display */}
      <div className="mb-3">
        <div className="text-yellow-400">STATUS:</div>
        <div className="text-green-300">{status}</div>
        {lastAction && <div className="text-green-500 text-xs">Last: {lastAction}</div>}
      </div>

      {/* Contract Addresses */}
      <div className="text-xs text-green-600">
        <div className="text-yellow-400">CONTRACTS:</div>
        <div>SAD: {SEPOLIA_CONTRACTS.SADCoin.slice(0, 10)}...</div>
        <div>Conversion: {SEPOLIA_CONTRACTS.ConversionContract.slice(0, 10)}...</div>
      </div>
    </div>
  )
}