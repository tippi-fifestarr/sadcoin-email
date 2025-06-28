import { Button } from '@/components/ui/button'
import { EmailContent } from '@/lib/gemini'

interface EmailViewScreenProps {
  email: EmailContent
  sender: string
  onBack: () => void
  onContinue: () => void
}

export function EmailViewScreen({ 
  email, 
  sender, 
  onBack, 
  onContinue 
}: EmailViewScreenProps) {
  return (
    <div>
      <div className="mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="border-green-400 text-green-400 hover:bg-green-900/20"
        >
          ← Back to Email Selection
        </Button>
      </div>

      <div className="border border-green-400 p-4 mb-4">
        <div className="text-sm text-green-500 mb-2">FROM: {sender}@sadcoin.net</div>
        <div className="text-lg mb-4 font-bold">{email.subject}</div>
        <div className="text-green-300 leading-relaxed whitespace-pre-wrap">{email.body}</div>
      </div>

      <div className="text-center">
        <Button onClick={onContinue} className="bg-green-600 hover:bg-green-700 text-black">
          Continue with this email →
        </Button>
      </div>

      <div className="mt-6 p-4 border border-blue-400 text-blue-400 text-sm">
        <strong>EMAIL ANALYSIS:</strong> This email was generated using the {sender.toLowerCase()} personality and communication style!
      </div>
    </div>
  )
} 