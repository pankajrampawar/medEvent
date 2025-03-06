'use client'
import { addNewUser } from '@/lib/api';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle, Calendar, Phone, Send, User } from 'lucide-react';

const RegistrationForm = ({ eventId }) => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    const [formData, setFormData] = useState({
        eventId: eventId,
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        contactNumber: '',
        chiefComplaint: '',
        hasAllergy: false,
        allergyInfo: '',
        hasAgreed: true,
    });

    const validateForm = () => {
        const errors = {};
        if (!formData.firstName.trim()) errors.firstName = "First name is required";
        if (!formData.lastName.trim()) errors.lastName = "Last name is required";
        if (!formData.contactNumber.trim()) errors.contactNumber = "Contact number is required";

        // Simple phone validation
        if (formData.contactNumber && !/^\d{10,15}$/.test(formData.contactNumber.replace(/[^\d]/g, ''))) {
            errors.contactNumber = "Please enter a valid phone number";
        }

        // Validate allergy info if hasAllergy is true
        if (formData.hasAllergy && !formData.allergyInfo.trim()) {
            errors.allergyInfo = "Please provide allergy information";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const result = await addNewUser(formData);
            router.push('/user/success');
        } catch (error) {
            setIsSubmitting(false);
            alert(error.message || 'An error occurred. Please try again.');
            console.error(error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear error when field is edited
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    return (
        <div className="w-full">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full"
            >
                <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-600 to-blue-500 px-6 py-4">
                        <h2 className="text-xl font-bold text-white flex items-center">
                            <User className="w-5 h-5 mr-2" />
                            Registration Form
                        </h2>
                        <p className="text-indigo-100 text-sm mt-1">
                            Please fill in your details to register for the event
                        </p>
                    </div>

                    <form className="p-6" onSubmit={handleSubmit} noValidate aria-label="Registration form">
                        <div className="space-y-6">
                            {/* Name Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                                        First Name<span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="firstName"
                                            type="text"
                                            name="firstName"
                                            placeholder="Enter first name"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            required
                                            aria-required="true"
                                            aria-invalid={!!formErrors.firstName}
                                            aria-describedby={formErrors.firstName ? "firstName-error" : undefined}
                                            className={`w-full px-4 py-2 border ${formErrors.firstName ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-indigo-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors`}
                                        />
                                        {formErrors.firstName && (
                                            <div id="firstName-error" className="text-red-500 text-xs mt-1 flex items-center">
                                                <AlertCircle className="w-3 h-3 mr-1" />
                                                {formErrors.firstName}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                                        Last Name<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="lastName"
                                        type="text"
                                        name="lastName"
                                        placeholder="Enter last name"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        required
                                        aria-required="true"
                                        aria-invalid={!!formErrors.lastName}
                                        aria-describedby={formErrors.lastName ? "lastName-error" : undefined}
                                        className={`w-full px-4 py-2 border ${formErrors.lastName ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-indigo-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors`}
                                    />
                                    {formErrors.lastName && (
                                        <div id="lastName-error" className="text-red-500 text-xs mt-1 flex items-center">
                                            <AlertCircle className="w-3 h-3 mr-1" />
                                            {formErrors.lastName}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Date of Birth */}
                            <div>
                                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                                    Date of Birth<span className=""></span>
                                </label>
                                <div className="relative">
                                    <input
                                        id="dateOfBirth"
                                        type="date"
                                        name="dateOfBirth"
                                        value={formData.dateOfBirth}
                                        onChange={handleInputChange}
                                        aria-invalid={!!formErrors.dateOfBirth}
                                        aria-describedby={formErrors.dateOfBirth ? "dateOfBirth-error" : undefined}
                                        max={new Date().toISOString().split('T')[0]} // Block future dates
                                        className={`w-full pl-4 pr-4 py-2 border ${formErrors.dateOfBirth ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-indigo-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors`}
                                    />
                                </div>
                                {formErrors.dateOfBirth && (
                                    <div id="dateOfBirth-error" className="text-red-500 text-xs mt-1 flex items-center">
                                        <AlertCircle className="w-3 h-3 mr-1" />
                                        {formErrors.dateOfBirth}
                                    </div>
                                )}
                            </div>

                            {/* Contact Number */}
                            <div>
                                <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                    Contact Number<span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Phone className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="contactNumber"
                                        type="tel"
                                        name="contactNumber"
                                        placeholder="Enter your mobile number"
                                        value={formData.contactNumber}
                                        onChange={handleInputChange}
                                        required
                                        aria-required="true"
                                        aria-invalid={!!formErrors.contactNumber}
                                        aria-describedby={formErrors.contactNumber ? "contactNumber-error" : undefined}
                                        className={`w-full pl-10 pr-4 py-2 border ${formErrors.contactNumber ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-indigo-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors`}
                                    />
                                </div>
                                {formErrors.contactNumber && (
                                    <div id="contactNumber-error" className="text-red-500 text-xs mt-1 flex items-center">
                                        <AlertCircle className="w-3 h-3 mr-1" />
                                        {formErrors.contactNumber}
                                    </div>
                                )}
                            </div>

                            {/* Chief Complaint */}
                            <div>
                                <label htmlFor="chiefComplaint" className="block text-sm font-medium text-gray-700 mb-1">
                                    Chief Complaints
                                </label>
                                <textarea
                                    id="chiefComplaint"
                                    name="chiefComplaint"
                                    placeholder="Describe the primary health concern"
                                    value={formData.chiefComplaint}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 focus:border-indigo-300 transition-colors"
                                />
                            </div>

                            {/* Allergy Question */}
                            <fieldset className="border border-gray-200 rounded-lg p-4">
                                <legend className="text-sm font-medium text-gray-700 px-2">
                                    Do you have any allergy?
                                </legend>
                                <div className="flex items-center gap-6 mt-2">
                                    <div className="flex items-center">
                                        <input
                                            id="allergy-yes"
                                            type="radio"
                                            name="hasAllergy"
                                            checked={formData.hasAllergy}
                                            onChange={() => setFormData(prev => ({ ...prev, hasAllergy: true }))}
                                            className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                            aria-labelledby="allergy-yes-label"
                                        />
                                        <label id="allergy-yes-label" htmlFor="allergy-yes" className="ml-2 text-sm text-gray-700">
                                            Yes
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            id="allergy-no"
                                            type="radio"
                                            name="hasAllergy"
                                            checked={!formData.hasAllergy}
                                            onChange={() => setFormData(prev => ({ ...prev, hasAllergy: false, allergyInfo: '' }))}
                                            className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                            aria-labelledby="allergy-no-label"
                                        />
                                        <label id="allergy-no-label" htmlFor="allergy-no" className="ml-2 text-sm text-gray-700">
                                            No
                                        </label>
                                    </div>
                                </div>
                            </fieldset>

                            {/* Allergy Information (Conditional) */}
                            {formData.hasAllergy && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <label htmlFor="allergyInfo" className="block text-sm font-medium text-gray-700 mb-1">
                                        Allergy Information<span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        id="allergyInfo"
                                        name="allergyInfo"
                                        placeholder="Please describe your allergies in detail"
                                        value={formData.allergyInfo}
                                        onChange={handleInputChange}
                                        rows={3}
                                        required={formData.hasAllergy}
                                        aria-required={formData.hasAllergy}
                                        aria-invalid={!!formErrors.allergyInfo}
                                        aria-describedby={formErrors.allergyInfo ? "allergyInfo-error" : undefined}
                                        className={`w-full px-4 py-2 border ${formErrors.allergyInfo ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-indigo-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors`}
                                    />
                                    {formErrors.allergyInfo && (
                                        <div id="allergyInfo-error" className="text-red-500 text-xs mt-1 flex items-center">
                                            <AlertCircle className="w-3 h-3 mr-1" />
                                            {formErrors.allergyInfo}
                                        </div>
                                    )}
                                </motion.div>
                            )}


                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name='hasAgreed'
                                    checked={formData.hasAgreed} // Boolean indicating whether terms are agreed
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
                                    I consent to IHP contacting me if necessary for further information or updates.
                                </label>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="mt-8">
                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5 mr-2" />
                                        Submit Registration
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default RegistrationForm;