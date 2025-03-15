'use client';
import React, { useEffect, useRef, useState } from 'react';
import { CheckSquare, ClipboardCheck, Grid, List, Package, Tag, User, X } from 'lucide-react';
import KpiCard from '../kpiCard';

export default function Inventory({ users, onClose, loading }) {
    const [inventory, setInventory] = useState({});
    const [totalQuantity, setTotalQuantity] = useState(0); // State for total quantity
    const [selectedMedicalKit, setSelectedMedicalKit] = useState('all'); // State for selected medical kit
    const containerRef = useRef(null);

    // Aggregate OTC supplies from all users
    useEffect(() => {
        const aggregatedInventory = {};
        let total = 0; // Variable to calculate total quantity

        users.forEach(user => {
            user.otcSuppliesDispensed.forEach(item => {
                const { value, quantity, medicalKit } = item;
                const key = `${medicalKit}-${value}`; // Unique key combining medicalKit and value
                if (aggregatedInventory[key]) {
                    aggregatedInventory[key].quantity += quantity;
                } else {
                    aggregatedInventory[key] = {
                        medicalKit,
                        value,
                        quantity
                    };
                }
                total += quantity; // Add to total quantity
            });
        });

        setInventory(aggregatedInventory);
        setTotalQuantity(total); // Set total quantity
    }, [users]);

    // Sort inventory items by quantity in descending order
    const sortedInventory = Object.values(inventory).sort((a, b) => b.quantity - a.quantity);

    // Filter inventory based on selected medical kit
    const filteredInventory = selectedMedicalKit === 'all'
        ? sortedInventory
        : sortedInventory.filter(item => item.medicalKit === selectedMedicalKit);

    // Get unique medical kits for the dropdown
    const medicalKits = [...new Set(sortedInventory.map(item => item.medicalKit))];

    // Calculate KPIs based on filtered inventory
    const totalItems = filteredInventory.length;
    const totalFilteredQuantity = filteredInventory.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="flex items-center justify-center z-50 mr-[5%] ml-[2%]">
            <div className="rounded-lg mb-32 pb-20 overflow-y-auto relative w-full">
                {/* Additional Metrics */}
                <div className="mt-8">
                    <h3 className="text-2xl font-bold mb-6">Metrics</h3>
                    <div className="flex w-full gap-4">
                        <KpiCard title="Total Users" number={users.length} Icon={User} />
                        <KpiCard title="Total Items" number={totalItems} Icon={Package} />
                        <KpiCard title="Item Quantity" number={totalFilteredQuantity} Icon={ClipboardCheck} />
                    </div>
                </div>

                <div className='bg-white shadow-lg p-4 rounded-xl mt-6 pt-10 pb-16'>
                    {/* Header */}
                    <h2 className="text-2xl font-bold mb-6">Inventory Overview</h2>

                    {/* Medical Kit Filter */}
                    <div className="mb-6">
                        <label htmlFor="medicalKit" className="block text-sm font-medium text-gray-700 mb-1">Select Medical Kit</label>
                        <div className="relative">
                            <select
                                id="medicalKit"
                                name="medicalKit"
                                value={selectedMedicalKit}
                                onChange={(e) => setSelectedMedicalKit(e.target.value)}
                                className="appearance-none block w-full pl-4 pr-10 py-2.5 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all cursor-pointer"
                            >
                                <option value="all">All</option>
                                {medicalKits.map((kit, index) => (
                                    <option key={index} value={kit}>{kit}</option>
                                ))}
                            </select>
                            {/* Dropdown arrow */}
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>

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
                                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Medical Kit</th>
                                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Item</th>
                                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Quantity</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredInventory.map((item, index) => (
                                            <tr key={index} className="hover:bg-gray-50 border-b border-gray-200">
                                                <td className="px-6 py-4 text-lg font-medium text-gray-900">{item.medicalKit}</td>
                                                <td className="px-6 py-4 text-lg font-medium text-gray-900">{item.value}</td>
                                                <td className="px-8 py-4 text-lg text-black font-medium">{item.quantity}</td>
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