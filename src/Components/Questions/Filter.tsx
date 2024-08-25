const Filter = () => {
    return (
        <aside className="col-span-12 md:col-span-3 dark:bg-dark-background rounded-lg shadow-md p-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Filters</h3>
            <div className="grid gap-6">
                {/* Tags Section */}
                <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-3 border-b border-gray-700 pb-1">Tags</h4>
                    <div className="flex gap-2 flex-wrap">
                        {['React', 'JavaScript', 'Python', 'CSS', 'Node.js', 'SQL'].map((tag) => (
                            <a
                                key={tag}
                                className="bg-gray-700 hover:bg-gray-600 text-white rounded-md px-3 py-1 text-xs font-mono transition-colors duration-200 ease-in-out"
                                href="#"
                            >
                                {tag}
                            </a>
                        ))}
                    </div>
                </div>
                {/* Sort By Section */}
                <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-3 border-b border-gray-700 pb-1">Sort By</h4>
                    {/* Add sorting options here */}
                </div>
            </div>
        </aside>
    )
}

export default Filter