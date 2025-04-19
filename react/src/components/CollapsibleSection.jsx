import React, { useRef, useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const CollapsibleSection = ({ title, icon, children, defaultOpen = true }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const [height, setHeight] = useState(0);
    const ref = useRef(null);

    // Measure height of content
    useEffect(() => {
        if (ref.current) {
            setHeight(ref.current.scrollHeight);
        }
    }, [children]);

    return (
        <div className="border-b border-gray-300 dark:border-gray-600 pb-4">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between text-left group hover:underline hover:text-indigo-600 transition duration-150"
            >
                <span className="flex items-center gap-2 text-md font-semibold">
                    {icon}
                    {title}
                </span>
                <span className="text-sm text-gray-500 group-hover:text-indigo-500">
                    {isOpen ? 'Click to collapse' : 'Click to expand'}
                </span>
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height, opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                            height: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
                            opacity: { duration: 0.25, ease: 'easeOut' }
                        }}
                        className="overflow-hidden"
                    >
                        <div ref={ref} className="pt-4">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CollapsibleSection;