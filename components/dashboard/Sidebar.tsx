import Link from "next/link";

const navItems = [
    { href: "/dashboard", label: "Overview" },
    { href: "/leads", label: "Leads" },
    { href: "/campaigns", label: "Campaigns" },
    { href: "/sla", label: "SLA Monitor" },
    { href: "/settings", label: "Settings" },
];

export function Sidebar() {
    return (
        <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col h-full border-r">
            <div className="p-6 h-16 flex items-center border-b border-slate-700">
                <h1 className="text-xl font-bold tracking-tight">Leads Tracker</h1>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="block px-4 py-2.5 rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium"
                    >
                        {item.label}
                    </Link>
                ))}
            </nav>
            <div className="p-4 border-t border-slate-700">
                <div className="text-xs text-slate-400">v0.1.0 MVP</div>
            </div>
        </aside>
    );
}
