import KpiCard from "../kpiCard";
import { Users, Clock, CheckCircle } from "lucide-react";

export default function UserKpi({ total, pending, completed }) {
    return (
        <section>
            <div className="flex justify-start gap-4">
                {/* Total Patients */}
                <KpiCard Icon={Users} title="Total Patients" percentage="+25%" number={total} />

                {/* Pending Patients */}
                <KpiCard Icon={Clock} title="Pending Patients" percentage="+25%" number={pending} />

                {/* Checked Patients */}
                <KpiCard Icon={CheckCircle} title="Checked Patients" percentage="+25%" number={completed} />
            </div>
        </section>
    );
}