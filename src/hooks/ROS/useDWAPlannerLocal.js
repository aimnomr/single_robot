import { useEffect, useState } from 'react'
import { useRos } from './useRos'
import * as ROSLIB from 'roslib'

export function useDWAPlannerLocal() {
    const { ros } = useRos()
    const [paths, setPaths] = useState(0)

    useEffect(() => {
        if (!ros) return

        const topic = new ROSLIB.Topic({
            ros,
            name: '/move_base_node/DWAPlannerROS/local_plan',
            messageType: 'nav_msgs/Path',
            queue_length: 1
        })

        topic.subscribe((msg) => {
            setPaths(
                msg
            )
        })
        return () => {
            topic.unsubscribe()
            setPaths(null)
        }
    }, [ros])

    return paths
}