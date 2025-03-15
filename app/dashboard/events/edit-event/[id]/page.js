'use client'
import EventFormFilled from "@/app/components/form/eventFormFilled";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useAuth } from "@/context/authContext";
import UserListing from "@/app/components/event/userEventListing";
import Inventory from "@/app/components/event/inventory";
import { getUserFromEvent } from "@/lib/api";

export default function eventInfo({ params }) {

    const router = useRouter()
    const searchParams = useSearchParams();
    const { id } = React.use(params);
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const eventData = JSON.parse(searchParams.get('data'));
    const { user, loading: authLoading } = useAuth();

    const isAdmin = user?.role === 'admin';
    console.log(eventData)

    useEffect(() => {
        const getUsers = async (eventId) => {
            try {
                const result = await getUserFromEvent(eventId);
                console.log(result);
                setUsers(result.users);
                setLoading(false);
            } catch (error) {
                throw new Error("Unable to load user data, please try again later.");
            }
        };

        getUsers(id);
    }, [id]); // Removed dependency on `users` to prevent infinite re-rendering

    if (authLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 border-4 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                    <div className="text-2xl font-semibold text-gray-700">
                        Authenticating...
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col mt-[2%]">
            <div>
                <button className="hover:bg-gray-300 rounded-full p-2" onClick={() => router.back()}>
                    <ChevronLeft />
                </button>
            </div>
            <section className="flex flex-col w-full gap-8 pt-6">
                <div className="flex-1">
                    <EventFormFilled eventDetails={eventData} isEditable={isAdmin} allowPastDates={true} />
                </div>
                <div>
                    <Inventory
                        users={users}
                        loading={loading}
                        onClose={() => setShow}
                    />
                </div>
            </section>
        </div>
    )
}