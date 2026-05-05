import { useEffect, useRef, useState } from 'react'
import { useRos } from '../hooks/ROS/useRos'

/**
 * Ros2dMapView - Map visualization component using ros2djs
 *
 * Uses ROS2D.OccupancyGridClient with continuous updates to render
 * the occupancy grid map on an EaselJS canvas.
 *
 * Props:
 * - className: Optional CSS classes for the container div
 *
 * To swap with MapView: replace <MapView /> with <Ros2dMapView /> in Robots.jsx
 */
export default function Ros2dMapView({ className = '' }) {
    const { ros } = useRos()
    const containerRef = useRef(null)
    const [error, setError] = useState(null)

    // Store refs for cleanup
    const viewerRef = useRef(null)
    const gridClientRef = useRef(null)

    useEffect(() => {
        if (!ros || !containerRef.current) return

        let isMounted = true

        try {
            if (!isMounted || !containerRef.current) return

            containerRef.current.innerHTML = ''

            const viewer = new ROS2D.Viewer({
                divID: containerRef.current.id,
                width: 480,
                height: 480,
            })

            // Setup the map client with continuous updates
            const gridClient = new ROS2D.OccupancyGridClient({
                ros: ros,
                rootObject: viewer.scene,
                continuous: true,
                topic: '/reference/map'
            })

            viewerRef.current = viewer
            gridClientRef.current = gridClient

            gridClient.on('change', function () {
                if (!isMounted) return
                viewer.scaleToDimensions(
                    gridClient.currentGrid.width,
                    gridClient.currentGrid.height
                )
                viewer.shift(
                    gridClient.currentGrid.pose.position.x,
                    gridClient.currentGrid.pose.position.y
                )
            })

            gridClient.on('error', function (err) {
                console.error('ros2d map error:', err)
                setError('Failed to load map')
            })
        } catch (err) {
            console.error('Failed to initialize ros2d:', err)
            setError('Failed to initialize map visualization')
        }

        return () => {
            isMounted = false
            // Cleanup gridClient - unsubscribe the internal topic listener
            if (gridClientRef.current) {
                try {
                    gridClientRef.current.gridClient.unsubscribe()
                } catch (e) {
                    // ignore cleanup errors
                }
                gridClientRef.current = null
            }
            // Cleanup viewer
            if (viewerRef.current) {
                viewerRef.current.scene.removeAllChildren()
                viewerRef.current = null
            }
        }
    }, [ros])

    if (error) {
        return (
            <div className={`flex items-center justify-center p-4 text-red-400 ${className}`}>
                {error}
            </div>
        )
    }

    return (
        <div
            ref={containerRef}
            id="map"
            className={`flex flex-col items-center rounded ${className}`}
            style={{
                minHeight: '480px',
                backgroundColor: '#1a1a1a',
                overflow: 'hidden'
            }}
        />
    )
}