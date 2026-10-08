export const WishlistSkeleton = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                    key={i}
                    className="bg-white rounded-xl border border-slate-200/80 p-4 animate-pulse flex flex-col justify-between"
                >
                    <div>
                        <div className="w-full aspect-4/3 bg-slate-100 rounded-lg mb-4" />
                        <div className="h-5 bg-slate-200 rounded w-3/4 mb-2" />
                        <div className="h-4 bg-slate-100 rounded w-1/2 mb-4" />
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <div className="h-6 bg-slate-200 rounded w-1/3" />
                        <div className="h-9 bg-slate-200 rounded w-1/3" />
                    </div>
                </div>
            ))}
        </div>
    );
};
