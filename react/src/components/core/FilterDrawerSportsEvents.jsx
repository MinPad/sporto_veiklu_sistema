import { useEffect, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function FilterDrawerSportsEvents({
    isOpen,
    onClose,
    onApply,
    initialFilters,
    availableSpecialties,
    availableGoals,
    onClear,
}) {
    const [localFilters, setLocalFilters] = useState(initialFilters);

    useEffect(() => {
        if (isOpen) {
            setLocalFilters(initialFilters);
        }
    }, [isOpen, initialFilters]);

    const toggleSpecialty = (specialtyName) => {
        setLocalFilters((prev) => ({
            ...prev,
            specialties: prev.specialties.includes(specialtyName)
                ? prev.specialties.filter(s => s !== specialtyName)
                : [...prev.specialties, specialtyName]
        }));
    };

    const toggleGoal = (goal) => {
        setLocalFilters((prev) => ({
            ...prev,
            goals: prev.goals.includes(goal)
                ? prev.goals.filter(g => g !== goal)
                : [...prev.goals, goal]
        }));
    };

    const handleDifficultyChange = (e) => {
        setLocalFilters(prev => ({
            ...prev,
            difficulty: e.target.value
        }));
    };

    const handleApplyFilters = () => {
        // console.log("Filters being applied:", localFilters);
        onApply(localFilters);
        onClose();
    };
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-end">
            <div className="bg-white w-full sm:max-w-md h-full shadow-lg flex flex-col p-6 overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold">Filters</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Clear Filters */}
                <button
                    onClick={onClear}
                    className="text-sm text-blue-600 hover:underline ml-auto mb-6"
                >
                    Clear All
                </button>

                {/* Specialties */}
                <div className="mb-6">
                    <h3 className="font-semibold text-sm mb-2">Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                        {availableSpecialties.map((spec) => (
                            <button
                                key={spec.id}
                                onClick={() => toggleSpecialty(spec.name)}
                                className={`px-3 py-1 rounded-full text-sm border ${localFilters.specialties.includes(spec.name)
                                    ? "bg-indigo-500 text-white border-indigo-500"
                                    : "bg-gray-100 text-gray-700 border-gray-300"
                                    }`}
                            >
                                {spec.name}
                            </button>
                        ))}

                    </div>
                </div>

                {/* Difficulty */}
                <div className="mb-6">
                    <h3 className="font-semibold text-sm mb-2">Difficulty</h3>
                    <select
                        value={localFilters.difficulty}
                        onChange={handleDifficultyChange}
                        className="w-full border rounded px-3 py-2 text-sm"
                    >
                        <option value="">All</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                    </select>
                </div>

                {/* Goals */}
                <div className="mb-6">
                    <h3 className="font-semibold text-sm mb-2">Goals</h3>
                    <div className="flex flex-wrap gap-2">
                        {[...availableGoals].sort((a, b) => a.localeCompare(b)).map((goal) => (
                            <button
                                key={goal}
                                onClick={() => toggleGoal(goal)}
                                className={`px-3 py-1 rounded-full text-sm border ${localFilters.goals.includes(goal)
                                    ? "bg-indigo-500 text-white border-indigo-500"
                                    : "bg-gray-100 text-gray-700 border-gray-300"
                                    }`}
                            >
                                {goal}
                            </button>
                        ))}

                    </div>
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
