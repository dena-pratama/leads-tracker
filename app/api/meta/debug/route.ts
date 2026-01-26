import { NextResponse } from "next/server";
import { decrypt } from "@/lib/encryption";
import { db } from "@/lib/db";

const FACEBOOK_GRAPH_VERSION = "v19.0";
const FACEBOOK_GRAPH_URL = `https://graph.facebook.com/${FACEBOOK_GRAPH_VERSION}`;

export async function GET() {
    const token = process.env.META_USER_ACCESS_TOKEN;
    if (!token) return NextResponse.json({ error: "No token" });

    try {
        const accRes = await fetch(`${FACEBOOK_GRAPH_URL}/me/adaccounts?fields=id,name&access_token=${token}`);
        const accData = await accRes.json();

        if (!accData.data) return NextResponse.json({ error: accData.error });

        const report: any[] = [];

        for (const acc of accData.data) {
            // Check for leadgen forms
            const formsRes = await fetch(`${FACEBOOK_GRAPH_URL}/${acc.id}/leadgen_forms?access_token=${token}`);
            const formsData = await formsRes.json();

            // Check campaigns
            const campaignsRes = await fetch(`${FACEBOOK_GRAPH_URL}/${acc.id}/campaigns?fields=id,name&access_token=${token}`);
            const campaignsData = await campaignsRes.json();

            let sampleInsights = null;
            if (campaignsData.data && campaignsData.data.length > 0) {
                const campId = campaignsData.data[0].id;
                // IMPORTANT: Check fields
                const fields = "spend,impressions,reach,ctr,clicks,actions";
                const insightsUrl = `${FACEBOOK_GRAPH_URL}/${campId}/insights?fields=${fields}&date_preset=maximum&access_token=${token}`;
                const insightsRes = await fetch(insightsUrl);
                sampleInsights = await insightsRes.json();
            }

            report.push({
                account: acc.name,
                accountId: acc.id,
                formsCount: formsData.data?.length || 0,
                campaignsCount: campaignsData.data?.length || 0,
                sampleInsights: sampleInsights,
                error: formsData.error || null
            });
        }

        return NextResponse.json(report);
    } catch (error: any) {
        return NextResponse.json({ error: error.message });
    }
}
