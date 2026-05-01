import { useEffect, useCallback, useRef } from 'react'
import { useTeleop } from '../hooks/ROS/useTeleop'

const LINEAR_SPEED = 0.3
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

function RobotControl() {
  const { publish, stop } = useTeleop()
  const intervalRef = useRef(null)

  const startCommand = useCallback((key) => {
    if (intervalRef.current) return
    const action = COMMANDS[key]
    if (!action) return
    action(publish)  // fire immediately
    intervalRef.current = setInterval(() => action(publish), 100)
  }, [publish])

  const stopCommand = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    stop()
  }, [stop])

  // Keyboard
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

  // Button component
  const ControlButton = ({ label, commandKey }) => (
    <button
      onMouseDown={() => startCommand(commandKey)}
      onMouseUp={stopCommand}
      onMouseLeave={stopCommand}  // stop if mouse drifts off button
      // onTouchStart={(e) => { 
      //   e.preventDefault(); startCommand(commandKey) }}
      // onTouchEnd={stopCommand}
      className="flex items-center justify-center w-14 h-14 bg-gray-700 hover:bg-gray-600 active:bg-gray-500  font-bold rounded-lg select-none"
    >
      {label}
    </button>
  )

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      {/* <h2 className=" font-semibold">Robot Control</h2> */}

      {/* D-pad style layout */}
      <div className="grid grid-cols-3 gap-2">
        <ControlButton label="Q" commandKey="q" />
        <ControlButton label="W" commandKey="w" />
        <ControlButton label="E" commandKey="e" />
        <ControlButton label="A" commandKey="a" />
        <ControlButton label="S" commandKey="s" />
        <ControlButton label="D" commandKey="d" />
        <ControlButton label="Z" commandKey="z" />
        <ControlButton label="X" commandKey="x" />
        <ControlButton label="C" commandKey="c" />
      </div>
    </div>
  )
}

export default RobotControl