import { conditionalHelper } from "../helper/conditionalHelper"
import { Button } from "@headlessui/react"

export default function Lists({ itemList }) {
    return (
        <div>
            <ul role="list" className="divide-y divide-white/5">
                {itemList.map((item) => (
                    <li key={item.email} className="flex justify-between gap-x-6 py-5">

                        <div className="flex min-w-0 gap-x-4">
                            <div className="self-center">
                                <div className={conditionalHelper(item.connected ? "bg-amber-300" : "bg-gray-400", "rounded-full size-3")}></div>
                            </div>
                            <div className="min-w-0 flex-auto">
                                <p className="text-sm/6 font-semibold text-white">{item.name}</p>
                                <p className="mt-1 truncate text-xs/5 text-gray-400">{item.email}</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <p className="text-xs/5 text-gray-500">{item.uuid}</p>

                            <p className="text-xs/5 text-gray-600">
                                {item.connected ? "Connected" : "Disconnected"}
                            </p>

                        </div>
                    </li>
                ))}
            </ul>
            <div className="flex justify-end mt-5 gap-5">
                <Button className="rounded bg-cyan-600 px-4 py-2 text-sm text-white  hover:bg-cyan-800 min-w-20 max-w-25">
                    Add
                </Button>
                <Button className="rounded bg-red-600 px-4 py-2 text-sm text-white  hover:bg-red-800 min-w-20 max-w-25">
                    Remove
                </Button>
            </div>
        </div>
    )
}
