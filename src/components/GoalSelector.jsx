import { mockLocationList } from '../pages/config/mock-data'
import { useMoveBase } from '../hooks/ROS/useMoveBase'

function GoalSelector() {
    const { publish, cancel } = useMoveBase()

    return (
        <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-3">Move to Goal</h3>
            <div className="flex flex-col gap-2">
                {mockLocationList.map((location) => (
                    <button
                        key={location.id}
                        onClick={() => publish(location.position, location.angle)}
                        className="flex items-center justify-between px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
                    >
                        <span>{location.name}</span>
                        <span className="text-sm text-indigo-200">
                            ({location.position.x.toFixed(1)}, {location.position.y.toFixed(1)})
                        </span>
                    </button>
                ))}
                <button
                    onClick={() => cancel()}
                    className="flex items-center justify-between px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
                >
                    <span>Cancel Nav</span>
                    <span className="text-sm text-indigo-200">
                        Stop
                    </span>
                </button>
            </div>
        </div>
    )
}

export default GoalSelector