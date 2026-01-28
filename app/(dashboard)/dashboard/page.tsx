"use client";

import { useEffect, useState } from "react";
import { FunnelStats } from "@/components/dashboard/FunnelStats";
import { Lead } from "../leads/columns";
import { RefreshCw, DollarSign, Users, MousePointer2, MessageCircle, BarChart3, Fingerprint } from "lucide-react";
import { DateRangePicker } from "@/components/dashboard/DateRangePicker";
import { DateRange } from "react-day-picker";
import { subDays } from "date-fns";

export default function DashboardPage() {
    const [stats, setStats] = useState({
        totalSpend: 0,
        totalLeads: 0,
        newMessagingConversations: 0,
        ctrAll: "0.00",
        ctrLink: "0.00",
        reach: 0,
        impressions: 0,
        totalCampaigns: 0,
        convRate: "0.00"
    });
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState<DateRange | undefined>({
        from: subDays(new Date(), 30),
        to: new Date(),
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true); // Show loading when date changes
            try {
                // Build query params
                const params = new URLSearchParams();
                if (date?.from) params.append("startDate", date.from.toISOString());
                if (date?.to) params.append("endDate", date.to.toISOString());

                const [statsRes, leadsRes] = await Promise.all([
                    fetch(`/api/dashboard/stats?${params.toString()}`),
                    fetch("/api/leads") // Leads list remains unfiltered for now as per MVP scope
                ]);
                const statsData = await statsRes.json();
                const leadsData = await leadsRes.json();

                if (statsData) setStats(statsData);
                if (Array.isArray(leadsData)) setLeads(leadsData);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [date]); // Re-fetch on date change

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
    };

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('id-ID').format(num);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
                <div className="flex items-center gap-2">
                    <DateRangePicker date={date} setDate={setDate} />
                    <div className="flex items-center gap-2 text-xs text-muted-foreground bg-card px-3 py-2 rounded-md border shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Live
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-gray-400">
                    <RefreshCw className="w-10 h-10 animate-spin" />
                    <p className="font-medium">Updating data...</p>
                </div>
            ) : (
                <>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {/* 1. Amount Spent */}
                        <div className="p-6 bg-card rounded-xl border shadow-sm flex flex-col justify-between">
                            <div>
                                <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <DollarSign className="w-4 h-4" /> Amount Spent
                                </div>
                                <div className="text-2xl font-bold mt-2">{formatCurrency(stats.totalSpend)}</div>
                            </div>
                        </div>

                        {/* 2. Leads (7d) */}
                        <div className="p-6 bg-card rounded-xl border shadow-sm flex flex-col justify-between">
                            <div>
                                <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <Users className="w-4 h-4" /> Leads (7d click)
                                </div>
                                <div className="text-2xl font-bold mt-2">{formatNumber(stats.totalLeads)}</div>
                            </div>
                        </div>

                        {/* 3. Messaging Conversations */}
                        <div className="p-6 bg-card rounded-xl border shadow-sm flex flex-col justify-between">
                            <div>
                                <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <MessageCircle className="w-4 h-4" /> New Messaging Convs
                                </div>
                                <div className="text-2xl font-bold mt-2">{formatNumber(stats.newMessagingConversations)}</div>
                            </div>
                        </div>

                        {/* 4. Reach */}
                        <div className="p-6 bg-card rounded-xl border shadow-sm flex flex-col justify-between">
                            <div>
                                <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <Fingerprint className="w-4 h-4" /> Reach
                                </div>
                                <div className="text-2xl font-bold mt-2">{formatNumber(stats.reach)}</div>
                            </div>
                        </div>

                        {/* 5. CTR (All) */}
                        <div className="p-6 bg-card rounded-xl border shadow-sm flex flex-col justify-between">
                            <div>
                                <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <MousePointer2 className="w-4 h-4" /> CTR (All)
                                </div>
                                <div className="text-2xl font-bold mt-2">{stats.ctrAll}%</div>
                            </div>
                        </div>

                        {/* 6. CTR (Link) */}
                        <div className="p-6 bg-card rounded-xl border shadow-sm flex flex-col justify-between">
                            <div>
                                <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <MousePointer2 className="w-4 h-4" /> CTR (Link)
                                </div>
                                <div className="text-2xl font-bold mt-2">{stats.ctrLink}%</div>
                            </div>
                        </div>

                        {/* 7. Impressions */}
                        <div className="p-6 bg-card rounded-xl border shadow-sm flex flex-col justify-between">
                            <div>
                                <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <BarChart3 className="w-4 h-4" /> Impressions
                                </div>
                                <div className="text-2xl font-bold mt-2">{formatNumber(stats.impressions)}</div>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <div className="col-span-4 bg-card p-6 rounded-xl border shadow-sm min-h-[300px]">
                            <FunnelStats leads={leads} />
                        </div>
                        <div className="col-span-3 bg-card p-6 rounded-xl border shadow-sm min-h-[300px]">
                            <h3 className="font-semibold mb-4">Recent Leads</h3>
                            <div className="space-y-4">
                                {leads.length > 0 ? leads.slice(0, 5).map(lead => (
                                    <div key={lead.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                                        <div>
                                            <div className="font-medium text-sm">{lead.name}</div>
                                            <div className="text-xs text-muted-foreground">{lead.platform} • {lead.created_at.split('T')[0]}</div>
                                        </div>
                                        <div className="text-xs font-medium px-2 py-1 bg-gray-100 rounded">
                                            {lead.status}
                                        </div>
                                    </div>
                                )) : (
                                    <div className="h-40 flex items-center justify-center text-gray-400 text-sm italic">
                                        No recent leads found
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
