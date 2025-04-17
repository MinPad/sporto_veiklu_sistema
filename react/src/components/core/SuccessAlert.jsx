import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

export default function SuccessAlert({ message, duration = 3000, onClose }) {
    const [visible, setVisible] = useState(true);
    const [progressWidth, setProgressWidth] = useState('100%');

    useEffect(() => {
        // Set initial width to 100% (reset it)
        setProgressWidth('100%');

        // Let the DOM apply that, then start the animation to 0%
        const animate = setTimeout(() => {
            setProgressWidth('0%');
        }, 10); // tiny delay lets the first width apply before shrinking

        const timer = setTimeout(() => {
            setVisible(false);
            onClose?.();
        }, duration);

        return () => {
            clearTimeout(timer);
            clearTimeout(animate);
        };
    }, [message, duration, onClose]);

    if (!visible) return null;

    return (
        <div className="fixed top-5 right-5 z-50 bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-xl shadow-lg flex flex-col gap-2 w-full max-w-sm">
            <div className="flex items-start justify-between space-x-3">
                <div className="flex items-start space-x-2">
                    <CheckCircleIcon className="h-6 w-6 mt-0.5 text-green-600" />
                    <div className="text-sm flex-1">{message}</div>
                </div>
                <button onClick={() => { setVisible(false); onClose?.(); }}>
                    <XMarkIcon className="h-5 w-5 text-green-600 hover:text-green-800" />
                </button>
            </div>
            <div className="relative h-1 w-full bg-green-200 rounded overflow-hidden">
                <div
                    className="absolute top-0 left-0 h-1 bg-green-500 transition-all duration-[3000ms]"
                    style={{ width: progressWidth }}
                />
            </div>
        </div>
    );
}
