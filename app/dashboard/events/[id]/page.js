'use client'
import EventKpi from "@/app/components/event/eventKpi";
import UserListing from "@/app/components/event/userEventListing";
import UserKpi from "@/app/components/event/userKpi";
import { getUserFromEvent } from "@/lib/api";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Event({ params }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const { id } = React.use(params);
    const [users, setUsers] = useState([]);

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

    // Separate users into completed and pending
    const completedUsers = users.filter(user => user.charmChartFilledOut);
    const pendingUsers = users.filter(user => !user.charmChartFilledOut);

    if (loading) return (
        <div className="flex w-full h-full justify-center items-center">
            loading user data..
        </div>
    );

    return (
        <div className="flex flex-col gap-6 mx-[5%] mb-[5%] mt-4">
            <h1 className="p-2 text-2xl flex items-center gap-2">
                <button className="hover:bg-gray-200 p-2 rounded-full" onClick={() => router.back()}>
                    <ChevronLeft />
                </button>
                Event Details
            </h1>
            <section className="">
                <UserKpi total={users.length} completed={completedUsers.length} pending={pendingUsers.length} />
            </section>
            <section className="">
                <UserListing eventId={id} usersList={users} />
            </section>
        </div>
    );
}