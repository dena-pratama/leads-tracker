"use client";

import { useEffect, useState } from "react";
import { RefreshCw, AlertCircle } from "lucide-react";

interface Campaign {
    id: string;
    name: string;
    status: string;
    createdAt: string;
}

type FilterStatus = "ALL" | "ACTIVE" | "PAUSED";

export default function CampaignsPage() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [filter, setFilter] = useState<FilterStatus>("ALL");

    const fetchCampaigns = async () => {
        try {
            const res = await fetch("/api/campaigns");
            const data = await res.json();
            if (Array.isArray(data)) setCampaigns(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSync = async () => {
        setSyncing(true);
        try {
            // Sync accounts first (updates token)
            await fetch("/api/meta/sync-accounts");
            // Then sync campaigns
            await fetch("/api/meta/sync-campaigns");
            // Then leads
            await fetch("/api/meta/sync-leads");
            // Then metrics (NEW)
            await fetch("/api/meta/sync-metrics");

            await fetchCampaigns();
        } catch (err) {
            console.error(err);
        } finally {
            setSyncing(false);
        }
    };

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const filteredCampaigns = campaigns.filter(camp => {
        if (filter === "ALL") return true;
        return camp.status === filter;
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Campaigns</h2>
                    <p className="text-sm text-gray-500">Manage and track your Meta Advertising campaigns.</p>
                </div>
                <button
                    onClick={handleSync}
                    disabled={syncing}
                    className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-50"
                >
                    {syncing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    {syncing ? "Syncing..." : "Sync Now"}
                </button>
            </div>

            <div className="flex items-center gap-2 border-b">
                {(["ALL", "ACTIVE", "PAUSED"] as FilterStatus[]).map((s) => (
                    <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-[2px] ${filter === s
                            ? "border-slate-900 text-slate-900"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        {s.charAt(0) + s.slice(1).toLowerCase()}
                        <span className="ml-2 px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px]">
                            {campaigns.filter(c => s === "ALL" ? true : c.status === s).length}
                        </span>
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="h-64 flex flex-col items-center justify-center gap-2 text-gray-400">
                    <RefreshCw className="w-8 h-8 animate-spin" />
                    <p>Loading campaigns...</p>
                </div>
            ) : filteredCampaigns.length === 0 ? (
                <div className="bg-white p-12 rounded-xl border border-dashed flex flex-col items-center justify-center text-gray-400 gap-4">
                    <AlertCircle className="w-12 h-12 text-gray-200" />
                    <div className="text-center">
                        <p className="text-gray-600 font-medium">No {filter !== "ALL" ? filter.toLowerCase() : ""} campaigns found</p>
                        <p className="text-sm">Try changing the filter or click Sync Now.</p>
                    </div>
                </div>
            ) : (
                <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 font-medium text-gray-600">Campaign Name</th>
                                <th className="px-6 py-3 font-medium text-gray-600">ID</th>
                                <th className="px-6 py-3 font-medium text-gray-600">Status</th>
                                <th className="px-6 py-3 font-medium text-gray-600">Synced At</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredCampaigns.map((camp) => (
                                <tr key={camp.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{camp.name}</td>
                                    <td className="px-6 py-4 text-gray-500 font-mono text-xs">{camp.id}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${camp.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {camp.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {new Date(camp.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
