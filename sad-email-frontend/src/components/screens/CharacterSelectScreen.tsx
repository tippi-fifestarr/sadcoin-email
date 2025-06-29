import { Button } from '@/components/ui/button'
import { Character } from '@/types/game'
import { characterResponses } from '@/data/gameData'

interface CharacterSelectScreenProps {
  selectedCharacter: Character
  onPlayMiniGame: () => void
}

export function CharacterSelectScreen({ selectedCharacter, onPlayMiniGame }: CharacterSelectScreenProps) {
  return (
    <div>
      <h2 className="text-xl mb-4">🎮 Time to "Take a Break"</h2>
      <div className="border border-green-400 p-4 mb-4">
        <h3 className="text-lg mb-2">{characterResponses[selectedCharacter].name}</h3>
        <p className="text-green-300 mb-4">{characterResponses[selectedCharacter].emailHelp}</p>
        <div className="text-yellow-400 text-sm mb-4">
          Available Mini-Game: {characterResponses[selectedCharacter].miniGame}
        </div>
      </div>
      <div className="text-center">
        <Button onClick={onPlayMiniGame} className="bg-red-600 hover:bg-red-700 text-white">
          Play Intentionally Frustrating Mini-Game
        </Button>
      </div>
    </div>
  )
} 