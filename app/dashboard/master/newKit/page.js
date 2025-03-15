'use client'; // Required for using client-side features in Next.js

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { getAllItems } from '@/lib/api';
import { addNewItem, addNewMaster } from '@/lib/api';

export default function AddMasterForm() {
    const router = useRouter();
    const [masterName, setMasterName] = useState('');
    const [defaultItems, setDefaultItems] = useState([]);
    const [kitItems, setKitItems] = useState([]);
    const [extraItems, setExtraItems] = useState([]);
    const [excludedItems, setExcludedItems] = useState([]);
    const [itemName, setItemName] = useState('');
    const [loadingItems, setLoadingItems] = useState(true);
    const [isAddingItem, setIsAddingItem] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);


    console.log(extraItems);
    console.log(excludedItems);
    useEffect(() => {
        const fetchItems = async () => {
            const result = await getAllItems();
            if (result.error) {
                alert('Failed to fetch items.');
                return;
            }
            const items = result.items
            const itemsToset = items.filter(item => !item.extra === true)
            setDefaultItems(itemsToset);
            setKitItems(itemsToset);
            setLoadingItems(false);
        }

        fetchItems();
    }, []);

    // Handle adding a new item
    const handleAddItem = async (e) => {
        e.preventDefault();
        if (!itemName.trim()) return;

        // Check if item already exists
        if (kitItems.some(item => item.name === itemName)) {
            alert('Item already exists!');
            setItemName('')
            return;
        }

        setIsAddingItem(true); // Show loader
        // if item in default items then add the item to kit Items
        if (defaultItems.some(item => item.name === itemName)) {
            const item = defaultItems.find(item => item.name === itemName);
            setKitItems([...kitItems, item]);
        } else {
            const result = await addNewItem(itemName);
            console.log(result);
            setKitItems([...kitItems, result.item]);
            setExtraItems([...extraItems, result.item]);
            setIsAddingItem(false);
            // get the the update item from backend and add it to kit itms and add it extra items
        }

        setItemName('');
    };

    // Handle removing an item
    const handleRemoveItem = (item) => {
        // Check if the item is in defaultItems
        const isDefaultItem = defaultItems.some(defaultItem => defaultItem.id === item.id);

        if (isDefaultItem) {
            // If the item is in defaultItems:
            // 1. Add it to excludedItems
            setExcludedItems(prevExcluded => [...prevExcluded, item]);

            // 2. Remove it from kitItems
            setKitItems(prevKitItems => prevKitItems.filter(kitItem => kitItem._id !== item._id));
        } else {
            // If the item is not in defaultItems:
            // 1. Remove it from kitItems
            setKitItems(prevKitItems => prevKitItems.filter(kitItem => kitItem._id !== item._id));
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const newMaster = {
            name: masterName,
            extraItems,
            excludedItems
        };

        try {
            const result = await addNewMaster(newMaster);
            if (result.error) {
                alert('Failed to add the master.');
                return;
            } else {
                alert("Master added successfully.");
                router.back();
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while adding the master.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // handle loading items
    if (loadingItems) {
        return (<div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="flex items-center space-x-4">
                <div className="w-8 h-8 border-4 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="text-2xl font-semibold text-gray-700">
                    Loading Medical Items...
                </div>
            </div>
        </div>)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-6 mx-[5%] mb-[5%] mt-10"
        >
            {/* Sticky Header */}
            <div className="sticky top-0 bg-white z-10 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl flex items-center gap-2">
                        <button className="hover:bg-gray-200 p-2 rounded-full" onClick={() => router.back()}>
                            <ChevronLeft />
                        </button>
                        Add New Kit
                    </h1>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-primary/80 disabled:bg-indigo-300"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
                {/* Master Name */}
                <div>
                    <label className="block text-lg font-medium text-gray-700">Kit Name</label>
                    <input
                        type="text"
                        value={masterName}
                        onChange={(e) => setMasterName(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/80"
                        required={true}
                    />
                </div>

                {/* Add Items */}
                <div>
                    <label className="block text-md font-medium text-gray-700">Add Items</label>
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/80"
                            placeholder="Enter item name"
                        />
                        <button
                            type="button"
                            onClick={handleAddItem}
                            disabled={isAddingItem}
                            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-primary/80 disabled:bg-indigo-300"
                        >
                            {isAddingItem ? 'Adding...' : 'Add'}
                        </button>
                    </div>
                </div>

                {/* Display Added Items */}
                {kitItems.length > 0 && (
                    <div>
                        <h3 className="text-lg font-medium text-gray-700">Added Items</h3>
                        <ul className="mt-2 space-y-1">
                            {kitItems.map((item, index) => (
                                <li
                                    key={item._id}
                                    className={`flex items-center justify-between py-2 ${index !== kitItems.length - 1 ? 'border-b border-gray-200' : ''
                                        }`}
                                >
                                    <span className="text-base text-gray-600">{item.name}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveItem(item)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <X size={16} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </form>
        </motion.div>
    );
}