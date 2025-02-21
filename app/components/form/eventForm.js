'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash } from 'lucide-react';

const EventForm = ({ isEditable = true, submitFunction, resetForm }) => {
    const [formData, setFormData] = useState({
        title: '',
        startDate: '',
        endDate: '',
        note: '',
        description: '',
        location: '',
        doctors: [{ name: '', email: '' }],
        option: '',
    });

    const [error, setError] = useState('');

    // Handle changes for all fields except doctors
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        // Clear error when user updates the dates
        if (name === 'startDate' || name === 'endDate') {
            setError('');
        }
    };

    // Handle changes for doctor fields
    const handleDoctorChange = (index, e) => {
        const { name, value } = e.target;
        const updatedDoctors = [...formData.doctors];
        updatedDoctors[index][name] = value;

        setFormData({
            ...formData,
            doctors: updatedDoctors,
        });
    };

    // Add a new doctor field
    const addDoctor = () => {
        setFormData({
            ...formData,
            doctors: [...formData.doctors, { name: '', email: '' }],
        });
    };

    // Remove a doctor field
    const removeDoctor = (index) => {
        const updatedDoctors = formData.doctors.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            doctors: updatedDoctors,
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate that startDate is not greater than endDate
        if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
            setError('Start date cannot be greater than end date.');
            return; // Prevent form submission
        }

        await submitFunction(formData);
        console.log('Form Data Submitted:', formData);
        setError(''); // Clear any previous errors
        // You can add your form submission logic here, such as an API call
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-6 border rounded-lg shadow-sm mx-auto"
        >
            <h2 className="text-lg font-semibold mb-4">Event Information</h2>

            {error && (
                <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {/* Start Date and End Date */}
                <div className='mb-6'>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                        Event Name <span className='text-red-700 text-xl'>*</span>
                    </label>
                    <input
                        type='text'
                        id='title'
                        name='title'
                        value={formData.title}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={!isEditable}
                        required={true}
                    />
                </div>
                <div className="mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                                Start Date <span className='text-red-700 text-xl'>*</span>
                            </label>
                            <input
                                type="date"
                                id="startDate"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                disabled={!isEditable}
                                required={true}
                            />
                        </div>
                        <div>
                            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                                End Date
                            </label>
                            <input
                                type="date"
                                id="endDate"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                disabled={!isEditable}
                                required={true}
                            />
                        </div>
                    </div>
                </div>


                <div className="mb-6">
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                        location <span className='text-red-700 text-xl'>*</span>
                    </label>
                    <textarea
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        rows="4"
                        disabled={!isEditable}
                        required={true}
                    ></textarea>
                </div>

                {/* Description */}
                <div className="mb-6">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description <span className='text-red-700 text-xl'>*</span>
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        rows="4"
                        disabled={!isEditable}
                        required={true}
                    ></textarea>
                </div>

                {/* Note */}
                <div className="mb-6">
                    <label htmlFor="note" className="block text-sm font-medium text-gray-700">
                        Note (Optional)
                    </label>
                    <textarea
                        id="note"
                        name="note"
                        value={formData.note}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        rows="3"
                        disabled={!isEditable}
                    ></textarea>
                </div>

                {/* Doctors */}
                <div className="mb-6">
                    <h3 className="text-md font-medium mb-2">Doctors</h3>
                    {formData.doctors.map((doctor, index) => (
                        <div key={index} className="mb-4 space-x-2 flex w-full  items-center">
                            <div className='flex-grow'>
                                <label
                                    htmlFor={`doctorName-${index}`}
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Doctor's Name
                                </label>
                                <input
                                    type="text"
                                    id={`doctorName-${index}`}
                                    name="name"
                                    value={doctor.name}
                                    onChange={(e) => handleDoctorChange(index, e)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                    disabled={!isEditable}
                                    required={true}
                                />
                            </div>
                            <div className='flex-grow'>
                                <label
                                    htmlFor={`doctorEmail-${index}`}
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Doctor's Email
                                </label>
                                <input
                                    type="email"
                                    id={`doctorEmail-${index}`}
                                    name="email"
                                    value={doctor.email}
                                    onChange={(e) => handleDoctorChange(index, e)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                    disabled={!isEditable}
                                    required={true}
                                />
                            </div>

                            <button
                                type="button"
                                onClick={() => removeDoctor(index)}
                                className="text-sm text-red-500 hover:text-red-700 pt-4"
                            >
                                <Trash />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addDoctor}
                        className="text-sm text-blue-500 hover:text-blue-700"
                    >
                        + Add Doctor
                    </button>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

export default EventForm;


// but pop up addition 
// add cross button at top