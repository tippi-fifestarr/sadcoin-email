"use client"
import { useState, useEffect } from "react"
import { useAccount, useBalance } from "wagmi"
import { parseEther } from "viem"
import { Button } from "@/components/ui/button"
import { 
  useSADCoinBalance, 
  useFEELSBalance, 
  useStakeInfo,
  usePendingRewards,
  useTotalStaked,
  useStakingConstants,
  useStakeSadness,
  useRequestUnstake,
  useUnstakeSadness,
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
  "I told my boss I needed a mental health day. He said 'Take two, you'll need them both.' 😢",
  "My code works perfectly... in production it cries like me. 🥲",
  "Why did the developer break up with their code? It had too many issues. 💔",
  "I'm not procrastinating, I'm just optimizing my anxiety levels. ⏰",
  "Error 404: Happiness not found. Please try staking more SAD. 😭",
  "My computer crashed again. Even technology can't handle my sadness. 💻💀",
  "Why do I code? Because debugging my life is harder than debugging my programs. 🐛"
]

export function WaterCoolerScreen({ onBack }: WaterCoolerScreenProps) {
  const { address, isConnected, chain } = useAccount()
  const { data: ethBalance } = useBalance({ address })
  
  // Contract data
  const { data: sadBalance, refetch: refetchSAD } = useSADCoinBalance(address)
  const { data: feelsBalance, refetch: refetchFEELS } = useFEELSBalance(address)
  const { data: stakeInfo } = useStakeInfo(address)
  const { data: pendingRewards } = usePendingRewards(address)
  const { data: totalStaked } = useTotalStaked()
  const { rewardRate, minimumStake, unstakeDelay } = useStakingConstants()
  
  // Allowance data for staking
  const { data: stakingAllowance, refetch: refetchAllowance } = useSADAllowance(address, SEPOLIA_CONTRACTS.StakingContract)
  
  // Staking functionality
  const [stakeAmount, setStakeAmount] = useState("69")
  const { writeContract: stakeSadness, isPending: isStaking } = useStakeSadness()
  const { writeContract: requestUnstake, isPending: isRequestingUnstake } = useRequestUnstake()
  const { writeContract: unstakeSadness, isPending: isUnstaking } = useUnstakeSadness()
  const { writeContract: harvestFeelings, isPending: isHarvesting } = useHarvestFeelings()
  const { writeContract: approveSAD, isPending: isApproving } = useApproveSAD()
  
  // Status and jokes
  const [status, setStatus] = useState<string>("Welcome to the water cooler of sadness 💧")
  const [currentJoke, setCurrentJoke] = useState(SAD_JOKES[0])
  const [lastAction, setLastAction] = useState<string>("")

  // Change joke every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentJoke(SAD_JOKES[Math.floor(Math.random() * SAD_JOKES.length)])
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  // Watch for staking events
  useWatchStakingRewards(address, () => {
    refetchFEELS()
    setStatus("Staking rewards harvested! The water tastes sweeter now 💰")
    setLastAction(`Harvest completed at ${new Date().toLocaleTimeString()}`)
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
    if (!address || !stakeInfo || (stakeInfo as any[])?.[0] === BigInt(0)) return
    
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
      <div className="min-h-screen bg-black text-blue-400 font-mono p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">💧 CORPORATE WATER COOLER 💧</h1>
            <p className="text-blue-300">Where sadness flows and FEELS grow</p>
          </div>
          
          <div className="border-2 border-red-400 bg-black text-red-400 p-8 text-center">
            <h2 className="text-xl mb-4">⚠️ WALLET NOT CONNECTED ⚠️</h2>
            <p className="mb-4">Please connect your wallet to access the water cooler</p>
            <p className="text-sm text-red-300">Even the water cooler needs authentication these days... 😔</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-blue-400 font-mono p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">💧 CORPORATE WATER COOLER 💧</h1>
          <p className="text-blue-300 mb-2">Where colleagues gather to share sadness and stake their troubles away</p>
          <div className="text-sm text-blue-500 italic">"{currentJoke}"</div>
        </div>

        {/* Water Cooler Image Placeholder */}
        <div className="flex justify-center mb-8">
          <div className="w-48 h-64 border-4 border-blue-400 bg-gradient-to-b from-blue-900 to-blue-800 rounded-lg flex flex-col items-center justify-center text-6xl">
            <div className="mb-4">💧</div>
            <div className="text-lg font-bold">WATER</div>
            <div className="text-lg font-bold">COOLER</div>
            <div className="text-sm mt-2">OF SADNESS</div>
          </div>
        </div>

        {/* Network Status */}
        {isWrongNetwork && (
          <div className="border-2 border-red-400 bg-black text-red-400 p-4 mb-6 text-center">
            <p>⚠️ Wrong Network! Please switch to Sepolia testnet</p>
          </div>
        )}

        {/* Wallet Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Left Panel - Wallet Stats */}
          <div className="border-2 border-blue-400 bg-black p-6">
            <h3 className="text-lg font-bold mb-4 text-center">💼 YOUR SADNESS PORTFOLIO</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Wallet:</span>
                <span className="text-blue-300">{address?.slice(0, 8)}...{address?.slice(-6)}</span>
              </div>
              <div className="flex justify-between">
                <span>ETH Balance:</span>
                <span className="text-green-400">{ethBalance ? parseFloat(ethBalance.formatted).toFixed(4) : "0.0000"} ETH</span>
              </div>
              <div className="flex justify-between">
                <span>SAD Balance:</span>
                <span className="text-yellow-400">{formatSADBalance(typeof sadBalance === 'bigint' ? sadBalance : BigInt(0))} SAD</span>
              </div>
              <div className="flex justify-between">
                <span>FEELS Balance:</span>
                <span className="text-pink-400">{formatFEELSBalance(typeof feelsBalance === 'bigint' ? feelsBalance : BigInt(0))} FEELS</span>
              </div>
            </div>
          </div>

          {/* Right Panel - Staking Stats */}
          <div className="border-2 border-blue-400 bg-black p-6">
            <h3 className="text-lg font-bold mb-4 text-center">🏢 OFFICE WATER COOLER STATS</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Your Staked SAD:</span>
                <span className="text-orange-400">{stakeInfo && Array.isArray(stakeInfo) ? formatSADBalance(stakeInfo[0] as bigint) : "0.00"} SAD</span>
              </div>
              <div className="flex justify-between">
                <span>Pending FEELS:</span>
                <span className="text-pink-400">{formatFEELSBalance(typeof pendingRewards === 'bigint' ? pendingRewards : BigInt(0))} FEELS</span>
              </div>
              <div className="flex justify-between">
                <span>Total Office SAD:</span>
                <span className="text-gray-400">{formatSADBalance(typeof totalStaked === 'bigint' ? totalStaked : BigInt(0))} SAD</span>
              </div>
              <div className="flex justify-between">
                <span>Reward Rate:</span>
                <span className="text-green-400">{typeof rewardRate.data === 'bigint' ? rewardRate.data.toString() : "42"} FEELS/hour</span>
              </div>
              <div className="flex justify-between">
                <span>Approval Status:</span>
                <span className={stakingAllowance && (stakingAllowance as bigint) > BigInt(0) ? "text-green-400" : "text-red-400"}>
                  {stakingAllowance && (stakingAllowance as bigint) > BigInt(0) ? "✅ Approved" : "❌ Not Approved"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Staking Interface */}
        <div className="border-2 border-blue-400 bg-black p-6 mb-6">
          <h3 className="text-lg font-bold mb-4 text-center">💧 STAKE YOUR SADNESS AT THE WATER COOLER</h3>
          
          {/* Stake Amount Input */}
          <div className="flex justify-center items-center gap-4 mb-6">
            <label className="text-blue-300">Amount to Stake:</label>
            <input
              type="number"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              min="69"
              className="bg-black border-2 border-blue-400 text-blue-400 px-3 py-2 w-32 text-center"
              placeholder="69"
            />
            <span className="text-blue-300">SAD tokens</span>
          </div>

          <div className="text-center text-xs text-blue-500 mb-4">
            Minimum stake: 69 SAD (because nice, but sad) | Current allowance: {formatSADBalance(typeof stakingAllowance === 'bigint' ? stakingAllowance : BigInt(0))} SAD
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={handleApproveSAD}
              disabled={isApproving || isWrongNetwork}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
            >
              {isApproving ? "Approving..." : "✅ APPROVE SADNESS"}
            </Button>
            <Button
              onClick={handleStake}
              disabled={isStaking || isWrongNetwork || !sadBalance || parseEther(stakeAmount || "0") > (sadBalance as bigint)}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2"
            >
              {isStaking ? "Staking..." : "🪣 POUR INTO COOLER"}
            </Button>
            <Button
              onClick={handleHarvest}
              disabled={isHarvesting || isWrongNetwork || !pendingRewards || (pendingRewards as bigint) === BigInt(0)}
              className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2"
            >
              {isHarvesting ? "Harvesting..." : "🌾 COLLECT FEELS"}
            </Button>
            <Button
              onClick={handleRequestUnstake}
              disabled={isRequestingUnstake || isWrongNetwork || !stakeInfo || (stakeInfo as any[])?.[0] === BigInt(0)}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2"
            >
              {isRequestingUnstake ? "Requesting..." : "⏰ REQUEST UNSTAKE"}
            </Button>
          </div>
        </div>

        {/* Status Display */}
        <div className="border-2 border-blue-400 bg-black p-6 mb-6">
          <h3 className="text-lg font-bold mb-4 text-center">📺 WATER COOLER GOSSIP</h3>
          <div className="text-center">
            <div className="text-blue-300 mb-2">{status}</div>
            {lastAction && <div className="text-blue-500 text-sm">Latest Action: {lastAction}</div>}
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <Button
            onClick={onBack}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2"
          >
            🚪 BACK TO EMAIL WRITING
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-blue-600">
          <p>Remember: In corporate life, the real treasure was the sadness we staked along the way 💼💔</p>
        </div>
      </div>
    </div>
  )
}