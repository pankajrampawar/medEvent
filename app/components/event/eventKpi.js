'use router';
import KpiCard from "../kpiCard";
import { Calendar, CheckCircle, Loader, CalendarPlus } from 'lucide-react';
import { useRouter } from "next/navigation";

export default function EventKpi({ ongoing, completed, upcoming }) {
    const router = useRouter();
    return (
        <section>
            <div className="flex justify-start gap-4">
                <button onClick={() => { router.push('/dashboard/events/ongoing') }} className="w-full">
                    <KpiCard Icon={Loader} title="Total Events" percentage="+25%" number={ongoing + completed + upcoming} />
                </button>
                <button onClick={() => { router.push('/dashboard/events/ongoing') }} className="w-full">
                    <KpiCard Icon={Loader} title="Ongoing Events" percentage="+25%" number={ongoing} />
                </button>
                <button onClick={() => { router.push('/dashboard/events/upcoming') }} className="w-full">
                    <KpiCard Icon={CalendarPlus} title="Upcoming Events" percentage="+25%" number={upcoming} />
                </button>
                <button onClick={() => { router.push('/dashboard/events/completed') }} className="w-full">
                    <KpiCard Icon={CheckCircle} title="Completed Events" percentage="+25%" number={completed} />
                </button>
            </div>
        </section>
    )
}