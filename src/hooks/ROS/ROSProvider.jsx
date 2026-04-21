import { useEffect, useState, useRef, useCallback } from 'react'
import { RosContext } from './ROSContext'
import * as ROSLIB from 'roslib'

const MAX_RETRIES = 5

export function RosProvider({ children }) {
    const [ros, setRos] = useState(null)
    const [status, setStatus] = useState('Connecting...')
    const retryRef = useRef(null)
    const connectRef = useRef(null)
    const retryCountRef = useRef(0)

    const connect = useCallback(() => {
        const rosInstance = new ROSLIB.Ros({ url: 'ws://localhost:9090' })

        rosInstance.on('connection', () => {
            setRos(rosInstance)
            setStatus('Connected')
            retryCountRef.current = 0  // reset on successful connection
            if (retryRef.current) {
                clearTimeout(retryRef.current)
                retryRef.current = null
            }
        })

        rosInstance.on('error', () => {
            setStatus('Error')
        })

        rosInstance.on('close', () => {
            setRos(null)

            if (retryCountRef.current >= MAX_RETRIES) {
                setStatus('Failed — max retries reached')
                return
            }

            retryCountRef.current += 1
            setStatus(`Reconnecting... (${retryCountRef.current}/${MAX_RETRIES})`)
            retryRef.current = setTimeout(() => connectRef.current?.(), 3000)
        })

        return rosInstance
    }, [])

    console.log("Current Connection Try: ",retryCountRef.current)

    useEffect(() => {
        connectRef.current = connect
        const rosInstance = connect()
        return () => {
            if (retryRef.current) clearTimeout(retryRef.current)
            rosInstance.close()
        }
    }, [connect])

    return (
        <RosContext.Provider value={{ ros, status }}>
            {children}
        </RosContext.Provider>
    )
}