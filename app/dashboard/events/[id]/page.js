'use client'
import EventKpi from "@/app/components/event/eventKpi";
import Inventory from "@/app/components/event/inventory";
import UserListing from "@/app/components/event/userEventListing";
import UserKpi from "@/app/components/event/userKpi";
import { getUserFromEvent } from "@/lib/api";
import { ChevronLeft, Package } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Event({ params }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const { id } = React.use(params);
    const [users, setUsers] = useState([]);
    const [showPending, setShowPending] = useState(false);
    const [showCompleted, setShowCompleted] = useState(false);
    const [showInventory, setShowInventory] = useState(false);
    const [currentEvent, setCurrentEvent] = useState();

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

        const getEvent = async (eventId) => {
            try {
                const storedEvents = await JSON.parse(localStorage.getItem("events")) || [];
                const thisEvent = storedEvents.find(event => event._id === eventId);
                setCurrentEvent(thisEvent);
            } catch (error) {
                throw new Error("Unable to get the events please go back and reaload")
            }
        }
        getEvent(id)
        getUsers(id);
    }, [id]); // Removed dependency on `users` to prevent infinite re-rendering

    // Separate users into completed and pending
    const completedUsers = users.filter(user => !user.isPending);
    const pendingUsers = users.filter(user => user.isPending);

    const refreshUsers = async () => {
        setLoading(true);
        try {
            const result = await getUserFromEvent(id);
            console.log(result);
            setUsers(result.users);
            setLoading(false);
        } catch (error) {
            throw new Error("Unable to load user data, please try again later.");
        }
    }

    if (loading) return (
        <div className="flex w-full h-full justify-center items-center">
            loading user data..
        </div>
    );

    console.log(users)

    return (
        <div className="flex flex-col gap-6 mx-[5%] mb-[5%] mt-4">
            <h1 className="text-2xl flex items-center gap-2">
                <button className="hover:bg-gray-200 p-2 rounded-full" onClick={() => router.back()}>
                    <ChevronLeft />
                </button>
                Event Details
            </h1>
            <section className="">
                <UserKpi total={users.length} completed={completedUsers.length} pending={pendingUsers.length} setShowPending={setShowPending} setShowCompleted={setShowCompleted} />
            </section>
            <section className="">
                <UserListing refreshUsers={refreshUsers} eventId={id} usersList={showPending ? pendingUsers : showCompleted ? completedUsers : users} Package={Package} setShowInventory={setShowInventory} medicalKit={currentEvent?.medicalKit} />
            </section>
            {showInventory && <section>
                <Inventory users={users} onClose={() => setShowInventory(false)} />
            </section>}
        </div>
    );
}