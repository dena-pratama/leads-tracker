import { calculateLeadSLA } from "@/lib/sla";
import { subDays } from "date-fns";

// Duplicating dummy data for now (ideally this comes from a shared API/DB)
const getDummyLeads = () => {
    const today = new Date();
    return [
        { created_at: subDays(today, 1).toISOString(), status: "NEW" },
        { created_at: subDays(today, 3).toISOString(), status: "CONTACTED" },
        { created_at: subDays(today, 6).toISOString(), status: "NEW" },
        { created_at: subDays(today, 0).toISOString(), status: "WON" },
        { created_at: subDays(today, 4).toISOString(), status: "LOST" },
        { created_at: subDays(today, 8).toISOString(), status: "NEW" }, // Overdue
        { created_at: subDays(today, 2).toISOString(), status: "NEW" }, // On Track
    ];
};

export default function SLAPage() {
    const leads = getDummyLeads();

    // Calculate stats
    const stats = {
        OVERDUE: 0,
        WARNING: 0,
        ON_TRACK: 0
    };

    leads.forEach(lead => {
        const sla = calculateLeadSLA(lead.created_at, lead.status);
        stats[sla]++;
    });

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">SLA Monitor</h2>
            <p className="text-gray-500">Monitoring response time performance based on lead creation time.</p>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="p-6 bg-red-50 text-red-700 rounded-xl border border-red-200">
                    <div className="text-sm font-medium">Overdue (&gt;5 days)</div>
                    <div className="text-4xl font-bold mt-2">{stats.OVERDUE}</div>
                    <div className="text-sm mt-1 opacity-80">Leads needing immediate attention</div>
                </div>
                <div className="p-6 bg-yellow-50 text-yellow-700 rounded-xl border border-yellow-200">
                    <div className="text-sm font-medium">Warning (&gt;2 days)</div>
                    <div className="text-4xl font-bold mt-2">{stats.WARNING}</div>
                    <div className="text-sm mt-1 opacity-80">Leads approaching deadline</div>
                </div>
                <div className="p-6 bg-green-50 text-green-700 rounded-xl border border-green-200">
                    <div className="text-sm font-medium">On Track</div>
                    <div className="text-4xl font-bold mt-2">{stats.ON_TRACK}</div>
                    <div className="text-sm mt-1 opacity-80">Leads within SLA</div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border shadow-sm">
                <h3 className="font-semibold mb-4">SLA Logic Explained</h3>
                <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
                    <li><span className="font-medium text-green-600">On Track</span>: Lead age &le; 2 days OR Status is WON/LOST.</li>
                    <li><span className="font-medium text-yellow-600">Warning</span>: Lead age &gt; 2 days AND Status is Open (New/Contacted).</li>
                    <li><span className="font-medium text-red-600">Overdue</span>: Lead age &gt; 5 days AND Status is Open.</li>
                </ul>
            </div>
        </div>
    );
}
