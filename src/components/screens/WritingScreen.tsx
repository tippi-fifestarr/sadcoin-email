import { Button } from '@/components/ui/button'
import { Character } from '@/types/game'

interface WritingScreenProps {
  selectedCharacter: Character | null
  onSendEmail: () => void
}

export function WritingScreen({ selectedCharacter, onSendEmail }: WritingScreenProps) {
  return (
    <div>
      <h2 className="text-xl mb-4">✍️ Email Composition</h2>
      <div className="border border-green-400 p-4 mb-4">
        <div className="text-sm text-green-500 mb-2">
          AI Assistant ({selectedCharacter?.toUpperCase()}) is helping you write...
        </div>
        <div className="bg-green-900/20 p-4 rounded">
          <p className="text-green-300">
            Your email has been intelligently crafted based on your interactions! The {selectedCharacter}{" "}
            personality has been applied, and your mini-game performance has influenced the tone and content.
          </p>
          <div className="mt-4 text-sm text-green-500">
            • Professional formatting: ✓<br />• Personality quirks added: ✓<br />• Appropriate level of chaos:
            ✓<br />• Ready to send to your REAL inbox: ✓
          </div>
        </div>
      </div>
      <div className="text-center">
        <Button onClick={onSendEmail} className="bg-blue-600 hover:bg-blue-700 text-white">
          Send Email to Real Inbox! 📧
        </Button>
      </div>
    </div>
  )
} 