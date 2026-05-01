import RobotControl from "../components/RobotControl"
import { useRos } from '../hooks/ROS/useRos'
import MapView from '../components/MapView'
import RobotView from '../components/RobotView'
import AMCLPoseView from '../components/AMCLPoseView'
import SkeletonRobot from '../components/SkeletonRobot'
import GoalSelector from '../components/GoalSelector'

function Robots() {
    const { ros } = useRos()

    return (
        <>
            {!ros ? (
                <SkeletonRobot />
            ) : (
                <main>
                    <div className="flex flex-col justify-start mx-auto max-w-7xl px-8 py-6">
                        {/* Single Robot */}
                        <div className='flex flex-row justify-start'>
                            <MapView />
                            <div className='flex flex-col justify-start'>
                                <RobotView />
                                {/* <AMCLPoseView /> */}
                                <GoalSelector />
                            </div>
                        </div>
                        <div className='flex flex-row divide-x jus divide-white/5 mt-5'>
                            <RobotControl />
                        </div>
                    </div>
                </main>
            )}
        </>
    )
}

export default Robots