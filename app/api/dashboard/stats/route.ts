import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { subDays } from "date-fns";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const startDateParam = searchParams.get("startDate");
        const endDateParam = searchParams.get("endDate");

        let startDate = startDateParam ? new Date(startDateParam) : subDays(new Date(), 30);
        let endDate = endDateParam ? new Date(endDateParam) : new Date();

        // Ensure dates are valid
        if (isNaN(startDate.getTime())) startDate = subDays(new Date(), 30);
        if (isNaN(endDate.getTime())) endDate = new Date();

        // Aggregate metrics for the date range
        const metrics = await db.adMetricDaily.findMany({
            where: {
                date: {
                    gte: startDate,
                    lte: endDate
                }
            }
        });

        let totalSpend = 0;
        let totalLeads = 0;
        let totalMessaging = 0;
        let totalImpressions = 0;
        let totalReach = 0;
        let totalClicks = 0;

        // We also need total campaigns active in this period? 
        // Or just total campaigns in DB? Usually total campaigns in DB is better for "Live Campaigns".
        const totalCampaigns = await db.campaign.count();

        for (const m of metrics) {
            totalSpend += m.spend;
            totalLeads += m.leads;
            totalMessaging += m.messagingConversations;
            totalImpressions += m.impressions;
            // Reach is tricky to sum, but we'll sum it for now
            totalReach += m.reach;
            totalClicks += m.clicks;
        }

        const avgCtrAll = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

        return NextResponse.json({
            totalSpend,
            totalLeads,
            newMessagingConversations: totalMessaging,
            ctrAll: avgCtrAll.toFixed(2),
            ctrLink: "0.00",
            reach: totalReach,
            impressions: totalImpressions,
            totalCampaigns,
            convRate: (totalLeads > 0 ? (totalLeads / totalClicks) * 100 : 0).toFixed(2),
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
