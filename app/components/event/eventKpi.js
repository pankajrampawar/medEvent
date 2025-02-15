import KpiCard from "../kpiCard";
import { UserCheck } from "lucide-react";

export default function EventKpi() {
    return (
        <section>
            <div className="flex justify-start gap-4">
                <KpiCard Icon={UserCheck} title="Total Users" subtext="Total Users" percentage="+25%" number="3,271" />
                <KpiCard Icon={UserCheck} title="Total Users" subtext="Total Users" percentage="+25%" number="3,271" />
                <KpiCard Icon={UserCheck} title="Total Users" subtext="Total Users" percentage="+25%" number="3,271" />
            </div>
        </section>
    )
}