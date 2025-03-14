'use client'
import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Trash } from 'lucide-react';
import { options } from '@/app/utils/options';
import { categories } from '@/app/utils/categories';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { addDirectUser } from '@/lib/api';
import { useAuth } from "@/context/authContext";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css'; // Import the styles
import { isValidPhoneNumber } from 'react-phone-number-input';

function AddNewPatient({ params }) {

    const router = useRouter();
    const searchParams = useSearchParams();
    const { id } = React.use(params);
    const medicalKit = JSON.parse(searchParams.get('data'));
    console.log(medicalKit)
    const initialData = {
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        contactNumber: '',
        chiefComplaint: '',
        allergic: '',
        primaryDiagnosis: '',
        conditionCategory: '',
        reffered: 'none',
        charmChartFilledOut: 'false',
        note: '',
        hasAgreed: false,
        medicalKit: [],
        otcSuppliesDispensed: [],
        isPending: true
    };

    const [formData, setFormData] = useState(initialData);
    const [errors, setErrors] = useState({});
    const [initialLoading, setInitialLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFocused, setCategoryFocused] = useState(false);
    const [categoryError, setCategoryError] = useState('');
    const [isNumberValid, setIsNumberValid] = useState(true);
    const inputRef = useRef(null);
    const { user, loading: authLoading, logout } = useAuth();
    const isEditing = true;
    const isAdmin = user?.role === 'admin';;

    const medicalKitOptions = medicalKit.map((kit) => ({
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

    // Handle input changes
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
                setIsNumberValid(true);
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
        setCategoryFocused(false); // Close dropdown after selection
    };

    const [items, setItems] = useState([
        { medicalKit: null, product: null, quantity: '' }
    ]);

    const addItem = () => {
        setItems([...items, { medicalKit: null, product: null, quantity: '' }]);
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

    // Validation function
    const validateForm = () => {
        const newErrors = {};
        // patient details check
        if (!formData.firstName) {
            newErrors.firstName = "First Name is required"
        }
        if (!formData.lastName) {
            newErrors.lastName = "Last Name is required"
        }
        if (!formData.contactNumber) {
            newErrors.contactNumber = "Contact Number is required"
        }
        if (!formData.chiefComplaint) {
            newErrors.chiefComplaint = "Chief Compalint is required"
        }
        // Check required fields
        if (!formData.primaryDiagnosis) {
            newErrors.primaryDiagnosis = 'Primary Diagnosis is required';
        }
        if (!formData.conditionCategory) {
            newErrors.conditionCategory = 'Condition Category is required';
        }

        // Check OTC supplies
        items.forEach((item, index) => {
            if (!item.medicalKit) {
                newErrors[`medicalKit-${index}`] = 'Medical kit is required'
            }
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

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission

        // if (categoryError) return;
        // if (!formData.conditionCategory) {
        //     setCategoryError('Category is required');
        //     return;
        // }

        if (!isNumberValid) return;
        if (!validateForm()) {
            return; // Stop if validation fails
        }

        setLoading(true);

        // Prepare form data for submission
        const submissionData = {
            ...formData,
            eventId: id,
            isPending: false,
            otcSuppliesDispensed: items.map((item) => ({
                medicalKit: item.medicalKit?.value || null,
                value: item.product?.value || null,
                quantity: item.quantity || '',
            }))
        };

        try {
            // Simulate API call
            const result = await addDirectUser(submissionData);
            if (result) {
                showSuccessMessage('Patient Data Updated');
                console.log('Form submitted:', submissionData);
            } else {
                alert("Please try agian later");
            }
            // Simulate navigation after delay
            setTimeout(() => {
                router.back();
            }, 1500);

        } catch (error) {
            alert('Failed to update changes. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Success Popup Component
    const SuccessPopup = ({ isOpen, onClose, message, autoCloseTime }) => {
        useEffect(() => {
            if (isOpen && autoCloseTime) {
                const timer = setTimeout(() => {
                    onClose();
                }, autoCloseTime);
                return () => clearTimeout(timer);
            }
        }, [isOpen, onClose, autoCloseTime]);

        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                <div className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full">
                    <div className="flex items-center justify-center mb-4">
                        <div className="bg-green-100 p-2 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>
                    <h3 className="text-xl font-semibold text-center text-gray-800">{message}</h3>
                </div>
            </div>
        );
    };

    // Custom Select Component
    const Select = ({ options, value, onChange, className, placeholder, isDisabled, required }) => {
        const [isOpen, setIsOpen] = useState(false);
        const selectRef = useRef(null);

        useEffect(() => {
            const handleClickOutside = (e) => {
                if (selectRef.current && !selectRef.current.contains(e.target)) {
                    setIsOpen(false);
                }
            };

            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }, []);

        return (
            <div className={`relative ${className}`} ref={selectRef}>
                <div
                    className={`p-2 border border-gray-300 rounded-md flex justify-between items-center cursor-pointer ${isDisabled ? 'bg-gray-100 cursor-not-allowed' : 'hover:border-blue-500'}`}
                    onClick={() => !isDisabled && setIsOpen(!isOpen)}
                >
                    <span className={value ? 'text-gray-900' : 'text-gray-500'}>
                        {value ? value.label : placeholder}
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </div>

                {isOpen && (
                    <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-48 overflow-y-auto shadow-lg">
                        {options.map((option, index) => (
                            <li
                                key={index}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                    onChange(option);
                                    setIsOpen(false);
                                }}
                            >
                                {option.label}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    };

    if (initialLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 border-4 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                    <div className="text-2xl font-semibold text-gray-700">
                        Verifying Event...
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
                        Updating patient details...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="m-10 relative bg-gray-50 min-h-screen">
            {/* Update Changes Button */}
            {isEditing && !isAdmin && (
                <div className="flex justify-between items-center mb-6 sticky top-0 bg-white py-4 z-50 border-b border-primary/10 backdrop-blur-sm shadow-sm px-4 rounded-lg">
                    <h1 className="text-2xl flex items-center gap-2">
                        <button className="hover:bg-gray-200 p-2 rounded-full" onClick={() => router.back()}>
                            <ChevronLeft />
                        </button>
                        Add New Patient
                    </h1>

                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium shadow-sm flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                            <polyline points="17 21 17 13 7 13 7 21"></polyline>
                            <polyline points="7 3 7 8 15 8"></polyline>
                        </svg>
                        Save Changes
                    </button>
                </div>
            )
            }

            <form onSubmit={handleSubmit} className="mb-[20%]">
                <fieldset disabled={isAdmin}>
                    <section className="flex flex-col md:flex-row gap-6">
                        {/* Patient Information */}
                        <div className="flex-grow shadow-md bg-white p-6 rounded-xl">
                            <div className="mb-6">
                                <h3 className="text-lg font-medium mb-4 text-blue-800 border-b pb-2">Patient Information</h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name <span className='text-red-600 text-lg'>*</span></label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                                value={formData.firstName || ''}
                                                onChange={handleInputChange}
                                                disabled={!isEditing || isAdmin}
                                            />
                                            {errors.firstName && (
                                                <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name <span className='text-red-600 text-lg'>*</span></label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                                value={formData.lastName || ''}
                                                onChange={handleInputChange}
                                                disabled={!isEditing || isAdmin}
                                            />
                                            {errors.lastName && (
                                                <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Date Of Birth</label>
                                        <input
                                            type="date"
                                            name="dateOfBirth"
                                            className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={formData.dateOfBirth || ''}
                                            onChange={handleInputChange}
                                            disabled={!isEditing || isAdmin}
                                            max={new Date().toISOString().split('T')[0]}
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

                                    <div>
                                        <h3 className="text-md font-medium mb-1">Chief Complaint <span className='text-red-600 text-lg'>*</span></h3>
                                        <input
                                            type="text"
                                            name="chiefComplaint"
                                            className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={formData.chiefComplaint || ''}
                                            onChange={handleInputChange}
                                            disabled={!isEditing || isAdmin}
                                        />
                                        {errors.chiefComplaint && (
                                            <p className="text-red-500 text-sm mt-1">{errors.chiefComplaint}</p>
                                        )}
                                    </div>

                                    <div>
                                        <h3 className="text-md font-medium mb-1">Are You Allergic to a Medication?</h3>
                                        <input
                                            type="text"
                                            name="allergic"
                                            className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={formData.allergic || ''}
                                            onChange={handleInputChange}
                                            disabled={!isEditing || isAdmin}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Doctor Filled Details */}
                        <div className="flex-grow shadow-md bg-white p-6 rounded-xl xl:min-w-[400px]">
                            <div className="mb-6">
                                <h3 className="text-lg font-medium mb-4 text-blue-800 border-b pb-2">Diagnosis</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Primary Diagnosis <span className='text-red-600 text-lg'>*</span></label>
                                        <input
                                            type="text"
                                            name="primaryDiagnosis"
                                            className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={formData.primaryDiagnosis || ''}
                                            onChange={handleInputChange}
                                            disabled={!isEditing || isAdmin}
                                            required={true}
                                        />
                                        {errors.primaryDiagnosis && (
                                            <p className="text-red-500 text-sm mt-1">{errors.primaryDiagnosis}</p>
                                        )}
                                    </div>
                                    <div className="relative" ref={inputRef}>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Condition Category <span className='text-red-600 text-lg'>*</span></label>
                                        <input
                                            type="text"
                                            name="conditionCategory"
                                            value={formData.conditionCategory}
                                            onChange={handleInputChange}
                                            onFocus={handleFocus}
                                            disabled={!isEditing || isAdmin}
                                            onBlur={() => {
                                                handleBlur();
                                                validateInput();
                                            }}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        {categoryError && <p className="text-red-500 text-sm mt-1">{categoryError}</p>}
                                        {errors.conditionCategory && <p className="text-red-500 text-sm mt-1">{errors.conditionCategory}</p>}
                                        {categoryFocused && (
                                            <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-48 overflow-y-auto shadow-lg">
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
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Referral</label>
                                        <select
                                            name="reffered"
                                            value={formData.reffered}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className="block w-full p-2 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        >
                                            <option value="none">None</option>
                                            <option value="ER">ER</option>
                                            <option value="urgentCare">Urgent Care</option>
                                            <option value="specialist">Specialist</option>
                                            <option value="diagnostic">Diagnostic</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Charm Chart Filled</label>
                                        <select
                                            name="charmChartFilledOut"
                                            value={formData.charmChartFilledOut}
                                            onChange={handleInputChange}
                                            disabled={!isEditing || isAdmin}
                                            className="block w-full p-2 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        >
                                            <option value="false">No</option>
                                            <option value="true">Yes</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-md font-medium mb-1">Note (optional)</h3>
                                <textarea
                                    name="note"
                                    className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                    rows="4"
                                    value={formData.note || ''}
                                    onChange={handleInputChange}
                                    disabled={!isEditing || isAdmin}
                                ></textarea>
                            </div>
                        </div>
                    </section>

                    <section className="bg-white p-6 shadow-md rounded-xl mt-6">
                        <div>
                            <h3 className="text-lg font-medium mb-4 text-blue-800 border-b pb-2">OTC Supplies Dispensed</h3>
                            <div className="space-y-4">
                                {items.map((item, index) => (
                                    <div key={index} className="flex flex-col md:flex-row md:items-center gap-4 p-2 pb-6 bg-gray-50 rounded-lg">
                                        <div className="flex-1 relative">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Medical Kit<span className='text-red-600 text-lg'>*</span></label>
                                            <Select
                                                options={medicalKitOptions}
                                                value={item.medicalKit}
                                                onChange={(selectedOption) => handleMedicalKitChange(index, selectedOption)}
                                                className="mt-1"
                                                placeholder="Select a medical kit"
                                                isDisabled={isAdmin}
                                                required={true}
                                            />
                                            {errors[`medicalKit-${index}`] && (
                                                <p className="text-red-500 text-sm mt-1 absolute">{errors[`medicalKit-${index}`]}</p>
                                            )}
                                        </div>
                                        <div className="flex-1 relative">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Item<span className='text-red-600 text-lg'>*</span></label>
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
                                                <p className="text-red-500 text-sm mt-1 absolute">{errors[`product-${index}`]}</p>
                                            )}
                                        </div>

                                        <div className="flex-1 relative">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity<span className='text-red-600 text-lg'>*</span></label>
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => handleQuantityChange(index, e)}
                                                onInput={(e) => {
                                                    if (e.target.value < 0) {
                                                        e.target.value = 0; // Prevent negative values
                                                    }
                                                }}
                                                className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Enter quantity"
                                                disabled={isAdmin}
                                                required={true}
                                            />
                                            {errors[`quantity-${index}`] && (
                                                <p className="text-red-500 text-sm mt-1 absolute">{errors[`quantity-${index}`]}</p>
                                            )}
                                        </div>

                                        {items.length > 1 && !isAdmin && (
                                            <button
                                                type="button"
                                                onClick={() => removeItem(index)}
                                                className="self-end md:self-center p-2 text-white rounded-md hover:bg-red-50 mt-4 md:mt-6"
                                            >
                                                <Trash className="text-red-500" />
                                            </button>
                                        )}
                                    </div>
                                ))}

                                {!isAdmin && (
                                    <button
                                        type="button"
                                        onClick={addItem}
                                        className="mt-4 px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors duration-200 flex items-center gap-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="12" y1="5" x2="12" y2="19"></line>
                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                        </svg>
                                        Add Another Item
                                    </button>
                                )}
                            </div>
                        </div>
                    </section>
                </fieldset>
            </form>

            <SuccessPopup
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                message={successMessage}
                autoCloseTime={1200}
            />
        </div >
    );
}

export default AddNewPatient;