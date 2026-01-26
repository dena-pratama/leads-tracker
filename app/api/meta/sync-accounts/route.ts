import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { fetchMetaAdAccounts } from "@/lib/meta";
import { encrypt } from "@/lib/encryption";

export async function GET() {
    const token = process.env.META_USER_ACCESS_TOKEN;

    if (!token) {
        return NextResponse.json({ error: "No Meta Access Token found in .env" }, { status: 400 });
    }

    try {
        // 1. Fetch from Meta
        const adAccounts = await fetchMetaAdAccounts(token);

        // 2. Get or Create Workspace
        let workspace = await db.workspace.findFirst();
        if (!workspace) {
            let user = await db.user.findFirst();
            if (!user) {
                // Create a seed user if none exists
                user = await db.user.create({
                    data: {
                        email: "seed@example.com",
                        name: "Seed User",
                        role: "ADMIN"
                    }
                });
            }

            workspace = await db.workspace.create({
                data: {
                    name: "Default Workspace",
                    ownerId: user.id
                }
            });
        }

        if (!workspace) {
            throw new Error("No workspace found. Please make sure a user exists.");
        }

        // 3. Save to Database
        const results = [];
        const encryptedToken = encrypt(token);

        for (const acc of adAccounts) {
            const savedAccount = await db.platformAccount.upsert({
                where: { id: acc.id }, // Using Meta's ID as our ID or identifying by accountId
                update: {
                    name: acc.name,
                    accessToken: encryptedToken,
                    updatedAt: new Date(),
                },
                create: {
                    id: acc.id,
                    platform: "META",
                    accountId: acc.account_id,
                    accessToken: encryptedToken,
                    workspaceId: workspace.id,
                },
            });
            results.push(savedAccount);
        }

        return NextResponse.json({
            success: true,
            count: results.length,
            accounts: results.map(a => a.id)
        });

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("Sync Error:", error);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
