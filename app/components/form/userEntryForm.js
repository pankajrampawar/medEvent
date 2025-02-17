'use client'
import { motion } from 'framer-motion';
import { useState } from 'react';

const RegistrationForm = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        contactNumber: '',
        chiefComplaints: '',
        hasAllergy: false,
        allergyInfo: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission here
        console.log('Form submitted:', formData);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    return (
        <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative py-3 sm:max-w-xl sm:mx-auto"
            >
                <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
                    <div className="max-w-md mx-auto">
                        <div className="flex items-center space-x-5">
                            <div className="block pl-2 font-semibold text-xl text-gray-700">
                                <h2 className="leading-relaxed">Registration Form</h2>
                                <p className="text-sm text-gray-500 font-normal leading-relaxed">
                                    Fill in your details to register for the event
                                </p>
                            </div>
                        </div>

                        <form className="divide-y divide-gray-200" onSubmit={handleSubmit}>
                            <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            placeholder="Ex. Calvin"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            placeholder="Ex. Klein"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                                    <input
                                        type="date"
                                        name="dateOfBirth"
                                        value={formData.dateOfBirth}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                                    <input
                                        type="tel"
                                        name="contactNumber"
                                        placeholder="Enter Your Mobile Number"
                                        value={formData.contactNumber}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Chief Complaints</label>
                                    <textarea
                                        name="chiefComplaints"
                                        placeholder="Describe the primary health concern"
                                        value={formData.chiefComplaints}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Do you have any allergy?</label>
                                    <div className="flex items-center space-x-4">
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                name="hasAllergy"
                                                checked={formData.hasAllergy}
                                                onChange={() => setFormData(prev => ({ ...prev, hasAllergy: true }))}
                                                className="form-radio text-indigo-600"
                                            />
                                            <span className="ml-2">YES</span>
                                        </label>
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                name="hasAllergy"
                                                checked={!formData.hasAllergy}
                                                onChange={() => setFormData(prev => ({ ...prev, hasAllergy: false }))}
                                                className="form-radio text-indigo-600"
                                            />
                                            <span className="ml-2">NO</span>
                                        </label>
                                    </div>
                                </div>

                                {formData.hasAllergy && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <label className="block text-sm font-medium text-gray-700">Allergy Information</label>
                                        <textarea
                                            name="allergyInfo"
                                            placeholder="Describe allergy info here"
                                            value={formData.allergyInfo}
                                            onChange={handleInputChange}
                                            rows={3}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                        />
                                    </motion.div>
                                )}
                            </div>

                            <div className="pt-4">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    className="w-full px-4 py-3 bg-gray-900 rounded-md text-white text-sm font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                                >
                                    Submit
                                </motion.button>
                            </div>
                        </form>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default RegistrationForm;