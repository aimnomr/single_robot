import { useEffect, useState } from 'react'
import { useRos } from './useRos'
import * as ROSLIB from 'roslib'

export function useMap() {
    const { ros } = useRos()
    const [map, setMap] = useState(null)

    useEffect(() => {
        if (!ros) return

        const topic = new ROSLIB.Topic({
            ros,
            name: '/reference/map',
            messageType: 'nav_msgs/OccupancyGrid',
            queue_length: 1
        })

        topic.subscribe((msg) => {
            setMap({
                width: msg.info.width,
                height: msg.info.height,
                resolution: msg.info.resolution,
                origin: msg.info.origin,
                data: msg.data
            })
        })
        return () => {
            topic.unsubscribe()
            setMap(null)
        }
    }, [ros])

    return map
}