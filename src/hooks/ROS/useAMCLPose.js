import { useEffect, useState } from 'react'
import { useRos } from './useRos'
import * as ROSLIB from 'roslib'

export function useAMCLPose() {
  const { ros } = useRos()
  const [pose, setPose] = useState(null)

  useEffect(() => {
    if (!ros) return

    const topic = new ROSLIB.Topic({
      ros,
      name: '/amcl_pose',
      messageType: 'geometry_msgs/PoseWithCovarianceStamped'
    })

    topic.subscribe((msg) => {
      setPose({
        x: msg.pose.pose.position.x.toFixed(3),
        y: msg.pose.pose.position.y.toFixed(3),
        z: msg.pose.pose.orientation.z.toFixed(3),
        w: msg.pose.pose.orientation.w.toFixed(3),
      })
    })

    return () => {
      topic.unsubscribe()
      setPose(null)
    }
  }, [ros])

  return pose
}