import { useRos } from '../hooks/ROS/useRos'
import { useCamera } from '../hooks/ROS/useCamera'

function RobotView() {
    const { ros } = useRos()
    const image = useCamera()

    if (!image) return null

    return (
        <div className="flex flex-col items-center gap-6 p-4">
            <div className="bg-gray-900 rounded-lg h-50 flex aspect-video items-center justify-center">
                <img src={image} alt="Camera feed" className="w-full h-full object-cover rounded-lg" />
            </div>
        </div>
    )
};

export default RobotView