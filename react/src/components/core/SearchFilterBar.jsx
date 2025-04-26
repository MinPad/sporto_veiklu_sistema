import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

export default function SearchFilterBar({
    value,
    onChange,
    onFilterClick,
    placeholder = "Search...",
    showFilter = false,
    filterCount = 0,
}) {
    return (
        <div className="relative w-full sm:max-w-xs">
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`p-2 pl-10 ${showFilter ? 'pr-10' : 'pr-3'} border border-gray-300 rounded-lg w-full text-sm`}
            />
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
            {showFilter && (
                <div className="absolute right-2 top-2.5">
                    <button
                        type="button"
                        onClick={onFilterClick}
                        className="relative"
                        title="Filter"
                    >
                        <FunnelIcon className="h-5 w-5 text-gray-500 hover:text-gray-700 transition" />
                        {filterCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 rounded-full">
                                {filterCount}
                            </span>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}
