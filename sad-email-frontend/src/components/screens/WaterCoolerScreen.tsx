"use client"
import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { parseEther } from "viem"
import { Button } from "@/components/ui/button"
import { 
  useSADCoinBalance, 
  useFEELSBalance, 
  useStakeInfo,
  usePendingRewards,
  useStakeSadness,
  useHarvestFeelings,
  formatSADBalance,
  formatFEELSBalance,
  useSADAllowance,
  useApproveSAD,
  useWatchStakingRewards
} from "@/hooks/useContracts"
import { SEPOLIA_CONTRACTS, StakingContract_ABI, SADCoin_ABI } from "@/lib/contracts"

interface WaterCoolerScreenProps {
  onBack: () => void
}

const SAD_JOKES = [
  "Why do programmers prefer dark mode? Because light attracts bugs... and feelings. 💔",
  "My code works perfectly... in production it cries like me. 🥲",
  "Error 404: Happiness not found. Please try staking more SAD. 😭",
  "Why do I code? Because debugging my life is harder than debugging my programs. 🐛"
]

export function WaterCoolerScreen({ onBack }: WaterCoolerScreenProps) {
  const { address, isConnected, chain } = useAccount()
  
  // Contract data
  const { data: sadBalance } = useSADCoinBalance(address)
  const { data: feelsBalance, refetch: refetchFEELS } = useFEELSBalance(address)
  const { data: stakeInfo } = useStakeInfo(address)
  const { data: pendingRewards } = usePendingRewards(address)
  const { data: stakingAllowance, refetch: refetchAllowance } = useSADAllowance(address, SEPOLIA_CONTRACTS.StakingContract)
  
  // Staking functionality
  const [stakeAmount, setStakeAmount] = useState("69")
  const { writeContract: stakeSadness, isPending: isStaking } = useStakeSadness()
  const { writeContract: harvestFeelings, isPending: isHarvesting } = useHarvestFeelings()
  const { writeContract: approveSAD, isPending: isApproving } = useApproveSAD()
  const { writeContract: requestUnstake, isPending: isRequestingUnstake } = useStakeSadness() // Using same hook for unstake
  
  // Status and jokes
  const [status, setStatus] = useState<string>("Welcome to the office water cooler! 💧")
  const [currentJoke, setCurrentJoke] = useState(SAD_JOKES[0])
  const [lastAction, setLastAction] = useState<string>("")

  // Change joke every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentJoke(SAD_JOKES[Math.floor(Math.random() * SAD_JOKES.length)])
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  // Watch for staking events
  useWatchStakingRewards(address, () => {
    refetchFEELS()
    setStatus("Staking rewards harvested! 💰")
  })

  // Approval handler
  const handleApproveSAD = async () => {
    if (!address) return
    
    try {
      setStatus("Asking the water cooler for permission to stake your sadness... 📝")
      setLastAction("Requesting approval...")
      
      await approveSAD({
        address: SEPOLIA_CONTRACTS.SADCoin,
        abi: SADCoin_ABI,
        functionName: 'approve',
        args: [SEPOLIA_CONTRACTS.StakingContract, parseEther("1000000")]
      })
      
      setStatus("Permission granted! The water cooler now trusts you with your sadness 🤝")
      setLastAction("Approval submitted to the blockchain")
      refetchAllowance()
      
    } catch (error: unknown) {
      const errorMsg = (error as Error).message?.includes('user rejected') 
        ? "You cancelled the approval - even the water cooler got rejected 😔"
        : `The water cooler malfunctioned: ${(error as Error).message}`
      
      setStatus(errorMsg)
      setLastAction(`Approval failed at ${new Date().toLocaleTimeString()}`)
    }
  }

  // Staking handler
  const handleStake = async () => {
    if (!address || !sadBalance || parseEther(stakeAmount) > (sadBalance as bigint)) return
    
    const stakeAmountBig = parseEther(stakeAmount)
    const currentAllowance = (stakingAllowance as bigint) || BigInt(0)
    
    if (currentAllowance < stakeAmountBig) {
      setStatus("❌ You need to approve first! The water cooler doesn't trust strangers 🚫")
      setLastAction("Insufficient allowance for staking")
      return
    }
    
    try {
      setStatus("Pouring your SAD tokens into the water cooler... 🪣")
      setLastAction("Staking in progress...")
      
      await stakeSadness({
        address: SEPOLIA_CONTRACTS.StakingContract,
        abi: StakingContract_ABI,
        functionName: 'stakeSadness',
        args: [stakeAmountBig]
      })
      
      setStatus("Your sadness is now marinating in the water cooler! Enjoy the FEELS 😌")
      setLastAction("Staking transaction submitted")
      
    } catch (error: unknown) {
      const errorMsg = (error as Error).message?.includes('user rejected') 
        ? "You cancelled the staking - the water cooler remains empty 💔"
        : `The water cooler leaked: ${(error as Error).message}`
      
      setStatus(errorMsg)
      setLastAction(`Staking failed at ${new Date().toLocaleTimeString()}`)
    }
  }

  // Harvest handler
  const handleHarvest = async () => {
    if (!address || !pendingRewards || (pendingRewards as bigint) === BigInt(0)) return
    
    try {
      setStatus("Collecting your FEELS from the water cooler... 🌾")
      setLastAction("Harvesting rewards...")
      
      await harvestFeelings({
        address: SEPOLIA_CONTRACTS.StakingContract,
        abi: StakingContract_ABI,
        functionName: 'harvestFeelings'
      })
      
      setStatus("FEELS harvested! Your emotional portfolio is growing 📈")
      setLastAction("Harvest submitted")
      
    } catch (error: unknown) {
      const errorMsg = (error as Error).message?.includes('user rejected') 
        ? "You rejected the harvest - the FEELS remain unharvested 🥀"
        : `Harvest malfunction: ${(error as Error).message}`
      
      setStatus(errorMsg)
      setLastAction(`Harvest failed at ${new Date().toLocaleTimeString()}`)
    }
  }

  // Unstake request handler
  const handleRequestUnstake = async () => {
    if (!address || !stakeInfo || !Array.isArray(stakeInfo) || stakeInfo[0] === BigInt(0)) return
    
    try {
      setStatus("Asking the water cooler to release your sadness... ⏰")
      setLastAction("Requesting unstake...")
      
      await requestUnstake({
        address: SEPOLIA_CONTRACTS.StakingContract,
        abi: StakingContract_ABI,
        functionName: 'requestUnstake'
      })
      
      setStatus("Unstake requested! Now you wait... like waiting for a slow coffee machine ☕")
      setLastAction("Unstake request submitted")
      
    } catch (error: unknown) {
      const errorMsg = (error as Error).message?.includes('user rejected') 
        ? "You cancelled the unstake request - your sadness stays put 🔒"
        : `Unstake request failed: ${(error as Error).message}`
      
      setStatus(errorMsg)
      setLastAction(`Unstake request failed at ${new Date().toLocaleTimeString()}`)
    }
  }

  const isWrongNetwork = chain?.id !== 11155111

  if (!isConnected) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4 text-red-400">⚠️ WALLET NOT CONNECTED</h2>
          <p className="mb-4">Please connect your wallet to access the water cooler</p>
          <Button onClick={onBack} className="bg-gray-600 hover:bg-gray-700 text-white text-xs">
            🚪 BACK TO EMAIL
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Water Cooler */}
      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">💧 OFFICE WATER COOLER 💧</h2>
        <p className="text-sm text-blue-300 mb-3">Where colleagues gather to stake their sadness</p>
        
        {/* Water Cooler ASCII Art */}
        <div className="border-2 border-blue-400 bg-black p-4 mb-4 mx-auto w-fit">
          <div className="text-4xl mb-2">💧</div>
          <div className="text-xs">SADNESS DISPENSER</div>
        </div>
        
        <div className="text-xs text-blue-500 italic mb-4">"{currentJoke}"</div>
      </div>

      {/* Network Warning */}
      {isWrongNetwork && (
        <div className="border-2 border-red-400 bg-black text-red-400 p-3 text-center text-sm">
          ⚠️ Wrong Network! Please switch to Sepolia testnet
        </div>
      )}

      {/* Balances */}
      <div className="grid grid-cols-2 gap-4">
        <div className="border border-green-400 p-3">
          <div className="text-sm font-bold mb-2">💰 WALLET</div>
          <div className="text-xs space-y-1">
            <div>SAD: {formatSADBalance(typeof sadBalance === 'bigint' ? sadBalance : BigInt(0))}</div>
            <div>FEELS: {formatFEELSBalance(typeof feelsBalance === 'bigint' ? feelsBalance : BigInt(0))}</div>
          </div>
        </div>
        
        <div className="border border-blue-400 p-3">
          <div className="text-sm font-bold mb-2">🏢 STAKING</div>
          <div className="text-xs space-y-1">
            <div>Staked: {stakeInfo && Array.isArray(stakeInfo) ? formatSADBalance(stakeInfo[0] as bigint) : "0.00"}</div>
            <div>Pending: {formatFEELSBalance(typeof pendingRewards === 'bigint' ? pendingRewards : BigInt(0))}</div>
          </div>
        </div>
      </div>

      {/* Staking Interface */}
      <div className="border-2 border-blue-400 bg-black p-4">
        <h3 className="text-sm font-bold mb-3 text-center">💧 STAKE AT WATER COOLER</h3>
        
        {/* Amount Input */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <input
            type="number"
            value={stakeAmount}
            onChange={(e) => setStakeAmount(e.target.value)}
            min="69"
            className="bg-black border border-blue-400 text-blue-400 px-2 py-1 w-20 text-center text-xs"
            placeholder="69"
          />
          <span className="text-xs">SAD tokens</span>
        </div>

        <div className="text-xs text-center text-blue-500 mb-3">
          Min: 69 SAD | Allowance: {formatSADBalance(typeof stakingAllowance === 'bigint' ? stakingAllowance : BigInt(0))}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={handleApproveSAD}
            disabled={isApproving || isWrongNetwork}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1"
          >
            {isApproving ? "Approving..." : "✅ APPROVE"}
          </Button>
          <Button
            onClick={handleStake}
            disabled={isStaking || isWrongNetwork || !sadBalance || parseEther(stakeAmount || "0") > (sadBalance as bigint)}
            className="bg-orange-600 hover:bg-orange-700 text-white text-xs px-2 py-1"
          >
            {isStaking ? "Staking..." : "🪣 STAKE"}
          </Button>
          <Button
            onClick={handleHarvest}
            disabled={isHarvesting || isWrongNetwork || !pendingRewards || (pendingRewards as bigint) === BigInt(0)}
            className="bg-pink-600 hover:bg-pink-700 text-white text-xs px-2 py-1"
          >
            {isHarvesting ? "Harvesting..." : "🌾 HARVEST"}
          </Button>
          <Button
            onClick={onBack}
            className="bg-gray-600 hover:bg-gray-700 text-white text-xs px-2 py-1"
          >
            🚪 BACK
          </Button>
        </div>
      </div>

      {/* Status */}
      <div className="border border-yellow-400 p-3 text-center">
        <div className="text-xs text-yellow-400 font-bold mb-1">WATER COOLER GOSSIP:</div>
        <div className="text-xs text-green-300">{status}</div>
      </div>
    </div>
  )
}