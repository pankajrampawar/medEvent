'use client'
import EventForm from "@/app/components/form/eventForm";
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { createEvent } from "@/lib/api";
import SuccessPopup from "@/app/components/popupCard";

export default function CreateEvent() {

    const router = useRouter();
    const [successMessage, setSuccessMessage] = useState('');
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const showSuccessMessage = (message) => {
        setSuccessMessage(message);
        setIsPopupOpen(true);
    };

    const handleSubmit = async (formData) => {
        try {
            const result = await createEvent(formData);
            if (result) {

                return router.back();
            }
            console.log(result)
            showSuccessMessage("Event created successfully!");
        } catch (error) {
            alert(error.message);
            console.log(error);
        }
    };

    const [formData, setFormData] = useState({
        title: "New Event",
        startDate: '',
        endDate: '',
        location: '',
        note: '',
        description: '',
        doctors: [{ name: '', email: '' }], // Array to store multiple doctors
        option: '',
    });

    const resetForm = () => {
        setFormData({
            title: "New Event",
            startDate: '',
            endDate: '',
            note: '',
            description: '',
            doctors: [{ name: '', email: '' }], // Array to store multiple doctors
            option: '',
        })
    }

    return (
        <div className="m-[5%] mt-10 space-y-10">
            <div className="flex justify-between items-end">
                <h1 className="p-2 text-2xl flex items-center gap-2">
                    <button className="hover:bg-gray-200 p-2 rounded-full" onClick={() => router.back()}>
                        <ChevronLeft />
                    </button>
                    Create New Event
                </h1>
                <div className="flex justify-end items-center rounded-lg ">
                    <div className="flex space-x-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 text-black/70 font-semibold hover:text-black rounded-lg hover:border-black border border-gray-400 transition-colors"
                            onClick={() => { router.push('/dashboard/events/createEvent') }}
                        >
                            Discard
                        </motion.button>
                    </div>
                </div>
            </div>


            <div className="p-10 bg-white rounded-lg ">
                <EventForm submitFunction={handleSubmit} resetForm={resetForm} />
            </div>

            <SuccessPopup
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                message={successMessage}
                autoCloseTime={3000} // Will auto close after 3 seconds
            />
        </div >
    )
}