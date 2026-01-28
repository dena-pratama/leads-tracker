"use client";

import { UserButton } from "@clerk/nextjs";
import { ModeToggle } from "@/components/mode-toggle";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { DashboardNav } from "./Nav";
import { useState } from "react";

export function Topbar() {
    const [open, setOpen] = useState(false);

    return (
        <header className="h-16 border-b bg-background flex items-center justify-between px-6 sticky top-0 z-10">
            <div className="flex items-center gap-4">
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <button className="md:hidden">
                            <Menu className="w-6 h-6 text-foreground" />
                        </button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-64 bg-sidebar border-r border-sidebar-border">
                        <div className="p-6 h-16 flex items-center border-b border-sidebar-border">
                            <SheetTitle className="text-xl font-bold tracking-tight text-sidebar-foreground">Leads Tracker</SheetTitle>
                        </div>
                        <DashboardNav setOpen={setOpen} />
                    </SheetContent>
                </Sheet>
                <div className="font-semibold text-foreground">Dashboard</div>
            </div>
            <div className="flex items-center gap-4">
                <ModeToggle />
                <UserButton afterSignOutUrl="/sign-in" />
            </div>
        </header>
    );
}
