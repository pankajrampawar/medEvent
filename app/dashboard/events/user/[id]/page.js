'use client';
import React, { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getEventDetails, updateUser } from '@/lib/api';

const PatientForm = ({ isEditable = true, params }) => {
    const searchParams = useSearchParams();
    const { id } = React.use(params);
    const userData = JSON.parse(searchParams.get('data'));
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(userData); // State to manage form data
    const [isEditing, setIsEditing] = useState(isEditable); // State to toggle edit mode

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Call the updateUser function in handleSubmit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await updateUser(id, formData)
            alert('Changes updated successfully!');
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
                        Loading event details...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="m-10">
            <h1 className="p-2 text-2xl flex items-center gap-2">
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
                                />
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
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Charm Chart Filled Out</label>
                                <input
                                    type="text"
                                    name="charmChart"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={formData.charmChart || ''}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">OTC/Supplies Dispensed</label>
                                <input
                                    type="text"
                                    name="otcSupplies"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={formData.otcSupplies || ''}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                />
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
        </div>
    );
};

export default PatientForm;