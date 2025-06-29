import { useEffect, useState } from 'react'

interface LoadingCScreenProps {
  onComplete: () => void
}

export function LoadingCScreen({ onComplete }: LoadingCScreenProps) {
  const [loadingCText, setLoadingCText] = useState('')
  const [loadingCComplete, setLoadingCComplete] = useState(false)

  useEffect(() => {
    const loadingCSequence = [
      "////...Encrypting packets\n",
      "Reticulating splines\n",
      "Checking credentials\n",
      "Hand.cron.job\n",
      "Handshake protocol\n",
      "Handhold protocol\n",
      "Ordering takeout\n",
      "Deprecating php\n",
      "Deleting MX records\n",
      "Shaking tree branch\n",
      "Emptying wallet\n",
      "Chaining Links\n",
      "Loading Sadcoin OS...///\n"
    ]

    let currentIndex = 0
    let currentChar = 0
    let cancelled = false

    const typeText = () => {
      if (cancelled) return

      if (currentIndex < loadingCSequence.length) {
        const currentLine = loadingCSequence[currentIndex]
        
        if (currentChar < currentLine.length) {
          const char = currentLine[currentChar]
          setLoadingCText(prev => prev + char)
          currentChar++
          setTimeout(typeText, 15) // Much faster typing for longer sequence
        } else {
          currentIndex++
          currentChar = 0
          setTimeout(typeText, 30) // Much faster line delay
        }
      } else {
        // Animation complete
        setLoadingCComplete(true)
        setTimeout(() => {
          onComplete()
        }, 300) // Much shorter wait before transitioning
      }
    }

    typeText()

    return () => {
      cancelled = true
    }
  }, [onComplete])

  return (
    <div className="space-y-6">
      {/* Monitor Content - Typing Animation */}
      <div className="text-center">
        <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono">
          {loadingCText}
          <span className="animate-pulse">█</span>
        </pre>
      </div>
    </div>
  )
} 