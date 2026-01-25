export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">Overview</h2>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Card 1 */}
                <div className="p-6 bg-white rounded-xl border shadow-sm">
                    <div className="text-sm font-medium text-gray-500">Total Spend</div>
                    <div className="text-2xl font-bold mt-2">Rp 0</div>
                    <div className="text-xs text-gray-400 mt-1">+0% from last month</div>
                </div>

                {/* Card 2 */}
                <div className="p-6 bg-white rounded-xl border shadow-sm">
                    <div className="text-sm font-medium text-gray-500">Total Leads</div>
                    <div className="text-2xl font-bold mt-2">0</div>
                    <div className="text-xs text-gray-400 mt-1">+0% from last month</div>
                </div>

                {/* Card 3 */}
                <div className="p-6 bg-white rounded-xl border shadow-sm">
                    <div className="text-sm font-medium text-gray-500">Cost per Lead</div>
                    <div className="text-2xl font-bold mt-2">-</div>
                </div>

                {/* Card 4 */}
                <div className="p-6 bg-white rounded-xl border shadow-sm">
                    <div className="text-sm font-medium text-gray-500">Conv. Rate</div>
                    <div className="text-2xl font-bold mt-2">0%</div>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4 bg-white p-6 rounded-xl border shadow-sm min-h-[300px]">
                    <h3 className="font-semibold mb-4">Lead Trend</h3>
                    <div className="flex items-center justify-center h-full text-gray-400">
                        Chart Placeholder
                    </div>
                </div>
                <div className="col-span-3 bg-white p-6 rounded-xl border shadow-sm min-h-[300px]">
                    <h3 className="font-semibold mb-4">Recent Leads</h3>
                    <div className="flex items-center justify-center h-full text-gray-400">
                        List Placeholder
                    </div>
                </div>
            </div>
        </div>
    );
}
