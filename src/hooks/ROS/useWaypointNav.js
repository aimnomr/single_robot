import { useRef, useState, useEffect, useCallback } from 'react'
import { useMoveBase } from './useMoveBase'
import { useRos } from './useRos'
import * as ROSLIB from 'roslib'
import { mockLocationList } from '../../pages/config/mock-data'

export const NAV_STATUS = {
    IDLE:       'idle',
    NAVIGATING: 'navigating',
    DONE:       'done',
    ERROR:      'error',
}

const RESULT_STATUS = {
    SUCCEEDED: 3,
    ABORTED:   4,
    REJECTED:  5,
    PREEMPTED: 2,
}

function normaliseMockLocations(locations) {
    return locations.map(loc => ({
        id:    loc.id,
        label: loc.name,
        x:     loc.position.x,
        y:     loc.position.y,
        angle: loc.angle,
    }))
}

const WAYPOINTS = normaliseMockLocations(mockLocationList)

export function useWaypointNav() {
    const { ros }                = useRos()
    const { publish, cancelAll } = useMoveBase()

    const [navStatus,  setNavStatus]  = useState(NAV_STATUS.IDLE)
    const [currentIdx, setCurrentIdx] = useState(0)
    const [logs,       setLogs]       = useState([])

    const navStatusRef  = useRef(NAV_STATUS.IDLE)
    const currentIdxRef = useRef(0)
    // Stores the goalID roslibjs assigned (e.g. "goal_0.36499_1678882100060")
    const activeGoalIdRef = useRef(null)

    function addLog(msg) {
        setLogs(prev => [
            { time: new Date().toLocaleTimeString(), msg },
            ...prev.slice(0, 49),
        ])
    }

    function syncIdx(idx) {
        currentIdxRef.current = idx
        setCurrentIdx(idx)
    }

    function syncStatus(s) {
        navStatusRef.current = s
        setNavStatus(s)
    }

    // publish() now returns the ROSLIB.Goal object so we can read its goalID
    function sendWaypoint(idx) {
        const wp   = WAYPOINTS[idx]
        const goal = publish({ x: wp.x, y: wp.y }, wp.angle)

        // roslibjs sets goal.goalID in the format "goal_<random>_<timestamp>"
        // This is what appears in /move_base/result as status.goal_id.id
        activeGoalIdRef.current = goal?.goalID ?? null

        addLog(`→ Sending: ${wp.label} (${wp.x.toFixed(2)}, ${wp.y.toFixed(2)}) [id: ${activeGoalIdRef.current}]`)
    }

    // ── Subscribe to /move_base/result ────────────────────────────────────
    // Fires exactly once per goal (not continuously like /status).
    // Message shape: { header, status: { goal_id: { id }, status, text }, result }
    useEffect(() => {
        if (!ros) return

        const resultTopic = new ROSLIB.Topic({
            ros,
            name:        '/move_base/result',
            messageType: 'move_base_msgs/MoveBaseActionResult',
        })

        resultTopic.subscribe((msg) => {
            if (navStatusRef.current !== NAV_STATUS.NAVIGATING) return

            const incomingId = msg?.status?.goal_id?.id
            const code       = msg?.status?.status

            // Ignore results that don't belong to our current goal
            if (incomingId !== activeGoalIdRef.current) {
                console.info(`[useWaypointNav] Ignoring stale result for id: ${incomingId}`)
                return
            }

            if (code === RESULT_STATUS.SUCCEEDED) {
                const wp   = WAYPOINTS[currentIdxRef.current]
                addLog(`✓ Reached ${wp.label}`)
                activeGoalIdRef.current = null

                const next = currentIdxRef.current + 1
                if (next >= WAYPOINTS.length) {
                    syncStatus(NAV_STATUS.DONE)
                    addLog('✅ All waypoints reached!')
                } else {
                    syncIdx(next)
                    sendWaypoint(next)
                }
            } else if (
                code === RESULT_STATUS.ABORTED   ||
                code === RESULT_STATUS.REJECTED  ||
                code === RESULT_STATUS.PREEMPTED
            ) {
                addLog(`✗ Failed at ${WAYPOINTS[currentIdxRef.current]?.label} (status: ${code} — ${msg?.status?.text})`)
                syncStatus(NAV_STATUS.ERROR)
                activeGoalIdRef.current = null
            }
        })

        return () => resultTopic.unsubscribe()
    }, [ros])

    // ── Controls ──────────────────────────────────────────────────────────
    const start = useCallback(() => {
        syncIdx(0)
        syncStatus(NAV_STATUS.NAVIGATING)
        addLog('▶ Starting navigation…')
        sendWaypoint(0)
    }, [])

    const stop = useCallback(() => {
        cancelAll()
        activeGoalIdRef.current = null
        syncStatus(NAV_STATUS.IDLE)
        addLog('⏹ Navigation stopped.')
    }, [cancelAll])

    const retry = useCallback(() => {
        if (navStatusRef.current !== NAV_STATUS.ERROR) return
        syncStatus(NAV_STATUS.NAVIGATING)
        addLog(`↺ Retrying: ${WAYPOINTS[currentIdxRef.current]?.label}…`)
        sendWaypoint(currentIdxRef.current)
    }, [])

    const skip = useCallback(() => {
        cancelAll()
        const next = currentIdxRef.current + 1
        if (next >= WAYPOINTS.length) {
            syncStatus(NAV_STATUS.DONE)
            addLog('⏭ Skipped last waypoint — done.')
            return
        }
        syncIdx(next)
        syncStatus(NAV_STATUS.NAVIGATING)
        addLog(`⏭ Skipping to: ${WAYPOINTS[next]?.label}`)
        sendWaypoint(next)
    }, [cancelAll])

    return {
        waypoints: WAYPOINTS,
        navStatus,
        currentIdx,
        logs,
        start,
        stop,
        retry,
        skip,
        isNavigating: navStatus === NAV_STATUS.NAVIGATING,
        isDone:       navStatus === NAV_STATUS.DONE,
        isError:      navStatus === NAV_STATUS.ERROR,
        isIdle:       navStatus === NAV_STATUS.IDLE,
        progress:     Math.round((currentIdx / WAYPOINTS.length) * 100),
    }
}