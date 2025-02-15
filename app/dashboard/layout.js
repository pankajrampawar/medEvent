import Sidebar from "../components/sidebar";

export default function DashboardLayout({ children }) {
    return (
        <main className="bg-background flex">
            {/* Sidebar */}
            <section className="flex flex-col relative">
                <Sidebar />
            </section>
            <section className="w-full">
                {children}
            </section>
        </main>
    )
}