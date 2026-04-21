import { useEffect, useRef } from 'react'
import { useMap } from '../hooks/ROS/useMap'
import 

function MapView() {
    const map = useMap()
    const canvasRef = useRef(null)

    useEffect(() => {
        if (!map|| !canvasRef.current) return

        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')

        canvas.width = map.width
        canvas.height = map.height
        console.log(map.height)
        console.log(map.width)
        const imageData = ctx.createImageData(map.width, map.height)

        for (let row = 0; row < map.height; row++) {
            for (let col = 0; col < map.width; col++) {
                // Flip Y axis — ROS origin is bottom-left, canvas is top-left
                const rosIdx = (map.height - 1 - row) * map.width + col
                const canvasIdx = (row * map.width + col) * 4

                const cell = map.data[rosIdx]

                let r, g, b
                if (cell === -1) {
                    // Unknown — grey
                    r = g = b = 50
                } else if (cell === 0) {
                    // Free — white
                    r = g = b = 255
                } else {
                    // Occupied — black (cell is 0–100)
                    r = g = b = Math.round((100 - cell) * 2.55)
                }

                imageData.data[canvasIdx]     = r
                imageData.data[canvasIdx + 1] = g
                imageData.data[canvasIdx + 2] = b
                imageData.data[canvasIdx + 3] = 255  // alpha
            }
        }

        ctx.putImageData(imageData, 0, 0)

    }, [map])

    return (
    <div className="flex flex-col items-center gap-6 p-4">

      <h2 className=" font-semibold">Map View </h2>
            {map ? (
                <div>
                    <canvas className='rounded'
                        ref={canvasRef}
                        style={{
                            imageRendering: 'pixelated',  // keeps map crisp when scaled
                            maxWidth: '100%'
                        }}
                    />
                </div>
            ) : (
                <div className=''>
                    <p style={{ color: '#aaa' }}>Waiting for map data...</p>

                </div>
            )}
        </div>
    )
}

export default MapView