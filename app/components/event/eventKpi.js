'use router';
import KpiCard from "../kpiCard";
import { Calendar, CheckCircle, Loader, CalendarPlus } from 'lucide-react';
import { useRouter } from "next/navigation";

export default function EventKpi({ ongoing, completed, upcoming }) {
    const router = useRouter();
    return (
        <section>
            <div className="flex justify-start gap-4">
                <button onClick={() => { router.push('/dashboard/events/') }}>
                    <KpiCard Icon={Loader} title="Total Events" percentage="+25%" number={ongoing + completed + upcoming} />
                </button>
                <button onClick={() => { router.push('/dashboard/events/ongoing') }}>
                    <KpiCard Icon={Loader} title="Ongoing Events" percentage="+25%" number={ongoing} />
                </button>
                <button onClick={() => { router.push('/dashboard/events/completed') }}>
                    <KpiCard Icon={CheckCircle} title="Completed Events" percentage="+25%" number={completed} />
                </button>
                <button onClick={() => { router.push('/dashboard/events/upcoming') }}>
                    <KpiCard Icon={CalendarPlus} title="Upcoming Events" percentage="+25%" number={upcoming} />
                </button>
            </div>
        </section>
    )
}