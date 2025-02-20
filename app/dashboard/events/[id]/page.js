'use client'
import EventKpi from "@/app/components/event/eventKpi";
import UserListing from "@/app/components/event/userEventListing";
import { getUserFromEvent } from "@/lib/api";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Event({ params }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const { id } = React.use(params);
    const [users, setUsers] = useState([])

    useEffect(() => {
        const getUsers = async (eventId) => {
            try {
                const result = await getUserFromEvent(eventId);
                console.log(result)
                setUsers(result.users)
                setLoading(false)
            } catch (error) {
                throw new Error("Unable to load user data, pelase try agian later.")
            }
        }

        getUsers(id);
    }, [users, id])

    if (loading) return (
        <div className="flex w-full h-full justify-center items-center">
            loading user data..
        </div>
    )

    return (
        <div className="flex flex-col gap-10 mx-[5%] my-[5%]">
            <h1 className="p-2 text-2xl flex items-center gap-2">
                <button className="hover:bg-gray-200 p-2 rounded-full" onClick={() => router.back()}>
                    <ChevronLeft />
                </button>
                Event Name
            </h1>
            <section className="">
                <EventKpi />
            </section>
            <section className="">
                <UserListing eventId={id} usersList={users} />
            </section>
        </div>
    )
}