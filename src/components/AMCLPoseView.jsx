import { useAMCLPose } from "../hooks/ROS/useAMCLPose"


function AMCLPoseView() {
    const pose = useAMCLPose()

    if (!pose) return null

    return (
        <div className="flex flex-col items-center gap-2 p-4">
            <p>X: {pose.x}</p>
            <p>Y: {pose.y}</p>
            <p>Z: {pose.z}</p>
            <p>W: {pose.w}</p>
        </div>
    )
}

export default AMCLPoseView