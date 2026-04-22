import { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { navLinks } from '../pages/config/routes'
import { useRos } from '../hooks/ROS/useRos'
import { Disclosure } from '@headlessui/react'
import ConnectDialog from './ConnectDialog'

function Layout() {
    const { ros, status, url, disconnect, connect } = useRos()
    const [dialogOpen, setDialogOpen] = useState(false)

    function handleConnect(newUrl) {
        connect(newUrl)
    }

    return (
        <>
            <ConnectDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onConnect={handleConnect}
            />

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
                                {status ?
                                    <>
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-green-500" />
                                            <span className="text-sm text-gray-400">
                                                Connected
                                            </span>
                                        </div>
                                        <span className="text-xs text-gray-500 max-w-32 truncate">{url}</span>

                                        <button
                                            onClick={disconnect}
                                            className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded transition"
                                        >
                                            Disconnect
                                        </button>
                                    </>

                                    :
                                    <>
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-red-500" />
                                            <span className="text-sm text-gray-400">
                                                Disconnected
                                            </span>
                                        </div>
                                        <span className="text-xs text-gray-500 max-w-32 truncate">Connect to a robot</span>

                                        <button
                                            onClick={() => setDialogOpen(true)}
                                            className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded transition"
                                        >
                                            Connect
                                        </button>
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                </Disclosure>
                <Outlet />
            </div>
        </>
    )
}

export default Layout