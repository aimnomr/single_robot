import { Disclosure } from '@headlessui/react'
import { Link } from 'react-router-dom'
import { navLinks } from '../pages/config/routes'
import RobotControl from './RobotControl'
import { useRos } from '../hooks/ROS/useRos'
import MapView from './MapView'
import RobotView from './RobotView'
import AMCLPoseView from './AMCLPoseView'
import SkeletonPage from './SkeletonPage'
import ConnectDialog from './ConnectDialog'
import { useState } from 'react'

export default function StackedPages() {
    const { ros, status, url, connect, disconnect } = useRos()
    const [dialogOpen, setDialogOpen] = useState(false)

    function handleConnect(newUrl) {
        connect(newUrl)
    }

    function handleDisconnect() {
        disconnect()
    }

    return (
        <>
            <ConnectDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onConnect={handleConnect}
            />

            {!ros ? (
                <SkeletonPage onConnect={() => setDialogOpen(true)} />
            ) : (
                <div className="min-h-full text-white text-lg">
                    <Disclosure as="nav" className="bg-gray-800/50">
                        <div className="mx-auto max-w-7xl px-8">
                            <div className="flex h-16 items-center justify-between">
                                <div className="flex items-center">
                                    <div className="shrink-0">
                                        <Link to="/">
                                            <img
                                                alt="Your Company"
                                                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                                                className="size-8"
                                            />
                                        </Link>
                                    </div>
                                    <div className="block">
                                        <div className="ml-10 flex items-baseline space-x-4">
                                            {navLinks.map((item) => (
                                                <Link
                                                    key={item.label}
                                                    to={item.href}
                                                    className="text-gray-300 hover:bg-white/5 rounded-md px-3 py-2 text-sm font-medium"
                                                >
                                                    {item.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${status ? 'bg-green-500' : 'bg-red-500'}`} />
                                        <span className="text-sm text-gray-400">
                                            {status ? 'Connected' : 'Disconnected'}
                                        </span>
                                    </div>
                                    {url && (
                                        <span className="text-xs text-gray-500 max-w-32 truncate">{url}</span>
                                    )}
                                    <button
                                        onClick={handleDisconnect}
                                        className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded transition"
                                    >
                                        Disconnect
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Disclosure>
                    <header className="relative bg-gray-800 after:pointer-events-none after:absolute after:inset-x-0 after:inset-y-0 after:border-y after:border-white/10">
                        <div className="mx-auto max-w-7xl px-8 py-6">
                            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                        </div>
                    </header>
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
                </div>
            )}
        </>
    )
}