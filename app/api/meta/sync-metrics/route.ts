import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { fetchMetaDailyMetrics } from "@/lib/meta";
import { decrypt } from "@/lib/encryption";

export async function GET() {
    try {
        const campaigns = await db.campaign.findMany();
        if (campaigns.length === 0) {
            return NextResponse.json({ error: "No campaigns found" }, { status: 400 });
        }

        const accounts = await db.platformAccount.findMany({ where: { platform: "META" } });
        let syncedCount = 0;

        for (const camp of campaigns) {
            const acc = accounts.find(a => a.workspaceId === camp.workspaceId);
            if (!acc) continue;
            const token = decrypt(acc.accessToken);

            try {
                // Fetch daily metrics for last 365 days (User needs back to Aug 2025)
                // Note: Meta might have limits or pagination for 365 days of daily data.
                // If it fails, we might need pagination. But 365 records is usually fine in one go JSON.
                const insights = await fetchMetaDailyMetrics(camp.id, token, 365);

                if (Array.isArray(insights)) {
                    for (const dayData of insights) {
                        const spend = parseFloat(dayData.spend || "0");
                        const impressions = parseInt(dayData.impressions || "0");
                        const reach = parseInt(dayData.reach || "0");

                        // CTR (All)
                        const ctrAll = parseFloat(dayData.ctr || "0");
                        // CTR (Link) - If not present, fallback to 0
                        const ctrLink = parseFloat(dayData.inline_link_click_ctr || "0");

                        // Clicks (All) - 'clicks' in Meta is all clicks
                        const clicksAll = parseInt(dayData.clicks || "0");
                        // Clicks (Link) - 'inline_link_clicks'
                        const clicksLink = parseInt(dayData.inline_link_clicks || "0");

                        // Use Link Clicks as the primary "Clicks" metric for dashboard ROI calculation?
                        // Usually "Clicks" column in dashboard implies Link Clicks.
                        // But let's check our schema. 'clicks' field. 
                        // Let's store Link Clicks in 'clicks' field because that's measuring traffic.
                        // Or stored 'clicksAll'. 
                        // Schema comment says "// Link clicks". So let's store clicksLink.
                        const clicksToStore = clicksLink;

                        const actions = dayData.actions || [];

                        // Messaging: CTWA
                        const msgConversations = actions.find((a: any) => a.action_type === 'onsite_conversion.messaging_conversation_started_7d')?.value ||
                            actions.find((a: any) => a.action_type === 'messaging_conversation_started_7d')?.value || "0";

                        // Leads: Instant Forms + Pixel Leads
                        const instantFormLeads = actions.find((a: any) => a.action_type === 'lead')?.value || "0";
                        const pixelLeads = actions.find((a: any) => a.action_type === 'offsite_conversion.fb_pixel_lead')?.value || "0";

                        // Total Leads = Msg + Form + Pixel ??
                        // Usually distinct based on campaign objective.
                        // Leads Tracker usually tracks "contacts". 
                        // We'll store sum of all conversion types as "leads" or just Form/Pixel? 
                        // If user runs CTWA, they consider Messaging as Lead.
                        // Let's sum them up for the 'leads' column.
                        const totalLeads = parseInt(instantFormLeads) + parseInt(pixelLeads) + parseInt(msgConversations);

                        // Use the date from Meta (date_start)
                        const metricDate = new Date(dayData.date_start);

                        await db.adMetricDaily.upsert({
                            where: {
                                date_campaignId: {
                                    date: metricDate,
                                    campaignId: camp.id
                                }
                            },
                            update: {
                                spend,
                                impressions,
                                reach,
                                ctrAll,
                                ctrLink, // Need to make sure schema has this field? Yes, added `ctrLink Float`.
                                clicks: clicksToStore,
                                leads: totalLeads,
                                messagingConversations: parseInt(msgConversations),
                                updatedAt: new Date()
                            },
                            create: {
                                date: metricDate,
                                campaignId: camp.id,
                                spend,
                                impressions,
                                reach,
                                ctrAll,
                                ctrLink,
                                clicks: clicksToStore,
                                leads: totalLeads,
                                messagingConversations: parseInt(msgConversations),
                            }
                        });
                    }
                    syncedCount += insights.length;
                }
            } catch (e: any) {
                console.log(`Error syncing metrics for ${camp.id}: ${e.message}`);
            }
        }

        return NextResponse.json({ success: true, count: syncedCount });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
