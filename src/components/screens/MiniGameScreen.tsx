import { Character } from '@/types/game'
import { characterResponses } from '@/data/gameData'

interface MiniGameScreenProps {
  selectedCharacter: Character
}

export function MiniGameScreen({ selectedCharacter }: MiniGameScreenProps) {
  return (
    <div className="text-center">
      <h2 className="text-xl mb-4">🎯 {characterResponses[selectedCharacter].miniGame}</h2>
      <div className="border border-red-400 p-8 mb-4 bg-red-900/10">
        <div className="text-6xl mb-4">🎮</div>
        <div className="text-red-400 mb-4">Playing intentionally buggy mini-game...</div>
        <div className="text-sm text-red-300">
          Controls are laggy, hitboxes are broken, and you're losing SAD coins!
        </div>
        <div className="mt-4 animate-pulse">Loading frustration... Please wait...</div>
      </div>
      <div className="text-yellow-400 text-sm">
        This is designed to be annoying so you'll want to go back to writing emails!
      </div>
    </div>
  )
} 