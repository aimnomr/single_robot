import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { useState } from 'react'

export default function ConnectDialog({ open, onClose, onConnect }) {
    const [inputUrl, setInputUrl] = useState('ws://localhost:9090')

    function handleSubmit(e) {
        e.preventDefault()
        onConnect(inputUrl)
        onClose()
    }

    return (
        <Dialog open={open} onClose={onClose} className="relative z-50">
            <DialogBackdrop className="fixed inset-0 bg-black/60" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
                    <DialogTitle className="text-xl font-bold mb-4 text-white">Connect to Robot</DialogTitle>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">ROS Bridge URL</label>
                            <input
                                type="text"
                                value={inputUrl}
                                onChange={(e) => setInputUrl(e.target.value)}
                                placeholder="ws://localhost:9090"
                                className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-gray-400 hover:text-white transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className=" text-white px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded font-medium transition"
                            >
                                Connect
                            </button>
                        </div>
                    </form>
                </DialogPanel>
            </div>
        </Dialog>
    )
}