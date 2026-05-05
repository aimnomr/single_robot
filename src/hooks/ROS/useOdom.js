import { useEffect, useState } from 'react'
import { useRos } from './useRos'
import * as ROSLIB from 'roslib'

export function useOdometry() {
    const { ros } = useRos()
    const [pose, setPose] = useState(null)

    useEffect(() => {
        if (!ros) return

        const topic = new ROSLIB.Topic({
            ros,
            name: '/robot_pose_ekf_node/odom_combined',
            messageType: 'geometry_msgs/PoseWithCovarianceStamped',
            queue_length: 1
        })

        topic.subscribe((msg) => {
            setPose({
                position: {
                    x: msg.pose.pose.position.x,
                    y: msg.pose.pose.position.y,
                    z: msg.pose.pose.position.z,
                },
                orientation: {
                    x: msg.pose.pose.orientation.x,
                    y: msg.pose.pose.orientation.y,
                    z: msg.pose.pose.orientation.z,
                    w: msg.pose.pose.orientation.w,
                }
            })
        })

        return () => {
            topic.unsubscribe()
            setPose(null)
        }
    }, [ros])

    return pose
}