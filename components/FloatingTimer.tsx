import { useRef, useState } from 'react'
import { Rnd } from 'react-rnd'
import { Button } from "@/components/ui/button"
import { Maximize2, X, Play, Pause, SkipForward, RotateCcw } from "lucide-react"

export default function FloatingTimer({
  isFloating,
  setIsFloating,
  currentEvent,
  timeRemaining,
  isBlinking,
  isTimerRunning,
  pauseTimer,
  resumeTimer,
  skipToNextEvent,
  resetTimer,
  closeTimer,
  formatTime
}) {
  const [floatSize, setFloatSize] = useState({ width: 200, height: 100 })
  const floatRef = useRef(null)

  const toggleFloating = () => {
    setIsFloating(!isFloating)
  }

  return (
    <Rnd
      ref={floatRef}
      default={{
        x: 0,
        y: 0,
        width: floatSize.width,
        height: floatSize.height,
      }}
      minWidth={150}
      minHeight={80}
      bounds="window"
      onResize={(e, direction, ref, delta, position) => {
        setFloatSize({
          width: ref.offsetWidth,
          height: ref.offsetHeight,
        })
      }}
      style={{
        background: 'black',
        position: 'fixed',
        zIndex: 9999,
      }}
    >
      <div className="w-full h-full flex flex-col items-center justify-center text-white p-2">
        <div className="absolute top-1 right-1 flex space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFloating}
            className="text-white hover:text-gray-300"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={closeTimer}
            className="text-white hover:text-gray-300"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-center">
          <h2 className="text-sm mb-1 truncate">{currentEvent.name}</h2>
          <div
            className={`text-2xl font-bold ${isBlinking ? 'animate-pulse' : ''}`}
            style={{
              animation: isBlinking ? 'blink 1s linear infinite' : 'none',
            }}
          >
            {formatTime(timeRemaining)}
          </div>
        </div>
        <div className="mt-2 flex space-x-2">
          <Button size="sm" onClick={isTimerRunning ? pauseTimer : resumeTimer}>
            {isTimerRunning ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
          </Button>
          <Button size="sm" onClick={skipToNextEvent}>
            <SkipForward className="h-3 w-3" />
          </Button>
          <Button size="sm" onClick={resetTimer}>
            <RotateCcw className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </Rnd>
  )
}