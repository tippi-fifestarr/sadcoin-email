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
  useWatchSadnessPurchases,
  useStakeInfo,
  usePendingRewards,
  useTotalStaked,
  useStakingConstants,
  useStakeSadness,
  useRequestUnstake,
  useUnstakeSadness,
  useHarvestFeelings,
  useNFTBalance,
  useUserTotalSadness,
  useGameStats,
  usePlayerSessions,
  useStartGameSession,
  useCompleteGame,
  useRequestNFTClaim,
  SadAchievement,
  ACHIEVEMENT_NAMES,
  useWatchGameRewards,
  useWatchStakingRewards,
  useWatchNFTClaims,
  useSADAllowance,
  useApproveSAD
} from "@/hooks/useContracts"
import { SEPOLIA_CONTRACTS, ConversionContract_ABI, StakingContract_ABI, GameRewards_ABI, NFTClaim_ABI, SADCoin_ABI } from "@/lib/contracts"
import { NetworkSwitcher } from "./NetworkSwitcher"

export function DebugPanel() {
  const { address, isConnected, chain } = useAccount()
  const { data: ethBalance } = useBalance({ address })
  
  // Contract data
  const { data: sadBalance, refetch: refetchSAD } = useSADCoinBalance(address)
  const { data: feelsBalance, refetch: refetchFEELS } = useFEELSBalance(address)
  const { data: sadnessLevel } = useSadnessLevel(address)
  const { data: emotionalDamage } = useEmotionalDamage(address)
  const { data: conversionRate } = useConversionRate()
  const { data: lastPurchaseTime } = useLastPurchaseTime(address)
  
  // Staking data
  const { data: stakeInfo } = useStakeInfo(address)
  const { data: pendingRewards } = usePendingRewards(address)
  const { data: totalStaked } = useTotalStaked()
  const { rewardRate, minimumStake, unstakeDelay } = useStakingConstants()
  
  // Game data
  const { data: gameStats } = useGameStats()
  const { data: playerSessions } = usePlayerSessions(address)
  
  // NFT data
  const { data: nftBalance } = useNFTBalance(address)
  const { data: userTotalSadness } = useUserTotalSadness(address)
  
  // Allowance data for staking
  const { data: stakingAllowance, refetch: refetchAllowance } = useSADAllowance(address, SEPOLIA_CONTRACTS.StakingContract)
  
  // Purchase testing
  const [testEthAmount, setTestEthAmount] = useState("0.001")
  const isValidEthAmount = testEthAmount !== "" && !isNaN(Number(testEthAmount)) && Number(testEthAmount) > 0
  const { data: purchasePreview } = usePurchaseCalculation(isValidEthAmount ? testEthAmount : "0")
  const { writeContract: purchaseSadness, isPending: isPurchasing } = usePurchaseSadness()
  let sadAmountStr = "0";
  if (
    purchasePreview &&
    Array.isArray(purchasePreview) &&
    purchasePreview.length === 2 &&
    typeof purchasePreview[0] === 'bigint' &&
    typeof purchasePreview[1] === 'bigint'
  ) {
    sadAmountStr = formatSADBalance(purchasePreview[0]);
  }
  
  // Conversion testing
  const [testFeelsAmount, setTestFeelsAmount] = useState("111")
  const { writeContract: convertFeels, isPending: isConverting } = useConvertFeelsToSad()
  
  // Staking testing
  const [testStakeAmount, setTestStakeAmount] = useState("69")
  const { writeContract: stakeSadness, isPending: isStaking } = useStakeSadness()
  const { writeContract: requestUnstake, isPending: isRequestingUnstake } = useRequestUnstake()
  const { writeContract: unstakeSadness, isPending: isUnstaking } = useUnstakeSadness()
  const { writeContract: harvestFeelings, isPending: isHarvesting } = useHarvestFeelings()
  const { writeContract: approveSAD, isPending: isApproving } = useApproveSAD()
  
  // Game testing
  const [testGameScore, setTestGameScore] = useState("50")
  const [currentSessionId, setCurrentSessionId] = useState<bigint | null>(null)
  const { writeContract: startGameSession, isPending: isStartingGame } = useStartGameSession()
  const { writeContract: completeGame, isPending: isCompletingGame } = useCompleteGame()
  
  // NFT testing
  const [selectedAchievement, setSelectedAchievement] = useState<SadAchievement>(SadAchievement.FIRST_EMAIL)
  const { writeContract: requestNFTClaim, isPending: isClaimingNFT } = useRequestNFTClaim()
  
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

  useWatchGameRewards(address, () => {
    refetchFEELS()
    setStatus("Game rewards received! 🎮")
    setLastAction(`Game reward at ${new Date().toLocaleTimeString()}`)
  })

  useWatchStakingRewards(address, () => {
    refetchFEELS()
    setStatus("Staking rewards harvested! 💰")
    setLastAction(`Harvest at ${new Date().toLocaleTimeString()}`)
  })

  useWatchNFTClaims(address, () => {
    setStatus("NFT claimed! 🏆")
    setLastAction(`NFT claim at ${new Date().toLocaleTimeString()}`)
  })

  const handlePurchaseTest = async (): Promise<void> => {
    if (!address || !canPurchase || !isValidEthAmount) {
      setStatus("❌ Cannot purchase: " + (!address ? "No wallet connected" : !canPurchase ? "In cooldown period" : "Invalid ETH amount"))
      return;
    }
    try {
      setStatus("Preparing purchase transaction...")
      setLastAction("Initiating purchase...")
      console.log("Attempting purchase with:", {
        contract: SEPOLIA_CONTRACTS.ConversionContract,
        amount: testEthAmount,
        value: parseEther(testEthAmount).toString()
      })
      
      const hash = await purchaseSadness({
        address: SEPOLIA_CONTRACTS.ConversionContract,
        abi: ConversionContract_ABI,
        functionName: 'purchaseSadness',
        value: parseEther(testEthAmount)
      })
      
      console.log("Transaction sent! Hash:", hash)
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
    return;
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

  // Approval handler
  const handleApproveSAD = async () => {
    if (!address) return
    
    try {
      setStatus("Approving SAD for staking...")
      setLastAction("Requesting approval...")
      
      const hash = await approveSAD({
        address: SEPOLIA_CONTRACTS.SADCoin,
        abi: SADCoin_ABI,
        functionName: 'approve',
        args: [SEPOLIA_CONTRACTS.StakingContract, parseEther("1000000")] // Approve large amount
      })
      
      setStatus("Approval transaction sent!")
      setLastAction("Approval submitted to mempool")
      refetchAllowance() // Refresh allowance after approval
      
    } catch (error: unknown) {
      const errorMsg = (error as Error).message?.includes('user rejected') 
        ? "Transaction cancelled by user"
        : `Error: ${(error as Error).message}`
      
      setStatus(`❌ ${errorMsg}`)
      setLastAction(`Approval failed: ${errorMsg}`)
    }
  }

  // Staking handlers
  const handleStakeTest = async () => {
    if (!address || !sadBalance || parseEther(testStakeAmount) > (sadBalance as bigint)) return
    
    // Check if approval is needed
    const stakeAmount = parseEther(testStakeAmount)
    const currentAllowance = (stakingAllowance as bigint) || BigInt(0)
    
    if (currentAllowance < stakeAmount) {
      setStatus("❌ Need approval first - click APPROVE button")
      setLastAction("Insufficient allowance for staking contract")
      return
    }
    
    try {
      setStatus("Staking SAD tokens...")
      setLastAction("Initiating stake...")
      
      const hash = await stakeSadness({
        address: SEPOLIA_CONTRACTS.StakingContract,
        abi: StakingContract_ABI,
        functionName: 'stakeSadness',
        args: [stakeAmount]
      })
      
      setStatus("Stake transaction sent!")
      setLastAction("Stake submitted to mempool")
      
    } catch (error: unknown) {
      const errorMsg = (error as Error).message?.includes('user rejected') 
        ? "Transaction cancelled by user"
        : `Error: ${(error as Error).message}`
      
      setStatus(`❌ ${errorMsg}`)
      setLastAction(`Staking failed: ${errorMsg}`)
    }
  }

  const handleRequestUnstake = async () => {
    if (!address || !stakeInfo || !Array.isArray(stakeInfo) || stakeInfo[0] === BigInt(0)) return
    
    try {
      setStatus("Requesting unstake...")
      setLastAction("Initiating unstake request...")
      
      const hash = await requestUnstake({
        address: SEPOLIA_CONTRACTS.StakingContract,
        abi: StakingContract_ABI,
        functionName: 'requestUnstake'
      })
      
      setStatus("Unstake request sent!")
      setLastAction("Unstake request submitted")
      
    } catch (error: unknown) {
      const errorMsg = (error as Error).message?.includes('user rejected') 
        ? "Transaction cancelled by user"
        : `Error: ${(error as Error).message}`
      
      setStatus(`❌ ${errorMsg}`)
      setLastAction(`Unstake request failed: ${errorMsg}`)
    }
  }

  const handleHarvestRewards = async () => {
    if (!address || !pendingRewards || (pendingRewards as bigint) === BigInt(0)) return
    
    try {
      setStatus("Harvesting rewards...")
      setLastAction("Initiating harvest...")
      
      const hash = await harvestFeelings({
        address: SEPOLIA_CONTRACTS.StakingContract,
        abi: StakingContract_ABI,
        functionName: 'harvestFeelings'
      })
      
      setStatus("Harvest transaction sent!")
      setLastAction("Harvest submitted")
      
    } catch (error: unknown) {
      const errorMsg = (error as Error).message?.includes('user rejected') 
        ? "Transaction cancelled by user"
        : `Error: ${(error as Error).message}`
      
      setStatus(`❌ ${errorMsg}`)
      setLastAction(`Harvest failed: ${errorMsg}`)
    }
  }

  // Game handlers
  const handleStartGame = async () => {
    if (!address) return
    
    try {
      setStatus("Starting game session...")
      setLastAction("Creating new game session...")
      
      const hash = await startGameSession({
        address: SEPOLIA_CONTRACTS.GameRewards,
        abi: GameRewards_ABI,
        functionName: 'startGameSession'
      })
      
      setStatus("Game session started!")
      setLastAction("Game session created")
      
    } catch (error: unknown) {
      const errorMsg = (error as Error).message?.includes('user rejected') 
        ? "Transaction cancelled by user"
        : `Error: ${(error as Error).message}`
      
      setStatus(`❌ ${errorMsg}`)
      setLastAction(`Game start failed: ${errorMsg}`)
    }
  }

  const handleCompleteGame = async () => {
    if (!address || !currentSessionId) return
    
    try {
      setStatus("Completing game...")
      setLastAction("Submitting game score...")
      
      const hash = await completeGame({
        address: SEPOLIA_CONTRACTS.GameRewards,
        abi: GameRewards_ABI,
        functionName: 'completeGame',
        args: [currentSessionId, BigInt(testGameScore)]
      })
      
      setStatus("Game completed!")
      setLastAction("Game score submitted")
      setCurrentSessionId(null)
      
    } catch (error: unknown) {
      const errorMsg = (error as Error).message?.includes('user rejected') 
        ? "Transaction cancelled by user"
        : `Error: ${(error as Error).message}`
      
      setStatus(`❌ ${errorMsg}`)
      setLastAction(`Game completion failed: ${errorMsg}`)
    }
  }

  // NFT handlers
  const handleClaimNFT = async () => {
    if (!address) return
    
    try {
      setStatus("Claiming NFT achievement...")
      setLastAction("Requesting NFT claim...")
      
      const emailHash = `test_email_${Date.now()}_${selectedAchievement}`
      const verificationData = `demo_verification_${selectedAchievement}`
      
      const hash = await requestNFTClaim({
        address: SEPOLIA_CONTRACTS.NFTClaim,
        abi: NFTClaim_ABI,
        functionName: 'requestClaim',
        args: [selectedAchievement, emailHash, verificationData]
      })
      
      setStatus("NFT claim submitted!")
      setLastAction("NFT claim requested")
      
    } catch (error: unknown) {
      const errorMsg = (error as Error).message?.includes('user rejected') 
        ? "Transaction cancelled by user"
        : `Error: ${(error as Error).message}`
      
      setStatus(`❌ ${errorMsg}`)
      setLastAction(`NFT claim failed: ${errorMsg}`)
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
        <div>SAD Balance: {formatSADBalance(typeof sadBalance === 'bigint' ? sadBalance : BigInt(0))} SAD</div>
        <div>FEELS Balance: {formatFEELSBalance(typeof feelsBalance === 'bigint' ? feelsBalance : BigInt(0))} FEELS</div>
        <div>Sadness Level: {typeof sadnessLevel === 'bigint' ? sadnessLevel.toString() : "0"}</div>
        <div>Emotional Damage: {typeof emotionalDamage === 'bigint' ? emotionalDamage.toString() : "0"}</div>
        <div>NFT Balance: {typeof nftBalance === 'bigint' ? nftBalance.toString() : "0"} NFTs</div>
        <div>Total NFT Sadness: {typeof userTotalSadness === 'bigint' ? userTotalSadness.toString() : "0"}</div>
      </div>

      {/* Conversion Info */}
      <div className="mb-3">
        <div className="text-yellow-400">CONVERSION DATA:</div>
        <div>Current Rate: {typeof conversionRate === 'bigint' ? conversionRate.toString() : "Loading..."} FEELS per SAD</div>
        <div>Purchase Cooldown: {formatCooldownTime(cooldownSeconds)}</div>
      </div>

      {/* Staking Info */}
      <div className="mb-3">
        <div className="text-yellow-400">STAKING DATA:</div>
        <div>Staked Amount: {stakeInfo && Array.isArray(stakeInfo) ? formatSADBalance(stakeInfo[0] as bigint) : "0.00"} SAD</div>
        <div>Pending Rewards: {formatFEELSBalance(typeof pendingRewards === 'bigint' ? pendingRewards : BigInt(0))} FEELS</div>
        <div>Total Staked: {formatSADBalance(typeof totalStaked === 'bigint' ? totalStaked : BigInt(0))} SAD</div>
        <div>Reward Rate: {typeof rewardRate.data === 'bigint' ? rewardRate.data.toString() : "42"} FEELS/hour</div>
        <div>Min Stake: {formatSADBalance(typeof minimumStake.data === 'bigint' ? minimumStake.data : BigInt(69 * 10**18))} SAD</div>
        <div>Allowance: {formatSADBalance(typeof stakingAllowance === 'bigint' ? stakingAllowance : BigInt(0))} SAD</div>
        <div>Unstake Requested: {stakeInfo && Array.isArray(stakeInfo) ? (stakeInfo[4] ? "Yes" : "No") : "No"}</div>
      </div>

      {/* Game Info */}
      <div className="mb-3">
        <div className="text-yellow-400">GAME DATA:</div>
        <div>Games Played: {gameStats && Array.isArray(gameStats) ? gameStats[0]?.toString() : "0"}</div>
        <div>Total FEELS Distributed: {gameStats && Array.isArray(gameStats) ? formatFEELSBalance(gameStats[1] as bigint) : "0.00"}</div>
        <div>Your Sessions: {playerSessions && Array.isArray(playerSessions) ? playerSessions.length : "0"}</div>
        <div>Current Session: {currentSessionId ? currentSessionId.toString() : "None"}</div>
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
          <span>{sadAmountStr} SAD</span>
          {!isValidEthAmount && (
            <span className="text-red-400 text-xs ml-2">Enter a valid ETH amount</span>
          )}
        </div>
        <Button
          onClick={handlePurchaseTest}
          disabled={!canPurchase || isPurchasing || isWrongNetwork || !isValidEthAmount}
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

      {/* Staking Testing */}
      <div className="mb-3">
        <div className="text-cyan-400">STAKING TESTING:</div>
        <div className="flex items-center gap-2 mt-1">
          <input
            type="number"
            value={testStakeAmount}
            onChange={(e) => setTestStakeAmount(e.target.value)}
            min="69"
            className="bg-black border border-green-400 text-green-400 px-2 py-1 w-20 text-xs"
            placeholder="69"
          />
          <span>SAD to stake</span>
        </div>
        <div className="text-xs text-green-300 mt-1">
          Allowance: {formatSADBalance(typeof stakingAllowance === 'bigint' ? stakingAllowance : BigInt(0))} SAD
        </div>
        <div className="flex gap-2 mt-2">
          <Button
            onClick={handleApproveSAD}
            disabled={isApproving || isWrongNetwork}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 h-auto"
          >
            {isApproving ? "Approving..." : "✅ APPROVE"}
          </Button>
          <Button
            onClick={handleStakeTest}
            disabled={isStaking || isWrongNetwork || !sadBalance || parseEther(testStakeAmount || "0") > (sadBalance as bigint)}
            className="bg-orange-600 hover:bg-orange-700 text-white text-xs px-3 py-1 h-auto"
          >
            {isStaking ? "Staking..." : "🔒 STAKE"}
          </Button>
          <Button
            onClick={handleHarvestRewards}
            disabled={isHarvesting || isWrongNetwork || !pendingRewards || (pendingRewards as bigint) === BigInt(0)}
            className="bg-yellow-600 hover:bg-yellow-700 text-black text-xs px-3 py-1 h-auto"
          >
            {isHarvesting ? "Harvesting..." : "🌾 HARVEST"}
          </Button>
          <Button
            onClick={handleRequestUnstake}
            disabled={isRequestingUnstake || isWrongNetwork || !stakeInfo || !Array.isArray(stakeInfo) || stakeInfo[0] === BigInt(0)}
            className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 h-auto"
          >
            {isRequestingUnstake ? "Requesting..." : "🔓 UNSTAKE"}
          </Button>
        </div>
      </div>

      {/* Game Testing */}
      <div className="mb-3">
        <div className="text-cyan-400">GAME TESTING:</div>
        <div className="flex items-center gap-2 mt-1">
          <input
            type="number"
            value={testGameScore}
            onChange={(e) => setTestGameScore(e.target.value)}
            min="1"
            max="1000"
            className="bg-black border border-green-400 text-green-400 px-2 py-1 w-20 text-xs"
            placeholder="50"
          />
          <span>Game score</span>
        </div>
        <div className="flex gap-2 mt-2">
          <Button
            onClick={handleStartGame}
            disabled={isStartingGame || isWrongNetwork}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 h-auto"
          >
            {isStartingGame ? "Starting..." : "🎮 START GAME"}
          </Button>
          <Button
            onClick={handleCompleteGame}
            disabled={isCompletingGame || isWrongNetwork || !currentSessionId}
            className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 h-auto"
          >
            {isCompletingGame ? "Completing..." : "🏁 COMPLETE GAME"}
          </Button>
        </div>
      </div>

      {/* NFT Testing */}
      <div className="mb-3">
        <div className="text-cyan-400">NFT TESTING:</div>
        <div className="flex items-center gap-2 mt-1">
          <select
            value={selectedAchievement}
            onChange={(e) => setSelectedAchievement(Number(e.target.value) as SadAchievement)}
            className="bg-black border border-green-400 text-green-400 px-2 py-1 text-xs"
          >
            {Object.entries(ACHIEVEMENT_NAMES).map(([key, name]) => (
              <option key={key} value={key}>{name}</option>
            ))}
          </select>
        </div>
        <Button
          onClick={handleClaimNFT}
          disabled={isClaimingNFT || isWrongNetwork}
          className="mt-2 bg-pink-600 hover:bg-pink-700 text-white text-xs px-3 py-1 h-auto"
        >
          {isClaimingNFT ? "Claiming..." : "🏆 CLAIM NFT"}
        </Button>
      </div>

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
        <div>FEELS: {SEPOLIA_CONTRACTS.FEELS.slice(0, 10)}...</div>
        <div>Conversion: {SEPOLIA_CONTRACTS.ConversionContract.slice(0, 10)}...</div>
        <div>Staking: {SEPOLIA_CONTRACTS.StakingContract.slice(0, 10)}...</div>
        <div>Game: {SEPOLIA_CONTRACTS.GameRewards.slice(0, 10)}...</div>
        <div>NFT: {SEPOLIA_CONTRACTS.NFTClaim.slice(0, 10)}...</div>
      </div>
    </div>
  )
}