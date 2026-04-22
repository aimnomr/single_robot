import { useState, useRef, useCallback } from 'react'
import { RosContext } from './ROSContext'
import * as ROSLIB from 'roslib'

export function RosProvider({ children }) {
    const [ros, setRos] = useState(null)
    const [status, setStatus] = useState(false)
    const [url, setUrl] = useState(null)
    const [connectionError, setConnectionError] = useState(null)
    const rosInstanceRef = useRef(null)
    const isConnectedRef = useRef(false)

    const clearError = useCallback(() => setConnectionError(null), [])

    const disconnect = useCallback(() => {
        if (rosInstanceRef.current) {
            rosInstanceRef.current.close()
            rosInstanceRef.current = null
        }
        isConnectedRef.current = false
        setRos(null)
        setStatus(false)
        setUrl(null)
        setConnectionError(null)
    }, [])

    const connect = useCallback((newUrl) => {
        if (rosInstanceRef.current) {
            rosInstanceRef.current.close()
        }

        setUrl(newUrl)
        setConnectionError(null)
        isConnectedRef.current = false
        const rosInstance = new ROSLIB.Ros({ url: newUrl })

        rosInstance.on('connection', () => {
            isConnectedRef.current = true
            setRos(rosInstance)
            setStatus(true)
            setConnectionError(null)
        })

        rosInstance.on('error', () => {
            isConnectedRef.current = false
            setStatus(false)
            setRos(null)
            setConnectionError('Failed to connect')
        })

        rosInstance.on('close', () => {
            isConnectedRef.current = false
            setStatus(false)
            setRos(null)
            if (!isConnectedRef.current) {
                setConnectionError('Connection closed')
            }
            rosInstanceRef.current = null
        })

        rosInstanceRef.current = rosInstance
        return rosInstance
    }, [])

    return (
        <RosContext.Provider value={{ ros, status, url, connect, disconnect, connectionError, clearError }}>
            {children}
        </RosContext.Provider>
    )
}
