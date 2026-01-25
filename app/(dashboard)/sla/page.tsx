export default function SLAPage() {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">SLA Monitor</h2>
            <div className="grid gap-4 md:grid-cols-3">
                <div className="p-6 bg-red-50 text-red-700 rounded-xl border border-red-100">
                    <div className="text-sm font-medium">Overdue (&gt;5 days)</div>
                    <div className="text-2xl font-bold mt-2">0 Leads</div>
                </div>
                <div className="p-6 bg-yellow-50 text-yellow-700 rounded-xl border border-yellow-100">
                    <div className="text-sm font-medium">Warning (&gt;2 days)</div>
                    <div className="text-2xl font-bold mt-2">0 Leads</div>
                </div>
                <div className="p-6 bg-green-50 text-green-700 rounded-xl border border-green-100">
                    <div className="text-sm font-medium">On Track</div>
                    <div className="text-2xl font-bold mt-2">0 Leads</div>
                </div>
            </div>
            <div className="bg-white p-12 rounded-xl border border-dashed flex items-center justify-center text-gray-400">
                Detailed SLA Report will be here
            </div>
        </div>
    );
}
