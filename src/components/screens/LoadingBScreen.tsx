interface LoadingBScreenProps {
  onMonitorClick: () => void
}

export function LoadingBScreen({ onMonitorClick }: LoadingBScreenProps) {
  return (
    <div className="space-y-6">
      {/* Monitor Content - Clickable */}
      <div 
        className="text-center cursor-pointer hover:bg-green-900/20 p-4 rounded transition-colors"
        onClick={onMonitorClick}
      >
        <h3 className="text-2xl font-bold mb-4">////...Peeling Bananas...///</h3>
        
        {/* Flashing text */}
        <div className="text-lg text-yellow-400 animate-pulse">
          click to continue peeling
        </div>
      </div>
    </div>
  )
} 