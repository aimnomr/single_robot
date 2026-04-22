import Skeleton from '@mui/material/Skeleton'

function SkeletonRobot() {
    return (
        <>
            <header className="relative bg-gray-800 after:pointer-events-none after:absolute after:inset-x-0 after:inset-y-0 after:border-y after:border-white/10">
                <div className="mx-auto max-w-7xl px-8 py-6 flex">
                    <h1 className="text-3xl font-bold tracking-tight">Robots</h1>
                </div>
            </header>
            <main>
                <div className="flex flex-col justify-start mx-auto max-w-7xl px-8 py-6">
                    {/* Main content skeleton - mirrors real layout */}
                    <div className='flex flex-row justify-start'>
                        {/* Map skeleton */}
                        <div className=' flex flex-col items-center gap-6 p-4'>
                            <Skeleton variant="rectangular" width={360} height={360} sx={{ borderRadius: 2 }} />
                        </div>

                        {/* Right column skeletons */}
                        <div className='flex flex-col justify-start'>
                            {/* RobotView (camera) skeleton */}
                            <div className='flex flex-col items-center gap-6 p-4'>
                                <div className="rounded-lg h-50 flex aspect-video items-center justify-center" style={{ width: 320 }}>
                                    <Skeleton variant="rectangular" width={320} height={200} sx={{ borderRadius: 1 }} />
                                </div>
                            </div>

                            {/* AMCLPoseView skeleton */}
                            <div className='flex flex-col items-center gap-2 p-4'>
                                <Skeleton variant="rectangular" width={200} height={20} />
                                <Skeleton variant="rectangular" width={200} height={20} />
                                <Skeleton variant="rectangular" width={200} height={20} />
                                <Skeleton variant="rectangular" width={200} height={20} />
                            </div>
                        </div>
                    </div>

                    {/* RobotControl skeleton */}
                    <div className='flex flex-row justify-start mt-5'>
                        <div className='flex flex-col items-center gap-6 p-4'>
                            <div className="grid grid-cols-3 gap-2">
                                {/* 3x3 grid of skeleton buttons */}
                                {[...Array(9)].map((_, i) => (
                                    <Skeleton key={i} variant="rectangular" width={56} height={56} sx={{ borderRadius: 1 }} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>

    )
}

export default SkeletonRobot