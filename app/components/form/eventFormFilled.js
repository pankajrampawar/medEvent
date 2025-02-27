'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash } from 'lucide-react';
import { updateEvent } from '@/lib/api';
import Popup from '../popupCard';
import { getDoctorsList } from '@/lib/api';
import { useRouter } from 'next/navigation';
import SuccessPopup from '../popupCard';
import { QRCodeCanvas } from 'qrcode.react';

const EventFormFilled = ({ isEditable = true, eventDetails }) => {

    const router = useRouter();
    const [successMessage, setSuccessMessage] = useState('');
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const showSuccessMessage = (message) => {
        setSuccessMessage(message);
        setIsPopupOpen(true);
    };

    useEffect(() => {
        const fetchDoctorsList = async () => {
            const result = await getDoctorsList();
            if (result) {
                setDoctors(result.doctors)
            }
        }

        fetchDoctorsList();
    }, [])

    const formatDate = (isoDate) => {
        if (!isoDate) return '';
        return new Date(isoDate).toISOString().split('T')[0];
    };

    console.log(eventDetails)
    const [formData, setFormData] = useState({
        title: eventDetails.title,
        clientName: eventDetails.clientName,
        startDate: formatDate(eventDetails.startDate),
        endDate: formatDate(eventDetails.endDate),
        note: eventDetails.note,
        description: eventDetails.description,
        location: eventDetails.location,
        doctors: eventDetails.doctors,
        option: eventDetails.option,
    });

    const [error, setError] = useState('');
    const [doctors, setDoctors] = useState([]);
    const [nameSuggestions, setNameSuggestions] = useState([]);
    const [emailSuggestions, setEmailSuggestions] = useState([]);
    const [currentField, setCurrentField] = useState(null);
    const [isFocused, setIsFocused] = useState(false); // Track focus state


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

        if (name === "startDate" || name === "endDate") {
            const startDate = name === "startDate" ? new Date(value) : new Date(formData.startDate);
            const endDate = name === "endDate" ? new Date(value) : new Date(formData.endDate);

            if (startDate > endDate) {
                setError("End date cannot be earlier than start date.");
            } else {
                setError("");
            }
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

    const handleNameInputChange = (index, value) => {
        setCurrentField(index); // Track the current field
        const filteredNames = doctors.filter((doctor) =>
            doctor.firstName.toLowerCase().includes(value.toLowerCase()) ||
            doctor.lastName.toLowerCase().includes(value.toLowerCase())
        );
        setNameSuggestions(filteredNames);
        handleDoctorChange(index, { target: { name: "name", value } });
    };


    const handleEmailInputFocus = (index, name) => {
        setIsFocused(true);
        const filteredEmails = doctors
            .filter((doctor) => `${doctor.firstName} ${doctor.lastName}` === name)
            .map((doctor) => doctor.email);
        setEmailSuggestions(filteredEmails);
        setCurrentField(index);
    };

    const handleEmailInputChange = (index, value, name) => {
        setCurrentField(index);
        const filteredEmails = doctors
            .filter((doctor) => `${doctor.firstName} ${doctor.lastName}` === name)
            .map((doctor) => doctor.email);
        setEmailSuggestions(filteredEmails);
        handleDoctorChange(index, { target: { name: "email", value } });
    };

    const selectSuggestion = (index, suggestion, type) => {
        if (type === "name") {
            const fullName = `${suggestion.firstName} ${suggestion.lastName}`;
            handleDoctorChange(index, { target: { name: "name", value: fullName } });
            const filteredEmails = doctors
                .filter((doctor) => `${doctor.firstName} ${doctor.lastName}` === fullName)
                .map((doctor) => doctor.email);
            if (filteredEmails.length === 1) {
                // Auto-fill email if name is unique
                handleDoctorChange(index, { target: { name: "email", value: filteredEmails[0] } });
            }
            setNameSuggestions([]);
        }
        if (type === "email") {
            handleDoctorChange(index, { target: { name: "email", value: suggestion } });
            setEmailSuggestions([]);
        }
    };

    const handleNameInputFocus = (index) => {
        setIsFocused(true);
        setNameSuggestions(doctors); // Show all doctors when the input is focused
        setCurrentField(index);
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

        const result = await updateEvent(eventDetails._id, formData)
        if (result) {
            showSuccessMessage("Event updated successfully!");
            setTimeout(() => {
                router.back();
            }, 1500); // 1.5 second delay
            return;
        }
        if (!result) {
            alert('error')
            router.back();
            return;
        }
        console.log('Form Data Submitted:', formData);
        setError(''); // Clear any previous errors
        // You can add your form submission logic here, such as an API call
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-6 border rounded-lg shadow-sm bg-white mb-32 mr-[5%] ml-[2%]"
        >
            <h2 className="text-lg font-semibold mb-4">Event Information</h2>

            {error && (
                <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className='mb-6 flex w-full justify-between gap-6'>
                    <div className='w-full'>
                        <div>
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
                        <div className='mb-6'>
                            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                                Client Name <span className='text-red-700 text-xl'>*</span>
                            </label>
                            <input
                                type='text'
                                id='clientName'
                                name='clientName'
                                value={formData.clientName}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                disabled={!isEditable}
                                required={true}
                            />
                        </div>
                        {/* Start Date and End Date */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2">
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
                                        min={new Date().toISOString().split('T')[0]}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                        disabled={!isEditable}
                                        required={true}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                                        End Date <span className='text-red-700 text-xl'>*</span>
                                    </label>
                                    <input
                                        type="date"
                                        id="endDate"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleChange}
                                        min={formData.startDate || new Date().toISOString().split('T')[0]}
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
                                disabled={!isEditable}
                                required={true}
                            ></textarea>
                        </div>
                    </div>

                    <div className="flex-0 bg-white flex flex-col justify-center items-center w-fit  rounded-xl">
                        <label className='w-full block text-sm font-medium text-gray-700'>QR for event</label>
                        <div className='border p-10 border-gray-300 mt-2'>
                            <QRCodeCanvas value={`https://med-event-nine.vercel.app/user/entryForm/${eventDetails._id}`} size={300} />
                        </div>
                    </div>
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
                        disabled={!isEditable}
                    ></textarea>
                </div>

                {/* Doctors */}
                <div className="mb-6">
                    <h3 className="text-md font-medium mb-2">Medical Staff</h3>
                    {formData.doctors.map((doctor, index) => (
                        <div key={index} className="mb-4 space-x-2 flex w-full  items-center">
                            <div className='flex-grow relative'>
                                <label
                                    htmlFor={`doctorName-${index}`}
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id={`doctorName-${index}`}
                                    name="name"
                                    value={doctor.name}
                                    onFocus={() => handleNameInputFocus(index, doctor.name)}
                                    onChange={(e) => handleNameInputChange(index, e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                    disabled={!isEditable}
                                    required={true}
                                    autoComplete="off"
                                />
                                {currentField === index && nameSuggestions.length > 0 && (
                                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto w-full">
                                        {nameSuggestions.map((suggestion, i) => (
                                            <div
                                                key={i}
                                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                                onClick={() => selectSuggestion(index, suggestion, "name")}
                                            >
                                                {suggestion.firstName} {suggestion.lastName}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className='flex-grow relative'>
                                <label
                                    htmlFor={`doctorEmail-${index}`}
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id={`doctorEmail-${index}`}
                                    name="email"
                                    value={doctor.email}
                                    onFocus={() => handleEmailInputFocus(index, doctor.name)} // Pass the doctor's name
                                    onChange={(e) => handleEmailInputChange(index, e.target.value, doctor.name)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                    disabled={!isEditable}
                                    required={true}
                                    autoComplete="off"
                                />
                                {currentField === index && emailSuggestions.length > 0 && (
                                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto w-full">
                                        {emailSuggestions.map((email, i) => (
                                            <div
                                                key={i}
                                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                                onClick={() => selectSuggestion(index, email, "email")}
                                            >
                                                {email}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {isEditable && formData.doctors.length > 1 &&
                                < button
                                    type="button"
                                    onClick={() => removeDoctor(index)}
                                    className="text-sm text-red-500 hover:text-red-700 pt-4"
                                >
                                    <Trash />
                                </button>
                            }
                        </div>
                    ))}
                    {isEditable && <button
                        type="button"
                        onClick={addDoctor}
                        className="text-sm text-blue-500 hover:text-blue-700"
                    >
                        + Add Medical Staff
                    </button>}
                </div>

                {/* Submit Button */}
                {isEditable && <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Submit
                    </button>
                </div>}
            </form>

            <SuccessPopup
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                message={successMessage}
                autoCloseTime={1200} // Will auto close after 3 seconds
            />
        </motion.div >
    );
};

export default EventFormFilled;


// but pop up addition 
// add cross button at top