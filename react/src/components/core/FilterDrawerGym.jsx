import { XMarkIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

export default function FilterDrawerGym({
    isOpen,
    onClose,
    onApply,
    initialFilters,
    availableSpecialties,
    onClear,
}) {
    const [localFilters, setLocalFilters] = useState(initialFilters);

    useEffect(() => {
        if (isOpen) {
            setLocalFilters(initialFilters);
        }
    }, [isOpen, initialFilters]);

    const toggleSpecialty = (specialtyValue) => {
        setLocalFilters((prev) => ({
            ...prev,
            specialties: prev.specialties.includes(specialtyValue)
                ? prev.specialties.filter(s => s !== specialtyValue)
                : [...prev.specialties, specialtyValue]
        }));
    };


    const handleRatingChange = (e) => {
        setLocalFilters((prev) => ({
            ...prev,
            minRating: parseFloat(e.target.value)
        }));
    };

    const handlePricingChange = (e) => {
        setLocalFilters((prev) => ({
            ...prev,
            pricing: e.target.value
        }));
    };

    const handleApplyFilters = () => {
        onApply(localFilters);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-end">
            <div className="bg-white w-full sm:max-w-md h-full shadow-lg flex flex-col p-6 overflow-y-auto transform transition-transform duration-300 translate-x-0">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold">Filters</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                <button
                    onClick={onClear}
                    className="text-sm text-blue-600 hover:underline ml-auto"
                >
                    Clear All
                </button>
                {/* Specialties */}
                <div className="mb-6">
                    <h3 className="font-semibold text-sm mb-2">Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                        {availableSpecialties.map((spec) => (
                            <button
                                key={spec.value}
                                onClick={() => toggleSpecialty(spec.value)}
                                className={`px-3 py-1 rounded-full text-sm border ${localFilters.specialties.includes(spec.value)
                                    ? "bg-indigo-500 text-white border-indigo-500"
                                    : "bg-gray-100 text-gray-700 border-gray-300"
                                    }`}
                            >
                                {spec.label}
                            </button>
                        ))}
                    </div>
                </div>


                {/* Rating */}
                <div className="mb-6">
                    <h3 className="font-semibold text-sm mb-2">Minimum Rating</h3>
                    <input
                        type="range"
                        min="0"
                        max="5"
                        step="0.5"
                        value={localFilters.minRating}
                        onChange={handleRatingChange}
                        className="w-full"
                    />
                    <div className="text-sm text-gray-600 mt-1">Selected: {localFilters.minRating}⭐ or higher</div>
                </div>

                {/* Pricing */}
                <div className="mb-6">
                    <h3 className="font-semibold text-sm mb-2">Pricing</h3>
                    <select
                        value={localFilters.pricing}
                        onChange={handlePricingChange}
                        className="w-full border rounded px-3 py-2 text-sm"
                    >
                        <option value="all">All</option>
                        <option value="free">Free gyms</option>
                        <option value="paid">Paid gyms</option>
                    </select>
                </div>

                {/* Apply Button */}
                <button
                    onClick={handleApplyFilters}
                    disabled={
                        JSON.stringify(localFilters) === JSON.stringify(initialFilters)
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-center text-sm font-semibold w-full mt-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Apply Filters
                </button>
            </div>
        </div>
    );
}
