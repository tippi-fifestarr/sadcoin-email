"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import AboutPage from "./about-page"
import CRTContainer from "./components/CRTContainer"
import NavBar from "./components/NavBar"
import { GameState, Character, Email } from "@/types/game"
import { emails, characterResponses } from "@/data/gameData"

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
  SentScreen
} from "./components/screens"

export default function Component() {
  const [gameState, setGameState] = useState<GameState>("boot")
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)
  const [sadCoins, setSadCoins] = useState(100)
  const [feels, setFeels] = useState(0)
  const [gameProgress, setGameProgress] = useState(0)

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

  const handleEmailSubmit = (userInput: string) => {
    console.log("Email submitted:", userInput)
    // TODO: Implement email submission logic
    setGameState("inbox")
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
    setSadCoins(100)
    setFeels(0)
    setGameProgress(0)
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
        return selectedCharacter ? (
          <WritingScreen
            selectedCharacter={selectedCharacter}
            onSendEmail={sendEmail}
          />
        ) : null

      case "sent":
        return (
          <SentScreen
            onResetGame={resetGame}
          />
        )

      case "about":
        return <AboutPage onBack={() => setGameState("inbox")} />

      default:
        return null
    }
  }

  return (
    <>
      <NavBar />
      <CRTContainer>
        <Card className="border-2 border-green-400 bg-black text-green-400 w-full h-full flex flex-col">
          {/* Debug info */}
          <div className="text-xs text-red-400 p-1">Current State: {gameState}</div>
          
          {/* Header */}
          <div className="border-b-2 border-green-400 p-4 bg-black">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-center flex-1">═══ LETSWRITEAN.EMAIL ═══</h1>
              <div className="flex gap-4 text-sm">
                <Badge variant="outline" className="border-yellow-400 text-yellow-400">
                  SAD: {sadCoins}
                </Badge>
                <Badge variant="outline" className="border-pink-400 text-pink-400">
                  FEELS: {feels}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setGameState("about")}
                  className="border-cyan-400 text-cyan-400 hover:bg-cyan-900/20"
                >
                  ABOUT
                </Button>
              </div>
            </div>
          </div>

          {/* Main Terminal */}
          <div className="flex-1 overflow-auto p-6">
            {renderScreen()}
          </div>

          {/* Footer */}
          <div className="text-center text-green-600 text-sm border-t-2 border-green-400 p-2">
            <p>A productivity tool disguised as a procrastination game</p>
            <p className="text-xs mt-1">Built for the intersection of game theory and behavioral economics</p>
          </div>
        </Card>
      </CRTContainer>

      {/* Loading containers and email input container */}
      <LoadingContainer gameState={gameState} />
      
      {gameState === "email-input" && (
        <EmailInputContainer onSubmit={handleEmailSubmit} />
      )}
    </>
  )
}
