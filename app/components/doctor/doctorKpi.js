'use router';
import KpiCard from "../kpiCard";
import { CalendarPlus, CheckCircle, Loader } from 'lucide-react';

export default function DoctorKpi({ total, emt, medic, usp, iP, setFilter }) {

    const handleFilterChange = (role) => {
        setFilter(role);
    };

    return (
        <section>
            <div className="flex justify-between gap-4 w-full">
                <button onClick={() => handleFilterChange(false)} className="w-full">
                    <KpiCard Icon={Loader} title="Total Staff" percentage="+25%" number={total} />
                </button>
                <button onClick={() => handleFilterChange('emt')} className="w-full">
                    <KpiCard Icon={Loader} title="EMT" percentage="+25%" number={emt} />
                </button>
                <button onClick={() => handleFilterChange('medic')} className="w-full">
                    <KpiCard Icon={CheckCircle} title="Medic" percentage="+25%" number={medic} />
                </button>
                <button onClick={() => handleFilterChange('usP')} className="w-full">
                    <KpiCard Icon={CalendarPlus} title="US Physician" percentage="+25%" number={usp} />
                </button>
                <button onClick={() => handleFilterChange('interP')} className="w-full">
                    <KpiCard Icon={CalendarPlus} title="Inter. Physician" percentage="+25%" number={iP} />
                </button>
            </div>
        </section>
    );
}