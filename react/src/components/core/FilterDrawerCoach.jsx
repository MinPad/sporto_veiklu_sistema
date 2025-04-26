import { useEffect, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function FilterDrawerCoach({
    isOpen,
    onClose,
    onApply,
    initialFilters,
    availableSpecialties = [],
    onClear,
}) {
    const [localFilters, setLocalFilters] = useState(initialFilters);

    useEffect(() => {
        if (isOpen) {
            setLocalFilters(initialFilters);
        }
    }, [isOpen, initialFilters]);

    const toggleSpecialty = (specValue) => {
        setLocalFilters(prev => ({
            ...prev,
            specialties: prev.specialties.includes(specValue)
                ? prev.specialties.filter(id => id !== specValue)
                : [...prev.specialties, specValue],
        }));
    };

    const handleApprovalChange = (e) => {
        setLocalFilters(prev => ({
            ...prev,
            approvalStatus: e.target.value,
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

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold">Filters</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Clear All Button */}
                <button
                    onClick={onClear}
                    className="text-sm text-blue-600 hover:underline ml-auto mb-6"
                >
                    Clear All
                </button>

                {/* Specialties Filter */}
                <div className="mb-6">
                    <h3 className="font-semibold text-sm mb-2">Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                        {(availableSpecialties || []).map((spec) => (
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

                {/* Approval Status Filter */}
                {/* <div className="mb-6">
                    <h3 className="font-semibold text-sm mb-2">Approval Status</h3>
                    <select
                        value={localFilters.approvalStatus}
                        onChange={handleApprovalChange}
                        className="w-full border rounded px-3 py-2 text-sm"
                    >
                        <option value="all">All</option>
                        <option value="approved">Approved</option>
                        <option value="pending">Pending</option>
                    </select>
                </div> */}

                {/* Apply Button */}
                <button
                    onClick={handleApplyFilters}
                    disabled={JSON.stringify(localFilters) === JSON.stringify(initialFilters)}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-center text-sm font-semibold w-full mt-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Apply Filters
                </button>
            </div>
        </div>
    );
}
