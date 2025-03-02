'use client';
import React, { useEffect, useRef, useState } from 'react';
import { CheckSquare, ClipboardCheck, Grid, List, Package, Tag, User, X } from 'lucide-react';
import KpiCard from '../kpiCard';

export default function Inventory({ users, onClose, loading }) {
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

    // Sort inventory items by quantity in descending order
    const sortedInventory = Object.entries(inventory).sort((a, b) => b[1] - a[1]);

    return (
        <div className="flex items-center justify-center z-50 mr-[5%] ml-[2%]">
            <div className="rounded-lg mb-32 pb-20 overflow-y-auto p-6 relative w-full">
                {/* Additional Metrics */}
                <div className="mt-8">
                    <h3 className="text-2xl font-bold mb-6">Metrics</h3>
                    <div className="flex w-full gap-4">
                        <KpiCard title="Total Users" number={users.length} Icon={User} />
                        <KpiCard title="Total Items" number={Object.keys(inventory).length} Icon={Package} />
                        <KpiCard title="Total Items" number={Object.keys(inventory).length} Icon={ClipboardCheck} />
                    </div>
                </div>

                <div className='bg-white shadow-lg p-4 rounded-xl mt-6 pt-10 pb-16'>
                    {/* Header */}
                    <h2 className="text-2xl font-bold mb-6">Inventory Overview</h2>

                    {/* Loading Skeleton */}
                    {loading ? (
                        <div className="space-y-4">
                            {[...Array(5)].map((_, index) => (
                                <div key={index} className="animate-pulse flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <>
                            {/* Inventory Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-300">
                                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Item</th>
                                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Quantity</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sortedInventory.map(([item, quantity], index) => (
                                            <tr key={index} className="hover:bg-gray-50 border-b border-gray-200">
                                                <td className="px-6 py-4 text-lg font-medium text-gray-900">{item}</td>
                                                <td className="px-8 py-4 text-lg text-black font-medium">{quantity}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}