import { useAMCLPose } from "../hooks/ROS/useAMCLPose"

function AMCLPoseView() {
    const pose = useAMCLPose()
    return (
        <div className="flex flex-col items-center gap-6 p-4">
            <h2 className=" font-semibold">AMCL Pose</h2>
            {pose ? (
                <div>
                    <p>X: {pose.x}</p>
                    <p>Y: {pose.y}</p>
                    <p>Z: {pose.z}</p>
                    <p>W: {pose.w}</p>

                </div>
            ) : (
                <p>Waiting for pose data...</p>
            )}
        </div>
    )
}

export default AMCLPoseView