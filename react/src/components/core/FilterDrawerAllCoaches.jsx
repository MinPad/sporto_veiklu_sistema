import { useEffect, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function FilterDrawerAllCoaches({
    isOpen,
    onClose,
    onApply,
    initialFilters,
    availableCities,
    availableGyms,
    availableSpecialties,
    onClear,
}) {
    const [localFilters, setLocalFilters] = useState(initialFilters);

    useEffect(() => {
        if (isOpen) {
            setLocalFilters(initialFilters);
        }
    }, [isOpen, initialFilters]);

    const handleChange = (field, value) => {
        setLocalFilters(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const toggleSpecialty = (specId) => {
        setLocalFilters(prev => ({
            ...prev,
            specialties: prev.specialties.includes(specId)
                ? prev.specialties.filter(id => id !== specId)
                : [...prev.specialties, specId],
        }));
    };

    const handleApplyFilters = () => {
        // console.log(" Filters being applied:", localFilters);
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

                {/* City Filter */}
                <div className="mb-6">
                    <h3 className="font-semibold text-sm mb-2">City</h3>
                    <select
                        value={localFilters.city}
                        onChange={(e) => handleChange('city', e.target.value)}
                        className="w-full border rounded px-3 py-2 text-sm"
                    >
                        <option value="">All Cities</option>
                        {availableCities.map(city => (
                            <option key={city.id} value={city.id}>{city.name}</option>
                        ))}
                    </select>
                </div>

                {/* Gym Filter */}
                <div className="mb-6">
                    <h3 className="font-semibold text-sm mb-2">Gym</h3>
                    <select
                        value={localFilters.gym}
                        onChange={(e) => handleChange('gym', e.target.value)}
                        className="w-full border rounded px-3 py-2 text-sm"
                    >
                        <option value="">All Gyms</option>
                        {availableGyms.map(gym => (
                            <option key={gym.id} value={gym.id}>{gym.name}</option>
                        ))}
                    </select>
                </div>

                {/* Specialties Filter */}
                <div className="mb-6">
                    <h3 className="font-semibold text-sm mb-2">Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                        {availableSpecialties.map(spec => (
                            <button
                                key={spec.id}
                                onClick={() => toggleSpecialty(spec.id)}
                                className={`px-3 py-1 rounded-full text-sm border ${localFilters.specialties.includes(spec.id)
                                    ? "bg-indigo-500 text-white border-indigo-500"
                                    : "bg-gray-100 text-gray-700 border-gray-300"
                                    }`}
                            >
                                {spec.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Apply Button */}
                {/* <button
                    onClick={handleApplyFilters}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-center text-sm font-semibold w-full mt-auto"
                >
                    Apply Filters
                </button> */}
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
