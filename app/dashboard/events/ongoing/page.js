import EventKpi from "@/app/components/event/eventKpi";
import EventListing from "@/app/components/event/eventListing";

export default function OngoingEvent() {
    return (
        <div className="flex flex-col w-full gap-4 p-[5%]">
            <section>
                <EventKpi />
            </section>

            <section className="min-w-full">
                <EventListing />
            </section>

            <section className="fixed">

            </section>
        </div>
    )
}