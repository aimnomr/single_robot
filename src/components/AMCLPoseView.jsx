import { useAMCLPose } from "../hooks/ROS/useAMCLPose"


function AMCLPoseView() {
    const pose = useAMCLPose()

    if (!pose) return null

    return (
        <div className="flex flex-col items-center gap-2 p-4">
            <p>Point</p>
            <p>X: {pose.px}</p>
            <p>Y: {pose.py}</p>
            <p>Quarternion</p>
            <p>qZ: {pose.qz}</p>
            <p>qW: {pose.qw}</p>
            <p>rZ: {pose.rz}</p>
        </div>
    )
}

export default AMCLPoseView