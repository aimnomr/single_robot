import { useEffect, useRef } from 'react'
import { useRos } from '../hooks/ROS/useRos'
import { useCamera } from '../hooks/ROS/useCamera'

function RobotView() {
    const { ros } = useRos()
    const image = useCamera()

    return (
    <div className="flex flex-col items-center gap-6 p-4">
      <h2 className=" font-semibold">Camera View</h2>

              <div className="bg-gray-900 rounded-lg h-50 flex aspect-video items-center justify-center">
                {image ? (
                  <img src={image} alt="Camera feed" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <p className="text-gray-400 text-sm">No camera feed</p>
                )}
              </div>
            </div>
    )};

export default RobotView