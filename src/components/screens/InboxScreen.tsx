import { Email } from '@/types/game'

interface InboxScreenProps {
  emails: Email[]
  onEmailClick: (email: Email) => void
}

export function InboxScreen({ emails, onEmailClick }: InboxScreenProps) {
  return (
    <div>
      <h2 className="text-xl mb-4">📧 INBOX (4 unread)</h2>
      <div className="space-y-2">
        {emails.map((email) => (
          <div
            key={email.id}
            onClick={() => onEmailClick(email)}
            className="border border-green-400 p-3 cursor-pointer hover:bg-green-900/20 transition-colors"
          >
            <div className="flex justify-between">
              <span className="font-bold">{email.from}</span>
              <span className="text-xs">{"[UNREAD]"}</span>
            </div>
            <div className="text-green-300">{email.subject}</div>
            <div className="text-green-500 text-sm">{email.preview}</div>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 border border-yellow-400 text-yellow-400 text-sm">
        <strong>GAME THEORY INSIGHT:</strong> Each email choice creates a different game tree with unique
        incentive structures and outcomes!
      </div>
    </div>
  )
} 