'use client'
// components/PatientForm.js
import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const PatientForm = ({ isEditable = false }) => {

    const router = useRouter();
    const [loading, setLoading] = useState(true);


    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="flex items-center space-x-4">
                <div className="w-8 h-8 border-4 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="text-2xl font-semibold text-gray-700">
                    Loading event details...
                </div>
            </div>
        </div>
    );


    return (
        <div className="m-10">
            <h1 className="p-2 text-2xl flex items-center gap-2">
                <button className="hover:bg-gray-200 p-2 rounded-full" onClick={() => router.back()}>
                    <ChevronLeft />
                </button>
                Patient Details
            </h1>

            <section className='flex  gap-10'>
                <div className='flex-grow shadow-lg bg-white h-fit p-6 rounded-xl'>
                    <div className="mb-6">
                        <h3 className="text-md font-medium mb-2">Patient Information</h3>
                        <div className="space-y-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">First Name</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    disabled={!isEditable}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    disabled={!isEditable}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Date Of Birth</label>
                                <input
                                    type="date"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    disabled={!isEditable}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Contact No</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    disabled={!isEditable}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* doctor filled detais */}
                <div className='flex-grow shadow-lg bg-white h-fit p-6 rounded-xl '>
                    <div className="mb-6">
                        <h3 className="text-md font-medium mb-2">Chief Complaint</h3>
                        <input
                            type="text"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            disabled={!isEditable}
                        />
                    </div>

                    <div className="mb-6">
                        <h3 className="text-md font-medium mb-2">Are You Allergic to a Medication?</h3>
                        <input
                            type="text"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            disabled={!isEditable}
                        />
                    </div>

                    <div className="mb-6">
                        <h3 className="text-md font-medium mb-2">Doctors Detail</h3>
                        <div className="space-y-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Primary Diagnosis</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    disabled={!isEditable}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Condition Category</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    disabled={!isEditable}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Charm Chart Filled Out</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    disabled={!isEditable}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">OTC/Supplies Dispensed</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    disabled={!isEditable}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-md font-medium mb-2">Note (optional)</h3>
                        <textarea
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            rows="4"
                            disabled={!isEditable}
                        ></textarea>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PatientForm;