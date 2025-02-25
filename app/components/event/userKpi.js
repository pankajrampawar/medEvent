import KpiCard from "../kpiCard";
import { Users, Clock, CheckCircle } from "lucide-react";

export default function UserKpi({ total, pending, completed, setShowPending, setShowCompleted }) {
    return (
        <section>
            <div className="flex justify-start gap-4">
                {/* Total Patients */}
                <button onClick={() => { setShowCompleted(false); setShowPending(false) }} className="w-full">
                    <KpiCard Icon={Users} title="Total Patients" percentage="+25%" number={total} />
                </button>

                {/* Pending Patients */}
                <button onClick={() => { setShowCompleted(false); setShowPending(true) }} className="w-full">
                    <KpiCard Icon={Clock} title="Pending Patients" percentage="+25%" number={pending} />
                </button>

                {/* Checked Patients */}
                <button onClick={() => { setShowCompleted(true); setShowPending(false) }} className="w-full">
                    <KpiCard Icon={CheckCircle} title="Completed Patients" percentage="+25%" number={completed} />
                </button>
            </div>
        </section>
    );
}