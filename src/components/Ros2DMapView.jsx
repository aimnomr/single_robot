import { useEffect, useRef, useState } from 'react'
import { useRos } from '../hooks/ROS/useRos'
import { useDWAPlannerLocal } from '../hooks/ROS/useDWAPlannerLocal'
import { useDWAPlannerGlobal } from '../hooks/ROS/useDWAPlannerGlobal'
import { quaternionToEuler } from "../helper/angleHelper"
import { useOdometry } from '../hooks/ROS/useOdom'
import { useMap } from '../hooks/ROS/useMap'


export default function Ros2dMapView({ className = '' }) {
    const { ros } = useRos()
    const containerRef = useRef(null)
    const [error, setError] = useState(null)
    const lpaths = useDWAPlannerLocal()
    const gpaths = useDWAPlannerGlobal()
    const robotPose = useOdometry()

    // Store refs for cleanup
    const viewerRef = useRef(null)
    const gridClientRef = useRef(null)
    const localPathShapeRef = useRef(null)
    const globalPathShapeRef = useRef(null)
    const navArrowRef = useRef(null)

    useEffect(() => {

        if (!ros || !containerRef.current) return

        let isMounted = true

        try {
            if (!isMounted || !containerRef.current) return

            containerRef.current.innerHTML = ''

            const viewer = new ROS2D.Viewer({
                divID: containerRef.current.id,
                width: 640,
                height: 640,
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

            const localPathShape = new ROS2D.PathShape({
                strokeSize: 0.03,
                strokeColor: createjs.Graphics.getRGB(200, 100, 100),
            });
            localPathShapeRef.current = localPathShape
            viewer.addObject(localPathShape)

            const globalPathShape = new ROS2D.PathShape({
                strokeSize: 0.01,
                strokeColor: createjs.Graphics.getRGB(0, 0, 100),
            });
            globalPathShapeRef.current = globalPathShape
            viewer.addObject(globalPathShape)

            const navArrow = new ROS2D.ArrowShape({
                size: 0.25,
                strokeSize: 0.1,
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
        if (!localPathShapeRef.current || !lpaths?.poses?.length) return
        localPathShapeRef.current.setPath(lpaths)
    }, [lpaths])

    useEffect(() => {
        if (!globalPathShapeRef.current || !gpaths?.poses?.length) return
        globalPathShapeRef.current.setPath(gpaths)
    }, [gpaths])

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