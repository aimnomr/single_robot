import { useEffect, useState } from 'react'
import { useRos } from './useRos'
import * as ROSLIB from 'roslib'

export function useCamera() {
    const { ros } = useRos()
    const [image, setImage] = useState(null)
    const imagePrefix = 'data:image/jpeg;base64,'
    useEffect(() => {
        if(!ros) return

        const topic = new ROSLIB.Topic({
            ros,
            name : '/camera/front/image_raw/compressed',
            messageType : 'sensor_msgs/CompressedImage'
        })

        topic.subscribe((msg)=>{
            setImage(`${imagePrefix}${msg.data}`)
        })
        return () => {
            topic.unsubscribe()
            setImage(null)
        }
    }, [ros])

    return image
}