import { useEffect, useRef, useState } from 'react'
import { useRos } from '../hooks/ROS/useRos'
import { useDWAPlanner } from '../hooks/ROS/useDWAPlanner'
import { quaternionToEuler } from "../helper/angleHelper"
import { useOdometry } from '../hooks/ROS/useOdom'

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
    const paths = useDWAPlanner()
    const robotPose = useOdometry()

    // Store refs for cleanup
    const viewerRef = useRef(null)
    const gridClientRef = useRef(null)
    const pathShapeRef = useRef(null)
    const navArrowRef = useRef(null)

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
            viewerRef.current = viewer

            const gridClient = new ROS2D.OccupancyGridClient({
                ros: ros,
                rootObject: viewer.scene,
                continuous: true,
                topic: '/reference/map'
            })
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

            const pathShape = new ROS2D.PathShape({
                strokeSize: 0.05,
                strokeColor: createjs.Graphics.getRGB(255, 100, 100),
            });
            pathShapeRef.current = pathShape
            viewer.addObject(pathShape)

            const navArrow = new ROS2D.ArrowShape({
                size: 0.25,
                strokeSize: 0.1,
                // strokeColor: createjs.Graphics.getRGB(255, 255, 0),
                fillColor: createjs.Graphics.getRGB(0, 100, 255),
            });
            navArrowRef.current = navArrow
            viewer.addObject(navArrow)



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

    useEffect(() => {
        if (!navArrowRef.current || !robotPose) return
        navArrowRef.current.x = robotPose.position.x
        navArrowRef.current.y = -robotPose.position.y
        navArrowRef.current.rotation = -quaternionToEuler(robotPose.orientation).z.toFixed(2)
    }, [robotPose])

    useEffect(() => {
        if (!pathShapeRef.current || !paths?.poses?.length) return
        pathShapeRef.current.setPath(paths)
    }, [paths])

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