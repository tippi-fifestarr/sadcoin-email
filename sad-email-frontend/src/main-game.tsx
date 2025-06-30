"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { useChainId } from "wagmi"
import { Card } from "@/components/ui/card"
import AboutModal from "./components/AboutModal"
import CRTContainer from "./components/CRTContainer"
import NavBar from "./components/NavBar"
import NetworkStatus from "./components/NetworkStatus"
import { GameState, Character, Email } from "@/types/game"
import { emails } from "@/data/gameData"
import {
  useSADCoinBalance,
  useFEELSBalance,
  formatSADBalance,
  formatFEELSBalance
} from "@/hooks/useContracts"
import { useReadContract } from "wagmi"
import { getContracts } from "@/lib/contracts"
import { generateEmail, EmailGenerationResponse, EmailContent } from "@/lib/gemini"

// Import screen components
import {
  BootScreen,
  LoginScreen,
  LoadingAScreen,
  LoadingBScreen,
  LoadingCScreen,
  EmailInputScreen,
  EmailInputContainer,
  InboxScreen,
  LoadingContainer,
  ReadingScreen,
  CharacterSelectScreen,
  MiniGameScreen,
  WritingScreen,
  SentScreen,
  AgentResponsesScreen,
  EmailViewScreen,
  WaterCoolerScreen
} from "./components/screens"

