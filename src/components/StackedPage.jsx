import RobotControl from './RobotControl'
import { useRos } from '../hooks/ROS/useRos'
import MapView from './MapView'
import RobotView from './RobotView'
import AMCLPoseView from './AMCLPoseView'
import SkeletonPage from './SkeletonPage'

export default function StackedPages() {
    const { ros } = useRos()

    return (
        <>
            {!ros ? (
                <SkeletonPage />
            ) : (
                <main>
                    <div className="flex flex-col justify-start mx-auto max-w-7xl px-8 py-6">
                        {/* Single Robot */}
                        <div className='flex flex-row justify-start'>
                            <MapView />
                            <div className='flex flex-col justify-start'>
                                <RobotView />
                                <AMCLPoseView />
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