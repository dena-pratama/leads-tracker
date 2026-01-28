"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
    { href: "/dashboard", label: "Overview" },
    { href: "/leads", label: "Leads" },
    { href: "/leads/potential", label: " — Leads Potential" },
    { href: "/campaigns", label: "Campaigns" },
    { href: "/sla", label: "SLA Monitor" },
    { href: "/settings", label: "Settings" },
];

interface NavProps {
    setOpen?: (open: boolean) => void;
}

export function DashboardNav({ setOpen }: NavProps) {
    const pathname = usePathname();

    return (
        <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => {
                            if (setOpen) setOpen(false);
                        }}
                        className={cn(
                            "block px-4 py-2.5 rounded-lg transition-colors text-sm font-medium",
                            isActive
                                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                        )}
                    >
                        {item.label}
                    </Link>
                );
            })}
        </nav>
    );
}
