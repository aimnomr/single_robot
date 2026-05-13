import { useWaypointNav, NAV_STATUS } from '../hooks/ROS/useWaypointNav'

export default function WaypointNav() {
    const {
        waypoints,
        navStatus, currentIdx, logs, progress,
        isNavigating, isDone, isError, isIdle,
        start, stop, retry, skip,
    } = useWaypointNav()

    return (
        <div className="p-4 bg-gray-900 text-white rounded-lg max-w-sm font-mono text-sm">
            <h3 className="text-base font-bold mb-3">Waypoint Navigator</h3>

            {/* Status + progress */}
            <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${statusColor(navStatus)}`}>
                    {navStatus.toUpperCase()}
                </span>
                <span className="text-gray-400 text-xs">
                    {isDone
                        ? 'Mission complete'
                        : `${Math.min(currentIdx + 1, waypoints.length)} / ${waypoints.length}`}
                </span>
            </div>
            <div className="w-full bg-gray-700 rounded h-1.5 mb-3">
                <div
                    className="bg-blue-500 h-1.5 rounded transition-all duration-300"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Waypoint list */}
            <ul className="mb-3 space-y-1">
                {waypoints.map((wp, i) => {
                    const isActive  = i === currentIdx && isNavigating
                    const isDoneWp  = i < currentIdx || (isDone && i === currentIdx)
                    return (
                        <li key={wp.id} className={`flex items-center gap-2
                            ${isDoneWp  ? 'text-green-400' : ''}
                            ${isActive  ? 'text-yellow-400' : ''}
                            ${!isDoneWp && !isActive ? 'text-gray-500' : ''}
                        `}>
                            <span className="w-4 text-center">
                                {isDoneWp ? '✓' : isActive ? '→' : '·'}
                            </span>
                            <span>{wp.label}</span>
                            <span className="ml-auto text-xs text-gray-600">
                                ({wp.x.toFixed(2)}, {wp.y.toFixed(2)})
                            </span>
                        </li>
                    )
                })}
            </ul>

            {/* Controls */}
            <div className="flex gap-2 mb-3">
                {(isIdle || isDone) && (
                    <button onClick={start}
                        className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-500 transition-colors">
                        {isDone ? 'Run Again' : 'Start'}
                    </button>
                )}
                {isNavigating && (<>
                    <button onClick={stop}
                        className="px-3 py-1 bg-red-600 rounded hover:bg-red-500 transition-colors">
                        Stop
                    </button>
                    <button onClick={skip}
                        className="px-3 py-1 bg-gray-600 rounded hover:bg-gray-500 transition-colors">
                        Skip
                    </button>
                </>)}
                {isError && (<>
                    <button onClick={retry}
                        className="px-3 py-1 bg-yellow-600 rounded hover:bg-yellow-500 transition-colors">
                        Retry
                    </button>
                    <button onClick={start}
                        className="px-3 py-1 bg-gray-600 rounded hover:bg-gray-500 transition-colors">
                        Restart
                    </button>
                </>)}
            </div>

            {/* Log */}
            <div className="bg-gray-800 rounded p-2 max-h-28 overflow-y-auto text-xs text-gray-300 space-y-0.5">
                {logs.length === 0 && (
                    <p className="text-gray-600 italic">No activity yet.</p>
                )}
                {logs.map((l, i) => (
                    <div key={i}>
                        <span className="text-gray-500 mr-1">{l.time}</span>{l.msg}
                    </div>
                ))}
            </div>
        </div>
    )
}

function statusColor(s) {
    return {
        idle:       'bg-gray-700 text-gray-300',
        navigating: 'bg-blue-800 text-blue-200',
        done:       'bg-green-800 text-green-200',
        error:      'bg-red-800 text-red-200',
    }[s] ?? 'bg-gray-700'
}