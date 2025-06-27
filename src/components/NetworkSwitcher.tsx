"use client"
import { useSwitchChain, useChainId } from "wagmi"
import { sepolia } from "wagmi/chains"
import { Button } from "@/components/ui/button"

export function NetworkSwitcher() {
  const chainId = useChainId()
  const { switchChain, isPending } = useSwitchChain()
  
  const isOnSepolia = chainId === sepolia.id
  
  if (isOnSepolia) {
    return (
      <div className="text-green-400 text-sm">
        ✅ Connected to Sepolia Testnet
      </div>
    )
  }
  
  return (
    <div className="border border-yellow-400 p-3 mb-3">
      <div className="text-yellow-400 mb-2">⚠️ Wrong Network Detected</div>
      <div className="text-sm text-yellow-300 mb-3">
        You're connected to {chainId === 1 ? "Ethereum Mainnet" : `Chain ${chainId}`}. 
        Please switch to Sepolia testnet to test the contracts.
      </div>
      <Button
        onClick={() => switchChain({ chainId: sepolia.id })}
        disabled={isPending}
        className="bg-yellow-600 hover:bg-yellow-700 text-black text-sm px-4 py-2"
      >
        {isPending ? "Switching..." : "🔄 Switch to Sepolia"}
      </Button>
    </div>
  )
}