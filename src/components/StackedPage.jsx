import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { navLinks } from '../pages/config/routes'
// import Lists from './List'
// import { robotList } from '../pages/config/robots'
import { conditionalHelper } from '../helper/conditionalHelper'

export default function StackedPages() {
    return (
        <div className="min-h-full">
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
                                                    ? 'bg-gray-950/50 text-white'
                                                    : 'text-gray-300 hover:bg-white/5 hover:text-white',
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
                    <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
                </div>
            </header>
            <main>
                <div className="flex flex-col justify-start mx-auto max-w-7xl px-8 py-6">
                    {/* Robots Page */}
                    {/* <Lists itemList={robotList} />  */}
                    {/* Single Robot */}
                </div>
            </main>
        </div>
    )
}
