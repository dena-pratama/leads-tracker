import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { fetchMetaLeads } from "@/lib/meta";
import { decrypt } from "@/lib/encryption";

export async function GET() {
    try {
        // 1. Get all synced campaigns
        const campaigns = await db.campaign.findMany();

        if (campaigns.length === 0) {
            return NextResponse.json({ error: "No campaigns found. Sync campaigns first." }, { status: 400 });
        }

        // 2. Get Meta accounts for tokens
        const accounts = await db.platformAccount.findMany({
            where: { platform: "META" }
        });

        let allSyncedLeads = 0;

        for (const camp of campaigns) {
            // Find the account this campaign belongs to (via workspace for now, or match via ID)
            const acc = accounts.find((a: { workspaceId: string | null }) => a.workspaceId === camp.workspaceId);
            if (!acc) continue;

            const token = decrypt(acc.accessToken);

            try {
                // Fetch leads for this specific Campaign
                const leads = await fetchMetaLeads(camp.id, token);

                for (const lead of leads) {
                    const extractField = (name: string) => {
                        if (!lead.field_data) return null;
                        const field = lead.field_data.find((f: { name: string; values: string[] }) => f.name === name || f.name.includes(name));
                        return field ? field.values[0] : null;
                    };

                    const name = extractField("full_name") || extractField("name");
                    const email = extractField("email");
                    const phone = extractField("phone_number") || extractField("phone");

                    const savedLead = await db.lead.upsert({
                        where: { id: lead.id },
                        update: {
                            name,
                            email,
                            phone,
                            campaignId: camp.id,
                            updatedAt: new Date(),
                        },
                        create: {
                            id: lead.id,
                            platformId: lead.id,
                            name,
                            email,
                            phone,
                            campaignId: camp.id,
                            workspaceId: acc.workspaceId,
                            status: "NEW",
                            createdAt: new Date(lead.created_time),
                        }
                    });

                    if (savedLead) allSyncedLeads++;
                }
            } catch (err: unknown) {
                const error = err as Error;
                // Many campaigns might not be lead gen, so we ignore errors here
                console.log(`Campaign ${camp.name} is likely not a lead-gen campaign or error:`, error.message);
            }
        }

        return NextResponse.json({
            success: true,
            count: allSyncedLeads
        });

    } catch (error: unknown) {
        const err = error as Error;
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
