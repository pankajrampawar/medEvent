'use client'
import React, { useState, useEffect } from "react";
import RegistrationForm from "../../../components/form/userEntryForm";
import { getEventDetails } from "@/lib/api";


export default function EntryForm({ params }) {

    const { id } = React.use(params)

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getEventById = async (id) => {
            try {
                const result = await getEventDetails(id)
                console.log(result)
                setLoading(false)
            } catch (error) {
                throw new Error("Unable to load data, please try again later.")
            }
        }

        getEventById(id);
    }, [])


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
        <div>
            <div>
                <RegistrationForm eventId={id} />
            </div>
        </div>
    )
}