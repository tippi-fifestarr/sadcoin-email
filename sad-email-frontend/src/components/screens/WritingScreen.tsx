import { Button } from '@/components/ui/button'
import { Character } from '@/types/game'
import { EmailContent } from '@/lib/gemini'

interface WritingScreenProps {
  selectedCharacter: Character | null
  generatedEmail: EmailContent | null
  isGeneratingEmail: boolean
  onSendEmail: () => void
}

export function WritingScreen({ 
  selectedCharacter, 
  generatedEmail, 
  isGeneratingEmail, 
  onSendEmail 
}: WritingScreenProps) {
  return (
    <div>
      <h2 className="text-xl mb-4">✍️ Email Composition</h2>
      
      {isGeneratingEmail && (
        <div className="border border-yellow-400 p-4 mb-4">
          <div className="text-sm text-yellow-500 mb-2">
            AI Assistant ({selectedCharacter?.toUpperCase()}) is crafting your email...
          </div>
          <div className="text-xs text-yellow-600">Please wait while we generate your email...</div>
        </div>
      )}

      {generatedEmail && (
        <div className="border border-green-400 p-4 mb-4">
          <div className="text-sm text-green-500 mb-2">Generated Email:</div>
          <div className="text-lg mb-2 font-bold">{generatedEmail.subject}</div>
          <div className="text-green-300 leading-relaxed whitespace-pre-wrap mb-4">{generatedEmail.body}</div>
          <Button onClick={onSendEmail} className="bg-green-600 hover:bg-green-700 text-black">
            Send Email →
          </Button>
        </div>
      )}

      {!generatedEmail && !isGeneratingEmail && (
        <div className="text-center text-yellow-400">
          No email content available. Please try again.
        </div>
      )}
    </div>
  )
} 