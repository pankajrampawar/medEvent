'use client'
import EventForm from "@/app/components/form/eventForm";
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";

export default function CreateEvent() {

    const router = useRouter();
    const [showQrCode, setShowQrCode] = useState(false);

    const handleSubmit = (formData) => {
        alert('Event Created!');
        setShowQrCode(true);
    }

    const [formData, setFormData] = useState({
        startDate: '',
        endDate: '',
        note: '',
        description: '',
        doctors: [{ name: '', email: '' }], // Array to store multiple doctors
        option: '',
    });

    const resetForm = () => {
        setFormData({
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


            {showQrCode &&
                <div className="fixed  bg-black/60 backdrop:blur-lg bottom-0 h-screen left-0 w-screen  flex justify-center items-center">
                    <div className="bg-white p-10 rounded-lg">  {/* QR Code */}
                        <h1 className="text-2xl font-bold mb-4">QR Code for Event</h1>
                        <div className="mt-4">
                            <QRCodeCanvas value={"https://med-event-nine.vercel.app/user/entryForm"} size={200} />
                        </div>
                    </div>
                </div>
            }
        </div >
    )
}