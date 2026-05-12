import { useRef, useEffect } from 'react'
import { useRos } from './useRos'
import * as ROSLIB from 'roslib'
import { eulerToQuaternion } from '../../helper/angleHelper'

export const GOAL_STATUS = {
    PENDING:   0,
    ACTIVE:    1,
    PREEMPTED: 2,
    SUCCEEDED: 3,
    ABORTED:   4,
    REJECTED:  5,
    LOST:      9,
}

let goalCounter = 0

export function useMoveBase() {
    const { ros } = useRos()
    const actionClientRef = useRef(null)

    useEffect(() => {
        if (!ros) return

        actionClientRef.current = new ROSLIB.ActionClient({
            ros,
            serverName: '/move_base',
            actionName:  'move_base_msgs/MoveBaseAction',
        })

        return () => {
            actionClientRef.current?.cancel()
            actionClientRef.current = null
        }
    }, [ros])

    // angle: { x, y, z } in degrees — eulerToQuaternion handles deg→rad internally
    function publish(point, angle, callbacks = {}) {
        const { onSucceeded, onFailed, onFeedback } = callbacks

        if (!actionClientRef.current) {
            console.warn('[useMoveBase] ActionClient not ready — is ROS connected?')
            onFailed?.('not_connected')
            return () => {}
        }

        // FIX: pass angle object directly — no manual deg→rad conversion here
        const qAngle = eulerToQuaternion(angle)
        const goalId = `goal_${++goalCounter}_${Date.now()}`

        console.info(`[useMoveBase] ${goalId} → pos(${point.x}, ${point.y}) orient:`, qAngle)

        const goal = new ROSLIB.Goal({
            actionClient: actionClientRef.current,
            goalMessage: {
                target_pose: {
                    header: { frame_id: 'map', stamp: { secs: 0, nsecs: 0 } },
                    pose: {
                        position:    { x: point.x, y: point.y, z: 0 },
                        orientation: {
                            x: qAngle.x,
                            y: qAngle.y,
                            z: qAngle.z,
                            w: qAngle.w,
                        },
                    },
                },
            },
        })

        goal.on('status', (statusMsg) => {
            const code = statusMsg?.status
            if (code === GOAL_STATUS.SUCCEEDED) {
                onSucceeded?.()
            } else if ([GOAL_STATUS.ABORTED, GOAL_STATUS.REJECTED, GOAL_STATUS.LOST].includes(code)) {
                onFailed?.(code)
            }
        })

        goal.on('feedback', (fb) => {
            onFeedback?.(fb?.base_position?.pose)
        })

        goal.send()
        return () => goal.cancel()
    }

    function cancelAll() {
        actionClientRef.current?.cancel()
    }

    return { publish, cancelAll }
}