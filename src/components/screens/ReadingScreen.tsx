import { Button } from '@/components/ui/button'
import { Email, Character } from '@/types/game'
import { characterResponses } from '@/data/gameData'

interface ReadingScreenProps {
  selectedEmail: Email
  selectedCharacter: Character
  onBackToInbox: () => void
  onCharacterInteraction: () => void
}

export function ReadingScreen({ 
  selectedEmail, 
  selectedCharacter, 
  onBackToInbox, 
  onCharacterInteraction 
}: ReadingScreenProps) {
  return (
    <div>
      <div className="mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onBackToInbox}
          className="border-green-400 text-green-400 hover:bg-green-900/20"
        >
          ← Back to Inbox
        </Button>
      </div>
      <div className="border border-green-400 p-4 mb-4">
        <div className="text-sm text-green-500 mb-2">FROM: {selectedEmail.from}</div>
        <div className="text-lg mb-4">{selectedEmail.subject}</div>
        <div className="text-green-300 leading-relaxed">{characterResponses[selectedCharacter].response}</div>
      </div>
      <div className="text-center">
        <Button onClick={onCharacterInteraction} className="bg-green-600 hover:bg-green-700 text-black">
          Get up from desk and procrastinate →
        </Button>
      </div>
    </div>
  )
} 