import { UserButton } from "@clerk/nextjs";

export function Topbar() {
    return (
        <header className="h-16 border-b bg-white flex items-center justify-between px-6 sticky top-0 z-10">
            <div className="font-semibold text-gray-700">Dashboard</div>
            <div className="flex items-center gap-4">
                <UserButton afterSignOutUrl="/sign-in" />
            </div>
        </header>
    );
}
