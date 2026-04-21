import { useRef } from 'react'
import { useRos } from './useRos'
import * as ROSLIB from 'roslib'

export function useTeleop() {
    const { ros } = useRos()
    const topicRef = useRef(null)

    function getTopic() {
        if (!ros) return null
        if (!topicRef.current) {
            topicRef.current = new ROSLIB.Topic({
                ros,
                name: '/web_teleop/cmd_vel',
                messageType: 'geometry_msgs/Twist'
            })
        }
        return topicRef.current
    }

    function publish(linearX, angularZ) {
        const topic = getTopic()
        if (!topic) return

        topic.publish({
            linear: { x: linearX, y: 0, z: 0 },
            angular: { x: 0, y: 0, z: angularZ }
        })
    }

    function stop() {
        publish(0, 0)
    }

    return { publish, stop }
}