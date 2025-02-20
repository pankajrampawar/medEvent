import KpiCard from "../kpiCard";
import { UserCheck } from "lucide-react";

export default function EventKpi({ ongoing, completed, upcoming }) {

    return (
        <section>
            <div className="flex justify-start gap-4">
                <KpiCard Icon={UserCheck} title="Ongoing Events" subtext="Total Users" percentage="+25%" number={ongoing} />
                <KpiCard Icon={UserCheck} title="Completed" subtext="Total Users" percentage="+25%" number={completed} />
                <KpiCard Icon={UserCheck} title="Upcoming" subtext="Total Users" percentage="+25%" number={upcoming} />
            </div>
        </section>
    )
}