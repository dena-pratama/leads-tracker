"use client";

import { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { columns, Lead } from "./columns";
import { RefreshCw } from "lucide-react";

export default function LeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);

    const fetchLeads = async () => {
        try {
            const res = await fetch("/api/leads");
            const data = await res.json();
            if (Array.isArray(data)) setLeads(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSync = async () => {
        setSyncing(true);
        try {
            await fetch("/api/meta/sync-leads");
            await fetchLeads();
        } catch (err) {
            console.error(err);
        } finally {
            setSyncing(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Leads</h2>
                    <p className="text-sm text-muted-foreground">Manage and track your leads from all platforms.</p>
                </div>
                <button
                    onClick={handleSync}
                    disabled={syncing}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-50"
                >
                    {syncing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    {syncing ? "Syncing..." : "Sync Leads Now"}
                </button>
            </div>

            {loading ? (
                <div className="h-64 flex flex-col items-center justify-center gap-2 text-gray-400">
                    <RefreshCw className="w-8 h-8 animate-spin" />
                    <p>Loading leads...</p>
                </div>
            ) : (
                <DataTable columns={columns} data={leads} />
            )}
        </div>
    );
}

