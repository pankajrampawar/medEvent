'use router';
import KpiCard from "../kpiCard";
import { Calendar, CheckCircle, Loader, CalendarPlus } from 'lucide-react';
import { useRouter } from "next/navigation";

export default function DoctorKpi({ total, emt, medic, usPhysician, internationPhysician }) {
    const router = useRouter();
    return (
        <section>
            <div className="flex justify-between gap-4 w-full">
                <button onClick={() => { router.push('/dashboard/events/ongoing') }} className="w-full">
                    <KpiCard Icon={Loader} title="Total Staff" percentage="+25%" number={total} />
                </button>
                <button onClick={() => { router.push('/dashboard/events/ongoing') }} className="w-full">
                    <KpiCard Icon={Loader} title="EMT" percentage="+25%" number={emt} />
                </button>
                <button onClick={() => { router.push('/dashboard/events/completed') }} className="w-full">
                    <KpiCard Icon={CheckCircle} title="Medic" percentage="+25%" number={medic} />
                </button>
                <button onClick={() => { router.push('/dashboard/events/upcoming') }} className="w-full">
                    <KpiCard Icon={CalendarPlus} title="US Physician" percentage="+25%" number={usPhysician} />
                </button>
                <button onClick={() => { router.push('/dashboard/events/upcoming') }} className="w-full">
                    <KpiCard Icon={CalendarPlus} title="Inter. Physician" percentage="+25%" number={internationPhysician} />
                </button>
            </div>
        </section>
    )
}