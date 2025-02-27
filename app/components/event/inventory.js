'use client';
import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

export default function Inventory({ users, onClose }) {
    const [inventory, setInventory] = useState({});
    const [totalQuantity, setTotalQuantity] = useState(0); // State for total quantity
    const containerRef = useRef(null);

    // Aggregate OTC supplies from all users
    useEffect(() => {
        const aggregatedInventory = {};
        let total = 0; // Variable to calculate total quantity

        users.forEach(user => {
            user.otcSuppliesDispensed.forEach(item => {
                const { value, quantity } = item;
                if (aggregatedInventory[value]) {
                    aggregatedInventory[value] += quantity;
                } else {
                    aggregatedInventory[value] = quantity;
                }
                total += quantity; // Add to total quantity
            });
        });

        setInventory(aggregatedInventory);
        setTotalQuantity(total); // Set total quantity
    }, [users]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div
                ref={containerRef}
                className="bg-white rounded-lg shadow-lg w-fit max-w-2xl h-[90vh] overflow-y-auto p-6 relative xl:min-w-[600px]"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
                >
                    <X size={20} />
                </button>

                {/* Header */}
                <h2 className="text-2xl font-bold mb-6">Inventory Overview</h2>

                {/* Inventory List */}
                <div className="space-y-4">
                    {Object.entries(inventory).map(([item, quantity]) => (
                        <div key={item} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                            <span className="text-lg font-medium">{item}</span>
                            <span className="text-lg font-semibold text-blue-600">{quantity}</span>
                        </div>
                    ))}
                </div>

                {/* Additional Metrics */}
                <div className="mt-8">
                    <h3 className="text-xl font-bold mb-4">Additional Metrics</h3>
                    <div className="flex w-full gap-2">
                        <div className="p-4 bg-gray-50 rounded-lg w-full">
                            <span className="block text-sm text-gray-500">Total Users</span>
                            <span className="text-xl font-bold">{users.length}</span>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg w-full">
                            <span className="block text-sm text-gray-500">Total Items</span>
                            <span className="text-xl font-bold">{Object.keys(inventory).length}</span>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg w-full">
                            <span className="block text-sm text-gray-500">Total Quantity</span>
                            <span className="text-xl font-bold">{totalQuantity}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}