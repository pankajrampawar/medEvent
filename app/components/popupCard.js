// components/SuccessPopup.jsx
'use client'

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SuccessPopup = ({ isOpen, onClose, message, autoCloseTime = 1000 }) => {
    // Auto close after specified time
    useEffect(() => {
        let timer;
        if (isOpen && autoCloseTime) {
            timer = setTimeout(() => {
                onClose();
            }, autoCloseTime);
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [isOpen, onClose, autoCloseTime]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-25"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    <motion.div
                        className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-md relative z-10"
                        initial={{ opacity: 0, y: -50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="bg-green-50 p-4 flex items-center">
                            <svg
                                className="w-8 h-8 text-green-500 mr-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                ></path>
                            </svg>
                            <h3 className="text-lg font-medium text-green-800">Success!</h3>
                        </div>

                        <div className="p-6">
                            <p className="text-gray-700">{message}</p>
                        </div>

                        <div className="px-6 py-3 bg-gray-50 flex justify-end">
                            <button
                                type="button"
                                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                onClick={onClose}
                            >
                                Got it
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default SuccessPopup;