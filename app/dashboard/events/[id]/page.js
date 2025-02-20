'use client'
import EventKpi from "@/app/components/event/eventKpi";
import UserListing from "@/app/components/event/userEventListing";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export default function Event({ params }) {
    const router = useRouter();
    const { id } = React.use(params);
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
                <UserListing eventId={id} />
            </section>
        </div>
    )
}