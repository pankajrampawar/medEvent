'use client';
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Trash, Plus, Save } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getEventDetails, updateUser } from '@/lib/api';
import Select from 'react-select';
import { options } from '@/app/utils/options';
import SuccessPopup from '@/app/components/popupCard';
import { useAuth } from '@/context/authContext';
import { categories } from '@/app/utils/categories';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css'; // Import the styles
import { isValidPhoneNumber } from 'react-phone-number-input';

const PatientForm = ({ isEditable = true, params }) => {
    const searchParams = useSearchParams();
    const { id } = React.use(params);
    const userData = JSON.parse(searchParams.get('data'));
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(userData);
    const [isEditing, setIsEditing] = useState(isEditable);
    const [errors, setErrors] = useState({});
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const { user, loading: authLoading } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFocused, setCategoryFocused] = useState(false);
    const [categoryError, setCategoryError] = useState(false);
    const [isNumberValid, setIsNumberValid] = useState(true);
    const inputRef = useRef(null);
    const isAdmin = user?.role === 'admin';

    const medicalKitOptions = userData.medicalKit.map((kit) => ({
        label: kit,
        value: kit,
    }));

    const filteredCategories = categories.filter((category) =>
        category.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 6);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (inputRef.current && !inputRef.current.contains(e.target)) {
                setCategoryFocused(false);
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        if (name === 'conditionCategory') {
            setSearchTerm(value);
        }

        if (name === 'contactNumber') {
            console.log(value)
            if (value && !isValidPhoneNumber(value)) {
                setIsNumberValid(false);
            } else {
                setIsNumberValid(true); // Clear error if the phone number is valid
            }
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
        setFormData((prevData) => ({
            ...prevData,
            [name]: category,
        }));
        setCategoryFocused(false);
    };

    const [items, setItems] = useState(
        userData?.otcSuppliesDispensed && userData.otcSuppliesDispensed.length > 0
            ? userData.otcSuppliesDispensed.map((item) => ({
                medicalKit: item.medicalKit ? { value: item.medicalKit, label: item.medicalKit } : null,
                product: item.value ? { value: item.value, label: item.value } : null,
                quantity: item.quantity || '',
            }))
            : [{ product: null, quantity: '' }]
    );

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

    const handleMedicalKitChange = (index, selectedOption) => {
        const updatedItems = [...items];
        updatedItems[index].medicalKit = selectedOption;
        setItems(updatedItems);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.primaryDiagnosis) {
            newErrors.primaryDiagnosis = 'Primary Diagnosis is required';
        }
        if (!formData.conditionCategory) {
            newErrors.conditionCategory = 'Condition Category is required';
        }

        items.forEach((item, index) => {
            if (!item.medicalKit) {
                newErrors[`medicalKit-${index}`] = 'Medical Kit is required';
            }
            if (!item.product) {
                newErrors[`product-${index}`] = 'Product is required';
            }
            if (!item.quantity) {
                newErrors[`quantity-${index}`] = 'Quantity is required';
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isNumberValid) return;
        if (categoryError) return;
        if (!formData.conditionCategory) {
            setCategoryError('Category is required');
        }
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        formData.isPending = false;
        formData.otcSuppliesDispensed = items.map((item) => ({
            medicalKit: item.medicalKit?.value || null,
            value: item.product?.value || null,
            quantity: item.quantity || '',
        }));

        try {
            const result = await updateUser(id, formData);
            if (result) {
                showSuccessMessage('Patient Data Updated');
                setTimeout(() => {
                    router.back();
                }, 1500);
            }
            setIsEditing(false);
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
                    <div className="text-2xl font-semibold text-gray-700">Authenticating...</div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 border-4 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                    <div className="text-2xl font-semibold text-gray-700">Updating user details...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="m-10 relative">
            <h1 className="text-2xl flex items-center gap-2 mb-6">
                <button className="hover:bg-gray-200 p-2 rounded-full" onClick={() => router.back()}>
                    <ChevronLeft />
                </button>
                Patient Details
            </h1>

            {isEditing && !isAdmin && (
                <div className="flex justify-between items-center mb-6 sticky top-0 bg-background py-4 z-50 border-b border-primary/10 backdrop-blur-sm shadow-sm px-4">
                    <div className="flex items-center gap-3">
                        {formData.hasAgreed ? (
                            <div className="flex items-center gap-2 text-green-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                </svg>
                                <span className="font-medium">User has opted in to receive updates</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-red-500">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="15" y1="9" x2="9" y2="15"></line>
                                    <line x1="9" y1="9" x2="15" y2="15"></line>
                                </svg>
                                <span className="font-medium">User has declined to receive updates</span>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors duration-200 font-medium shadow-sm flex items-center gap-2"
                    >
                        <Save size={16} />
                        Save Changes
                    </button>
                </div>
            )}

            <form onSubmit={handleSubmit} className="mb-[20%]">
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Patient Information */}
                    <div className="bg-white shadow-sm rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-4">Patient Information</h3>
                        <div className="space-y-4">
                            <div> {/* first name */}
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
                            <div> {/* last name */}
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
                            <div> {/* date of birth */}
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
                            <div> {/* Contact Number */}
                                <label className="block text-sm font-medium text-gray-700">Contact No</label>
                                <PhoneInput
                                    international
                                    defaultCountry="US"
                                    value={formData.contactNumber}
                                    onChange={(e) => { handleInputChange({ target: { name: 'contactNumber', value: e } }) }}
                                    disabled={!isEditing || isAdmin}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                />
                                {!isNumberValid && <p className="text-red-500 text-sm mt-1">Invalid phone number</p>}
                            </div>
                            <div> {/* chief complaint */}
                                <label className="block text-sm font-medium text-gray-700">Chief Complaint</label>
                                <input
                                    type="text"
                                    name="chiefComplaint"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={formData.chiefComplaint || ''}
                                    onChange={handleInputChange}
                                    disabled={!isEditing || isAdmin}
                                />
                            </div>
                            <div> {/* allergic */}
                                <label className="block text-sm font-medium text-gray-700">Are You Allergic to a Medication?</label>
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

                    {/* Doctor Filled Details */}
                    <div className="bg-white shadow-sm rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-4">Diagnosis</h3>
                        <div className="space-y-4">
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
                            <div className="relative" ref={inputRef}> {/* condition Category */}
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
                                                    onMouseDown={() => handleSelectCategory("conditionCategory", category)}
                                                >
                                                    {category}
                                                </li>
                                            )
                                        )}
                                    </ul>
                                )}
                            </div>
                            <div> { /* referral */}
                                <label className="block text-sm font-medium text-gray-700">Referral</label>
                                <select
                                    name="reffered"
                                    value={formData.reffered}
                                    onChange={handleInputChange}
                                    disabled={isAdmin}
                                    className="mt-1 block w-full p-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                >
                                    <option value="none">None</option>
                                    <option value="ER">ER</option>
                                    <option value="urgentCare">Urgent Care</option>
                                    <option value="specialist">Specialist</option>
                                    <option value="diagnostic">Diagnostic</option>
                                </select>
                            </div>
                            <div> {/* charm chart filled */}
                                <label className="block text-sm font-medium text-gray-700">Charm Chart Filled</label>
                                <select
                                    name="charmChartFilledOut"
                                    value={formData.charmChartFilledOut}
                                    onChange={handleInputChange}
                                    disabled={!isEditable || isAdmin}
                                    className="mt-1 block w-full p-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                >
                                    <option value="false">No</option>
                                    <option value="true">Yes</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Note (optional)</label>
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
                    </div>
                </section>

                <section className="bg-white shadow-sm rounded-lg p-6 mt-6">
                    <h3 className="text-lg font-semibold mb-4">OTC Supplies Dispensed</h3>
                    <div className="space-y-4">
                        {items.map((item, index) => (
                            <div key={index} className="flex w-full gap-4 items-end pb-2">
                                <div className='w-full relative'>
                                    <label className="block text-sm font-medium text-gray-700">Medical Kit</label>
                                    <Select
                                        options={medicalKitOptions}
                                        value={item.medicalKit}
                                        onChange={(selectedOption) => handleMedicalKitChange(index, selectedOption)}
                                        className="mt-1"
                                        placeholder="Select Medical Kit"
                                        isDisabled={isAdmin}
                                        required={true}
                                    />
                                    {errors[`medicalKit-${index}`] && (
                                        <p className="text-red-500 text-sm absolute mt-1">{errors[`medicalKit-${index}`]}</p>
                                    )}
                                </div>
                                <div className='w-full relative'>
                                    <label className="block text-sm font-medium text-gray-700">Item</label>
                                    <Select
                                        options={options}
                                        value={item.product}
                                        onChange={(selectedOption) => handleProductChange(index, selectedOption)}
                                        className="mt-1"
                                        placeholder="Select a product"
                                        isDisabled={isAdmin}
                                        required={true}
                                    />
                                    {errors[`product-${index}`] && (
                                        <p className="text-red-500 text-sm absolute mt-1">{errors[`product-${index}`]}</p>
                                    )}
                                </div>
                                <div className='w-full relative'>
                                    <label className="block text-sm font-medium text-gray-700">Quantity</label>
                                    <input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => handleQuantityChange(index, e)}
                                        onInput={(e) => {
                                            if (e.target.value < 0) {
                                                e.target.value = 0;
                                            }
                                        }}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                        placeholder="Enter quantity"
                                        disabled={isAdmin}
                                        required={true}
                                    />
                                    {errors[`quantity-${index}`] && (
                                        <p className="text-red-500 text-sm absolute mt-1">{errors[`quantity-${index}`]}</p>
                                    )}
                                </div>
                                {items.length > 1 && !isAdmin && (
                                    <button
                                        type="button"
                                        onClick={() => removeItem(index)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                                    >
                                        <Trash size={20} />
                                    </button>
                                )}
                            </div>
                        ))}
                        {!isAdmin && (
                            <button
                                type="button"
                                onClick={addItem}
                                className="mt-10 p-2 text-primary hover:bg-gray-100 rounded-md flex items-center gap-2"
                            >
                                <Plus size={16} />
                                Add Another Item
                            </button>
                        )}
                    </div>
                </section>
            </form>

            <SuccessPopup
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                message={successMessage}
                autoCloseTime={1200}
            />
        </div>
    );
};

export default PatientForm;