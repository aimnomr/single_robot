import { Disclosure } from '@headlessui/react'
import Skeleton from '@mui/material/Skeleton'

function SkeletonPage({ onConnect }) {
    return (
        <div className="min-h-full text-white text-lg">
            <Disclosure as="nav" className="bg-gray-800/50">
                <div className="mx-auto max-w-7xl px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center">
                            <div className="shrink-0">
                                <Skeleton variant="rectangular" width={32} height={32} sx={{ borderRadius: 1 }} />
                            </div>
                            <div className="block">
                                <div className="ml-10 flex items-baseline space-x-4">
                                    <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 1 }} />
                                    <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 1 }} />
                                    <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 1 }} />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red-500" />
                                <span className="text-sm text-gray-400">
                                    Disconnected
                                </span>
                            </div>
                            <span className="text-xs text-gray-500 max-w-32 truncate">Connect to robot</span>
                            <button onClick={onConnect}
                                className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded transition">
                                Connect
                            </button>
                        </div>
                    </div>
                </div>
            </Disclosure>
            <header
                className="relative bg-gray-800 after:pointer-events-none after:absolute after:inset-x-0 after:inset-y-0 after:border-y after:border-white/10">
                <div className="mx-auto max-w-7xl px-8 py-6">
                <Skeleton variant="text" width={200} height={40} />

                </div>
            </header>
            <main>
                <div className="flex flex-col justify-start mx-auto max-w-7xl px-8 py-6">
                    {/* Single Robot */}
                    <div className='flex flex-row justify-start'>
                        <div className='flex flex-col items-center gap-6 p-4'>
                            <Skeleton variant="rectangular" width={480} height={480} sx={{ borderRadius: 2 }} />
                        </div>
                        <div className='flex flex-col justify-start'>
                            <div className='flex flex-col items-center gap-6 p-4'>
                                <div className="bg-gray-800 rounded-lg h-50 flex aspect-video items-center justify-center" style={{ width: 320 }}>
                                    <Skeleton variant="rectangular" width={320} height={200} sx={{ borderRadius: 1 }} />
                                </div>
                            </div>
                            <div className='flex flex-col items-center gap-2 p-4'>
                                <Skeleton variant="rectangular" width={200} height={20} />
                                <Skeleton variant="rectangular" width={200} height={20} />
                                <Skeleton variant="rectangular" width={200} height={20} />
                                <Skeleton variant="rectangular" width={200} height={20} />
                            </div>
                        </div>
                    </div>
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
        </div>
    )
}

export default SkeletonPage
