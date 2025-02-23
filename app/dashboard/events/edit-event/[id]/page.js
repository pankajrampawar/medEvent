'use client'
import EventFormFilled from "@/app/components/form/eventFormFilled";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function eventInfo({ params }) {

    const router = useRouter()
    const searchParams = useSearchParams();
    const { id } = React.use(params);
    const eventData = JSON.parse(searchParams.get('data'));
    console.log(eventData)

    return (
        <div className="flex flex-col mt-[2%]">
            <div>
                <button className="hover:bg-gray-300 rounded-full p-2" onClick={() => router.back()}>
                    <ChevronLeft />
                </button>
            </div>
            <section className="flex w-full gap-8 pt-6">
                <div className="flex-1">
                    <EventFormFilled eventDetails={eventData} />
                </div>
                <div className="flex-0 bg-white p-4 h-fit w-fit rounded-xl">
                    <div></div>
                    <QRCodeCanvas value={`https://med-event-nine.vercel.app/user/entryForm/${eventData._id}`} size={300} />
                </div>
            </section>
        </div>
    )
}