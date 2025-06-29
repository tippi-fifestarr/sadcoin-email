import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

interface LoadingAScreenProps {
  onContinue: () => void
}

export function LoadingAScreen({ onContinue }: LoadingAScreenProps) {
  const [loadingText, setLoadingText] = useState('')
  const [loadingComplete, setLoadingComplete] = useState(false)

  useEffect(() => {
    const loadingSequence = [
      "SADCOIN\n",
      "INC.\n",
      "OS V.69.!.420\n",
      "Loading...\n"
    ]

    let currentIndex = 0
    let currentChar = 0
    let cancelled = false

    const typeText = () => {
      if (cancelled) return

      if (currentIndex < loadingSequence.length) {
        const currentLine = loadingSequence[currentIndex]
        console.log("Processing line:", currentIndex, "content:", JSON.stringify(currentLine), "length:", currentLine.length)
        
        if (currentChar < currentLine.length) {
          const char = currentLine[currentChar]
          console.log("Adding character:", JSON.stringify(char), "at position:", currentChar)
          setLoadingText(prev => prev + char)
          currentChar++
          setTimeout(typeText, 20) // Much faster type speed
        } else {
          console.log("Line complete, moving to next")
          currentIndex++
          currentChar = 0
          setTimeout(typeText, 50) // Much faster line delay
        }
      } else {
        console.log("Animation complete")
        // Animation complete, show click to continue
        setLoadingComplete(true)
      }
    }

    typeText()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="space-y-6">
      {/* Monitor Content - Typing Animation */}
      <div className="text-center">
        <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono">
          {loadingText}
          <span className="animate-pulse">█</span>
        </pre>
        
        {/* Click to continue text - appears when animation is complete */}
        {loadingComplete && (
          <div className="mt-4">
            <Button 
              onClick={onContinue}
              className="bg-green-600 hover:bg-green-700 text-black font-bold text-lg px-8 py-3 animate-pulse"
            >
              CLICK TO CONTINUE
            </Button>
          </div>
        )}
      </div>
    </div>
  )
} 