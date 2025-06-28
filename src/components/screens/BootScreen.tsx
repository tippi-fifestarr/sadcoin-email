import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

interface BootScreenProps {
  onDone: () => void
  skip: () => void
}

const bootSequence = [
  "Initializing letswritean.email...",
  "Loading productivity protocols...",
  "Connecting to SAD network...",
  "Calibrating procrastination sensors...",
  "Ready to help you avoid work!",
]

export function BootScreen({ onDone, skip }: BootScreenProps) {
  const [bootText, setBootText] = useState('')

  useEffect(() => {
    console.log("Starting boot sequence...")
    
    let currentLine = 0
    const interval = setInterval(() => {
      console.log("Interval tick - currentLine:", currentLine, "bootSequence.length:", bootSequence.length)
      
      if (currentLine < bootSequence.length) {
        const line = bootSequence[currentLine]
        console.log("Adding line:", line)
        setBootText((prev) => prev + line + "\n")
        currentLine++
      } else {
        console.log("Boot sequence finished, clearing interval")
        clearInterval(interval)
        console.log("Boot sequence complete")
        
        // Transition to login after completion
        setTimeout(() => {
          console.log("Transitioning to login state")
          onDone()
        }, 1000)
      }
    }, 800)

    return () => {
      clearInterval(interval)
    }
  }, [onDone])

  return (
    <div className="space-y-2">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">💻</div>
        <div className="text-xl">BOOTING SYSTEM...</div>
      </div>
      <pre className="whitespace-pre-wrap text-sm leading-relaxed">{bootText}</pre>
      <div className="flex justify-center mt-4">
        <div className="animate-pulse">█</div>
      </div>
      {/* Debug button */}
      <div className="text-center mt-4">
        <Button 
          onClick={skip}
          className="bg-red-600 hover:bg-red-700 text-white text-xs"
        >
          DEBUG: Skip to Login
        </Button>
      </div>
    </div>
  )
} 