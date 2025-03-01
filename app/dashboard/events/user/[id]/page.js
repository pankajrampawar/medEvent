'use client';
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Trash } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getEventDetails, updateUser } from '@/lib/api';
import Select from 'react-select';
import { options } from '@/app/utils/options';
import SuccessPopup from '@/app/components/popupCard';
import { useAuth } from '@/context/authContext';
import { categories } from '@/app/utils/categories';

const PatientForm = ({ isEditable = true, params }) => {
    const searchParams = useSearchParams();
    const { id } = React.use(params);
    const userData = JSON.parse(searchParams.get('data'));
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(userData); // State to manage form data
    const [isEditing, setIsEditing] = useState(isEditable); // State to toggle edit mode
    const [errors, setErrors] = useState({}); // State to manage validation errors
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const { user, loading: authLoading } = useAuth();
    const [searchTerm, setSearchTerm] = useState(''); // search term for condition category
    const [categoryFocused, setCategoryFocused] = useState(false);
    const [categoryError, setCategoryError] = useState(false);
    const inputRef = useRef(null)

    const isAdmin = user?.role === 'admin';

    const filteredCategories = categories.filter((category) =>
        category.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 6);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (inputRef.current && !inputRef.current.contains(e.target)) {
                setCategoryFocused(false)
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const showSuccessMessage = (message) => {
        setSuccessMessage(message);
        setIsPopupOpen(true);
    };

    console.log(userData);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        // Update searchTerm when conditionCategory changes
        if (name === 'conditionCategory') {
            setSearchTerm(value);
        }
    };

    const handleFocus = () => {
        setCategoryFocused(true);
    };

    const handleBlur = () => {
        setCategoryFocused(false);
    };

    const validateInput = () => {
        if (formData.conditionCategory && !categories.includes(formData.conditionCategory)) {
            setCategoryError('Invalid category');
        } else {
            setCategoryError('');
        }
    };

    const handleSelectCategory = (name, category) => {
        console.log("Category selected:", category); // Debugging
        setFormData((prevData) => ({
            ...prevData,
            [name]: category,
        }));
        setCategoryFocused(false); // Close dropdown after selection
        console.log("FormData after update:", formData); // Debugging
    };


    const [items, setItems] = useState(
        userData?.otcSuppliesDispensed && userData.otcSuppliesDispensed.length > 0
            ? userData.otcSuppliesDispensed.map((item) => ({
                product: item.value ? { value: item.value, label: item.value } : null, // Create the product object
                quantity: item.quantity || '', // Use existing quantity
            }))
            : [{ product: null, quantity: '' }] // Default value if no data
    );

    console.log(items);

    const addItem = () => {
        setItems([...items, { product: null, quantity: '' }]);
    };

    const removeItem = (index) => {
        const updatedItems = items.filter((_, i) => i !== index);
        setItems(updatedItems);
    };

    const handleQuantityChange = (index, e) => {
        const updatedItems = [...items];
        updatedItems[index].quantity = e.target.value;
        setItems(updatedItems);
    };

    const handleProductChange = (index, selectedOption) => {
        const updatedItems = [...items];
        updatedItems[index].product = selectedOption;
        setItems(updatedItems);
    };

    console.log(userData);

    // Validation function
    const validateForm = () => {
        const newErrors = {};

        // Check required fields
        if (!formData.primaryDiagnosis) {
            newErrors.primaryDiagnosis = 'Primary Diagnosis is required';
        }
        if (!formData.conditionCategory) {
            newErrors.conditionCategory = 'Condition Category is required';
        }

        // Check OTC supplies
        items.forEach((item, index) => {
            if (!item.product) {
                newErrors[`product-${index}`] = 'Product is required';
            }
            if (!item.quantity) {
                newErrors[`quantity-${index}`] = 'Quantity is required';
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

    // Call the updateUser function in handleSubmit
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission

        if (categoryError) return;
        if (!formData.conditionCategory) {
            setCategoryError('Category is required')
        }
        if (!validateForm()) {
            return; // Stop if validation fails
        }

        setLoading(true);
        formData.isPending = false;
        formData.otcSuppliesDispensed = items.map((item) => ({
            value: item.product?.value || null,
            quantity: item.quantity || '',
        }));

        try {
            const result = await updateUser(id, formData);
            if (result) {
                showSuccessMessage('Patient Data Updated');

                // Add a delay before navigation to allow time for the success message to be seen
                setTimeout(() => {
                    router.back();
                }, 1500); // 1.5 second delay
            }
            setIsEditing(false); // Exit edit mode after saving
        } catch (error) {
            alert('Failed to update changes. Please try again.');
        } finally {
            setLoading(false);
        }
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
        )
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 border-4 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                    <div className="text-2xl font-semibold text-gray-700">
                        Updating user details...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="m-10">
            <h1 className="text-2xl flex items-center gap-2 mb-6">
                <button className="hover:bg-gray-200 p-2 rounded-full" onClick={() => router.back()}>
                    <ChevronLeft />
                </button>
                Patient Details
            </h1>

            {/* Update Changes Button */}
            {isEditing && !isAdmin && (
                <div className="flex justify-end mb-6">
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        Update Changes
                    </button>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <section className="flex gap-10">
                    {/* Patient Information */}
                    <div className="flex-grow shadow-lg bg-white h-fit p-6 rounded-xl">
                        <div className="mb-6">
                            <h3 className="text-md font-medium mb-2">Patient Information</h3>
                            <div className="space-y-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                        value={formData.firstName || ''}
                                        onChange={handleInputChange}
                                        disabled={!isEditing || isAdmin}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                        value={formData.lastName || ''}
                                        onChange={handleInputChange}
                                        disabled={!isEditing || isAdmin}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Date Of Birth</label>
                                    <input
                                        type="date"
                                        name="dateOfBirth"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                        value={formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split('T')[0] : ''}
                                        onChange={handleInputChange}
                                        disabled={!isEditing || isAdmin}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Contact No</label>
                                    <input
                                        type="text"
                                        name="contactNumber"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                        value={formData.contactNumber || ''}
                                        onChange={handleInputChange}
                                        disabled={!isEditing || isAdmin}
                                    />
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-md font-medium mb-2">Chief Complaint</h3>
                                    <input
                                        type="text"
                                        name="chiefComplaint"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                        value={formData.chiefComplaint || ''}
                                        onChange={handleInputChange}
                                        disabled={!isEditing || isAdmin}
                                    />
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-md font-medium mb-2">Are You Allergic to a Medication?</h3>
                                    <input
                                        type="text"
                                        name="allergic"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                        value={formData.allergic || ''}
                                        onChange={handleInputChange}
                                        disabled={!isEditing || isAdmin}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Doctor Filled Details */}
                    <div className="flex-grow shadow-lg bg-white h-fit p-6 rounded-xl">
                        <div className="mb-6 ">
                            <h3 className="text-md font-medium mb-2">Diagnosis</h3>
                            <div className="space-y-2 flex flex-col gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Primary Diagnosis</label>
                                    <input
                                        type="text"
                                        name="primaryDiagnosis"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                        value={formData.primaryDiagnosis || ''}
                                        onChange={handleInputChange}
                                        disabled={!isEditing || isAdmin}
                                        required={true}
                                    />
                                    {errors.primaryDiagnosis && (
                                        <p className="text-red-500 text-sm">{errors.primaryDiagnosis}</p>
                                    )}
                                </div>
                                <div className="relative" ref={inputRef}>
                                    <label className="block text-sm font-medium text-gray-700">Condition Category</label>
                                    <input
                                        type="text"
                                        name="conditionCategory"
                                        value={formData.conditionCategory}
                                        onChange={handleInputChange}
                                        onFocus={handleFocus}
                                        disabled={!isEditable || isAdmin}
                                        onBlur={() => {
                                            handleBlur();
                                            validateInput();
                                        }}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                    />
                                    {categoryError && <p className="text-red-500 text-sm mt-1">{categoryError}</p>}
                                    {categoryFocused && (
                                        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-48 overflow-y-auto">
                                            {(searchTerm ? filteredCategories : categories.slice(0, 19)).map(
                                                (category, index) => (
                                                    <li
                                                        key={index}
                                                        className="p-2 hover:bg-gray-100 cursor-pointer"
                                                        onMouseDown={() => handleSelectCategory("conditionCategory", category)} // Use onMouseDown
                                                    >
                                                        {category}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 pt-2">referral</label>
                                    <select
                                        name="reffered"
                                        value={formData.reffered}
                                        onChange={handleInputChange}
                                        disabled={!isEditable}
                                        className="mt-1 block w-full p-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    >
                                        <option value="none">none</option>
                                        <option value="ER">ER</option>
                                        <option value="urgentCare">Urgent Care</option>
                                        <option value="specialist">Specialist</option>
                                        <option value="diagnostic">Diagnostic</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 pt-2">Charm Chart Filled</label>
                                    <select
                                        name="charmChartFilledOut"
                                        value={formData.charmChartFilledOut}
                                        onChange={handleInputChange}
                                        disabled={!isEditable || isAdmin}
                                        className="mt-1 block w-full p-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    >
                                        <option value="false">No</option>
                                        <option value="true">Yes</option>
                                    </select>
                                </div>
                                <div>
                                    <label className=''>OTC supplies dispensed</label>
                                    <div className='min-h-2'></div>
                                    {items.map((item, index) => (
                                        <div key={index} className="flex items-center gap-4 mb-4">
                                            <div className="flex-1 relative">
                                                <label className="block text-sm font-medium text-gray-700">Item</label>
                                                <Select
                                                    options={options}
                                                    value={item.product}
                                                    onChange={(selectedOption) => handleProductChange(index, selectedOption)}
                                                    className='mt-1'
                                                    placeholder="Select a product"
                                                    isDisabled={isAdmin}
                                                    required={true}
                                                />
                                                {errors[`product-${index}`] && (
                                                    <p className="text-red-500 text-sm absolute">{errors[`product-${index}`]}</p>
                                                )}
                                            </div>

                                            <div className="flex-1 relative">
                                                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                                                <input
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => handleQuantityChange(index, e)}
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                                    placeholder="Enter quantity"
                                                    disabled={isAdmin}
                                                    required={true}
                                                />
                                                {errors[`quantity-${index}`] && (
                                                    <p className="text-red-500 text-sm absolute">{errors[`quantity-${index}`]}</p>
                                                )}
                                            </div>

                                            {items.length > 1 && !isAdmin && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(index)}
                                                    className="mt-6 p-2 text-white rounded-md hover:bg-red-50"
                                                >
                                                    <Trash className='text-red-500' />
                                                </button>
                                            )}
                                        </div>
                                    ))}

                                    {!isAdmin &&
                                        <button
                                            type="button"
                                            onClick={addItem}
                                            className="mt-2 p-2 bg-blue-500 text-white rounded-md"
                                        >
                                            Add Another Item
                                        </button>
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-md font-medium mb-2">Note (optional)</h3>
                            <textarea
                                name="note"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                rows="4"
                                value={formData.note || ''}
                                onChange={handleInputChange}
                                disabled={!isEditing || isAdmin}
                            ></textarea>
                        </div>
                    </div>
                </section>
            </form>

            <SuccessPopup
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                message={successMessage}
                autoCloseTime={1200} // Will auto close after 3 seconds
            />
        </div >
    );
};

export default PatientForm;