export default function Component() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  
  // Get network-aware contracts
  const contracts = getContracts(chainId)
  
  const [gameState, setGameState] = useState<GameState>("login")
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)
  const [generatedEmails, setGeneratedEmails] = useState<EmailGenerationResponse | null>(null)
  const [isGeneratingEmail, setIsGeneratingEmail] = useState(false)
  const [userSadInput, setUserSadInput] = useState("")
  const [selectedEmailContent, setSelectedEmailContent] = useState<EmailContent | null>(null)
  const [selectedEmailSender, setSelectedEmailSender] = useState<string>("")
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false)

  // Web3 token balances
  const { data: sadBalance, error: sadError, isLoading: sadLoading } = useSADCoinBalance(address)
  const { data: feelsBalance, error: feelsError, isLoading: feelsLoading } = useFEELSBalance(address)

  // Direct contract test
  const { data: directSadBalance, error: directSadError, isLoading: directSadLoading } = useReadContract({
    address: contracts.SADCoin,
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
      retry: 1,
      retryDelay: 1000,
      staleTime: 30000
    }
  })

  // Format balances for display
  const sadCoins = formatSADBalance(typeof sadBalance === 'bigint' ? sadBalance : BigInt(0))
  const feels = formatFEELSBalance(typeof feelsBalance === 'bigint' ? feelsBalance : BigInt(0))

  // Debug logging
  console.log("Wallet Debug:", {
    address,
    isConnected,
    chainId,
    isOnSepolia: chainId === 11155111,
    isOnAvalancheFuji: chainId === 43113,
    sadBalance: typeof sadBalance === 'bigint' ? sadBalance.toString() : sadBalance,
    feelsBalance: typeof feelsBalance === 'bigint' ? feelsBalance.toString() : feelsBalance,
    directSadBalance: typeof directSadBalance === 'bigint' ? directSadBalance.toString() : directSadBalance,
    sadError: sadError?.message,
    feelsError: feelsError?.message,
    directSadError: directSadError?.message,
    sadLoading,
    feelsLoading,
    directSadLoading,
    formattedSad: sadCoins,
    formattedFeels: feels,
    currentNetworkContracts: contracts
  })

  // Test network connectivity
  useEffect(() => {
    if (isConnected && (chainId === 11155111 || chainId === 43113)) {
      const networkName = chainId === 43113 ? 'Avalanche Fuji' : 'Sepolia'
      const rpcUrl = chainId === 43113 ? 'https://api.avax-test.network/ext/bc/C/rpc' : 'https://sepolia.drpc.org'
      
      console.log(`Testing ${networkName} connectivity...`)
      fetch(rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_blockNumber',
          params: [],
          id: 1
        })
      })
      .then(response => response.json())
      .then(data => {
        console.log(`${networkName} RPC response:`, data)
      })
      .catch(error => {
        console.error(`${networkName} RPC error:`, error)
      })

      // Test contract addresses
      console.log("Testing contract addresses...")
      const testContract = (address: string, name: string) => {
        fetch(rpcUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'eth_getCode',
            params: [address, 'latest'],
            id: 1
          })
        })
        .then(response => response.json())
        .then(data => {
          console.log(`${name} contract test:`, {
            address,
            hasCode: data.result !== '0x' && data.result !== '0x0',
            codeLength: data.result ? data.result.length : 0
          })
        })
        .catch(error => {
          console.error(`${name} contract test error:`, error)
        })
      }

      testContract(contracts.SADCoin, 'SADCoin')
      testContract(contracts.FEELS, 'FEELS')
      testContract(contracts.ConversionContract, 'ConversionContract')

      // Test user's balance directly
      if (address) {
        console.log("Testing user balance...")
        fetch(rpcUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'eth_call',
            params: [{
              to: contracts.SADCoin,
              data: '0x70a08231' + '000000000000000000000000' + address.slice(2)
            }, 'latest'],
            id: 1
          })
        })
        .then(response => response.json())
        .then(data => {
          console.log("User SAD balance test:", {
            address,
            result: data.result,
            hasBalance: data.result !== '0x0000000000000000000000000000000000000000000000000000000000000000'
          })
        })
        .catch(error => {
          console.error("User balance test error:", error)
        })
      }
    }
  }, [isConnected, chainId])

  // Event handlers
  const handleEmailClick = (email: Email) => {
    setSelectedEmail(email)
    setGameState("reading")
  }

  const handleCharacterInteraction = () => {
    setGameState("character-select")
  }

  const handleCharacterSelect = (character: Character) => {
    setSelectedCharacter(character)
    setGameState("loading-a")
  }

  const handleContinueClick = () => {
    setGameState("loading-b")
  }

  const handleMonitorClick = () => {
    setGameState("loading-c")
  }

  const handleEmailSubmit = async (userInput: string) => {
    console.log("Email submitted:", userInput)
    
    setUserSadInput(userInput)
    setIsGeneratingEmail(true)
    
    try {
      const emailResponse = await generateEmail({
        userInput
      })

      if (emailResponse.success) {
        setGeneratedEmails(emailResponse)
        setGameState("agent-responses")
      } else {
        console.error("Failed to generate emails:", emailResponse.error)
        // Fallback to agent responses with error messages
        setGeneratedEmails({
          agentInitialEmail: { subject: "Error", body: "Failed to generate agent email" },
          officerInitialEmail: { subject: "Error", body: "Failed to generate officer email" },
          monkeyInitialEmail: { subject: "Error", body: "Failed to generate monkey email" },
          success: false,
          error: emailResponse.error
        })
        setGameState("agent-responses")
      }
    } catch (error) {
      console.error("Error in email generation:", error)
      setGeneratedEmails({
        agentInitialEmail: { subject: "Error", body: "Failed to generate agent email" },
        officerInitialEmail: { subject: "Error", body: "Failed to generate officer email" },
        monkeyInitialEmail: { subject: "Error", body: "Failed to generate monkey email" },
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      })
      setGameState("agent-responses")
    } finally {
      setIsGeneratingEmail(false)
    }
  }

  const handleWaterCooler = () => {
    setGameState("water-cooler")
  }

  const handleBackFromWaterCooler = () => {
    setGameState("email-input")
  }

  const handleEmailSelect = (email: EmailContent, sender: string) => {
    setSelectedEmailContent(email)
    setSelectedEmailSender(sender)
    setGameState("email-view")
  }

  const handleEmailViewBack = () => {
    setGameState("agent-responses")
  }

  const handleEmailViewContinue = () => {
    setGameState("writing")
  }

  const playMiniGame = () => {
    setGameState("mini-game")
  }

  const sendEmail = () => {
    setGameState("sent")
  }

  const resetGame = () => {
    setGameState("login")
    setSelectedEmail(null)
    setSelectedCharacter(null)
    setGeneratedEmails(null)
    setIsGeneratingEmail(false)
    setUserSadInput("")
    setSelectedEmailContent(null)
    setSelectedEmailSender("")
  }

  // Render the appropriate screen based on game state
  const renderScreen = () => {
    switch (gameState) {
      case "boot":
        return (
          <BootScreen
            onDone={() => setGameState("login")}
            skip={() => setGameState("login")}
          />
        )

      case "login":
        return (
          <LoginScreen
            onSelectCharacter={handleCharacterSelect}
          />
        )

      case "loading-a":
        return (
          <LoadingAScreen
            onContinue={handleContinueClick}
          />
        )

      case "loading-b":
        return (
          <LoadingBScreen
            onMonitorClick={handleMonitorClick}
          />
        )

      case "loading-c":
        return (
          <LoadingCScreen
            onComplete={() => setGameState("email-input")}
          />
        )

      case "email-input":
        return (
          <EmailInputScreen
            onSubmit={handleEmailSubmit}
            onWaterCooler={handleWaterCooler}
          />
        )

      case "inbox":
        return (
          <InboxScreen
            emails={emails}
            onEmailClick={handleEmailClick}
          />
        )

      case "reading":
        return selectedEmail && selectedCharacter ? (
          <ReadingScreen
            selectedEmail={selectedEmail}
            selectedCharacter={selectedCharacter}
            onBackToInbox={() => setGameState("inbox")}
            onCharacterInteraction={handleCharacterInteraction}
          />
        ) : null

      case "character-select":
        return selectedCharacter ? (
          <CharacterSelectScreen
            selectedCharacter={selectedCharacter}
            onPlayMiniGame={playMiniGame}
          />
        ) : null

      case "mini-game":
        return selectedCharacter ? (
          <MiniGameScreen
            selectedCharacter={selectedCharacter}
          />
        ) : null

      case "writing":
        return selectedEmailContent ? (
          <WritingScreen
            selectedCharacter={selectedCharacter}
            generatedEmail={selectedEmailContent}
            isGeneratingEmail={isGeneratingEmail}
            onSendEmail={sendEmail}
          />
        ) : null

      case "sent":
        return (
          <SentScreen
            onResetGame={resetGame}
          />
        )


      case "agent-responses":
        return generatedEmails ? (
          <AgentResponsesScreen
            userSadInput={userSadInput}
            agentInitialEmail={generatedEmails.agentInitialEmail}
            officerInitialEmail={generatedEmails.officerInitialEmail}
            monkeyInitialEmail={generatedEmails.monkeyInitialEmail}
            onSelectEmail={handleEmailSelect}
          />
        ) : null

      case "email-view":
        return selectedEmailContent ? (
          <EmailViewScreen
            email={selectedEmailContent}
            sender={selectedEmailSender}
            onBack={handleEmailViewBack}
            onContinue={handleEmailViewContinue}
          />
        ) : null

      case "water-cooler":
        return (
          <WaterCoolerScreen onBack={handleBackFromWaterCooler} />
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <NavBar
        gameState={gameState}
        debugInfo={{
          chainId,
          address,
          isConnected,
          isOnSepolia: chainId === 11155111,
          sadBalance: sadBalance?.toString(),
          directSadBalance: directSadBalance?.toString(),
          sadLoading,
          directSadLoading,
          sadError,
          directSadError,
          feelsBalance: feelsBalance?.toString(),
          feelsLoading
        }}
        sadBalance={sadCoins}
        feelsBalance={feels}
        onAboutClick={() => setIsAboutModalOpen(true)}
      />
      
      {/* Network Status Component for testing */}
      <NetworkStatus />
      <div className="bg-black" style={{ minHeight: "calc(100vh - 70px)" }}>
        {/* Monitor Area */}
        <CRTContainer>
          <Card className="border-2 border-green-400 bg-black text-green-400 w-full h-full flex flex-col">
            {/* Main Terminal - Full screen usage */}
            <div className="flex-1 overflow-auto p-6">
              {renderScreen()}
            </div>
          </Card>
        </CRTContainer>
        
        {/* 20px spacing before EmailInputContainer/LoadingContainer */}
        <div style={{ height: "20px" }}></div>
        
        {/* Loading containers and email input container - now in main flow */}
        <LoadingContainer gameState={gameState} />
        
        {(gameState === "email-input" || gameState === "water-cooler") && (
          <EmailInputContainer 
            onSubmit={handleEmailSubmit} 
            onWaterCooler={gameState === "water-cooler" ? handleBackFromWaterCooler : handleWaterCooler}
            isWaterCoolerMode={gameState === "water-cooler"}
          />
        )}
        
      </div>

      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />
    </div>
  )
}