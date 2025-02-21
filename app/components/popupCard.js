'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const Popup = ({ message, type, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    // Automatically close the popup after 3 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    // Define styles based on the type
    const getStyles = () => {
        switch (type) {
            case 'warning':
                return {
                    bg: 'bg-yellow-50',
                    border: 'border-yellow-400',
                    text: 'text-yellow-700',
                    icon: '⚠️',
                };
            case 'error':
                return {
                    bg: 'bg-red-50',
                    border: 'border-red-400',
                    text: 'text-red-700',
                    icon: '❌',
                };
            case 'success':
                return {
                    bg: 'bg-green-50',
                    border: 'border-green-400',
                    text: 'text-green-700',
                    icon: '✅',
                };
            default:
                return {
                    bg: 'bg-gray-50',
                    border: 'border-gray-400',
                    text: 'text-gray-700',
                    icon: 'ℹ️',
                };
        }
    };

    const styles = getStyles();

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.3 }}
                    className={`fixed top-4 right-4 p-4 border-l-4 ${styles.bg} ${styles.border} ${styles.text} rounded-lg shadow-lg flex items-center space-x-2 z-50`}
                >
                    <span className="text-xl">{styles.icon}</span>
                    <p>{message}</p>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Popup;