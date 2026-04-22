import { useAMCLPose } from "../hooks/ROS/useAMCLPose"
import Skeleton from '@mui/material/Skeleton'


function AMCLPoseView() {
    const pose = useAMCLPose()
    return (
        <div className="flex flex-col items-center gap-2 p-4">
            {/* <h2 className=" font-semibold">AMCL Pose</h2> */}
            {pose ? (
                <>
                    <p>X: {pose.x}</p>
                    <p>Y: {pose.y}</p>
                    <p>Z: {pose.z}</p>
                    <p>W: {pose.w}</p>

                </>
            ) : (
                <>
                <Skeleton variant="rectangular" width={200} height={20} />
                <Skeleton variant="rectangular" width={200} height={20} />
                <Skeleton variant="rectangular" width={200} height={20} />
                </>
            )}
        </div>
    )
}

export default AMCLPoseView