"use client"
import { useChainId, useAccount } from "wagmi"
import { getNetworkName, getContracts } from "@/lib/contracts"

export default function NetworkStatus() {
  const chainId = useChainId()
  const { address, isConnected } = useAccount()
  
  if (!isConnected) {
    return (
      <div className="p-4 bg-gray-800 text-white rounded-lg">
        <h3 className="text-lg font-bold mb-2">Network Status</h3>
        <p>Wallet not connected</p>
      </div>
    )
  }

  const networkName = getNetworkName(chainId)
  const contracts = getContracts(chainId)
  
  return (
    <div className="p-4 bg-gray-800 text-white rounded-lg">
      <h3 className="text-lg font-bold mb-2">Network Status</h3>
      <div className="space-y-2">
        <p><strong>Connected Network:</strong> {networkName}</p>
        <p><strong>Chain ID:</strong> {chainId}</p>
        <p><strong>Wallet Address:</strong> {address}</p>
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Contract Addresses:</h4>
          <div className="text-sm space-y-1">
            <p><strong>SADCoin:</strong> {contracts.SADCoin}</p>
            <p><strong>FEELS:</strong> {contracts.FEELS}</p>
            <p><strong>ConversionContract:</strong> {contracts.ConversionContract}</p>
            <p><strong>GameRewards:</strong> {contracts.GameRewards}</p>
            <p><strong>StakingContract:</strong> {contracts.StakingContract}</p>
            <p><strong>NFTClaim:</strong> {contracts.NFTClaim}</p>
          </div>
        </div>
        {chainId === 43113 && (
          <div className="mt-2 p-2 bg-green-600 rounded">
            ✅ Connected to Avalanche Fuji (Primary Network)
          </div>
        )}
        {chainId === 11155111 && (
          <div className="mt-2 p-2 bg-yellow-600 rounded">
            ⚠️ Connected to Sepolia (Fallback Network)
          </div>
        )}
        {chainId !== 43113 && chainId !== 11155111 && (
          <div className="mt-2 p-2 bg-red-600 rounded">
            ❌ Connected to Unsupported Network
          </div>
        )}
      </div>
    </div>
  )
}