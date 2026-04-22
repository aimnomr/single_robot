function Dashboard() {
    return (
        <div className="min-h-full text-white text-lg">
            <div className="bg-gray-800/50 h-16 px-8 flex items-center">
                <div className="shrink-0">
                    <a href="/">
                        <img
                            alt="Your Company"
                            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                            className="size-8"
                        />
                    </a>
                </div>
            </div>
            <header className="bg-gray-800 px-8 py-6">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            </header>
            <main className="px-8 py-6">
                <p className="text-gray-400">Robot dashboard will be displayed here.</p>
            </main>
        </div>
    )
}

export default Dashboard