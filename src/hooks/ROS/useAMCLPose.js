import { useEffect, useState } from 'react'
import { useRos } from './useRos'
import * as ROSLIB from 'roslib'
import { quaternionToEuler, eulerToQuaternion } from '../../helper/angleHelper'

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

      const angles = quaternionToEuler(msg.pose.pose.orientation)

      setPose({
        px: msg.pose.pose.position.x.toFixed(3),
        py: msg.pose.pose.position.y.toFixed(3),
        qz: msg.pose.pose.orientation.z.toFixed(3),
        qw: msg.pose.pose.orientation.w.toFixed(3),
        rz: angles.z.toFixed(3)
      })
    })

    return () => {
      topic.unsubscribe()
      setPose(null)
    }
  }, [ros])

  return pose
}