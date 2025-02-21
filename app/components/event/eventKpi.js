import KpiCard from "../kpiCard";
import { Calendar, CheckCircle, Loader, CalendarPlus } from 'lucide-react';

export default function EventKpi({ ongoing, completed, upcoming }) {

    return (
        <section>
            <div className="flex justify-start gap-4">
                <KpiCard Icon={Loader} title="Total Events" percentage="+25%" number={ongoing + completed + upcoming} />
                <KpiCard Icon={Loader} title="Ongoing Events" percentage="+25%" number={ongoing} />
                <KpiCard Icon={CheckCircle} title="Completed Events" percentage="+25%" number={completed} />
                <KpiCard Icon={CalendarPlus} title="Upcoming Events" percentage="+25%" number={upcoming} />
            </div>
        </section>
    )
}