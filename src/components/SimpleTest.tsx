"use client"
import { useState } from "react"
import { useAccount, useWriteContract, useReadContract } from "wagmi"
import { parseEther } from "viem"
import { Button } from "@/components/ui/button"
import { SEPOLIA_CONTRACTS, ConversionContract_ABI } from "@/lib/contracts"

export function SimpleTest() {
  const { address, isConnected, chain } = useAccount()
  const { writeContract, isPending, error } = useWriteContract()
  const [status, setStatus] = useState("Ready")

  // Test read function first
  const { data: conversionRate } = useReadContract({
    address: SEPOLIA_CONTRACTS.ConversionContract,
    abi: ConversionContract_ABI,
    functionName: 'currentConversionRate'
  })

  const handleSimpleTest = async () => {
    if (!address) {
      setStatus("No wallet connected")
      return
    }

    try {
      setStatus("Sending transaction...")
      
      const hash = await writeContract({
        address: SEPOLIA_CONTRACTS.ConversionContract,
        abi: ConversionContract_ABI,
        functionName: 'purchaseSadness',
        value: parseEther("0.001")
      })
      
      setStatus(`Transaction sent: ${hash}`)
      
    } catch (err: any) {
      setStatus(`Error: ${err.message}`)
      console.error("Transaction error:", err)
    }
  }

  if (!isConnected) {
    return <div className="p-4 border border-red-400 text-red-400">Wallet not connected</div>
  }

  return (
    <div className="p-4 border border-green-400 text-green-400 font-mono text-sm">
      <h3 className="text-lg mb-2">SIMPLE TRANSACTION TEST</h3>
      <div className="mb-2">Chain: {chain?.name} ({chain?.id})</div>
      <div className="mb-2">Address: {address?.slice(0, 10)}...</div>
      <div className="mb-2">Conversion Rate: {conversionRate?.toString() || "Loading..."}</div>
      <div className="mb-2">Status: {status}</div>
      {error && <div className="mb-2 text-red-400">Error: {error.message}</div>}
      
      <Button
        onClick={handleSimpleTest}
        disabled={isPending || chain?.id !== 11155111}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        {isPending ? "Sending..." : "Test 0.001 ETH Purchase"}
      </Button>
    </div>
  )
}