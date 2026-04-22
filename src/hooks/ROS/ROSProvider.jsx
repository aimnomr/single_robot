import { useEffect, useState, useRef, useCallback } from 'react'
import { RosContext } from './ROSContext'
import * as ROSLIB from 'roslib'

const MAX_RETRIES = 5

export function RosProvider({ children }) {
    const [ros, setRos] = useState(null)
    const [status, setStatus] = useState(false)
    const [url, setUrl] = useState(null)
    const retryRef = useRef(null)
    const connectRef = useRef(null)
    const retryCountRef = useRef(0)
    const rosInstanceRef = useRef(null)

    const disconnect = useCallback(() => {
        if (retryRef.current) {
            clearTimeout(retryRef.current)
            retryRef.current = null
        }
        retryCountRef.current = 0
        if (rosInstanceRef.current) {
            rosInstanceRef.current.close()
            rosInstanceRef.current = null
        }
        setRos(null)
        setStatus(false)
        setUrl(null)
    }, [])

    const connect = useCallback((newUrl) => {
        if (rosInstanceRef.current) {
            rosInstanceRef.current.close()
        }

        setUrl(newUrl)
        const rosInstance = new ROSLIB.Ros({ url: newUrl })

        rosInstance.on('connection', () => {
            setRos(rosInstance)
            setStatus(true)
            retryCountRef.current = 0
            if (retryRef.current) {
                clearTimeout(retryRef.current)
                retryRef.current = null
            }
        })

        rosInstance.on('error', () => {
            setStatus(false)
        })

        rosInstance.on('close', () => {
            if (retryCountRef.current >= MAX_RETRIES) {
                setRos(null)
                setStatus(false)
                rosInstanceRef.current = null
                return
            }

            retryCountRef.current += 1
            setStatus(false)
            retryRef.current = setTimeout(() => connectRef.current?.(), 3000)
        })

        rosInstanceRef.current = rosInstance
        return rosInstance
    }, [])

    useEffect(() => {
        connectRef.current = connect
    }, [connect])

    return (
        <RosContext.Provider value={{ ros, status, url, connect, disconnect }}>
            {children}
        </RosContext.Provider>
    )
}