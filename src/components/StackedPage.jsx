import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { navLinks } from '../pages/config/routes'
// import Lists from './List'
// import { robotList } from '../pages/config/robots'
import RobotControl from './RobotControl'
import { conditionalHelper } from '../helper/conditionalHelper'
import { useRos } from '../hooks/ROS/useRos'
import MapView from './MapView'
import RobotView from './RobotView'

export default function StackedPages() {

    const { ros } = useRos()

    return (
        <div className="min-h-full text-white text-lg">
            <Disclosure as="nav" className="bg-gray-800/50">
                <div className="mx-auto max-w-7xl px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center">
                            <div className="shrink-0">
                                <a href="/">
                                    <img
                                        alt="Your Company"
                                        src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                                        className="size-8"
                                    />
                                </a>
                            </div>
                            <div className="block">
                                <div className="ml-10 flex items-baseline space-x-4">
                                    {navLinks.map((item) => (
                                        <a
                                            key={item.label}
                                            href={item.href}
                                            className={conditionalHelper(
                                                item.current
                                                    ? 'bg-gray-950/50 '
                                                    : 'text-gray-300 hover:bg-white/5 hover:',
                                                'rounded-md px-3 py-2 text-sm font-medium',
                                            )}
                                        >
                                            {item.label}
                                        </a>
                                    ))}
                                </div>
                            </div>
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
                    {/* Robots Page */}
                    {/* <Lists itemList={robotList} />  */}
                    {/* Single Robot */}
                    <div className='flex flex-row justify-start'>
                    <MapView/>
                    <RobotView/>
                    </div>
                    <div className='flex flex-row divide-x jus divide-white/5 mt-5'>
                    <RobotControl/>

                    </div>
                </div>
            </main>
        </div>
    )
}
