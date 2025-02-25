'use client';
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Trash } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getEventDetails, updateUser } from '@/lib/api';
import Select from 'react-select';
import { options } from '@/app/utils/options';
import SuccessPopup from '@/app/components/popupCard';
import { useAuth } from '@/context/authContext';

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

        if (!validateForm()) {
            return; // Stop if validation fails
        }

        setLoading(true);
        formData.charmChartFilledOut = true;
        formData.otcSuppliesDispensed = items.map((item) => ({
            value: item.product?.value || null,
            quantity: item.quantity || '',
        }));

        console.log(formData.otcSuppliesDispensed);

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
            {isEditing && (
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
                                        disabled={!isEditing}
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
                                        disabled={!isEditing}
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
                                        disabled={!isEditing}
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
                                        disabled={!isEditing}
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
                                        disabled={!isEditing}
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
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Doctor Filled Details */}
                    <div className="flex-grow shadow-lg bg-white h-fit p-6 rounded-xl">
                        <div className="mb-6">
                            <h3 className="text-md font-medium mb-2">Diagnosis</h3>
                            <div className="space-y-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Primary Diagnosis</label>
                                    <input
                                        type="text"
                                        name="primaryDiagnosis"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                        value={formData.primaryDiagnosis || ''}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        required={true}
                                    />
                                    {errors.primaryDiagnosis && (
                                        <p className="text-red-500 text-sm">{errors.primaryDiagnosis}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Condition Category</label>
                                    <input
                                        type="text"
                                        name="conditionCategory"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                        value={formData.conditionCategory || ''}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        required={true}
                                    />
                                    {errors.conditionCategory && (
                                        <p className="text-red-500 text-sm">{errors.conditionCategory}</p>
                                    )}
                                </div>
                                <div>
                                    {items.map((item, index) => (
                                        <div key={index} className="flex items-center gap-4 mb-4">
                                            <div className="flex-1">
                                                <label className="block text-sm font-medium text-gray-700">Product</label>
                                                <Select
                                                    options={options}
                                                    value={item.product}
                                                    onChange={(selectedOption) => handleProductChange(index, selectedOption)}
                                                    className='mt-1'
                                                    placeholder="Select a product"
                                                    required={true}
                                                />
                                                {errors[`product-${index}`] && (
                                                    <p className="text-red-500 text-sm">{errors[`product-${index}`]}</p>
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
                                                    required={true}
                                                />
                                                {errors[`quantity-${index}`] && (
                                                    <p className="text-red-500 text-sm absolute">{errors[`quantity-${index}`]}</p>
                                                )}
                                            </div>

                                            {items.length > 1 && (
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

                                    <button
                                        type="button"
                                        onClick={addItem}
                                        className="mt-2 p-2 bg-blue-500 text-white rounded-md"
                                    >
                                        Add Another Item
                                    </button>
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
                                disabled={!isEditing}
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
        </div>
    );
};

export default PatientForm;