
export function LiveBadge() {
    return (
        <span className="flex items-center gap-1.5 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
            <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-100 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-200"></span>
            </span>
            Live
        </span>
    )
}
