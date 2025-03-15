'use client';
import { useAuth } from "@/context/authContext";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAllItems, addNewItem, updateItem, deleteItem } from "@/lib/api"; // Import addNewItem
import { X } from "lucide-react";
import SuccessPopup from "@/app/components/popupCard";

export default function Items() {
    const router = useRouter();
    const [items, setItemsList] = useState([]);
    const { user, loading: authLoading, logout } = useAuth();
    const [allItems, setAllItems] = useState([]);
    const [newItemName, setNewItemName] = useState(""); // State for new item input
    const [isAddingItem, setIsAddingItem] = useState(false); // Loading state for adding item
    const isAdmin = user?.role === 'admin';
    const [successMessage, setSuccessMessage] = useState('');
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const showSuccessMessage = (message) => {
        setSuccessMessage(message);
        setIsPopupOpen(true);
    };

    useEffect(() => {
        const getCompleteList = async () => {
            const result = await getAllItems();
            if (result.error) {
                alert('Failed to fetch master list.');
                return;
            }
            const items = result.items;
            const itemsToset = items.filter(item => !item.extra === true);
            setAllItems(items);
            setItemsList(itemsToset);
        };

        getCompleteList();
    }, []);

    // Function to handle adding a new item
    const handleAddItem = async (e) => {
        e.preventDefault(); // Prevent form submission refresh

        if (!newItemName.trim()) {
            alert("Item name cannot be empty!");
            return;
        }

        // Check if the item already exists
        if (items.some(item => item.name.toLowerCase() === newItemName.toLowerCase())) {
            alert("Item already exists!");
            return;
        }

        if (items.some(item => item.name.toLowerCase() === newItemName.toLowerCase())) {
            alert("Item already exists!");
            return;
        }

        if (allItems.some(item => item.name.toLowerCase() === newItemName.toLowerCase())) {
            const item = allItems.find(item => item.name.toLowerCase() === newItemName.toLowerCase());
            try {
                const result = updateItem(item._id);
                if (!result) {
                    alert("Failed to update the item.");
                    return;
                }
                showSuccessMessage("Item added successfully!");
                setItemsList((prevItems) => [...prevItems, item]);
                return;
            } catch (error) {
                console.error("Error updating item:", error);
                alert("An error occurred while updating the item.");
            }
            setNewItemName("");
            return;
        }

        setIsAddingItem(true); // Show loading state

        try {
            // Add the new item to the backend
            const status = "active";
            const result = await addNewItem(newItemName, status);
            if (result.error) {
                alert("Failed to add the item.");
                return;
            }

            // Update the items list with the new item
            showSuccessMessage("Item added successfully!");
            setItemsList((prevItems) => [...prevItems, result.item]);
            setAllItems((prevAllItems) => [...prevAllItems, result.item]);

            // Clear the input field
            setNewItemName("");
        } catch (error) {
            console.error("Error adding item:", error);
            alert("An error occurred while adding the item.");
        } finally {
            setIsAddingItem(false); // Hide loading state
        }
    };

    // Function to handle removing an item
    const handleRemoveItem = (item) => {
        const result = deleteItem(item._id);
        if (!result) {
            alert("Failed to delete the item.");
            return;
        }
        showSuccessMessage("Item removed successfully!");
        setItemsList((prevItems) => prevItems.filter((i) => i._id !== item._id));
        return;
    };

    if (authLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 border-4 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                    <div className="text-2xl font-semibold text-gray-700">
                        Authenticating...
                    </div>
                </div>
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-2xl font-semibold text-gray-700">
                    You are not authorized to view this page.
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 mx-[5%] mb-[5%] mt-10">
            <h1 className="text-2xl flex items-center gap-2">
                Items Management
            </h1>

            {/* Add New Item Form */}
            <form onSubmit={handleAddItem} className="space-y-4">
                <div>
                    <label className="block text-md font-medium text-gray-700">Add New Item</label>
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            value={newItemName}
                            onChange={(e) => setNewItemName(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/80"
                            placeholder="Enter item name"
                            required
                        />
                        <button
                            type="submit"
                            disabled={isAddingItem}
                            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-primary/80 disabled:bg-indigo-300"
                        >
                            {isAddingItem ? "Adding..." : "Add"}
                        </button>
                    </div>
                </div>
            </form>

            {/* Display Added Items */}
            {items.length > 0 && (
                <div>
                    <h3 className="text-lg font-medium text-gray-700">Added Items</h3>
                    <ul className="mt-2 space-y-1">
                        {items.map((item, index) => (
                            <li
                                key={item._id}
                                className={`flex items-center justify-between py-2 ${index !== items.length - 1 ? 'border-b border-gray-200' : ''
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

            <SuccessPopup
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                message={successMessage}
                autoCloseTime={1200} // Will auto close after 3 seconds
            />
        </div>
    );
}