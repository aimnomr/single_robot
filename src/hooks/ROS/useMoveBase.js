import { useRef } from 'react'
import { useRos } from './useRos'
import * as ROSLIB from 'roslib'
import { eulerToQuaternion } from '../../helper/angleHelper'

export function useMoveBase() {
    const { ros } = useRos()
    const topicRef = useRef(null)

    function getTopic() {
        if (!ros) return null
        if (!topicRef.current) {
            topicRef.current = new ROSLIB.Topic({
                ros,
                name: '/move_base/goal',
                messageType: 'move_base_msgs/MoveBaseActionGoal'
            })
        }
        return topicRef.current
    }

    function publish(point, angle) {
        const { x, y } = point
        const qAngle = eulerToQuaternion(angle)
        const topic = getTopic()
        if (!topic) return

        topic.publish({
            header: {
                frame_id: "map"
            },
            goal_id: {
                stamp: { secs: 0, nsecs: 0 },
                id: `goal_${Date.now()}`
            },
            goal: {
                target_pose: {
                    header: {
                        frame_id: "map"   // ← this is what was missing
                    },
                    pose: {
                        position: {
                            x: x,
                            y: y,
                            z: 0,
                        },
                        orientation: {
                            x: qAngle.x,
                            y: qAngle.y,
                            z: qAngle.z,
                            w: qAngle.w,
                        }
                    }
                }
            }
        })
    }

    return { publish }
}