import EventKpi from "@/app/components/event/eventKpi";
import UserListing from "@/app/components/event/userEventListing";

export default function Event() {
    return (
        <div className="flex flex-col gap-10 mx-[5%]">
            <h1 className="p-2 text-2xl">Event Name</h1>
            <section className="">
                <EventKpi />
            </section>
            <section className="">
                <UserListing />
            </section>
        </div>
    )
}