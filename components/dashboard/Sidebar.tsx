import { DashboardNav } from "@/components/dashboard/Nav";

export function Sidebar() {
    return (
        <aside className="w-64 bg-sidebar text-sidebar-foreground hidden md:flex flex-col h-full border-r border-sidebar-border">
            <div className="p-6 h-16 flex items-center border-b border-sidebar-border">
                <h1 className="text-xl font-bold tracking-tight">Leads Tracker</h1>
            </div>
            <DashboardNav />
            <div className="p-4 border-t border-sidebar-border">
                <div className="text-xs text-muted-foreground">v0.1.0 MVP</div>
            </div>
        </aside>
    );
}
