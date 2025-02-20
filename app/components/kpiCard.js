export default function KpiCard({ title, number, Icon, subtext }) {
    return (
        <div className="flex justify-between p-4 px-8 shadow-sm bg-white rounded-lg min-w-[320px] hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out">
            <div className="flex flex-col gap-2 test-sm">
                <p>{title}</p>
                <h3 className="flex gap-2 text-2xl font-medium items-baseline">{number} </h3>
                <p className="text-xs text-black/70">{subtext}</p>
            </div>
            <div>
                <div className="p-2 bg-green-200 rounded-md ">
                    <Icon className="bg-green-200" />
                </div>
            </div>
        </div>
    )
}