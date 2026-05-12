import { useEffect, useCallback, useRef } from 'react'
import { useTeleop } from '../hooks/ROS/useTeleop'

const LINEAR_SPEED  = 0.3
const ANGULAR_SPEED = 0.5

const COMMANDS = {
  w: (publish) => publish(LINEAR_SPEED, 0),
  x: (publish) => publish(-LINEAR_SPEED, 0),
  a: (publish) => publish(0, ANGULAR_SPEED),
  s: (publish) => publish(0, 0),
  d: (publish) => publish(0, -ANGULAR_SPEED),
  q: (publish) => publish(LINEAR_SPEED, ANGULAR_SPEED),
  e: (publish) => publish(LINEAR_SPEED, -ANGULAR_SPEED),
  z: (publish) => publish(-LINEAR_SPEED, -ANGULAR_SPEED),
  c: (publish) => publish(-LINEAR_SPEED, ANGULAR_SPEED),
}

// FIX: Moved outside RobotControl so it has a stable identity across renders.
// Handlers are passed as props instead of closing over them.
const ControlButton = ({ label, commandKey, onStart, onStop }) => (
  <button
    onMouseDown={() => onStart(commandKey)}
    onMouseUp={onStop}
    onMouseLeave={onStop}
    // onTouchStart={(e) => { e.preventDefault(); onStart(commandKey) }}
    // onTouchEnd={onStop}
    className="flex items-center justify-center w-14 h-14 bg-gray-700 hover:bg-gray-600 active:bg-gray-500 font-bold rounded-lg select-none"
  >
    {label}
  </button>
)

function RobotControl() {
  const { publish, stop } = useTeleop()
  const intervalRef = useRef(null)

  const startCommand = useCallback((key) => {
    if (intervalRef.current) return
    const action = COMMANDS[key]
    if (!action) return
    action(publish)
    intervalRef.current = setInterval(() => action(publish), 100)
  }, [publish])

  const stopCommand = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    stop()
  }, [stop])

  const handleKeyDown = useCallback((e) => {
    if (e.repeat) return
    startCommand(e.key)
  }, [startCommand])

  const handleKeyUp = useCallback((e) => {
    if (Object.keys(COMMANDS).includes(e.key)) stopCommand()
  }, [stopCommand])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [handleKeyDown, handleKeyUp])

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div className="grid grid-cols-3 gap-2">
        <ControlButton label="Q" commandKey="q" onStart={startCommand} onStop={stopCommand} />
        <ControlButton label="W" commandKey="w" onStart={startCommand} onStop={stopCommand} />
        <ControlButton label="E" commandKey="e" onStart={startCommand} onStop={stopCommand} />
        <ControlButton label="A" commandKey="a" onStart={startCommand} onStop={stopCommand} />
        <ControlButton label="S" commandKey="s" onStart={startCommand} onStop={stopCommand} />
        <ControlButton label="D" commandKey="d" onStart={startCommand} onStop={stopCommand} />
        <ControlButton label="Z" commandKey="z" onStart={startCommand} onStop={stopCommand} />
        <ControlButton label="X" commandKey="x" onStart={startCommand} onStop={stopCommand} />
        <ControlButton label="C" commandKey="c" onStart={startCommand} onStop={stopCommand} />
      </div>
    </div>
  )
}

export default RobotControl