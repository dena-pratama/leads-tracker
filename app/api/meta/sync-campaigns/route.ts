import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { fetchMetaCampaigns } from "@/lib/meta";
import { decrypt } from "@/lib/encryption";

export async function GET() {
    try {
        // 1. Get all Meta accounts
        const accounts = await db.platformAccount.findMany({
            where: { platform: "META" }
        });

        if (accounts.length === 0) {
            return NextResponse.json({ error: "No Meta accounts connected" }, { status: 400 });
        }

        const allSyncedCampaigns = [];

        // 2. Loop through each account and sync campaigns
        for (const acc of accounts) {
            const token = decrypt(acc.accessToken);

            try {
                const campaigns = await fetchMetaCampaigns(acc.id, token);

                for (const camp of campaigns) {
                    const synced = await db.campaign.upsert({
                        where: { id: camp.id },
                        update: {
                            name: camp.name,
                            status: camp.status,
                            updatedAt: new Date(),
                        },
                        create: {
                            id: camp.id,
                            platformId: camp.id, // Usually camp.id is the unique platform ID
                            name: camp.name,
                            status: camp.status,
                            workspaceId: acc.workspaceId,
                        }
                    });
                    allSyncedCampaigns.push(synced);
                }
            } catch (err) {
                console.error(`Error syncing campaigns for account ${acc.id}:`, err);
            }
        }

        return NextResponse.json({
            success: true,
            count: allSyncedCampaigns.length
        });

    } catch (error: Error | any) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
